const express = require("express");
const crypto = require("crypto");
const supabase = require("../supabase");

const router = express.Router();

/*
 * Generate a short, URL-friendly token.
 */
function generateShareToken() {
  return crypto.randomBytes(9).toString("base64url");
}

/*
 * POST /api/shared-trips
 *
 * Creates a shareable itinerary.
 */
router.post("/", async (req, res) => {
  try {
    const {
      travellers = 1,
      startDate = null,
      endDate = null,
      nights = 0,
      days = 0,
      roomId = null,
      flightId = null,
      carId = null,
      activityIds = [],
      packageId = null,
      selectedHotel = null,
    } = req.body;

    const shareToken = generateShareToken();

    /*
     * Shared itineraries are valid for 30 days.
     */
    const expiresAt = new Date();

    expiresAt.setDate(
      expiresAt.getDate() + 30
    );

    const { data, error } = await supabase
      .from("shared_trips")
      .insert({
        share_token: shareToken,

        travellers,

        start_date: startDate,
        end_date: endDate,

        nights,
        days,

        selected_hotel: selectedHotel,
        selected_room: roomId,
        selected_flight: flightId,
        selected_car: carId,

        selected_activities: activityIds,

        selected_package: packageId,

        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Create shared trip error:",
        error
      );

      return res.status(500).json({
        success: false,
        error: "Failed to create shared itinerary",
      });
    }

    return res.status(201).json({
      success: true,

      shareToken: data.share_token,

      expiresAt: data.expires_at,
    });
  } catch (error) {
    console.error(
      "Shared trip creation error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Failed to create shared itinerary",
    });
  }
});

/*
 * GET /api/shared-trips/:token
 *
 * Retrieves a shared itinerary.
 */
router.get("/:token", async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Share token is required",
      });
    }

    const { data, error } = await supabase
      .from("shared_trips")
      .select("*")
      .eq("share_token", token)
      .maybeSingle();

    if (error) {
      console.error(
        "Get shared trip error:",
        error
      );

      return res.status(500).json({
        success: false,
        error: "Failed to load shared itinerary",
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Shared itinerary not found",
      });
    }

    /*
     * Check expiration.
     */
    if (
      data.expires_at &&
      new Date(data.expires_at) < new Date()
    ) {
      return res.status(410).json({
        success: false,
        error: "This shared itinerary has expired",
      });
    }

    return res.json({
      success: true,

      trip: {
        id: data.id,

        shareToken: data.share_token,

        travellers: data.travellers,

        startDate: data.start_date,
        endDate: data.end_date,

        nights: data.nights,
        days: data.days,

        roomId: data.selected_room,
        flightId: data.selected_flight,
        carId: data.selected_car,

        activityIds:
          data.selected_activities || [],

        packageId: data.selected_package,

        selectedHotel:
          data.selected_hotel,

        createdAt: data.created_at,
        expiresAt: data.expires_at,
      },
    });
  } catch (error) {
    console.error(
      "Shared trip retrieval error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Failed to load shared itinerary",
    });
  }
});

module.exports = router;
