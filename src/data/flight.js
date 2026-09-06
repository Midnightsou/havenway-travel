const flights = {
  economy: {
    name: "Economy",

    outbound: {
      type: "Nonstop",
      price: 231,

      from: {
        time: "08:32",
        airport: "LAX",
        city: "Los Angeles",
        airportName: "Los Angeles International Airport",
      },

      to: {
        time: "16:37",
        airport: "BWI",
        city: "Linthicum Heights",
        airportName:
          "Baltimore/Washington International Thurgood Marshall Airport",
      },

      duration: "5h 05m",
      stops: "Nonstop",
      airline: "United Airlines",
      flightNumber: "United Airlines",
      cabin: "Economy",
      baggage: "1 carry-on",
    },

    return: {
      type: "Nonstop",
      price: 249,

      from: {
        time: "08:00",
        airport: "BWI",
        city: "Linthicum Heights",
        airportName:
          "Baltimore/Washington International Thurgood Marshall Airport",
      },

      to: {
        time: "10:36",
        airport: "LAX",
        city: "Los Angeles",
        airportName: "Los Angeles International Airport",
      },

      duration: "5h 36m",
      stops: "Nonstop",
      airline: "United Airlines",
      flightNumber: "United Airlines",
      cabin: "Economy",
      baggage: "1 carry-on",
    },
  },

  business: {
    name: "Business",

    outbound: {
      type: "Nonstop",
      price: 731,

      from: {
        time: "08:32",
        airport: "LAX",
        city: "Los Angeles",
        airportName: "Los Angeles International Airport",
      },

      to: {
        time: "16:37",
        airport: "BWI",
        city: "Linthicum Heights",
        airportName:
          "Baltimore/Washington International Thurgood Marshall Airport",
      },

      duration: "5h 05m",
      stops: "Nonstop",
      airline: "United Airlines",
      flightNumber: "United Airlines",
      cabin: "Business",
      baggage: "2 checked bags",
    },

    return: {
      type: "Nonstop",
      price: 749,

      from: {
        time: "08:00",
        airport: "BWI",
        city: "Linthicum Heights",
        airportName:
          "Baltimore/Washington International Thurgood Marshall Airport",
      },

      to: {
        time: "10:36",
        airport: "LAX",
        city: "Los Angeles",
        airportName: "Los Angeles International Airport",
      },

      duration: "5h 36m",
      stops: "Nonstop",
      airline: "United Airlines",
      flightNumber: "United Airlines",
      cabin: "Business",
      baggage: "2 checked bags",
    },
  },

  first: {
    name: "First Class",

    outbound: {
      type: "Nonstop",
      price: 1281,

      from: {
        time: "08:32",
        airport: "LAX",
        city: "Los Angeles",
        airportName: "Los Angeles International Airport",
      },

      to: {
        time: "16:37",
        airport: "BWI",
        city: "Linthicum Heights",
        airportName:
          "Baltimore/Washington International Thurgood Marshall Airport",
      },

      duration: "5h 05m",
      stops: "Nonstop",
      airline: "United Airlines",
      flightNumber: "United Airlines",
      cabin: "First Class",
      baggage: "2 checked bags",
    },

    return: {
      type: "Nonstop",
      price: 1299,

      from: {
        time: "08:00",
        airport: "BWI",
        city: "Linthicum Heights",
        airportName:
          "Baltimore/Washington International Thurgood Marshall Airport",
      },

      to: {
        time: "10:36",
        airport: "LAX",
        city: "Los Angeles",
        airportName: "Los Angeles International Airport",
      },

      duration: "5h 36m",
      stops: "Nonstop",
      airline: "United Airlines",
      flightNumber: "United Airlines",
      cabin: "First Class",
      baggage: "2 checked bags",
    },
  },
};

export default flights;