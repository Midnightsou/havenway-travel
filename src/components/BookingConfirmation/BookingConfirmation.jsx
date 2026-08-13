import {
  CheckCircle2,
  Plane,
  Hotel,
  Car,
  CalendarDays,
  User,
  Mail,
  MapPin,
  ArrowLeft,
} from "lucide-react";

import "./BookingConfirmation.css";


function BookingConfirmation({
  booking,
  onReturnHome,
}) {

  const {
    traveler,
    room,
    car,
    flightTotal,
    hotelTotal,
    carTotal,
    tripTotal,
    travellers,
    bookingReference,
  } = booking;


  return (
    <section className="booking-confirmation">

      <div className="confirmation-container">

        {/* SUCCESS */}

        <div className="confirmation-success">

          <CheckCircle2 size={64} />

          <span>
            Booking confirmed
          </span>

          <h1>
            Your Los Angeles trip is ready!
          </h1>

          <p>
            Your trip details have been confirmed.
            Keep your booking reference for your records.
          </p>

        </div>


        {/* REFERENCE */}

        <div className="booking-reference">

          <span>
            Booking reference
          </span>

          <strong>
            {bookingReference}
          </strong>

        </div>


        {/* TRAVELER */}

          <div className="confirmation-card">

          <div className="confirmation-card-title">

            <User size={20} />

            <h3>
              Traveler
            </h3>

          </div>


          <div className="traveler-confirmation">

            <strong>
              {traveler.firstName}
              {" "}
              {traveler.lastName}
            </strong>

            <span>
              <Mail size={15} />

              {traveler.email}
            </span>

            <small>
              {travellers}{" "}
              {travellers === 1
                ? "traveler"
                : "travelers"}
            </small>

          </div>

        </div>


        {/* FLIGHTS */}

        <div className="confirmation-card">

          <div className="confirmation-card-title">

            <Plane size={20} />

            <h3>
              Flights
            </h3>

          </div>


          <div className="confirmation-flight-grid">

            <div>

              <span>
                Oct 12, 2026
              </span>

              <strong>
                Washington → Los Angeles
              </strong>

              <small>
                DCA → LAX
              </small>

            </div>


            <div>

              <span>
                Oct 15, 2026
              </span>

              <strong>
                Los Angeles → Washington
              </strong>

              <small>
                LAX → DCA
              </small>

            </div>

          </div>

        </div>


        {/* HOTEL */}

        {room && (
          <div className="confirmation-card">

            <div className="confirmation-card-title">

              <Hotel size={20} />

              <h3>
                Your stay
              </h3>

            </div>


            <div className="confirmation-hotel">

              <img
                src={room.images[0]}
                alt={room.name}
              />

              <div>

                <strong>
                  The Westin Los Angeles Airport
                </strong>

                <span>
                  {room.name}
                </span>

                <small>
                  Oct 12 – Oct 15 · 3 nights
                </small>

              </div>

            </div>

          </div>
        )}


        {/* CAR RENTAL */}

        {car && (
          <div className="confirmation-card">

            <div className="confirmation-card-title">

              <Car size={20} />

              <h3>
                Car rental
              </h3>

            </div>


            <div className="confirmation-hotel">

              <div className="confirmation-car-icon">
                <Car size={28} />
              </div>

              <div>

                <strong>
                  {car.name}
                </strong>

                <span>
                  {car.type} · {car.seats} seats
                </span>

                <small>
                  Oct 12 – Oct 15 · 3 days
                </small>

              </div>

            </div>

          </div>
        )}


        {/* ITINERARY */}

        <div className="confirmation-card">

          <div className="confirmation-card-title">

            <CalendarDays size={20} />

            <h3>
              Trip overview
            </h3>

          </div>


          <div className="confirmation-itinerary">

            <div>

              <span>Oct 12</span>

              <strong>
                Fly to Los Angeles and check in
              </strong>

            </div>

            <div>

              <span>Oct 13</span>

              <strong>
                Explore Los Angeles
              </strong>

            </div>

            <div>

              <span>Oct 14</span>

              <strong>
                Enjoy your free day
              </strong>

            </div>

            <div>

              <span>Oct 15</span>

              <strong>
                Check out and return to Washington
              </strong>

            </div>

          </div>

        </div>


        {/* PRICE */}

        <div className="confirmation-total">

          <div>

            <span>
              Flights
            </span>

            <strong>
              ${flightTotal}
            </strong>

          </div>


          {room && (
            <div>

              <span>
                Hotel
              </span>

              <strong>
                ${hotelTotal}
              </strong>

            </div>
          )}


          {car && (
            <div>

              <span>
                Car rental
              </span>

              <strong>
                ${carTotal}
              </strong>

            </div>
          )}


          <div className="confirmation-grand-total">

            <span>
              Total trip price
            </span>

            <strong>
              ${tripTotal}
            </strong>

          </div>

        </div>


        <button
          className="confirmation-home-button"
          onClick={onReturnHome}
        >

          <ArrowLeft size={18} />

          Back to Havenway Travel

        </button>

      </div>

    </section>
  );
}


export default BookingConfirmation;