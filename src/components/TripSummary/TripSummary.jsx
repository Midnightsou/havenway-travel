import {
  Plane,
  Hotel,
  BedDouble,
  Car,
  CalendarDays,
  Users,
  CheckCircle2,
} from "lucide-react";

import rooms from "../../data/rooms";
import flights from "../../data/flight";
import cars from "../../data/cars";

import "./TripSummary.css";


function TripSummary({
  selectedRoom,
  selectedCar,
  onContinue,
  travellers = 1,
}) {

  const room = rooms.find(
    (item) => item.id === selectedRoom
  );

  const car = cars.find(
    (item) => item.id === selectedCar
  );

  const rentalDays = 3;


  const flightTotal =
    (flights.outbound.price +
      flights.return.price) *
    travellers;


  const hotelTotal = room
    ? room.pricePerNight * room.nights
    : 0;


  const carTotal = car
    ? car.pricePerDay * rentalDays
    : 0;


  const tripTotal =
    flightTotal + hotelTotal + carTotal;


  return (
    <section
      className="trip-summary"
      id="summary"
    >

      <div className="container">

        <div className="summary-heading">

          <span className="section-eyebrow">
            Your booking
          </span>

          <h2>
            Trip summary
          </h2>

          <p>
            Review your flight and hotel details
            before continuing.
          </p>

        </div>


        <div className="summary-layout">

          {/* LEFT SIDE */}

          <div className="summary-details">

            {/* FLIGHTS */}

            <div className="summary-card">

              <div className="summary-card-heading">

                <div className="summary-icon flight">
                  <Plane size={21} />
                </div>

                <div>
                  <span>
                    Flights
                  </span>

                  <strong>
                    Round trip
                  </strong>
                </div>

              </div>


              <div className="summary-flight">

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


                <div className="summary-flight-line">
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


              <div className="return-label">
                Return · Oct 15
              </div>


              <div className="summary-flight">

                <div>
                  <strong>
                    {flights.return.from.airport}
                  </strong>

                  <span>
                    {flights.return.from.city}
                  </span>

                  <small>
                    {flights.return.from.time}
                  </small>
                </div>


                <div className="summary-flight-line">
                  <Plane size={16} />
                </div>


                <div>
                  <strong>
                    {flights.return.to.airport}
                  </strong>

                  <span>
                    {flights.return.to.city}
                  </span>

                  <small>
                    {flights.return.to.time}
                  </small>
                </div>

              </div>


              <div className="summary-card-total">

                <span>
                  Flight total · {travellers}{" "}
                  {travellers === 1
                    ? "traveler"
                    : "travelers"}
                </span>

                <strong>
                  ${flightTotal}
                </strong>

              </div>

            </div>


            {/* HOTEL */}

            <div className="summary-card">

              <div className="summary-card-heading">

                <div className="summary-icon hotel">
                  <Hotel size={21} />
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


              {room ? (
                <>
                  <div className="selected-room-info">

                    <BedDouble size={20} />

                    <div>

                      <strong>
                        {room.name}
                      </strong>

                      <span>
                        {room.beds} · {room.guests}
                      </span>

                    </div>

                  </div>


                  <div className="hotel-dates">

                    <div>
                      <CalendarDays size={18} />

                      <span>
                        Oct 12 – Oct 15
                      </span>
                    </div>

                    <span>
                      {room.nights} nights
                    </span>

                  </div>


                  <div className="summary-card-total">

                    <span>
                      Hotel total
                    </span>

                    <strong>
                      ${hotelTotal}
                    </strong>

                  </div>

                </>
              ) : (

                <div className="no-room">

                  <BedDouble size={20} />

                  <span>
                    Select a room to see your hotel total.
                  </span>

                </div>

              )}

            </div>

            {/* CAR */}

            <div className="summary-card">

              <div className="summary-card-heading">

                <div className="summary-icon car">
                  <Car size={21} />
                </div>

                <div>
                  <span>
                    Car rental
                  </span>

                  <strong>
                    Pickup at LAX
                  </strong>
                </div>

              </div>


              {car ? (
                <>
                  <div className="selected-car-info">

                    <Car size={20} />

                    <div>

                      <strong>
                        {car.name}
                      </strong>

                      <span>
                        {car.type} · {car.seats} seats
                      </span>

                    </div>

                  </div>


                  <div className="car-dates">

                    <div>
                      <CalendarDays size={18} />

                      <span>
                        Oct 12 – Oct 15
                      </span>
                    </div>

                    <span>
                      {rentalDays} days
                    </span>

                  </div>


                  <div className="summary-card-total">

                    <span>
                      Car rental total
                    </span>

                    <strong>
                      ${carTotal}
                    </strong>

                  </div>

                </>
              ) : (

                <div className="no-car">

                  <Car size={20} />

                  <span>
                    Select a car to see your rental total.
                  </span>

                </div>

              )}

            </div>

          </div>


          {/* RIGHT SIDE */}

          <aside className="price-card">

            <div className="price-card-top">

              <span>
                Total trip price
              </span>

              <strong>
                ${tripTotal}
              </strong>

              <small>
                {travellers}{" "}
                {travellers === 1
                  ? "traveler"
                  : "travelers"}
              </small>

            </div>


            <div className="price-breakdown">

              <div>
                <span>
                  Flights
                </span>

                <strong>
                  ${flightTotal}
                </strong>
              </div>


              <div>
                <span>
                  Hotel
                </span>

                <strong>
                  {room
                    ? `$${hotelTotal}`
                    : "—"}
                </strong>
              </div>


              <div>
                <span>
                  Car rental
                </span>

                <strong>
                  {car
                    ? `$${carTotal}`
                    : "—"}
                </strong>
              </div>


              <div>
                <span>
                  Travelers
                </span>

                <strong>
                  {travellers}
                </strong>
              </div>

            </div>


            <div className="price-divider" />


            <div className="price-total">

              <span>
                Total
              </span>

              <strong>
                {room || car
                  ? `$${tripTotal}`
                  : `$${flightTotal}`}
              </strong>

            </div>


            <button
              className="continue-button"
              disabled={!room && !car}
              onClick={onContinue}
            >
              {room || car
                ? "Continue to booking"
                : "Select a room or car first"}
            </button>


            <div className="secure-booking">

              <CheckCircle2 size={17} />

              <span>
                Secure booking · No hidden fees
              </span>

            </div>

          </aside>

        </div>

      </div>

    </section>
  );
}

export default TripSummary;