const express = require("express");
const crypto = require("crypto");
const supabase = require("../supabase");
const { SETTING_KEY } = require("../bitcoinConfig");
const { isValidBitcoinAddress } = require("../bitcoinAddress");

const router = express.Router();
const ITINERARY_TEMPLATES_KEY = "itinerary_templates";
const ITINERARY_TEMPLATE_KEYS = ["arrival", "explore", "freeDay", "departure"];
const ITINERARY_EVENT_TYPES = ["flight", "arrival", "hotel", "activity", "free"];

function requireAdmin(req, res, next) {
  const auth = req.headers["authorization"];
  const token = process.env.ADMIN_TOKEN || "Admin123";

  if (!auth || auth !== `Bearer ${token}`) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  next();
}

function sendResult(res, result) {
  const { data, error } = result;
  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  return res.json({ success: true, data });
}

router.get("/verify", requireAdmin, (req, res) => {
  return res.json({ success: true });
});

router.get("/itinerary-templates", async (req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", ITINERARY_TEMPLATES_KEY)
      .maybeSingle();
    if (error) throw error;

    return res.json({
      success: true,
      templates: data?.value ? JSON.parse(data.value) : null,
    });
  } catch (error) {
    console.error("Itinerary templates load failed:", error.message);
    return res.status(500).json({ success: false, error: "Could not load itinerary templates." });
  }
});

router.put("/itinerary-templates", requireAdmin, async (req, res) => {
  const templates = req.body?.templates;
  if (!templates || typeof templates !== "object" || Array.isArray(templates)) {
    return res.status(400).json({ success: false, error: "Provide itinerary templates to save." });
  }

  const normalized = {};
  for (const key of ITINERARY_TEMPLATE_KEYS) {
    const template = templates[key];
    if (!template || typeof template.title !== "string" || !Array.isArray(template.events)) {
      return res.status(400).json({ success: false, error: `The ${key} itinerary template is invalid.` });
    }
    if (template.title.length > 200 || template.events.length > 100) {
      return res.status(400).json({ success: false, error: `The ${key} template exceeds the allowed size.` });
    }

    const events = [];
    for (const event of template.events) {
      if (!event || typeof event !== "object" || Array.isArray(event)) {
        return res.status(400).json({ success: false, error: `An event in the ${key} template is invalid.` });
      }
      if (
        typeof event.type !== "string" ||
        !ITINERARY_EVENT_TYPES.includes(event.type) ||
        ["id", "time", "title", "description", "details"].some(
          (field) => typeof event[field] !== "string"
        ) ||
        event.id.length > 100 ||
        event.time.length > 50 ||
        event.title.length > 200 ||
        event.description.length > 2000 ||
        event.details.length > 500
      ) {
        return res.status(400).json({ success: false, error: `An event in the ${key} template has invalid fields.` });
      }
      events.push({
        id: event.id,
        time: event.time,
        type: event.type,
        title: event.title,
        description: event.description,
        details: event.details,
      });
    }

    normalized[key] = { title: template.title, events };
  }

  try {
    const { error } = await supabase
      .from("admin_settings")
      .upsert({
        key: ITINERARY_TEMPLATES_KEY,
        value: JSON.stringify(normalized),
        updated_at: new Date().toISOString(),
      }, { onConflict: "key" });
    if (error) throw error;
    return res.json({ success: true, templates: normalized });
  } catch (error) {
    console.error("Itinerary templates save failed:", error.message);
    return res.status(500).json({
      success: false,
      error: "Could not save itinerary templates. Confirm the admin_settings table exists.",
    });
  }
});

router.get("/payment-settings/bitcoin-address", requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", SETTING_KEY)
      .maybeSingle();
    if (error) throw error;

    const address = data?.value || process.env.BTC_RECEIVING_ADDRESS || "";
    return res.json({
      success: true,
      address,
      source: data?.value ? "admin" : address ? "environment" : "unset",
    });
  } catch (error) {
    console.error("Bitcoin payment settings load failed:", error.message);
    return res.status(500).json({ success: false, error: "Could not load payment settings." });
  }
});

router.put("/payment-settings/bitcoin-address", requireAdmin, async (req, res) => {
  const address = typeof req.body?.address === "string" ? req.body.address.trim() : "";
  if (!isValidBitcoinAddress(address)) {
    return res.status(400).json({
      success: false,
      error: "Enter a valid Bitcoin mainnet address.",
    });
  }

  try {
    const { error } = await supabase
      .from("admin_settings")
      .upsert({
        key: SETTING_KEY,
        value: address,
        updated_at: new Date().toISOString(),
      }, { onConflict: "key" });
    if (error) throw error;
    return res.json({ success: true, address });
  } catch (error) {
    console.error("Bitcoin payment settings save failed:", error.message);
    return res.status(500).json({
      success: false,
      error: "Could not save the Bitcoin address. Confirm the admin_settings table exists.",
    });
  }
});

