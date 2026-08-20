import flights from "../data/flight";
import rooms from "../data/rooms";
import cars from "../data/cars";
import activities from "../data/activities";
import packages from "../data/packages";

/**
 * Calculate the flight total for the trip.
 * Flight price is per traveler.
 */
export function calculateFlightTotal(travellers = 1) {
  return (
    (flights.outbound.price + flights.return.price) *
    travellers
  );
}

/**
 * Calculate the hotel total for the trip.
 * Hotel price is per night, not per traveler.
 */
export function calculateHotelTotal(roomId, nights = 0) {
  if (!roomId) return 0;

  const room = rooms.find((item) => item.id === roomId);
  if (!room) return 0;

  return room.pricePerNight * nights;
}

/**
 * Calculate the car rental total for the trip.
 * Car price is per day, not per traveler.
 */
export function calculateCarTotal(carId, days = 0) {
  if (!carId) return 0;

  const car = cars.find((item) => item.id === carId);
  if (!car) return 0;

  return car.pricePerDay * days;
}

/**
 * Calculate the total for a single activity.
 * Activity price is per person.
 */
export function calculateActivityTotal(activityId, travellers = 1) {
  if (!activityId) return 0;

  const activity = activities.find((item) => item.id === activityId);
  if (!activity) return 0;

  return activity.pricePerPerson * travellers;
}

/**
 * Calculate the total for all selected activities.
 */
export function calculateActivitiesTotal(activityIds = [], travellers = 1) {
  return activityIds.reduce(
    (sum, id) => sum + calculateActivityTotal(id, travellers),
    0
  );
}

/**
 * Calculate the package savings.
 * A package bundles flight + hotel with a discount.
 * Returns the discount amount (savings) applied to the hotel.
 */
export function calculatePackageTotal(packageId, travellers = 1, nights = 0) {
  if (!packageId) return 0;

  const pkg = packages.find((item) => item.id === packageId);
  if (!pkg) return 0;

  const hotelTotal = calculateHotelTotal(pkg.roomId, nights);

  return Math.round(hotelTotal * pkg.discount);
}

/**
 * Build the complete totals object for a trip.
 *
 * @param {Object} trip - The trip state
 * @returns {Object} totals
 */
export function calculateTotals(trip) {
  const {
    travellers = 1,
    nights = 0,
    days = 0,
    roomId = null,
    carId = null,
    activityIds = [],
    packageId = null,
  } = trip;

  const flightTotal = calculateFlightTotal(travellers);
  const hotelTotal = calculateHotelTotal(roomId, nights);
  const carTotal = calculateCarTotal(carId, days);
  const activitiesTotal = calculateActivitiesTotal(activityIds, travellers);
  const packageTotal = calculatePackageTotal(packageId, travellers, nights);

  const tripTotal =
    flightTotal + hotelTotal + carTotal + activitiesTotal - packageTotal;

  return {
    flightTotal,
    hotelTotal,
    carTotal,
    activitiesTotal,
    packageTotal,
    tripTotal,
  };
}

/**
 * Build the complete booking object from the trip state.
 * This is the single source of truth used by the modal
 * and the confirmation.
 */
export function buildBooking(trip, traveler = null) {
  const {
    startDate,
    endDate,
    travellers = 1,
    nights = 0,
    days = 0,
    roomId = null,
    carId = null,
    activityIds = [],
    packageId = null,
  } = trip;

  const room = roomId
    ? rooms.find((item) => item.id === roomId)
    : null;

  const car = carId
    ? cars.find((item) => item.id === carId)
    : null;

  const selectedActivities = activityIds
    .map((id) => activities.find((item) => item.id === id))
    .filter(Boolean);

  const pkg = packageId
    ? packages.find((item) => item.id === packageId)
    : null;

  const totals = calculateTotals(trip);

  return {
    startDate,
    endDate,
    travellers,
    nights,
    days,
    room,
    car,
    activities: selectedActivities,
    package: pkg,
    flight: flights,
    totals,
    traveler,
  };
}