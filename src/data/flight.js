const flights = {
  economy: {
    name: "Economy",

    outbound: {
      type: "Nonstop",
      price: 325,
      flexible: true,

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
      flexible: true,
      baggage: "1 carry-on",
    },

    return: {
      type: "Nonstop",
      price: 325,
      flexible: true,

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
      flexible: true,
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

export const chicoAirport = {
  code: "CIC",
  name: "Chico Regional Airport",
  location: "150 Airpark Blvd, Chico, CA",
};

export const chicoAirlineOptions = [
  {
    id: "frontier",
    airline: "Frontier Airlines",
    cabinOptions: {
      economy: 380,
      business: 468,
      firstClass: 540,
    },
  },
  {
    id: "united",
    airline: "United Airlines",
    cabinOptions: {
      economy: 298,
      business: 480,
      firstClass: 620,
    },
  },
  {
    id: "alaska",
    airline: "Alaska Airlines",
    cabinOptions: {
      economy: 430,
      business: 610,
      firstClass: 968,
    },
  },
];

const cabinNames = {
  economy: "Economy",
  business: "Business",
  firstClass: "First Class",
};

const makeChicoFlightPlan = (option, cabin, roundTripFare) => {
  const outboundPrice = Math.floor(roundTripFare / 2);
  const inboundPrice = roundTripFare - outboundPrice;
  const origin = {
    time: "—",
    airport: "LAX",
    city: "Los Angeles",
    airportName: "Los Angeles International Airport",
  };
  const destination = {
    time: "—",
    airport: chicoAirport.code,
    city: "Chico, California",
    airportName: chicoAirport.name,
  };

  return {
    name: `${option.airline} · ${cabinNames[cabin]}`,
    airline: option.airline,
    roundTripFare,
    outbound: {
      type: "Outbound",
      price: outboundPrice,
      from: origin,
      to: destination,
      duration: "Varies by route",
      stops: "Route details vary",
      airline: option.airline,
      flightNumber: "Flight schedule varies",
      cabin: cabinNames[cabin],
      baggage: "Check carrier rules",
    },
    return: {
      type: "Return",
      price: inboundPrice,
      from: destination,
      to: origin,
      duration: "Varies by route",
      stops: "Route details vary",
      airline: option.airline,
      flightNumber: "Flight schedule varies",
      cabin: cabinNames[cabin],
      baggage: "Check carrier rules",
    },
  };
};

for (const option of chicoAirlineOptions) {
  for (const [cabin, fare] of Object.entries(option.cabinOptions)) {
    flights[`chico-${option.id}-${cabin}`] = makeChicoFlightPlan(
      option,
      cabin,
      fare
    );
  }
}

export default flights;