router.post("/images", requireAdmin, async (req, res) => {
  const { fileName, dataUrl } = req.body || {};
  const match = typeof dataUrl === "string"
    ? dataUrl.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/)
    : null;

  if (!match) {
    return res.status(400).json({ success: false, error: "Choose a valid JPG, PNG, WebP, or GIF image." });
  }

  const [, contentType, encodedImage] = match;
  const image = Buffer.from(encodedImage, "base64");
  if (!image.length || image.length > 7 * 1024 * 1024) {
    return res.status(400).json({ success: false, error: "Images must be 7 MB or smaller." });
  }

  const validSignature = {
    "image/jpeg": image[0] === 0xff && image[1] === 0xd8 && image[2] === 0xff,
    "image/png": image.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    "image/webp": image.toString("ascii", 0, 4) === "RIFF"
      && image.toString("ascii", 8, 12) === "WEBP",
    "image/gif": ["GIF87a", "GIF89a"].includes(image.toString("ascii", 0, 6)),
  }[contentType];
  if (!validSignature) {
    return res.status(400).json({ success: false, error: "The selected file is not a valid image." });
  }

  const extension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  }[contentType];
  const safeName = String(fileName || "image")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .slice(0, 60) || "image";
  const path = `${crypto.randomUUID()}-${safeName}.${extension}`;

  try {
    const { error } = await supabase.storage
      .from("catalog-images")
      .upload(path, image, { contentType, upsert: false });
    if (error) {
      console.error("Catalog image upload failed:", error.message);
      return res.status(500).json({
        success: false,
        error: "Could not save the image. Confirm the catalog-images bucket exists in Supabase Storage.",
      });
    }

    const { data } = supabase.storage.from("catalog-images").getPublicUrl(path);
    return res.status(201).json({ success: true, url: data.publicUrl });
  } catch (error) {
    console.error("Catalog image upload failed:", error.message);
    return res.status(500).json({ success: false, error: "Image upload failed." });
  }
});

router.get("/catalog", async (req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    const [flightResult, hotelResult, roomResult, carResult, activityResult, packageResult, itineraryResult] =
      await Promise.all([
        supabase.from("admin_flights").select("plan_key, name, data").order("plan_key"),
        supabase.from("admin_hotels").select("*").order("name"),
        supabase.from("admin_rooms").select("*").order("name"),
        supabase.from("admin_cars").select("*").order("type"),
        supabase.from("admin_activities").select("*").order("name"),
        supabase.from("admin_packages").select("*").order("name"),
        supabase.from("admin_settings").select("value").eq("key", ITINERARY_TEMPLATES_KEY).maybeSingle(),
      ]);

    const failedResult = [
      flightResult, hotelResult, roomResult, carResult, activityResult, packageResult, itineraryResult,
    ].find((result) => result.error);
    if (failedResult) {
      return res.status(500).json({ success: false, error: failedResult.error.message });
    }

    const flights = Object.fromEntries(
      flightResult.data.map(({ plan_key, name, data }) => [
        plan_key,
        { ...data, name },
      ])
    );

    return res.json({
      success: true,
      data: {
        flights,
        hotels: hotelResult.data.map((hotel) => ({
          ...hotel,
          ratingLabel: hotel.rating_label,
          reviewCount: hotel.review_count,
          longDescription: hotel.long_description,
          checkIn: hotel.check_in,
          checkOut: hotel.check_out,
        })),
        rooms: roomResult.data.map((room) => ({
          ...room,
          hotelId: room.hotel_id,
          pricePerNight: room.price_per_night,
        })),
        cars: carResult.data.map((car) => ({
          ...car,
          pricePerDay: car.price_per_day,
          images: car.images || [],
        })),
        activities: activityResult.data.map((activity) => ({
          ...activity,
          pricePerPerson: activity.price_per_person,
        })),
        packages: packageResult.data.map((pkg) => ({
          ...pkg,
          roomId: pkg.room_id,
        })),
        itineraryTemplates: itineraryResult.data?.value
          ? JSON.parse(itineraryResult.data.value)
          : {},
      },
    });
  } catch (error) {
    console.error("Public catalog load failed:", error.message);
    return res.status(500).json({ success: false, error: "Unable to load travel catalog" });
  }
});

