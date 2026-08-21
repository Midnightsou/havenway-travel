import {
  Plane,
  Hotel,
  MapPin,
  CalendarDays,
  Coffee,
  ArrowRight,
} from "lucide-react";

import flights from "../../data/flight";

import { generateItinerary } from "../../data/itinerary";

import "./Itinerary.css";


function ItineraryEvent({ event }) {

  const icons = {
    flight: Plane,
    arrival: MapPin,
    hotel: Hotel,
    activity: MapPin,
    free: Coffee,
  };

  const Icon =
    icons[event.type] || CalendarDays;


  return (
    <div className="itinerary-event">

      <div className="event-time">
        {event.time}
      </div>


      <div className="event-timeline">

        <div
          className={`event-icon ${event.type}`}
        >
          <Icon size={20} />
        </div>

        <div className="timeline-line" />

      </div>


      <div className="event-content">

        <div className="event-content-top">

          <h4>
            {event.title}
          </h4>

          {event.type === "flight" && (
            <Plane
              size={18}
              className="event-flight-icon"
            />
          )}

        </div>


        <p>
          {event.description}
        </p>

        <span className="event-details">
          {event.details}
        </span>

      </div>

    </div>
  );
}


function Itinerary({
  startDate,
  endDate,
  selectedFlight,
}) {

  if (!startDate || !endDate) {
    return null;
  }




  const selectedFlightPlan =
    selectedFlight
      ? flights[selectedFlight]
      : null;


  const itinerary =
    generateItinerary(
      startDate,
      endDate,
      selectedFlightPlan
    );




  const totalDays =
    itinerary.length;




  const formattedStart =
    itinerary[0]?.date;

  const formattedEnd =
    itinerary[totalDays - 1]?.date;


  return (
    <section
      className="itinerary-section"
      id="itinerary"
    >

      <div className="container">

        <div className="itinerary-header">

          <div>

            <span className="section-eyebrow">
              Your trip
            </span>

            <h2>
              Trip itinerary
            </h2>

            <p>
              Washington → Los Angeles ·{" "}
              {formattedStart} –{" "}
              {formattedEnd}
            </p>

          </div>


          <div className="trip-duration">

            <CalendarDays size={20} />

            <div>

              <strong>
                {totalDays}{" "}
                {totalDays === 1
                  ? "day"
                  : "days"}
              </strong>

              <span>
                {formattedStart} –{" "}
                {formattedEnd}
              </span>

            </div>

          </div>

        </div>


        <div className="itinerary">

          {itinerary.map(
            (day) => (

              <article
                className="itinerary-day"
                key={day.id}
              >

                <div className="day-header">

                  <div className="day-date">
                    {day.date}
                  </div>


                  <div>

                    <span className="day-full-date">
                      {day.fullDate}
                    </span>

                    <h3>
                      {day.title}
                    </h3>

                  </div>

                </div>


                <div className="day-events">

                  {day.events.map(
                    (event) => (

                      <ItineraryEvent
                        key={event.id}
                        event={event}
                      />

                    )
                  )}

                </div>

              </article>

            )
          )}

        </div>


        <div className="itinerary-footer">

          <div>

            <strong>
              Your Los Angeles trip
            </strong>

            <span>
              Flight, hotel stay, and daily
              itinerary in one place.
            </span>

          </div>


          <button className="view-trip-button">

            View trip details

            <ArrowRight size={18} />

          </button>

        </div>

      </div>

    </section>
  );
}


export default Itinerary;