import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock,
  Hotel,
  MapPin,
  Plane,
  ShieldCheck,
  Users,
  AlertCircle,
  Briefcase,
} from "lucide-react";

import hotels from "../data/hotel";
import rooms from "../data/rooms";
import flights from "../data/flight";
import cars from "../data/cars";

import {
  formatShortDate,
} from "../utils/dates";

import {
  calculateFlightTotal,
  calculateHotelTotal,
  calculateCarTotal,
} from "../utils/pricing";

import "./SharedTripPage.css";

import { API_BASE_URL } from "../utils/api";

function SharedTripPage({
  onContinueWithTrip,
}) {
  const { token } = useParams();

  const navigate = useNavigate();

  const [trip, setTrip] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [errorType, setErrorType] =
    useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadSharedTrip = async () => {
      try {
        setLoading(true);
        setErrorType(null);

        const response =
          await fetch(
            `${API_BASE_URL}/api/shared-trips/${encodeURIComponent(
              token
            )}`
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          if (response.status === 410) {
            setErrorType("expired");
          } else if (
            response.status === 404
          ) {
            setErrorType("not-found");
          } else {
            setErrorType("error");
          }

          return;
        }

        if (!cancelled) {
          setTrip(data.trip);
        }
      } catch (error) {
        console.error(
          "Failed to load shared itinerary:",
          error
        );

        if (!cancelled) {
          setErrorType("error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (token) {
      loadSharedTrip();
    } else {
      setErrorType("not-found");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [token]);

  const resolved = useMemo(() => {
    if (!trip) return null;

    const hotel = trip.selectedHotel
      ? hotels.find(
          (item) =>
            item.id ===
            trip.selectedHotel
        )
      : null;

    const room = trip.roomId
      ? rooms.find(
          (item) =>
            item.id === trip.roomId
        )
      : null;

    const flight = trip.flightId
      ? flights[trip.flightId]
      : null;

    /*
     * car IDs are numeric in cars.js.
     * Number() also protects us if
     * Supabase sends "1" instead of 1.
     */
    const car = trip.carId
      ? cars.find(
          (item) =>
            Number(item.id) ===
            Number(trip.carId)
        )
      : null;

    return {
      hotel,
      room,
      flight,
      car,
    };
  }, [trip]);

  const totals = useMemo(() => {
    if (!trip) {
      return {
        flightTotal: 0,
        hotelTotal: 0,
        carTotal: 0,
        tripTotal: 0,
      };
    }

    /*
     * Do not use calculateFlightTotal
     * when there is no flightId because
     * that utility currently falls back
     * to economy.
     */
    const flightTotal =
      trip.flightId
        ? calculateFlightTotal(
            trip.flightId,
            trip.travellers || 1
          )
        : 0;

    const hotelTotal =
      trip.roomId
        ? calculateHotelTotal(
            trip.roomId,
            trip.nights || 0
          )
        : 0;

    const carTotal =
      trip.carId
        ? calculateCarTotal(
            Number(trip.carId),
            trip.days || 0
          )
        : 0;

    return {
      flightTotal,
      hotelTotal,
      carTotal,

      tripTotal:
        flightTotal +
        hotelTotal +
        carTotal,
    };
  }, [trip]);

  const handleContinue = () => {
    if (!trip) return;

    if (onContinueWithTrip) {
      onContinueWithTrip(trip);
      return;
    }

    navigate("/stays");
  };

  const handleBackHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="shared-trip-state-page">
        <div className="shared-trip-state-card">
          <div className="shared-trip-loader" />

          <h2>
            Loading itinerary
          </h2>

          <p>
            Retrieving the shared trip
            details.
          </p>
        </div>
      </div>
    );
  }

  if (errorType) {
    let title =
      "Unable to load this itinerary";

    let description =
      "Something went wrong while loading this shared trip.";

    if (
      errorType === "expired"
    ) {
      title =
        "This itinerary has expired";

      description =
        "Shared itineraries remain available for 30 days.";
    }

    if (
      errorType === "not-found"
    ) {
      title =
        "Itinerary not found";

      description =
        "This shared itinerary may no longer exist or the link may be incorrect.";
    }

    return (
      <div className="shared-trip-state-page">
        <div className="shared-trip-state-card">
          <div className="shared-trip-error-icon">
            <AlertCircle size={28} />
          </div>

          <h2>{title}</h2>

          <p>{description}</p>

          <button
            type="button"
            onClick={handleBackHome}
          >
            Return home
          </button>
        </div>
      </div>
    );
  }

  if (!trip || !resolved) {
    return null;
  }

  const {
    hotel,
    room,
    flight,
    car,
  } = resolved;

  const {
    flightTotal,
    hotelTotal,
    carTotal,
    tripTotal,
  } = totals;

  const travellers =
    trip.travellers || 1;

  const nights =
    trip.nights || 0;

  const days =
    trip.days || 0;

  const dateRange =
    trip.startDate &&
    trip.endDate
      ? `${formatShortDate(
          trip.startDate
        )} – ${formatShortDate(
          trip.endDate
        )}`
      : "Dates not selected";

  const totalSelections =
    Number(Boolean(flight)) +
    Number(Boolean(room || hotel)) +
    Number(Boolean(car));

  return (
    <div className="shared-trip-page">

      <header className="shared-trip-header">
        <div className="shared-trip-container shared-trip-header-inner">

          <button
            className="shared-trip-back"
            type="button"
            onClick={handleBackHome}
          >
            <ArrowLeft size={18} />
            Havenway Travel
          </button>

          <div className="shared-trip-secure">
            <ShieldCheck size={17} />
            Shared itinerary
          </div>

        </div>
      </header>

      <main className="shared-trip-container">

        <section className="shared-trip-hero">

          <span className="shared-trip-eyebrow">
            TRIP ITINERARY
          </span>

          <h1>
            Your trip is ready to review
          </h1>

          <p>
            Review the selections below.
            You can continue with this exact
            itinerary when you're ready.
          </p>

          <div className="shared-trip-hero-meta">
            <CheckCircle2 size={17} />

            <span>
              Shared securely through
              Havenway Travel
            </span>
          </div>

        </section>

        <section className="shared-trip-overview">

          <div className="shared-trip-overview-item">
            <CalendarDays size={21} />

            <div>
              <span>Travel dates</span>
              <strong>
                {dateRange}
              </strong>
            </div>
          </div>

          <div className="shared-trip-overview-item">
            <Users size={21} />

            <div>
              <span>Travelers</span>
              <strong>
                {travellers}{" "}
                {travellers === 1
                  ? "traveler"
                  : "travelers"}
              </strong>
            </div>
          </div>

          <div className="shared-trip-overview-item">
            <Clock size={21} />

            <div>
              <span>Duration</span>
              <strong>
                {nights}{" "}
                {nights === 1
                  ? "night"
                  : "nights"}
              </strong>
            </div>
          </div>

          <div className="shared-trip-overview-item">
            <CheckCircle2 size={21} />

            <div>
              <span>Selections</span>
              <strong>
                {totalSelections}{" "}
                {totalSelections === 1
                  ? "item"
                  : "items"}
              </strong>
            </div>
          </div>

        </section>

        <div className="shared-trip-content">

          <div className="shared-trip-main">

            {flight && (
              <section className="shared-trip-card">

                <div className="shared-trip-card-heading">

                  <div className="shared-trip-card-icon">
                    <Plane size={22} />
                  </div>

                  <div>
                    <span>
                      ROUND-TRIP FLIGHT
                    </span>

                    <h2>
                      {flight.name}
                    </h2>

                    <p>
                      {flight.outbound.airline}
                      {" · "}
                      {flight.outbound.stops}
                    </p>
                  </div>

                  <div className="shared-trip-card-price">
                    <span>
                      Flight total
                    </span>

                    <strong>
                      ${flightTotal.toLocaleString()}
                    </strong>
                  </div>

                </div>

                <div className="shared-flight-leg">

                  <div className="shared-flight-date">
                    <strong>
                      {formatShortDate(
                        trip.startDate
                      )}
                    </strong>

                    <span>Departure</span>
                  </div>

                  <div className="shared-flight-route">

                    <div className="shared-flight-airport">
                      <strong>
                        {flight.outbound.from.time}
                      </strong>

                      <span>
                        {flight.outbound.from.airport}
                      </span>

                      <small>
                        {
                          flight.outbound.from.city
                        }
                      </small>
                    </div>

                    <div className="shared-flight-line">
                      <span>
                        {
                          flight.outbound.duration
                        }
                      </span>

                      <div>
                        <Plane size={16} />
                      </div>

                      <small>
                        {
                          flight.outbound.stops
                        }
                      </small>
                    </div>

                    <div className="shared-flight-airport shared-flight-airport-right">
                      <strong>
                        {flight.outbound.to.time}
                      </strong>

                      <span>
                        {flight.outbound.to.airport}
                      </span>

                      <small>
                        {
                          flight.outbound.to.city
                        }
                      </small>
                    </div>

                  </div>

                  <div className="shared-flight-details">
                    <span>
                      {
                        flight.outbound.airline
                      }
                    </span>

                    <span>
                      {
                        flight.outbound.cabin
                      }
                    </span>

                    <span>
                      {
                        flight.outbound.baggage
                      }
                    </span>
                  </div>

                </div>

                <div className="shared-flight-leg">

                  <div className="shared-flight-date">
                    <strong>
                      {formatShortDate(
                        trip.endDate
                      )}
                    </strong>

                    <span>Return</span>
                  </div>

                  <div className="shared-flight-route">

                    <div className="shared-flight-airport">
                      <strong>
                        {flight.return.from.time}
                      </strong>

                      <span>
                        {flight.return.from.airport}
                      </span>

                      <small>
                        {
                          flight.return.from.city
                        }
                      </small>
                    </div>

                    <div className="shared-flight-line">
                      <span>
                        {
                          flight.return.duration
                        }
                      </span>

                      <div>
                        <Plane size={16} />
                      </div>

                      <small>
                        {
                          flight.return.stops
                        }
                      </small>
                    </div>

                    <div className="shared-flight-airport shared-flight-airport-right">
                      <strong>
                        {flight.return.to.time}
                      </strong>

                      <span>
                        {flight.return.to.airport}
                      </span>

                      <small>
                        {
                          flight.return.to.city
                        }
                      </small>
                    </div>

                  </div>

                  <div className="shared-flight-details">
                    <span>
                      {
                        flight.return.airline
                      }
                    </span>

                    <span>
                      {
                        flight.return.cabin
                      }
                    </span>

                    <span>
                      {
                        flight.return.baggage
                      }
                    </span>
                  </div>

                </div>

              </section>
            )}

            {(room || hotel) && (
              <section className="shared-trip-card">

                <div className="shared-trip-card-heading">

                  <div className="shared-trip-card-icon">
                    <Hotel size={22} />
                  </div>

                  <div>
                    <span>
                      HOTEL STAY
                    </span>

                    <h2>
                      {hotel?.name ||
                        "Selected hotel"}
                    </h2>

                    {hotel?.location && (
                      <p>
                        <MapPin size={14} />
                        {hotel.location}
                      </p>
                    )}
                  </div>

                  {room && (
                    <div className="shared-trip-card-price">
                      <span>
                        Stay total
                      </span>

                      <strong>
                        ${hotelTotal.toLocaleString()}
                      </strong>
                    </div>
                  )}

                </div>

                <div className="shared-hotel-content">

                  {room?.images?.[0] && (
                    <div className="shared-hotel-image">
                      <img
                        src={
                          room.images[0]
                        }
                        alt={room.name}
                      />
                    </div>
                  )}

                  <div className="shared-hotel-info">

                    {room && (
                      <>
                        <span className="shared-hotel-label">
                          SELECTED ROOM
                        </span>

                        <h3>
                          {room.name}
                        </h3>

                        <p>
                          {room.beds}
                          {" · "}
                          {room.guests}
                        </p>

                        <div className="shared-hotel-details">
                          <span>
                            <CalendarDays
                              size={16}
                            />
                            {dateRange}
                          </span>

                          <span>
                            <Clock
                              size={16}
                            />
                            {nights}{" "}
                            {nights === 1
                              ? "night"
                              : "nights"}
                          </span>
                        </div>
                      </>
                    )}

                  </div>

                </div>

              </section>
            )}

            {car && (
              <section className="shared-trip-card">

                <div className="shared-trip-card-heading">

                  <div className="shared-trip-card-icon">
                    <Car size={22} />
                  </div>

                  <div>
                    <span>
                      CAR RENTAL
                    </span>

                    <h2>
                      {car.name}
                    </h2>

                    <p>
                      {car.type}
                    </p>
                  </div>

                  <div className="shared-trip-card-price">
                    <span>
                      Rental total
                    </span>

                    <strong>
                      ${carTotal.toLocaleString()}
                    </strong>
                  </div>

                </div>

                <div className="shared-car-details">

                  <div>
                    <Users size={18} />

                    <span>
                      {car.seats} seats
                    </span>
                  </div>

                  <div>
                    <Briefcase size={18} />

                    <span>
                      {car.bags} bags
                    </span>
                  </div>

                  <div>
                    <Car size={18} />

                    <span>
                      {car.transmission}
                    </span>
                  </div>

                  <div>
                    <Clock size={18} />

                    <span>
                      {days}{" "}
                      {days === 1
                        ? "day"
                        : "days"}
                    </span>
                  </div>

                </div>

              </section>
            )}

          </div>

          <aside className="shared-trip-sidebar">

            <div className="shared-trip-action-card">

              <span className="shared-trip-summary-eyebrow">
                YOUR TRIP
              </span>

              <h2>
                Trip summary
              </h2>

              <div className="shared-trip-summary-meta">
                <CalendarDays size={17} />

                <span>
                  {dateRange}
                </span>
              </div>

              <div className="shared-trip-summary-meta">
                <Users size={17} />

                <span>
                  {travellers}{" "}
                  {travellers === 1
                    ? "traveler"
                    : "travelers"}
                  {" · "}
                  {nights}{" "}
                  {nights === 1
                    ? "night"
                    : "nights"}
                </span>
              </div>

              <div className="shared-trip-summary-divider" />

              {flight && (
                <div className="shared-trip-summary-section">

                  <div className="shared-trip-summary-title">
                    <Plane size={17} />

                    <span>
                      Flight
                    </span>
                  </div>

                  <strong>
                    {flight.name}
                  </strong>

                  <small>
                    {
                      flight.outbound.from
                        .airport
                    }
                    {" → "}
                    {
                      flight.outbound.to
                        .airport
                    }
                    {" · "}
                    {
                      flight.outbound.airline
                    }
                  </small>

                  <div className="shared-trip-summary-price">
                    ${flightTotal.toLocaleString()}
                  </div>

                </div>
              )}

              {(hotel || room) && (
                <div className="shared-trip-summary-section">

                  <div className="shared-trip-summary-title">
                    <Hotel size={17} />

                    <span>
                      Stay
                    </span>
                  </div>

                  <strong>
                    {hotel?.name ||
                      "Selected hotel"}
                  </strong>

                  {room && (
                    <small>
                      {room.name}
                    </small>
                  )}

                  {room && (
                    <div className="shared-trip-summary-price">
                      ${hotelTotal.toLocaleString()}
                    </div>
                  )}

                </div>
              )}

              {car && (
                <div className="shared-trip-summary-section">

                  <div className="shared-trip-summary-title">
                    <Car size={17} />

                    <span>
                      Car
                    </span>
                  </div>

                  <strong>
                    {car.name}
                  </strong>

                  <small>
                    {car.type}
                    {" · "}
                    {days} days
                  </small>

                  <div className="shared-trip-summary-price">
                    ${carTotal.toLocaleString()}
                  </div>

                </div>
              )}

              <div className="shared-trip-total">

                <span>
                  Total trip price
                </span>

                <strong>
                  ${tripTotal.toLocaleString()}
                </strong>

              </div>

              <button
                type="button"
                className="shared-trip-continue"
                onClick={
                  handleContinue
                }
              >
                Continue with this trip

                <ArrowRight
                  size={18}
                />
              </button>

              <div className="shared-trip-protection">
                <ShieldCheck
                  size={16}
                />

                <span>
                  You'll review everything
                  again before payment.
                </span>
              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default SharedTripPage;