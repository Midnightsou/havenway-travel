export const itineraryTemplateDefaults = {
  arrival: {
    title: "Travel to Washington",
    events: [
      {
        id: "flight-out",
        time: "",
        type: "flight",
        title: "Depart Los Angeles",
        description: "Depart Los Angeles International Airport (LAX) for Washington.",
        details: "Flight details",
      },
      {
        id: "arrival",
        time: "",
        type: "arrival",
        title: "Arrive in Washington",
        description: "Arrive at Ronald Reagan Washington National Airport (DCA).",
        details: "Washington, DC",
      },
      {
        id: "checkin",
        time: "3:00 PM",
        type: "hotel",
        title: "Hotel check-in",
        description: "Check in and settle into your room.",
        details: "",
      },
    ],
  },
  explore: {
    title: "Explore Los Angeles",
    events: [
      {
        id: "morning-la",
        time: "Morning",
        type: "activity",
        title: "Explore Los Angeles",
        description: "Spend the day exploring the city and visiting attractions of your choice.",
        details: "Los Angeles, California",
      },
      {
        id: "evening-la",
        time: "Evening",
        type: "free",
        title: "Free evening",
        description: "Relax, explore nearby restaurants, or enjoy the city at your own pace.",
        details: "Free time",
      },
    ],
  },
  freeDay: {
    title: "Free day in Los Angeles",
    events: [
      {
        id: "free-day",
        time: "All day",
        type: "activity",
        title: "Enjoy Los Angeles",
        description: "A full day available for sightseeing, shopping, entertainment, or relaxation.",
        details: "Los Angeles",
      },
    ],
  },
  departure: {
    title: "Return to Los Angeles",
    events: [
      {
        id: "checkout",
        time: "11:00 AM",
        type: "hotel",
        title: "Hotel check-out",
        description: "Check out of your hotel.",
        details: "Remember to collect all belongings",
      },
      {
        id: "return-flight",
        time: "",
        type: "flight",
        title: "Depart Washington",
        description: "Depart Ronald Reagan Washington National Airport (DCA) for Los Angeles.",
        details: "Flight details",
      },
      {
        id: "arrive-los-angeles",
        time: "",
        type: "arrival",
        title: "Arrive in Los Angeles",
        description: "Arrive at Los Angeles International Airport (LAX).",
        details: "Los Angeles, California",
      },
    ],
  },
};

/*
 * Generate dated itinerary days from the selected dates, flight plan,
 * hotel, and any itinerary templates saved by the admin.
 */

