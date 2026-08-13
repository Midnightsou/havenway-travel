import {
  Plane,
  Hotel,
  Check,
  Sparkles,
} from "lucide-react";

import flights from "../../data/flight";
import rooms from "../../data/rooms";

import "./Packages.css";


function Packages({ travellers = 1 }) {

  const room = rooms[0];

  const hotelTotal =
    room.pricePerNight * room.nights;

  const flightTotal =
    (flights.outbound.price +
      flights.return.price) *
    travellers;

  const packageTotal =
    hotelTotal + flightTotal;

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
              Washington to Los Angeles ·
              Oct 12 – Oct 15, 2026
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
                Round-trip flight and 3 nights at
                The Westin Los Angeles Airport
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
                    {flights.outbound.from.airport}
                  </strong>

                  <span>
                    {flights.outbound.from.city}
                  </span>

                  <small>
                    {flights.outbound.from.time}
                  </small>
                </div>

                <div className="package-route-line">
                  <Plane size={16} />
                </div>

                <div>
                  <strong>
                    {flights.outbound.to.airport}
                  </strong>

                  <span>
                    {flights.outbound.to.city}
                  </span>

                  <small>
                    {flights.outbound.to.time}
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
                    The Westin Los Angeles Airport
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
                    Oct 12 – Oct 15 · {room.nights} nights
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

                {room.nights} nights hotel
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

        </div>

      </div>

    </section>
  );
}

export default Packages;