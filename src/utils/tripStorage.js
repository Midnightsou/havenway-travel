const STORAGE_KEY = "havenway_trip_state";

export const getStoredTrip = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);

  } catch (error) {

    console.error(
      "Failed to read Havenway trip state:",
      error
    );

    return null;
  }
};


export const saveTrip = (trip) => {
  try {

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(trip)
    );

  } catch (error) {

    console.error(
      "Failed to save Havenway trip state:",
      error
    );

  }
};


export const clearTrip = () => {
  try {

    sessionStorage.removeItem(
      STORAGE_KEY
    );

  } catch (error) {

    console.error(
      "Failed to clear Havenway trip state:",
      error
    );

  }
};