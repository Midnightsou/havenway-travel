import { useSyncExternalStore } from "react";
import flightCatalog from "./flight";
import hotelCatalog from "./hotel";
import roomCatalog from "./rooms";
import carCatalog from "./cars";
import activityCatalog from "./activities";
import packageCatalog from "./packages";
import { API_BASE_URL } from "../utils/api";

export const CATALOG_UPDATED_EVENT = "havenway:catalog-updated";
export let adminItineraryTemplates = {};
const starterCars = carCatalog.map((car) => ({
  ...car,
  features: [...(car.features || [])],
  images: [...(car.images || [])],
}));
const starterHotelAirportDetails = new Map(
  hotelCatalog.map((hotel) => [
    String(hotel.id),
    {
      airportCode: hotel.airportCode,
      airportName: hotel.airportName,
      airportLocation: hotel.airportLocation,
    },
  ])
);
const chicoHotelIds = new Set([
  "hotel-diamond",
  "hotel-katerina",
  "residence-inn-by-marriott-chico",
  "oxford-suites-chico",
  "doubletree-by-hilton-chico",
  "hampton-inn-suites-chico",
  "best-western-heritage-inn-chico",
]);
const starterChicoHotels = new Map(
  hotelCatalog
    .filter((hotel) => chicoHotelIds.has(String(hotel.id)))
    .map((hotel) => [String(hotel.id), hotel])
);
const starterChicoRooms = new Map(
  roomCatalog
    .filter((room) => chicoHotelIds.has(String(room.hotelId)))
    .map((room) => [String(room.id), room])
);
const starterActivities = activityCatalog.map((activity) => ({
  ...activity,
  includes: [...(activity.includes || [])],
}));
const starterChicoFlights = Object.fromEntries(
  Object.entries(flightCatalog).filter(([id]) => id.startsWith("chico-"))
);
let catalogRevision = 0;
const catalogListeners = new Set();

function subscribeToCatalog(listener) {
  catalogListeners.add(listener);
  return () => catalogListeners.delete(listener);
}

function getCatalogRevision() {
  return catalogRevision;
}

export function useCatalogRevision() {
  return useSyncExternalStore(
    subscribeToCatalog,
    getCatalogRevision,
    getCatalogRevision
  );
}

function replaceArray(target, incoming) {
  target.splice(0, target.length, ...incoming);
}

function mergeChicoImages(item, starterImages) {
  if (!starterImages?.length) return item;

  const hasLegacyGeneratedImages =
    Array.isArray(item.images) &&
    item.images.some((image) =>
      /images\.pexels\.com\/photos\/271\d+\//.test(image)
    );
  if (
    hasLegacyGeneratedImages ||
    !Array.isArray(item.images) ||
    !item.images.length
  ) {
    return { ...item, images: starterImages };
  }

  return item;
}

function mergeChicoRoomImages(room, starterImages) {
  const mergedRoom = mergeChicoImages(room, starterImages);
  return Array.isArray(mergedRoom.images)
    ? { ...mergedRoom, images: mergedRoom.images.slice(0, 3) }
    : mergedRoom;
}

function mergeCarsWithStarterCatalog(savedCars) {
  const carsById = new Map(starterCars.map((car) => [String(car.id), car]));
  for (const car of savedCars) {
    carsById.set(String(car.id), car);
  }
  return [...carsById.values()];
}

function mergeActivitiesWithStarterCatalog(savedActivities) {
  const activitiesById = new Map(
    starterActivities.map((activity) => [String(activity.id), activity])
  );
  for (const activity of savedActivities) {
    activitiesById.set(String(activity.id), activity);
  }
  return [...activitiesById.values()];
}

export function applyCatalog(catalog) {
  if (!catalog || typeof catalog !== "object") {
    throw new Error("The catalog response is invalid.");
  }

  if (Array.isArray(catalog.hotels)) {
    replaceArray(
      hotelCatalog,
      catalog.hotels.map((hotel) => {
        const starterDetails = starterHotelAirportDetails.get(String(hotel.id));
        const mergedHotel = {
          ...hotel,
          airportCode:
            hotel.airportCode ||
            hotel.airport_code ||
            starterDetails?.airportCode,
          airportName:
            hotel.airportName ||
            hotel.airport_name ||
            starterDetails?.airportName,
          airportLocation:
            hotel.airportLocation ||
            hotel.airport_location ||
            starterDetails?.airportLocation,
        };
        const starterHotel = starterChicoHotels.get(String(hotel.id));
        return starterHotel
          ? mergeChicoImages(mergedHotel, starterHotel.images)
          : mergedHotel;
      })
    );
  }
  if (Array.isArray(catalog.rooms)) {
    replaceArray(
      roomCatalog,
      catalog.rooms.map((room) => {
        const starterRoom = starterChicoRooms.get(String(room.id));
        return starterRoom
          ? mergeChicoRoomImages(room, starterRoom.images)
          : room;
      })
    );
  }
  if (Array.isArray(catalog.cars)) {
    replaceArray(carCatalog, mergeCarsWithStarterCatalog(catalog.cars));
  }
  if (Array.isArray(catalog.activities)) {
    replaceArray(
      activityCatalog,
      catalog.activities.length
        ? mergeActivitiesWithStarterCatalog(catalog.activities)
        : starterActivities
    );
  }
  if (Array.isArray(catalog.packages)) replaceArray(packageCatalog, catalog.packages);

  if (catalog.flights && typeof catalog.flights === "object") {
    for (const key of Object.keys(flightCatalog)) delete flightCatalog[key];
    Object.assign(flightCatalog, starterChicoFlights);
    Object.assign(flightCatalog, catalog.flights);
  }
  if (
    catalog.itineraryTemplates &&
    typeof catalog.itineraryTemplates === "object" &&
    !Array.isArray(catalog.itineraryTemplates)
  ) {
    adminItineraryTemplates = catalog.itineraryTemplates;
  }

  catalogRevision += 1;
  for (const listener of catalogListeners) listener();
}

export async function loadCatalog() {
  const response = await fetch(`${API_BASE_URL}/api/admin/catalog`, {
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || "Unable to load the travel catalog.");
  }
  const catalog = result.data;
  const hasSavedItems = [
    catalog?.hotels,
    catalog?.rooms,
    catalog?.cars,
    catalog?.activities,
    catalog?.packages,
  ].some((items) => Array.isArray(items) && items.length > 0) ||
    Object.keys(catalog?.flights || {}).length > 0 ||
    (catalog?.itineraryTemplates &&
      Object.keys(catalog.itineraryTemplates).length > 0);
  if (!hasSavedItems) return;
  applyCatalog(catalog);
}

export function notifyCatalogUpdated() {
  window.dispatchEvent(new Event(CATALOG_UPDATED_EVENT));
}
