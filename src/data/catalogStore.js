import { useSyncExternalStore } from "react";
import flightCatalog from "./flight";
import hotelCatalog from "./hotel";
import roomCatalog from "./rooms";
import carCatalog from "./cars";
import activityCatalog from "./activities";
import packageCatalog from "./packages";
import { API_BASE_URL } from "../utils/api";

export const CATALOG_UPDATED_EVENT = "havenway:catalog-updated";
const starterCars = carCatalog.map((car) => ({
  ...car,
  features: [...(car.features || [])],
  images: [...(car.images || [])],
}));
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

function mergeCarsWithStarterCatalog(savedCars) {
  const carsById = new Map(starterCars.map((car) => [String(car.id), car]));
  for (const car of savedCars) {
    carsById.set(String(car.id), car);
  }
  return [...carsById.values()];
}

export function applyCatalog(catalog) {
  if (!catalog || typeof catalog !== "object") {
    throw new Error("The catalog response is invalid.");
  }

  if (Array.isArray(catalog.hotels)) replaceArray(hotelCatalog, catalog.hotels);
  if (Array.isArray(catalog.rooms)) replaceArray(roomCatalog, catalog.rooms);
  if (Array.isArray(catalog.cars)) {
    replaceArray(carCatalog, mergeCarsWithStarterCatalog(catalog.cars));
  }
  if (Array.isArray(catalog.activities)) replaceArray(activityCatalog, catalog.activities);
  if (Array.isArray(catalog.packages)) replaceArray(packageCatalog, catalog.packages);

  if (catalog.flights && typeof catalog.flights === "object") {
    for (const key of Object.keys(flightCatalog)) delete flightCatalog[key];
    Object.assign(flightCatalog, catalog.flights);
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
    Object.keys(catalog?.flights || {}).length > 0;
  if (!hasSavedItems) return;
  applyCatalog(catalog);
}

export function notifyCatalogUpdated() {
  window.dispatchEvent(new Event(CATALOG_UPDATED_EVENT));
}
