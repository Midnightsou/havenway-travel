import {
  CheckCircle2,
  Plane,
  Hotel,
  Car,
  CalendarDays,
  User,
  Mail,
  Phone,
  ArrowLeft,
  Ticket,
  Sparkles,
  Receipt,
  CreditCard,
  MapPin,
  Clock3,
  Users,
  Printer,
  ShieldCheck,
  Download,
} from "lucide-react";

import { formatShortDate } from "../../utils/dates";

import "./BookingConfirmation.css";

function BookingConfirmation({
  booking,
  onReturnHome,
}) {
  if (!booking) {
    return (
      <section className="booking-confirmation">
        <div className="confirmation-container">
          <div className="confirmation-empty">
            <h2>Booking information unavailable</h2>
            <p>
              We couldn't load the details for this booking.
            </p>

            <button
              className="confirmation-home-button"
              onClick={onReturnHome}
            >
              <ArrowLeft size={18} />
              Back to Havenway Travel
            </button>
          </div>
        </div>
      </section>
    );
  }

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
   * Supports both:
   *
   * totals.total
   *
   * and backend-style:
   *
   * usdTotal
   */

  const flightTotal =
    Number(
      totals.flights ??
        totals.flightTotal ??
        0
    );

  const hotelTotal =
    Number(
      totals.hotel ??
        totals.hotelTotal ??
        0
    );

  const carTotal =
    Number(
      totals.car ??
        totals.carTotal ??
        0
    );

  const activitiesTotal =
    Number(
      totals.activities ??
        totals.activitiesTotal ??
        0
    );

  const packageTotal =
    Number(
      totals.package ??
        totals.packageTotal ??
        0
    );

  const calculatedTotal =
    flightTotal +
    hotelTotal +
    carTotal +
    activitiesTotal +
    packageTotal;

  const tripTotal =
    Number(
      totals.total ??
        totals.tripTotal ??
        booking.usdTotal ??
        booking.usd_total ??
        calculatedTotal
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

  const confirmationDate = formatShortDate(
    new Date()
  );

  /*
   * ------------------------------------------------
   * FLIGHT DATA
   * ------------------------------------------------
   */

  const outbound = flight?.outbound;
  const returnFlight = flight?.return;

  /*
   * ------------------------------------------------
   * HOTEL
   * ------------------------------------------------
   */

  const hotelName =
    hotel?.name ||
    booking?.hotelName ||
    "Your selected hotel";

  /*
   * ------------------------------------------------
   * TRAVELER
   * ------------------------------------------------
   */

  const travelerFirstName =
    traveler?.firstName ||
    traveler?.name?.split(" ")?.[0] ||
    "";

  const travelerLastName =
    traveler?.lastName ||
    traveler?.name
      ?.split(" ")
      ?.slice(1)
      ?.join(" ") ||
    "";

  const travelerFullName =
    `${travelerFirstName} ${travelerLastName}`.trim() ||
    traveler?.name ||
    "Traveler";

  /*
   * ------------------------------------------------
   * DESTINATION
   * ------------------------------------------------
   */

  const destination =
    outbound?.to?.city ||
    hotel?.location ||
    booking?.destination ||
    "Your destination";

  /*
   * ------------------------------------------------
   * PAYMENT
   * ------------------------------------------------
   */

  const paymentConfirmed =
    booking?.paymentStatus === "confirmed" ||
    booking?.payment_status === "confirmed" ||
    booking?.bookingStatus === "confirmed" ||
    booking?.booking_status === "confirmed" ||
    booking?.status === "confirmed";

  /*
   * ------------------------------------------------
   * PRINT
   * ------------------------------------------------
   */

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="booking-confirmation">

      <div className="confirmation-container">

        {/* =========================================
            TOP BRAND HEADER
        ========================================= */}

        <header className="confirmation-topbar">

          <div className="confirmation-brand">

            <div className="brand-mark">
              <Plane size={21} />
            </div>

            <div>
              <strong>
                Havenway Travels
              </strong>

              <span>
                Your journey, made easy.
              </span>
            </div>

          </div>


          <div className="confirmation-document">

            <span>
              <Receipt size={15} />
              Booking confirmation
            </span>

            <small>
              Official travel document
            </small>

          </div>

        </header>


        {/* =========================================
            SUCCESS HERO
        ========================================= */}

        <section className="confirmation-hero">

          <div className="success-icon">

            <CheckCircle2 size={48} />

          </div>


          <div className="success-content">

            <div className="success-label">

              <ShieldCheck size={15} />

              Booking confirmed

            </div>

            <h1>
              Your trip to {destination} is confirmed.
            </h1>

            <p>
              Everything is ready. Your booking details
              are shown below for your records.
            </p>

          </div>


          <div className="hero-actions">

            <button
              type="button"
              className="print-button"
              onClick={handlePrint}
            >
              <Printer size={17} />
              Print
            </button>

          </div>

        </section>


        {/* =========================================
            BOOKING META
        ========================================= */}

        <section className="booking-meta">

          <div className="booking-meta-item">

            <span>
              Booking reference
            </span>

            <strong>
              {bookingReference || booking?.id || "—"}
            </strong>

          </div>


          <div className="booking-meta-item">

            <span>
              Confirmation date
            </span>

            <strong>
              {confirmationDate}
            </strong>

          </div>


          <div className="booking-meta-item">

            <span>
              Travelers
            </span>

            <strong>
              {travellers}{" "}
              {travellers === 1
                ? "traveler"
                : "travelers"}
            </strong>

          </div>


          <div className="booking-meta-item">

            <span>
              Payment
            </span>

            <strong className="payment-confirmed">

              <CheckCircle2 size={15} />

              {paymentConfirmed
                ? "Paid"
                : "Confirmed"}

            </strong>

          </div>

        </section>


        {/* =========================================
            TRIP SUMMARY
        ========================================= */}

        <section className="trip-summary-card">

          <div className="trip-summary-heading">

            <div>

              <span className="section-eyebrow">
                YOUR TRIP
              </span>

              <h2>
                {destination}
              </h2>

            </div>

            <div className="trip-summary-icon">
              <MapPin size={21} />
            </div>

          </div>


          <div className="trip-summary-details">

            <div>

              <CalendarDays size={18} />

              <div>

                <span>
                  Travel dates
                </span>

                <strong>
                  {dateRange || "Dates unavailable"}
                </strong>

              </div>

            </div>


            <div>

              <Users size={18} />

              <div>

                <span>
                  Travelers
                </span>

                <strong>
                  {travellers}{" "}
                  {travellers === 1
                    ? "traveler"
                    : "travelers"}
                </strong>

              </div>

            </div>


            {nights > 0 && (

              <div>

                <Clock3 size={18} />

                <div>

                  <span>
                    Length of stay
                  </span>

                  <strong>
                    {nights}{" "}
                    {nights === 1
                      ? "night"
                      : "nights"}
                  </strong>

                </div>

              </div>

            )}

          </div>

        </section>


        {/* =========================================
            TRAVELER INFORMATION
        ========================================= */}

        <section className="confirmation-section">

          <div className="section-heading">

            <div className="section-heading-icon">
              <User size={19} />
            </div>

            <div>

              <span>
                BOOKING DETAILS
              </span>

              <h2>
                Traveler information
              </h2>

            </div>

          </div>


          <div className="traveler-card">

            <div className="traveler-avatar">
              {travelerFullName
                .charAt(0)
                .toUpperCase()}
            </div>


            <div className="traveler-main">

              <strong>
                {travelerFullName}
              </strong>

              <div className="traveler-contact">

                {traveler?.email && (

                  <span>
                    <Mail size={15} />
                    {traveler.email}
                  </span>

                )}

                {traveler?.phone && (

                  <span>
                    <Phone size={15} />
                    {traveler.phone}
                  </span>

                )}

              </div>

            </div>


            <div className="traveler-count">

              <Users size={16} />

              {travellers}{" "}
              {travellers === 1
                ? "traveler"
                : "travelers"}

            </div>

          </div>

        </section>


        {/* =========================================
            FLIGHTS
        ========================================= */}

        {(outbound || returnFlight) && (

          <section className="confirmation-section">

            <div className="section-heading">

              <div className="section-heading-icon">
                <Plane size={19} />
              </div>

              <div>

                <span>
                  TRANSPORTATION
                </span>

                <h2>
                  Flight itinerary
                </h2>

              </div>

            </div>


            <div className="flight-list">

              {/* OUTBOUND */}

              {outbound && (

                <div className="flight-card">

                  <div className="flight-card-top">

                    <span className="flight-direction">
                      OUTBOUND
                    </span>

                    <span className="flight-date">

                      <CalendarDays size={14} />

                      {startDate
                        ? formatShortDate(startDate)
                        : "Departure date"}

                    </span>

                  </div>


                  <div className="flight-route">

                    <div className="airport">

                      <strong>
                        {outbound.from?.airport}
                      </strong>

                      <span>
                        {outbound.from?.city}
                      </span>

                    </div>


                    <div className="flight-line">

                      <span>
                        <Plane size={17} />
                      </span>

                      <div />

                    </div>


                    <div className="airport airport-arrival">

                      <strong>
                        {outbound.to?.airport}
                      </strong>

                      <span>
                        {outbound.to?.city}
                      </span>

                    </div>

                  </div>


                  <div className="flight-route-footer">

                    <span>
                      {outbound.from?.city}
                      {" → "}
                      {outbound.to?.city}
                    </span>

                    {outbound.duration && (

                      <span>
                        <Clock3 size={14} />
                        {outbound.duration}
                      </span>

                    )}

                  </div>

                </div>

              )}


              {/* RETURN */}

              {returnFlight && (

                <div className="flight-card">

                  <div className="flight-card-top">

                    <span className="flight-direction">
                      RETURN
                    </span>

                    <span className="flight-date">

                      <CalendarDays size={14} />

                      {endDate
                        ? formatShortDate(endDate)
                        : "Return date"}

                    </span>

                  </div>


                  <div className="flight-route">

                    <div className="airport">

                      <strong>
                        {returnFlight.from?.airport}
                      </strong>

                      <span>
                        {returnFlight.from?.city}
                      </span>

                    </div>


                    <div className="flight-line">

                      <span>
                        <Plane size={17} />
                      </span>

                      <div />

                    </div>


                    <div className="airport airport-arrival">

                      <strong>
                        {returnFlight.to?.airport}
                      </strong>

                      <span>
                        {returnFlight.to?.city}
                      </span>

                    </div>

                  </div>


                  <div className="flight-route-footer">

                    <span>
                      {returnFlight.from?.city}
                      {" → "}
                      {returnFlight.to?.city}
                    </span>

                    {returnFlight.duration && (

                      <span>
                        <Clock3 size={14} />
                        {returnFlight.duration}
                      </span>

                    )}

                  </div>

                </div>

              )}

            </div>

          </section>

        )}


        {/* =========================================
            HOTEL
        ========================================= */}

        {room && (

          <section className="confirmation-section">

            <div className="section-heading">

              <div className="section-heading-icon">
                <Hotel size={19} />
              </div>

              <div>

                <span>
                  ACCOMMODATION
                </span>

                <h2>
                  Your stay
                </h2>

              </div>

            </div>


            <div className="hotel-confirmation-card">

              {room.images?.[0] ? (

                <div className="hotel-image-wrapper">

                  <img
                    src={room.images[0]}
                    alt={room.name || hotelName}
                  />

                </div>

              ) : (

                <div className="hotel-image-placeholder">
                  <Hotel size={30} />
                </div>

              )}


              <div className="hotel-confirmation-info">

                <div className="hotel-location">

                  <MapPin size={14} />

                  {hotel?.location ||
                    booking?.hotelLocation ||
                    "Destination"}

                </div>


                <h3>
                  {hotelName}
                </h3>


                <strong className="hotel-room-name">
                  {room.name}
                </strong>


                <div className="hotel-details-row">

                  <span>

                    <CalendarDays size={15} />

                    {dateRange}

                  </span>


                  <span>

                    <Clock3 size={15} />

                    {nights}{" "}
                    {nights === 1
                      ? "night"
                      : "nights"}

                  </span>

                </div>

              </div>

            </div>

          </section>

        )}


        {/* =========================================
            CAR RENTAL
        ========================================= */}

        {car && (

          <section className="confirmation-section">

            <div className="section-heading">

              <div className="section-heading-icon">
                <Car size={19} />
              </div>

              <div>

                <span>
                  TRANSPORTATION
                </span>

                <h2>
                  Car rental
                </h2>

              </div>

            </div>


            <div className="additional-service-card">

              <div className="service-icon">
                <Car size={25} />
              </div>


              <div className="service-content">

                <strong>
                  {car.name}
                </strong>

                <span>
                  {car.type}
                  {car.seats
                    ? ` · ${car.seats} seats`
                    : ""}
                </span>

                <small>
                  {dateRange}
                  {days > 0
                    ? ` · ${days} ${
                        days === 1
                          ? "day"
                          : "days"
                      }`
                    : ""}
                </small>

              </div>

            </div>

          </section>

        )}


        {/* =========================================
            ACTIVITIES
        ========================================= */}

        {activities.length > 0 && (

          <section className="confirmation-section">

            <div className="section-heading">

              <div className="section-heading-icon">
                <Ticket size={19} />
              </div>

              <div>

                <span>
                  EXPERIENCES
                </span>

                <h2>
                  Activities
                </h2>

              </div>

            </div>


            <div className="activity-list">

              {activities.map((activity) => (

                <div
                  className="activity-item"
                  key={activity.id}
                >

                  <div className="activity-icon">
                    <Ticket size={18} />
                  </div>


                  <div className="activity-content">

                    <strong>
                      {activity.name}
                    </strong>

                    <span>
                      {activity.location}
                      {activity.duration
                        ? ` · ${activity.duration}`
                        : ""}
                    </span>

                  </div>


                  <strong className="activity-price">

                    $
                    {(
                      Number(
                        activity.pricePerPerson || 0
                      ) * travellers
                    ).toFixed(2)}

                  </strong>

                </div>

              ))}

            </div>

          </section>

        )}


        {/* =========================================
            PACKAGE
        ========================================= */}

        {pkg && (

          <section className="confirmation-section">

            <div className="section-heading">

              <div className="section-heading-icon">
                <Sparkles size={19} />
              </div>

              <div>

                <span>
                  TRAVEL PACKAGE
                </span>

                <h2>
                  Package
                </h2>

              </div>

            </div>


            <div className="additional-service-card">

              <div className="service-icon">
                <Sparkles size={25} />
              </div>


              <div className="service-content">

                <strong>
                  {pkg.name}
                </strong>

                <span>
                  Flight + hotel bundled
                </span>

              </div>

            </div>

          </section>

        )}


        {/* =========================================
            ITINERARY
        ========================================= */}

        {itinerary.length > 0 && (

          <section className="confirmation-section">

            <div className="section-heading">

              <div className="section-heading-icon">
                <CalendarDays size={19} />
              </div>

              <div>

                <span>
                  TRIP PLAN
                </span>

                <h2>
                  Trip overview
                </h2>

              </div>

            </div>


            <div className="itinerary-list">

              {itinerary.map((day, index) => (

                <div
                  className="itinerary-item"
                  key={day.id || index}
                >

                  <div className="itinerary-number">
                    {index + 1}
                  </div>


                  <div>

                    <span>
                      {day.date}
                    </span>

                    <strong>
                      {day.title}
                    </strong>

                  </div>

                </div>

              ))}

            </div>

          </section>

        )}


        {/* =========================================
            PAYMENT / PRICE
        ========================================= */}

        <section className="payment-section">

          <div className="payment-header">

            <div>

              <span className="section-eyebrow">
                PAYMENT SUMMARY
              </span>

              <h2>
                Trip cost
              </h2>

            </div>


            <div className="payment-method">

              <CreditCard size={17} />

              <span>
                Bitcoin
              </span>

            </div>

          </div>


          <div className="price-breakdown">

            {flightTotal > 0 && (

              <div className="price-row">

                <span>
                  Flights
                </span>

                <strong>
                  ${flightTotal.toFixed(2)}
                </strong>

              </div>

            )}


            {room && (

              <div className="price-row">

                <span>
                  Hotel
                </span>

                <strong>
                  ${hotelTotal.toFixed(2)}
                </strong>

              </div>

            )}


            {car && carTotal > 0 && (

              <div className="price-row">

                <span>
                  Car rental
                </span>

                <strong>
                  ${carTotal.toFixed(2)}
                </strong>

              </div>

            )}


            {activities.length > 0 &&
              activitiesTotal > 0 && (

                <div className="price-row">

                  <span>
                    Activities
                  </span>

                  <strong>
                    ${activitiesTotal.toFixed(2)}
                  </strong>

                </div>

              )}


            {pkg && packageTotal > 0 && (

              <div className="price-row">

                <span>
                  Package
                </span>

                <strong>
                  ${packageTotal.toFixed(2)}
                </strong>

              </div>

            )}

          </div>


          <div className="total-row">

            <div>

              <span>
                Total trip price
              </span>

              <small>
                Taxes and fees included where applicable
              </small>

            </div>

            <strong>
              ${tripTotal.toFixed(2)}
            </strong>

          </div>


          <div className="payment-status">

            <CheckCircle2 size={18} />

            <div>

              <strong>
                {paymentConfirmed
                  ? "Payment received"
                  : "Booking confirmed"}
              </strong>

              <span>
                Your booking has been successfully processed.
              </span>

            </div>

          </div>

        </section>


        {/* =========================================
            IMPORTANT INFORMATION
        ========================================= */}

        <section className="important-information">

          <div className="important-icon">
            <ShieldCheck size={20} />
          </div>


          <div>

            <h3>
              Important information
            </h3>

            <p>
              Please keep your booking reference handy
              when contacting Havenway Travels about this
              reservation.
            </p>

            <p>
              Check your flight and accommodation details
              before travelling and arrive at the airport
              in accordance with your airline's recommended
              check-in time.
            </p>

          </div>

        </section>


        {/* =========================================
            RECEIPT FOOTER
        ========================================= */}

        <footer className="confirmation-footer">

          <div className="footer-brand">

            <div className="footer-brand-mark">
              <Plane size={17} />
            </div>

            <strong>
              Havenway Travels
            </strong>

          </div>


          <p>
            Thank you for choosing Havenway Travels.
            We look forward to being part of your journey.
          </p>


          <div className="footer-document">

            <span>
              Booking reference
            </span>

            <strong>
              {bookingReference || booking?.id || "—"}
            </strong>

          </div>


          <small>
            This document serves as your booking confirmation
            and receipt. Please retain it for your records.
          </small>

        </footer>


        {/* =========================================
            BACK HOME
        ========================================= */}

        <div className="confirmation-bottom-actions">

          <button
            className="confirmation-home-button"
            onClick={onReturnHome}
          >

            <ArrowLeft size={18} />

            Back to Havenway Travel

          </button>

        </div>

      </div>

    </section>
  );
}

export default BookingConfirmation;