router.post("/seed", requireAdmin, async (req, res) => {
  try {
    const [flightsModule, hotelsModule, roomsModule, carsModule, activitiesModule, packagesModule] =
      await Promise.all([
        import("../../src/data/flight.js"),
        import("../../src/data/hotel.js"),
        import("../../src/data/rooms.js"),
        import("../../src/data/cars.js"),
        import("../../src/data/activities.js"),
        import("../../src/data/packages.js"),
      ]);

    const seedGroups = [
      {
        table: "admin_flights",
        rows: Object.entries(flightsModule.default).map(([plan_key, plan]) => ({
          plan_key,
          name: plan.name,
          data: plan,
        })),
        conflict: "plan_key",
      },
      {
        table: "admin_hotels",
        rows: hotelsModule.default.map((hotel) => ({
          id: String(hotel.id),
          name: hotel.name,
          location: hotel.location,
          rating: hotel.rating,
          rating_label: hotel.ratingLabel,
          review_count: hotel.reviewCount,
          description: hotel.description,
          long_description: hotel.longDescription,
          check_in: hotel.checkIn,
          check_out: hotel.checkOut,
          amenities: hotel.amenities,
          highlights: hotel.highlights,
          images: hotel.images,
        })),
        conflict: "id",
      },
      {
        table: "admin_rooms",
        rows: roomsModule.default.map((room) => ({
          id: String(room.id),
          hotel_id: String(room.hotelId),
          name: room.name,
          beds: room.beds,
          guests: room.guests,
          price_per_night: room.pricePerNight,
          amenities: room.amenities,
          images: room.images,
        })),
        conflict: "id",
      },
      {
        table: "admin_cars",
        rows: carsModule.default.map((car) => ({
          id: Number(car.id),
          type: car.type,
          name: car.name,
          price_per_day: car.pricePerDay,
          seats: car.seats,
          bags: car.bags,
          transmission: car.transmission,
          features: car.features,
          images: car.images || [],
        })),
        conflict: "id",
      },
      {
        table: "admin_activities",
        rows: activitiesModule.default.map((activity) => ({
          id: Number(activity.id),
          name: activity.name,
          location: activity.location,
          duration: activity.duration,
          price_per_person: activity.pricePerPerson,
          rating: activity.rating,
          reviews: activity.reviews,
          description: activity.description,
          includes: activity.includes,
        })),
        conflict: "id",
      },
      {
        table: "admin_packages",
        rows: packagesModule.default.map((pkg) => ({
          id: Number(pkg.id),
          name: pkg.name,
          type: pkg.type,
          description: pkg.description,
          room_id: pkg.roomId,
          discount: pkg.discount,
        })),
        conflict: "id",
      },
    ];

    const errors = {};
    for (const group of seedGroups) {
      const { error } = await supabase.from(group.table).upsert(group.rows, {
        onConflict: group.conflict,
        ignoreDuplicates: true,
      });
      if (error) errors[group.table] = error.message;
    }

    if (!Object.keys(errors).length) {
      const { error } = await supabase.rpc("sync_admin_catalog_sequences");
      if (error) errors.sequences = error.message;
    }

    const counts = {};
    for (const group of seedGroups) {
      const { count, error } = await supabase
        .from(group.table)
        .select("*", { count: "exact", head: true });
      if (error) errors[`${group.table}_count`] = error.message;
      else counts[group.table] = count;
    }

    const tableErrors = Object.keys(errors).filter((key) => key !== "sequences");
    if (tableErrors.length || !Object.values(counts).some((count) => count > 0)) {
      return res.status(500).json({
        success: false,
        error: "The starter catalog could not be imported. Check the Supabase schema and table errors.",
        errors,
        counts,
      });
    }

    const imported = Object.fromEntries(
      seedGroups.map((group) => [group.table, group.rows.length])
    );

    return res.json({
      success: true,
      message: "Starter catalog import finished. Existing catalog entries were left unchanged.",
      imported,
      counts,
      warnings: errors.sequences ? { sequences: errors.sequences } : null,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const [flights, hotels, rooms, cars, activities, packages, bookings] =
      await Promise.all([
        supabase.from("admin_flights").select("*", { count: "exact", head: true }),
        supabase.from("admin_hotels").select("*", { count: "exact", head: true }),
        supabase.from("admin_rooms").select("*", { count: "exact", head: true }),
        supabase.from("admin_cars").select("*", { count: "exact", head: true }),
        supabase.from("admin_activities").select("*", { count: "exact", head: true }),
        supabase.from("admin_packages").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }),
      ]);

    return res.json({
      success: true,
      data: {
        flights: flights.count || 0,
        hotels: hotels.count || 0,
        rooms: rooms.count || 0,
        cars: cars.count || 0,
        activities: activities.count || 0,
        packages: packages.count || 0,
        bookings: bookings.count || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/flights", requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from("admin_flights")
    .select("*")
    .order("plan_key");
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, data });
});

router.post("/flights", requireAdmin, async (req, res) => {
  const { plan_key, name, data } = req.body;
  if (!plan_key || !name) {
    return res.status(400).json({ success: false, error: "plan_key and name are required" });
  }
  const { data: inserted, error } = await supabase
    .from("admin_flights")
    .insert({ plan_key, name, data: data || {} })
    .select()
    .single();
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.status(201).json({ success: true, data: inserted });
});

router.put("/flights/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, data } = req.body;
  const update = { updated_at: new Date().toISOString() };
  if (name) update.name = name;
  if (data) update.data = data;
  const { data: updated, error } = await supabase
    .from("admin_flights")
    .update(update)
    .eq("id", id)
    .select()
    .single();
  if (error) return res.status(500).json({ success: false, error: error.message });
  if (!updated) return res.status(404).json({ success: false, error: "Flight not found" });
  return res.json({ success: true, data: updated });
});

router.delete("/flights/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("admin_flights").delete().eq("id", id);
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true });
});


