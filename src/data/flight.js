const flights = {
  outbound: {
    type: "Nonstop",
    price: 249,

    from: {
      time: "08:30",
      airport: "DCA",
      city: "Washington",
      airportName: "Ronald Reagan Washington National Airport",
    },

    to: {
      time: "11:05",
      airport: "LAX",
      city: "Los Angeles",
      airportName: "Los Angeles International Airport",
    },

    duration: "5h 35m",
    stops: "Nonstop",

    airline: "Delta Air Lines",
    flightNumber: "DL 1249",
    cabin: "Economy",
    baggage: "1 carry-on",
  },

  return: {
    type: "Nonstop",
    price: 231,

    from: {
      time: "14:20",
      airport: "LAX",
      city: "Los Angeles",
      airportName: "Los Angeles International Airport",
    },

    to: {
      time: "22:05",
      airport: "DCA",
      city: "Washington",
      airportName: "Ronald Reagan Washington National Airport",
    },

    duration: "5h 45m",
    stops: "Nonstop",

    airline: "Delta Air Lines",
    flightNumber: "DL 1248",
    cabin: "Economy",
    baggage: "1 carry-on",
  },
};

export default flights;