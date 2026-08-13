const itinerary = [
  {
    id: "day-1",
    date: "Oct 12",
    fullDate: "Monday, October 12, 2026",
    title: "Travel to Los Angeles",
    events: [
      {
        id: "flight-out",
        time: "8:15 AM",
        type: "flight",
        title: "Depart Washington",
        description:
          "Depart Ronald Reagan Washington National Airport (DCA) for Los Angeles International Airport (LAX).",
        details: "United Airlines · UA 123",
      },
      {
        id: "arrival",
        time: "11:05 AM",
        type: "arrival",
        title: "Arrive in Los Angeles",
        description:
          "Arrive at Los Angeles International Airport (LAX).",
        details: "Los Angeles, California",
      },
      {
        id: "checkin",
        time: "3:00 PM",
        type: "hotel",
        title: "Hotel check-in",
        description:
          "Check in to The Westin Los Angeles Airport and settle into your room.",
        details: "5400 W Century Blvd, Los Angeles",
      },
    ],
  },

  {
    id: "day-2",
    date: "Oct 13",
    fullDate: "Tuesday, October 13, 2026",
    title: "Explore Los Angeles",
    events: [
      {
        id: "morning-la",
        time: "Morning",
        type: "activity",
        title: "Explore Los Angeles",
        description:
          "Spend the day exploring the city and visiting attractions of your choice.",
        details: "Los Angeles, California",
      },
      {
        id: "evening-la",
        time: "Evening",
        type: "free",
        title: "Free evening",
        description:
          "Relax, explore nearby restaurants, or enjoy the city at your own pace.",
        details: "Free time",
      },
    ],
  },

  {
    id: "day-3",
    date: "Oct 14",
    fullDate: "Wednesday, October 14, 2026",
    title: "Free day in Los Angeles",
    events: [
      {
        id: "free-day",
        time: "All day",
        type: "activity",
        title: "Enjoy Los Angeles",
        description:
          "A full day available for sightseeing, shopping, entertainment, or relaxation.",
        details: "Los Angeles",
      },
    ],
  },

  {
    id: "day-4",
    date: "Oct 15",
    fullDate: "Thursday, October 15, 2026",
    title: "Return to Washington",
    events: [
      {
        id: "checkout",
        time: "11:00 AM",
        type: "hotel",
        title: "Hotel check-out",
        description:
          "Check out of The Westin Los Angeles Airport.",
        details: "Remember to collect all belongings",
      },
      {
        id: "return-flight",
        time: "4:30 PM",
        type: "flight",
        title: "Depart Los Angeles",
        description:
          "Depart Los Angeles International Airport (LAX) for Washington.",
        details: "United Airlines · UA 456",
      },
      {
        id: "arrive-washington",
        time: "12:15 AM",
        type: "arrival",
        title: "Arrive in Washington",
        description:
          "Arrive at Ronald Reagan Washington National Airport (DCA).",
        details: "+1 day · Friday, October 16",
      },
    ],
  },
];

export default itinerary;