router.get("/hotels", requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from("admin_hotels").select("*").order("name");
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, data });
});

router.post("/hotels", requireAdmin, async (req, res) => {
  const { data: inserted, error } = await supabase.from("admin_hotels").insert(req.body).select().single();
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.status(201).json({ success: true, data: inserted });
});

router.put("/hotels/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { data: updated, error } = await supabase.from("admin_hotels").update({ ...req.body, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) return res.status(500).json({ success: false, error: error.message });
  if (!updated) return res.status(404).json({ success: false, error: "Hotel not found" });
  return res.json({ success: true, data: updated });
});

router.delete("/hotels/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("admin_hotels").delete().eq("id", id);
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true });
});

router.get("/rooms", requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from("admin_rooms").select("*").order("name");
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, data });
});

router.post("/rooms", requireAdmin, async (req, res) => {
  const { data: inserted, error } = await supabase.from("admin_rooms").insert(req.body).select().single();
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.status(201).json({ success: true, data: inserted });
});

router.put("/rooms/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { data: updated, error } = await supabase.from("admin_rooms").update({ ...req.body, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) return res.status(500).json({ success: false, error: error.message });
  if (!updated) return res.status(404).json({ success: false, error: "Room not found" });
  return res.json({ success: true, data: updated });
});

router.delete("/rooms/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("admin_rooms").delete().eq("id", id);
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true });
});

router.get("/cars", requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from("admin_cars").select("*").order("type");
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, data });
});

router.post("/cars", requireAdmin, async (req, res) => {
  const { data: inserted, error } = await supabase.from("admin_cars").insert(req.body).select().single();
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.status(201).json({ success: true, data: inserted });
});

router.put("/cars/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { data: updated, error } = await supabase.from("admin_cars").update({ ...req.body, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) return res.status(500).json({ success: false, error: error.message });
  if (!updated) return res.status(404).json({ success: false, error: "Car not found" });
  return res.json({ success: true, data: updated });
});

router.delete("/cars/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("admin_cars").delete().eq("id", id);
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true });
});

router.get("/activities", requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from("admin_activities").select("*").order("name");
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, data });
});

router.post("/activities", requireAdmin, async (req, res) => {
  const { data: inserted, error } = await supabase.from("admin_activities").insert(req.body).select().single();
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.status(201).json({ success: true, data: inserted });
});

router.put("/activities/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { data: updated, error } = await supabase.from("admin_activities").update({ ...req.body, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) return res.status(500).json({ success: false, error: error.message });
  if (!updated) return res.status(404).json({ success: false, error: "Activity not found" });
  return res.json({ success: true, data: updated });
});

router.delete("/activities/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("admin_activities").delete().eq("id", id);
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true });
});

router.get("/packages", requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from("admin_packages").select("*").order("name");
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, data });
});

router.post("/packages", requireAdmin, async (req, res) => {
  const { data: inserted, error } = await supabase.from("admin_packages").insert(req.body).select().single();
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.status(201).json({ success: true, data: inserted });
});

router.put("/packages/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { data: updated, error } = await supabase.from("admin_packages").update({ ...req.body, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) return res.status(500).json({ success: false, error: error.message });
  if (!updated) return res.status(404).json({ success: false, error: "Package not found" });
  return res.json({ success: true, data: updated });
});

router.delete("/packages/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("admin_packages").delete().eq("id", id);
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true });
});

router.get("/bookings", requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, data });
});
module.exports = router;