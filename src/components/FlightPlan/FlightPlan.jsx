import { useState } from "react";

import {
  Plane,
  ArrowRight,
  Clock,
  Briefcase,
  CircleCheck,
  Check,
} from "lucide-react";

import flights from "../../data/flight";

import { formatDate } from "../../utils/dates";

import "./Flightplan.css";


function FlightCard({
  flight,
  date,
  selected,
  onSelect,
}) {

  return (
    <article
      className={`flight-card ${
        selected
          ? "flight-card-selected"
          : ""
      }`}
      onClick={onSelect}
    >

      {/* SELECTED BADGE */}

      {selected && (
        <div className="flight-selected-badge">

          <Check size={15} />

          Selected

        </div>
      )}


      {/* TOP */}

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

          <span>
            Flight 
          </span>

          <strong>
            ${flight.price}
          </strong>

        </div>

      </div>


      {/* ROUTE */}

      <div className="flight-route">

        {/* DEPARTURE */}

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


        {/* PATH */}

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


        {/* ARRIVAL */}

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


      {/* DETAILS */}

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


      {/* AIRPORT DETAILS */}

      <div className="airport-details">

        <div>

          <span>
            Departure
          </span>

          <strong>
            {flight.from.airportName}
          </strong>

        </div>

        <div>

          <span>
            Arrival
          </span>

          <strong>
            {flight.to.airportName}
          </strong>

        </div>

      </div>


      {/* SELECT BUTTON */}

      <button
        type="button"
        className={`flight-select-button ${
          selected
            ? "flight-select-button-selected"
            : ""
        }`}
        onClick={(event) => {

          event.stopPropagation();

          onSelect();

        }}
      >

        {selected ? (
          <>
            <Check size={17} />
            Selected
          </>
        ) : (
          "Select flight"
        )}

      </button>

    </article>
  );
}


function FlightPlan({
  travellers = 1,
  startDate,
  endDate,
  selectedFlight,
  onSelectFlight,
}) {

  const flightOptions = Object.entries(
    flights
  );


  const selectedPlan =
    flights[selectedFlight] || null;


  const flightTotal = selectedPlan
    ? (
        selectedPlan.outbound.price +
        selectedPlan.return.price
      ) * travellers
    : 0;


  const dateRange =
    startDate && endDate
      ? `${formatDate(startDate)} – ${formatDate(endDate)}`
      : "";


  return (
    <section
      className="flight-plan"
      id="flights"
    >

      <div className="container">

        {/* HEADING */}

        <div className="flight-section-heading">

          <div>

            <span className="section-eyebrow">
              Your journey
            </span>

            <h2>
              Choose your flight (non-refundable)
            </h2>

            <p>
              Los Angeles to Washington ·{" "}
              {dateRange}
            </p>

          </div>


          <div className="trip-badge">

            <Plane size={18} />

            Round trip

          </div>

        </div>


        {/* FLIGHT PLAN OPTIONS */}

        <div className="flight-plan-options">

          {flightOptions.map(([id, plan]) => {

            const total =
              (plan.outbound.price +
                plan.return.price) *
              travellers;

            const isSelected =
              selectedFlight === id;

            return (
              <button
                key={id}
                type="button"
                className={`flight-option ${
                  isSelected
                    ? "flight-option-selected"
                    : ""
                }`}
                onClick={() =>
                  onSelectFlight(id)
                }
              >

                <div>

                  <strong>
                    {plan.name}
                  </strong>

                  <span>
                    {plan.outbound.cabin}
                  </span>

                </div>

                <div>

                  <strong>
                    ${total}
                  </strong>

                  {isSelected && (
                    <span>
                      Selected
                    </span>
                  )}

                </div>

              </button>
            );

          })}

        </div>


        {/* FLIGHT CARDS */}

        {selectedPlan && (
          <div className="flight-cards">

            <FlightCard
              flight={selectedPlan.outbound}
              date={
                startDate
                  ? formatDate(startDate)
                  : ""
              }
            />

            <FlightCard
              flight={selectedPlan.return}
              date={
                endDate
                  ? formatDate(endDate)
                  : ""
              }
            />

          </div>
        )}


        {/* TOTAL */}

        {selectedPlan && (

          <div className="flight-total">

            <div>

              <strong>
                Total flight cost
              </strong>

              <span>
                {selectedPlan.name} round-trip
                for {travellers}{" "}
                {travellers === 1
                  ? "traveler"
                  : "travelers"}
              </span>

            </div>


            <strong className="flight-total-price">

              ${flightTotal}

            </strong>

          </div>

        )}

      </div>

    </section>
  );
}


export default FlightPlan;