export function generateItinerary(
  startDate,
  endDate,
  selectedFlightPlan,
  savedTemplates = {},
  selectedHotel = null,
  selectedRoom = null,
) {

  if (!startDate || !endDate) {
    return [];
  }


  const outbound =
    selectedFlightPlan?.outbound;

  const returning =
    selectedFlightPlan?.return;

  const isChicoTrip =
    selectedHotel?.airportCode === "CIC";

  const isFlexible =
    Boolean(selectedFlightPlan?.flexible);


  const start =
    new Date(startDate);

  const end =
    new Date(endDate);


  const MS_PER_DAY =
    1000 * 60 * 60 * 24;


  const totalDays =
    Math.ceil(
      (end.getTime() - start.getTime()) /
      MS_PER_DAY
    ) + 1;


  const formatDate =
    (date) => {

      return new Intl.DateTimeFormat(
        "en-US",
        {
          month: "short",
          day: "numeric",
        }
      ).format(date);

    };


  const formatFullDate =
    (date) => {

      return new Intl.DateTimeFormat(
        "en-US",
        {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      ).format(date);

    };


  const itineraryDays = [];


  for (
    let index = 0;
    index < totalDays;
    index++
  ) {

    const currentDate =
      new Date(start);

    currentDate.setDate(
      start.getDate() + index
    );


    let templateKey;


    /*
     * First day
     */

    if (index === 0) {

      templateKey = "arrival";

    }


    /*
     * Last day
     */

    else if (
      index === totalDays - 1
    ) {

      templateKey = "departure";

    }


    /*
     * Middle days
     */

    else {

      templateKey = index % 2 === 0 ? "freeDay" : "explore";

    }

    const savedTemplate = savedTemplates?.[templateKey];
    const template = savedTemplate || itineraryTemplateDefaults[templateKey];
    const events = template.events.map((event) => ({ ...event }));
    const defaultEvents = itineraryTemplateDefaults[templateKey].events;
    const chicoDayTitles = {
      arrival: "Travel to Chico",
      explore: "Explore Chico",
      freeDay: "Free day in Chico",
      departure: "Return to Los Angeles",
    };
    const title =
      isChicoTrip &&
      (!savedTemplate ||
        template.title === itineraryTemplateDefaults[templateKey].title)
        ? chicoDayTitles[templateKey]
        : template.title;
    const applyDynamicValues = (eventId, values) => {
      const event = events.find((item) => item.id === eventId);
      const original = defaultEvents.find((item) => item.id === eventId);
      if (!event || !original) return;

      for (const [field, value] of Object.entries(values)) {
        if (value && (!savedTemplate || event[field] === original[field])) {
          event[field] = value;
        }
      }
    };

    if (templateKey === "arrival") {
      if (outbound) {
        applyDynamicValues("flight-out", {
          title: `Depart ${outbound.from?.city || "your origin"}`,
          time: outbound.from?.time,
          description: `Depart ${outbound.from.airportName} (${outbound.from.airport}) for ${outbound.to.airportName} (${outbound.to.airport}).`,
          details: `${outbound.airline} · ${outbound.flightNumber}`,
        });
        applyDynamicValues("arrival", {
          title: `Arrive in ${outbound.to?.city || "your destination"}`,
          time: outbound.to?.time,
          description: `Arrive at ${outbound.to.airportName} (${outbound.to.airport}).`,
        });
      }
      if (selectedHotel) {
        applyDynamicValues("checkin", {
          description: `Check in to ${selectedHotel.name} and settle into your ${selectedRoom?.name ? selectedRoom.name.toLowerCase() : "room"}.`,
          details: selectedHotel.location || "",
          time: selectedHotel.checkIn || selectedHotel.check_in,
        });
      }
      if (isFlexible && !events.some((event) => event.id.startsWith("flexible-ticket"))) {
        events.push({
          id: `flexible-ticket-${index + 1}`,
          time: "Anytime",
          type: "activity",
          title: "Open/Flexible ticket",
          description: "Your economy fare is open and flexible — changes are allowed up to departure.",
          details: "Economy · Open/Flexible · United Airlines",
        });
      }
    }

    if (isChicoTrip && templateKey === "explore") {
      applyDynamicValues("morning-la", {
        title: "Explore Chico",
        description:
          "Spend the day exploring Chico's local attractions, downtown, or nearby trails.",
        details: "Chico, California",
      });
      applyDynamicValues("evening-la", {
        description:
          "Relax, explore nearby restaurants, or enjoy Chico at your own pace.",
        details: "Chico, California",
      });
    }

    if (isChicoTrip && templateKey === "freeDay") {
      applyDynamicValues("free-day", {
        title: "Enjoy Chico",
        description:
          "A full day to explore Chico, visit local attractions, or relax at your own pace.",
        details: "Chico, California",
      });
    }

    if (templateKey === "departure") {
      if (returning) {
        applyDynamicValues("return-flight", {
          title: `Depart ${returning.from?.city || "your destination"}`,
          time: returning.from?.time,
          description: `Depart ${returning.from.airportName} (${returning.from.airport}) for ${returning.to.airportName} (${returning.to.airport}).`,
          details: `${returning.airline} · ${returning.flightNumber}`,
        });
        applyDynamicValues("arrive-los-angeles", {
          title: `Arrive in ${returning.to?.city || "your origin"}`,
          time: returning.to?.time,
          description: `Arrive at ${returning.to.airportName} (${returning.to.airport}).`,
        });
      }
      if (selectedHotel) {
        applyDynamicValues("checkout", {
          description: `Check out of ${selectedHotel.name}.`,
          time: selectedHotel.checkOut || selectedHotel.check_out,
          details: selectedHotel.location || "",
        });
      }
    }

    itineraryDays.push({

      id: `day-${index + 1}`,

      dayNumber: index + 1,

      date:
        formatDate(currentDate),

      fullDate:
        formatFullDate(currentDate),

      title,

      events: events.map((event, eventIndex) => ({
        ...event,
        id: `${event.id || `event-${eventIndex + 1}`}-${index + 1}`,
      })),

    });

  }


  return itineraryDays;
}