import {
  Plane,
  ArrowRight,
  Clock,
  Briefcase,
  CircleCheck,
} from "lucide-react";

import flights from "../../data/flight";

import { formatDate } from "../../utils/dates";

import "./Flightplan.css";


function FlightCard({ flight, date }) {
  return (
    <article className="flight-card">

      <div className="flight-card-top">

        <div>
          <span className="flight-type">
            {flight.type}
          </span>

          <h3>
            {date}
          </h3>
        </div>

        <div className="flight-price">
          <span>Flight</span>

          <strong>
            ${flight.price}
          </strong>
        </div>

      </div>


      <div className="flight-route">

        {/* Departure */}

        <div className="airport departure">

          <span className="airport-time">
            {flight.from.time}
          </span>

          <strong className="airport-code">
            {flight.from.airport}
          </strong>

          <span className="airport-city">
            {flight.from.city}
          </span>

        </div>


        {/* Flight line */}

        <div className="flight-path">

          <div className="flight-duration">
            <Clock size={16} />

            <span>
              {flight.duration}
            </span>
          </div>

          <div className="route-line">
            <div className="line" />

            <div className="plane-icon">
              <Plane size={22} />
            </div>

            <ArrowRight
              className="route-arrow"
              size={18}
            />
          </div>

          <span className="stops">
            {flight.stops}
          </span>

        </div>


        {/* Arrival */}

        <div className="airport arrival">

          <span className="airport-time">
            {flight.to.time}
          </span>

          <strong className="airport-code">
            {flight.to.airport}
          </strong>

          <span className="airport-city">
            {flight.to.city}
          </span>

          {flight.to.nextDay && (
            <span className="next-day">
              +1 day
            </span>
          )}

        </div>

      </div>


      <div className="flight-divider" />


      <div className="flight-details">

        <div className="airline-info">

          <div className="airline-logo">
            <Plane size={20} />
          </div>

          <div>
            <strong>
              {flight.airline}
            </strong>

            <span>
              {flight.flightNumber}
            </span>
          </div>

        </div>


        <div className="flight-meta">

          <div>
            <Briefcase size={18} />

            <span>
              {flight.cabin}
            </span>
          </div>

          <div>
            <CircleCheck size={18} />

            <span>
              {flight.baggage}
            </span>
          </div>

        </div>

      </div>


      <div className="airport-details">

        <div>
          <span>Departure</span>

          <strong>
            {flight.from.airportName}
          </strong>
        </div>

        <div>
          <span>Arrival</span>

          <strong>
            {flight.to.airportName}
          </strong>
        </div>

      </div>

    </article>
  );
}


function FlightPlan({
  travellers = 1,
  startDate,
  endDate,
}) {

  const flightTotal =
    (flights.outbound.price +
      flights.return.price) *
    travellers;

  const dateRange = startDate && endDate
    ? `${formatDate(startDate)} – ${formatDate(endDate)}`
    : "";

  return (
    <section
      className="flight-plan"
      id="flights"
    >

      <div className="container">

        <div className="flight-section-heading">

          <div>
            <span className="section-eyebrow">
              Your journey
            </span>

            <h2>
              Flight details
            </h2>

            <p>
              Washington to Los Angeles ·
              {dateRange}
            </p>
          </div>

          <div className="trip-badge">
            <Plane size={18} />

            Round trip
          </div>

        </div>


        <div className="flight-cards">

          <FlightCard
            flight={flights.outbound}
            date={startDate ? formatDate(startDate) : ""}
          />

          <FlightCard
            flight={flights.return}
            date={endDate ? formatDate(endDate) : ""}
          />

        </div>


        <div className="flight-total">

          <div>
            <strong>
              Total flight cost
            </strong>

            <span>
              Round-trip flight for {travellers}{" "}
              {travellers === 1
                ? "traveler"
                : "travelers"}
            </span>
          </div>

          <strong className="flight-total-price">
            ${flightTotal}
          </strong>

        </div>

      </div>

    </section>
  );
}

export default FlightPlan;