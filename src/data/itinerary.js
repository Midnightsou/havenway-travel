import flights from "./flight";

const itineraryTemplates = {
  arrival: {
    title: "Travel to Los Angeles",

    events: [
      {
        id: "flight-out",
        time: flights.outbound.from.time,
        type: "flight",
        title: "Depart Washington",
        description:
          "Depart Ronald Reagan Washington National Airport (DCA) for Los Angeles International Airport (LAX).",
        details: `${flights.outbound.airline} · ${flights.outbound.flightNumber}`,
      },

      {
        id: "arrival",
        time: flights.outbound.to.time,
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
        time: flights.return.from.time,
        type: "flight",
        title: "Depart Los Angeles",
        description:
          "Depart Los Angeles International Airport (LAX) for Washington.",
        details: `${flights.return.airline} · ${flights.return.flightNumber}`,
      },

      {
        id: "arrive-washington",
        time: flights.return.to.time,
        type: "arrival",
        title: "Arrive in Washington",
        description:
          "Arrive at Ronald Reagan Washington National Airport (DCA).",
        details: "Washington, DC",
      },
    ],
  },
};


/*
 * Generate the itinerary from the
 * user's selected dates.
 */

export function generateItinerary(
  startDate,
  endDate
) {

  if (!startDate || !endDate) {
    return [];
  }


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


export default itineraryTemplates;