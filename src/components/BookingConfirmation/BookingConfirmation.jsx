import {
  CheckCircle2,
  Plane,
  Hotel,
  Car,
  CalendarDays,
  User,
  Mail,
  ArrowLeft,
  Ticket,
  Sparkles,
} from "lucide-react";

import { formatShortDate } from "../../utils/dates";

import "./BookingConfirmation.css";


function BookingConfirmation({
  booking,
  onReturnHome,
}) {

  const {
    traveler,
    room,
    car,
    activities = [],
    package: pkg,
    flight,
    totals = {},
    travellers = 1,
    bookingReference,
    startDate,
    endDate,
    nights = 0,
    days = 0,
    itinerary = [],
    hotel,
  } = booking;


  /*
   * ------------------------------------------------
   * TOTALS
   * ------------------------------------------------
   *
   * These now support the new booking structure:
   *
   * totals: {
   *   flights,
   *   hotel,
   *   car,
   *   activities,
   *   package,
   *   total
   * }
   */

  const flightTotal =
    totals.flights ??
    totals.flightTotal ??
    0;

  const hotelTotal =
    totals.hotel ??
    totals.hotelTotal ??
    0;

  const carTotal =
    totals.car ??
    totals.carTotal ??
    0;

  const activitiesTotal =
    totals.activities ??
    totals.activitiesTotal ??
    0;

  const packageTotal =
    totals.package ??
    totals.packageTotal ??
    0;

  const tripTotal =
    totals.total ??
    totals.tripTotal ??
    (
      flightTotal +
      hotelTotal +
      carTotal +
      activitiesTotal +
      packageTotal
    );


  /*
   * ------------------------------------------------
   * DATES
   * ------------------------------------------------
   */

  const dateRange =
    startDate && endDate
      ? `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`
      : "";


  /*
   * ------------------------------------------------
   * FLIGHT DATA
   * ------------------------------------------------
   */

  const outbound =
    flight?.outbound;

  const returnFlight =
    flight?.return;


  /*
   * ------------------------------------------------
   * HOTEL NAME
   * ------------------------------------------------
   *
   * Prefer booking.hotel.name.
   * This allows the confirmation page to work
   * with different hotels later.
   */

  const hotelName =
    hotel?.name ||
    booking?.hotelName ||
    "Your selected hotel";


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
              {traveler?.firstName}{" "}
              {traveler?.lastName}
            </strong>

            <span>

              <Mail size={15} />

              {traveler?.email}

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

        {(outbound || returnFlight) && (

          <div className="confirmation-card">

            <div className="confirmation-card-title">

              <Plane size={20} />

              <h3>
                Flights
              </h3>

            </div>


            <div className="confirmation-flight-grid">


              {/* OUTBOUND */}

              {outbound && (

                <div>

                  <span>
                    {startDate
                      ? formatShortDate(startDate)
                      : ""}
                  </span>


                  <strong>

                    {outbound.from?.city}
                    {" → "}
                    {outbound.to?.city}

                  </strong>


                  <small>

                    {outbound.from?.airport}
                    {" → "}
                    {outbound.to?.airport}

                  </small>

                </div>

              )}


              {/* RETURN */}

              {returnFlight && (

                <div>

                  <span>
                    {endDate
                      ? formatShortDate(endDate)
                      : ""}
                  </span>


                  <strong>

                    {returnFlight.from?.city}
                    {" → "}
                    {returnFlight.to?.city}

                  </strong>


                  <small>

                    {returnFlight.from?.airport}
                    {" → "}
                    {returnFlight.to?.airport}

                  </small>

                </div>

              )}

            </div>

          </div>

        )}


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
                src={room.images?.[0]}
                alt={room.name}
              />


              <div>

                <strong>
                  {hotelName}
                </strong>

                <span>
                  {room.name}
                </span>

                <small>

                  {dateRange}

                  {" · "}

                  {nights}{" "}
                  {nights === 1
                    ? "night"
                    : "nights"}

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

                  {car.type}
                  {" · "}
                  {car.seats} seats

                </span>

                <small>

                  {dateRange}

                  {" · "}

                  {days}{" "}
                  {days === 1
                    ? "day"
                    : "days"}

                </small>

              </div>

            </div>

          </div>

        )}


        {/* ACTIVITIES */}

        {activities.length > 0 && (

          <div className="confirmation-card">

            <div className="confirmation-card-title">

              <Ticket size={20} />

              <h3>
                Activities
              </h3>

            </div>


            <div className="confirmation-activities">

              {activities.map(
                (activity) => (

                  <div
                    className="confirmation-activity-item"
                    key={activity.id}
                  >

                    <Ticket size={17} />

                    <div>

                      <strong>
                        {activity.name}
                      </strong>

                      <span>

                        {activity.location}
                        {" · "}
                        {activity.duration}

                      </span>

                    </div>


                    <strong>

                      $
                      {activity.pricePerPerson *
                        travellers}

                    </strong>

                  </div>

                )
              )}

            </div>

          </div>

        )}


        {/* PACKAGE */}

        {pkg && (

          <div className="confirmation-card">

            <div className="confirmation-card-title">

              <Sparkles size={20} />

              <h3>
                Package
              </h3>

            </div>


            <div className="confirmation-package">

              <Sparkles size={20} />

              <div>

                <strong>
                  {pkg.name}
                </strong>

                <span>
                  Flight + hotel bundled
                </span>

              </div>

            </div>

          </div>

        )}


        {/* ITINERARY */}

        {itinerary.length > 0 && (

          <div className="confirmation-card">

            <div className="confirmation-card-title">

              <CalendarDays size={20} />

              <h3>
                Trip overview
              </h3>

            </div>


            <div className="confirmation-itinerary">

              {itinerary.map(
                (day) => (

                  <div
                    key={day.id}
                  >

                    <span>
                      {day.date}
                    </span>

                    <strong>
                      {day.title}
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>

        )}


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


          {activities.length > 0 && (

            <div>

              <span>
                Activities
              </span>

              <strong>
                ${activitiesTotal}
              </strong>

            </div>

          )}


          {pkg && (

            <div>

              <span>
                Package
              </span>

              <strong>
                ${packageTotal}
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


        {/* BACK HOME */}

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