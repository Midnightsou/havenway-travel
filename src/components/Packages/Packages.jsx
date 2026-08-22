import {
  Plane,
  Hotel,
  Check,
  Sparkles,
  Plus,
} from "lucide-react";

import flights from "../../data/flight";
import rooms from "../../data/rooms";
import hotels from "../../data/hotel";

import { formatShortDate } from "../../utils/dates";

import "./Packages.css";


function Packages({
  travellers = 1,
  startDate,
  endDate,
  nights = 0,
  selectedPackage = null,
  selectedHotel = null,
  onSelectPackage,
}) {

  const room = rooms[0];

  const hotel = selectedHotel
    ? hotels.find(
        (item) => item.id === selectedHotel
      )
    : null;

  const flightPlan = flights.economy;

  const hotelTotal =
    room.pricePerNight * nights;

  const flightTotal =
    (flightPlan.outbound.price +
      flightPlan.return.price) *
    travellers;

  const packageTotal =
    hotelTotal + flightTotal;

  const isSelected =
    selectedPackage === 1;

  const dateRange = startDate && endDate
    ? `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`
    : "";

  return (
    <section
      className="packages"
      id="packages"
    >

      <div className="container">

        <div className="package-heading">

          <div>
            <span className="section-eyebrow">
              Bundle & save
            </span>

            <h2>
              Flight + stay packages
            </h2>

            <p>
              Los Angeles to Washington ·
              {dateRange}
            </p>
          </div>

          <div className="package-badge">
            <Sparkles size={18} />

            Save up to 15%
          </div>

        </div>


        <div className="package-card">

          <div className="package-card-top">

            <div>
              <span className="package-type">
                Havenway Package
              </span>

              <h3>
                Flight + Hotel Bundle
              </h3>

              <p>
                Round-trip flight and {nights} nights at
                {hotel?.name || "your selected hotel"}
              </p>
            </div>

            <div className="package-price">
              <span>
                Total package
              </span>

              <strong>
                ${packageTotal}
              </strong>

              <small>
                for {travellers}{" "}
                {travellers === 1
                  ? "traveler"
                  : "travelers"}
              </small>
            </div>

          </div>


          <div className="package-sections">

            {/* FLIGHT */}

            <div className="package-section">

              <div className="package-section-title">

                <div className="package-icon flight">
                  <Plane size={20} />
                </div>

                <div>
                  <span>
                    Flights
                  </span>

                  <strong>
                    Round trip · {travellers}{" "}
                    {travellers === 1
                      ? "traveler"
                      : "travelers"}
                  </strong>
                </div>

              </div>


              <div className="package-route">

                <div>
                  <strong>
                    {flightPlan.outbound.from.airport}
                  </strong>

                  <span>
                    {flightPlan.outbound.from.city}
                  </span>

                  <small>
                    {flightPlan.outbound.from.time}
                  </small>
                </div>

                <div className="package-route-line">
                  <Plane size={16} />
                </div>

                <div>
                  <strong>
                    {flightPlan.outbound.to.airport}
                  </strong>

                  <span>
                    {flightPlan.outbound.to.city}
                  </span>

                  <small>
                    {flightPlan.outbound.to.time}
                  </small>
                </div>

              </div>


              <div className="package-section-total">

                <span>
                  Flight total
                </span>

                <strong>
                  ${flightTotal}
                </strong>

              </div>

            </div>


            {/* HOTEL */}

            <div className="package-section">

              <div className="package-section-title">

                <div className="package-icon hotel">
                  <Hotel size={20} />
                </div>

                <div>
                  <span>
                    Hotel
                  </span>

                  <strong>
                    {hotel?.name || "Your selected hotel"}
                  </strong>
                </div>

              </div>


              <div className="package-hotel">

                <div className="package-hotel-image">

                  <img
                    src={room.images[0]}
                    alt={room.name}
                  />

                </div>

                <div>

                  <strong>
                    {room.name}
                  </strong>

                  <span>
                    {room.beds} · {room.guests}
                  </span>

                  <small>
                    {dateRange} · {nights} nights
                  </small>

                </div>

              </div>


              <div className="package-section-total">

                <span>
                  Hotel total
                </span>

                <strong>
                  ${hotelTotal}
                </strong>

              </div>

            </div>

          </div>


          <div className="package-includes">

            <span>
              Package includes
            </span>

            <div className="package-include-list">

              <div>
                <Check size={16} />

                Round-trip flights
              </div>

              <div>
                <Check size={16} />

                {nights} nights hotel
              </div>

              <div>
                <Check size={16} />

                Free cancellation
              </div>

              <div>
                <Check size={16} />

                No hidden fees
              </div>

            </div>

          </div>


          <div className="package-total">

            <div>
              <strong>
                Package total
              </strong>

              <span>
                Hotel + flight for {travellers}{" "}
                {travellers === 1
                  ? "traveler"
                  : "travelers"}
              </span>
            </div>

            <strong className="package-total-price">
              ${packageTotal}
            </strong>

          </div>


          {onSelectPackage && (
            <button
              className={"select-package-button" + (isSelected ? " package-selected" : "")}
              onClick={() =>
                onSelectPackage(
                  isSelected ? null : 1
                )
              }
            >
              {isSelected ? (
                <>
                  <Check size={17} />
                  Package added to trip
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Add package to trip
                </>
              )}
            </button>
          )}

        </div>

      </div>

    </section>
  );
}

export default Packages;