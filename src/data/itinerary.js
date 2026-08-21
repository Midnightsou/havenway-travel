/*
 * Generate the itinerary from the
 * user's selected dates and the
 * selected flight plan.
 */

export function generateItinerary(
  startDate,
  endDate,
  selectedFlightPlan
) {

  if (!startDate || !endDate) {
    return [];
  }


  const outbound =
    selectedFlightPlan?.outbound;

  const returning =
    selectedFlightPlan?.return;


  const itineraryTemplates = {

    arrival: {
      title: "Travel to Los Angeles",

      events: [
        {
          id: "flight-out",
          time: outbound?.from?.time,
          type: "flight",
          title: "Depart Washington",
          description: outbound
            ? `Depart ${outbound.from.airportName} (${outbound.from.airport}) for ${outbound.to.airportName} (${outbound.to.airport}).`
            : "Depart Washington for Los Angeles.",
          details: outbound
            ? `${outbound.airline} · ${outbound.flightNumber}`
            : "Flight details",
        },

        {
          id: "arrival",
          time: outbound?.to?.time,
          type: "arrival",
          title: "Arrive in Los Angeles",
          description: outbound
            ? `Arrive at ${outbound.to.airportName} (${outbound.to.airport}).`
            : "Arrive at Los Angeles International Airport (LAX).",
          details: "Los Angeles, California",
        },

        {
          id: "checkin",
          time: "3:00 PM",
          type: "hotel",
          title: "Hotel check-in",
          description:
            "Check in to The Westin Los Angeles Airport and settle into your room.",
          details:
            "5400 W Century Blvd, Los Angeles",
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

    freeDay: {
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

    departure: {
      title: "Return to Washington",

      events: [
        {
          id: "checkout",
          time: "11:00 AM",
          type: "hotel",
          title: "Hotel check-out",
          description:
            "Check out of The Westin Los Angeles Airport.",
          details:
            "Remember to collect all belongings",
        },

        {
          id: "return-flight",
          time: returning?.from?.time,
          type: "flight",
          title: "Depart Los Angeles",
          description: returning
            ? `Depart ${returning.from.airportName} (${returning.from.airport}) for ${returning.to.airportName} (${returning.to.airport}).`
            : "Depart Los Angeles International Airport (LAX) for Washington.",
          details: returning
            ? `${returning.airline} · ${returning.flightNumber}`
            : "Flight details",
        },

        {
          id: "arrive-washington",
          time: returning?.to?.time,
          type: "arrival",
          title: "Arrive in Washington",
          description: returning
            ? `Arrive at ${returning.to.airportName} (${returning.to.airport}).`
            : "Arrive at Ronald Reagan Washington National Airport (DCA).",
          details: "Washington, DC",
        },
      ],
    },
  };


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


    let template;


    /*
     * First day
     */

    if (index === 0) {

      template =
        itineraryTemplates.arrival;

    }


    /*
     * Last day
     */

    else if (
      index === totalDays - 1
    ) {

      template =
        itineraryTemplates.departure;

    }


    /*
     * Middle days
     */

    else {

      template =
        index % 2 === 0
          ? itineraryTemplates.freeDay
          : itineraryTemplates.explore;

    }


    itineraryDays.push({

      id: `day-${index + 1}`,

      dayNumber: index + 1,

      date:
        formatDate(currentDate),

      fullDate:
        formatFullDate(currentDate),

      title:
        template.title,

      events:
        template.events.map(
          (event) => ({
            ...event,

            id:
              `${event.id}-${index + 1}`,

          })
        ),

    });

  }


  return itineraryDays;
}