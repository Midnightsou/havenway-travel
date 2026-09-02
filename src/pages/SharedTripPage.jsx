import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Sparkles,
  Ticket,
  Users,
  AlertCircle,
} from "lucide-react";

import hotels from "../data/hotel";
import rooms from "../data/rooms";
import flights from "../data/flight";
import cars from "../data/cars";
import activities from "../data/activities";
import packages from "../data/packages";

import { formatShortDate } from "../utils/dates";

import "./SharedTripPage.css";

const API_BASE_URL = "https://api.havenway-travels.cv";

function SharedTripPage({ onContinueWithTrip }) {
  const { token } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadSharedTrip = async () => {
      try {
        setLoading(true);
        setErrorType(null);

        const response = await fetch(
          `${API_BASE_URL}/api/shared-trips/${encodeURIComponent(token)}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          if (response.status === 410) {
            setErrorType("expired");
          } else if (response.status === 404) {
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
        console.error("Failed to load shared itinerary:", error);

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
    if (!trip) {
      return null;
    }

    const hotel = trip.selectedHotel
      ? hotels.find((item) => item.id === trip.selectedHotel)
      : null;

    const room = trip.roomId
      ? rooms.find((item) => item.id === trip.roomId)
      : null;

    const flight = trip.flightId
      ? flights[trip.flightId]
      : null;

    const car = trip.carId
      ? cars.find((item) => item.id === trip.carId)
      : null;

    const selectedActivities = (trip.activityIds || [])
      .map((id) => activities.find((item) => item.id === id))
      .filter(Boolean);

    const pkg = trip.packageId
      ? packages.find((item) => item.id === trip.packageId)
      : null;

    return {
      hotel,
      room,
      flight,
      car,
      selectedActivities,
      pkg,
    };
  }, [trip]);

  const handleContinue = () => {
    if (!trip) {
      return;
    }

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
      <div className="shared-trip-page">
        <div className="shared-trip-state">
          <div className="shared-trip-spinner" />

          <h1>Loading your itinerary</h1>

          <p>
            We're retrieving the shared Havenway trip.
          </p>
        </div>
      </div>
    );
  }

  if (errorType) {
    const errorContent = {
      expired: {
        icon: <Clock size={34} />,
        title: "This itinerary has expired",
        message:
          "This shared itinerary was only available for 30 days. Ask the person who shared it to create a new link.",
      },
      "not-found": {
        icon: <AlertCircle size={34} />,
        title: "Itinerary not found",
        message:
          "This shared itinerary doesn't exist or the link may be incorrect.",
      },
      error: {
        icon: <AlertCircle size={34} />,
        title: "Unable to load itinerary",
        message:
          "Something went wrong while loading this shared trip. Please try again later.",
      },
    };

    const content = errorContent[errorType];

    return (
      <div className="shared-trip-page">
        <div className="shared-trip-state shared-trip-error">
          <div className="shared-trip-state-icon">
            {content.icon}
          </div>

          <h1>{content.title}</h1>

          <p>{content.message}</p>

          <button
            type="button"
            className="shared-trip-secondary-button"
            onClick={handleBackHome}
          >
            <ArrowLeft size={17} />
            Back to Havenway
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
    selectedActivities,
    pkg,
  } = resolved;

  const dateRange =
    trip.startDate && trip.endDate
      ? `${formatShortDate(trip.startDate)} – ${formatShortDate(
          trip.endDate
        )}`
      : "Dates not selected";

  const totalSelections =
    Boolean(flight) +
    Boolean(hotel || room) +
    Boolean(car) +
    selectedActivities.length +
    Boolean(pkg);

  return (
    <div className="shared-trip-page">
      <header className="shared-trip-header">
        <button
          type="button"
          className="shared-trip-back"
          onClick={handleBackHome}
        >
          <ArrowLeft size={18} />
          Havenway
        </button>

        <div className="shared-trip-header-label">
          <CheckCircle2 size={17} />
          Shared itinerary
        </div>
      </header>

      <main className="shared-trip-container">
        <section className="shared-trip-hero">
          <div>
            <span className="shared-trip-eyebrow">
              HAVENWAY TRAVEL
            </span>

            <h1>Your shared trip</h1>

            <p>
              Someone shared this itinerary with you.
              Review the selections below and continue
              with this trip when you're ready.
            </p>
          </div>

          <div className="shared-trip-validity">
            <Clock size={17} />

            <div>
              <span>Link expires</span>
              <strong>
                {trip.expiresAt
                  ? new Date(trip.expiresAt).toLocaleDateString(
                      undefined,
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "—"}
              </strong>
            </div>
          </div>
        </section>

        <section className="shared-trip-overview">
          <div className="shared-trip-overview-item">
            <CalendarDays size={19} />

            <div>
              <span>Travel dates</span>
              <strong>{dateRange}</strong>
            </div>
          </div>

          <div className="shared-trip-overview-item">
            <Users size={19} />

            <div>
              <span>Travelers</span>
              <strong>
                {trip.travellers}{" "}
                {trip.travellers === 1
                  ? "traveler"
                  : "travelers"}
              </strong>
            </div>
          </div>

          <div className="shared-trip-overview-item">
            <Clock size={19} />

            <div>
              <span>Duration</span>
              <strong>
                {trip.nights || 0} nights ·{" "}
                {trip.days || 0} days
              </strong>
            </div>
          </div>

          <div className="shared-trip-overview-item">
            <Ticket size={19} />

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

        <section className="shared-trip-content">
          <div className="shared-trip-main">

            {flight && (
              <article className="shared-trip-card">
                <div className="shared-trip-card-heading">
                  <div className="shared-trip-card-icon">
                    <Plane size={20} />
                  </div>

                  <div>
                    <span>FLIGHTS</span>
                    <h2>Round-trip flight</h2>
                  </div>
                </div>

                <div className="shared-flight">
                  <div className="shared-flight-leg">
                    <div>
                      <span>
                        {trip.startDate
                          ? formatShortDate(trip.startDate)
                          : "Departure"}
                      </span>

                      <strong>
                        {flight.outbound.from.airport}
                      </strong>

                      <small>
                        {flight.outbound.from.city}
                      </small>
                    </div>

                    <div className="shared-flight-route">
                      <small>
                        {flight.outbound.from.time}
                      </small>

                      <div className="shared-flight-line">
                        <span />
                        <Plane size={15} />
                      </div>

                      <small>
                        {flight.outbound.to.time}
                      </small>
                    </div>

                    <div className="shared-flight-destination">
                      <span>
                        {flight.outbound.to.airport}
                      </span>

                      <strong>
                        {flight.outbound.to.city}
                      </strong>
                    </div>
                  </div>

                  <div className="shared-flight-divider" />

                  <div className="shared-flight-leg">
                    <div>
                      <span>
                        {trip.endDate
                          ? formatShortDate(trip.endDate)
                          : "Return"}
                      </span>

                      <strong>
                        {flight.return.from.airport}
                      </strong>

                      <small>
                        {flight.return.from.city}
                      </small>
                    </div>

                    <div className="shared-flight-route">
                      <small>
                        {flight.return.from.time}
                      </small>

                      <div className="shared-flight-line">
                        <span />
                        <Plane size={15} />
                      </div>

                      <small>
                        {flight.return.to.time}
                      </small>
                    </div>

                    <div className="shared-flight-destination">
                      <span>
                        {flight.return.to.airport}
                      </span>

                      <strong>
                        {flight.return.to.city}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="shared-trip-card-footer">
                  <span>{flight.name}</span>

                  <span>
                    {trip.travellers}{" "}
                    {trip.travellers === 1
                      ? "traveler"
                      : "travelers"}
                  </span>
                </div>
              </article>
            )}

            {(hotel || room) && (
              <article className="shared-trip-card">
                <div className="shared-trip-card-heading">
                  <div className="shared-trip-card-icon">
                    <Hotel size={20} />
                  </div>

                  <div>
                    <span>STAY</span>
                    <h2>Hotel accommodation</h2>
                  </div>
                </div>

                <div className="shared-hotel">
                  {room?.images?.[0] && (
                    <img
                      src={room.images[0]}
                      alt={room.name}
                    />
                  )}

                  <div className="shared-hotel-details">
                    <span className="shared-trip-location">
                      <MapPin size={14} />
                      {hotel?.location ||
                        "Selected hotel"}
                    </span>

                    <h3>
                      {hotel?.name ||
                        "Selected hotel"}
                    </h3>

                    {room && (
                      <>
                        <strong>{room.name}</strong>

                        <span>
                          {room.beds} · {room.guests}
                        </span>
                      </>
                    )}

                    <small>
                      {dateRange} ·{" "}
                      {trip.nights || 0} nights
                    </small>
                  </div>
                </div>
              </article>
            )}

            {car && (
              <article className="shared-trip-card">
                <div className="shared-trip-card-heading">
                  <div className="shared-trip-card-icon">
                    <Car size={20} />
                  </div>

                  <div>
                    <span>TRANSPORT</span>
                    <h2>Car rental</h2>
                  </div>
                </div>

                <div className="shared-car">
                  <div className="shared-car-icon">
                    <Car size={30} />
                  </div>

                  <div>
                    <h3>{car.name}</h3>

                    <span>
                      {car.type} · {car.seats} seats
                    </span>

                    <small>
                      {dateRange} ·{" "}
                      {trip.days || 0} days
                    </small>
                  </div>
                </div>
              </article>
            )}

            {selectedActivities.length > 0 && (
              <article className="shared-trip-card">
                <div className="shared-trip-card-heading">
                  <div className="shared-trip-card-icon">
                    <Ticket size={20} />
                  </div>

                  <div>
                    <span>EXPERIENCES</span>
                    <h2>Activities</h2>
                  </div>
                </div>

                <div className="shared-activity-list">
                  {selectedActivities.map(
                    (activity) => (
                      <div
                        className="shared-activity"
                        key={activity.id}
                      >
                        <div className="shared-activity-icon">
                          <Ticket size={17} />
                        </div>

                        <div>
                          <h3>{activity.name}</h3>

                          <span>
                            <MapPin size={13} />
                            {activity.location}
                          </span>

                          <small>
                            {activity.duration}
                          </small>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </article>
            )}

            {pkg && (
              <article className="shared-trip-card">
                <div className="shared-trip-card-heading">
                  <div className="shared-trip-card-icon">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <span>PACKAGE</span>
                    <h2>Travel package</h2>
                  </div>
                </div>

                <div className="shared-package">
                  <Sparkles size={23} />

                  <div>
                    <h3>{pkg.name}</h3>
                    <span>
                      Flight + hotel bundled
                    </span>
                  </div>
                </div>
              </article>
            )}

            {!flight &&
              !hotel &&
              !room &&
              !car &&
              selectedActivities.length === 0 &&
              !pkg && (
                <div className="shared-trip-empty">
                  <AlertCircle size={24} />
                  <p>
                    Some selections from this itinerary
                    are no longer available.
                  </p>
                </div>
              )}
          </div>

          <aside className="shared-trip-sidebar">
            <div className="shared-trip-action-card">
              <span className="shared-trip-action-eyebrow">
                READY TO TRAVEL?
              </span>

              <h2>
                Continue with this trip
              </h2>

              <p>
                We'll load these selections into
                Havenway so you can review your booking
                details before continuing.
              </p>

              <div className="shared-trip-action-summary">
                <div>
                  <span>Travelers</span>
                  <strong>{trip.travellers}</strong>
                </div>

                <div>
                  <span>Duration</span>
                  <strong>
                    {trip.nights || 0} nights
                  </strong>
                </div>

                <div>
                  <span>Flight</span>
                  <strong>
                    {flight ? "Selected" : "Not selected"}
                  </strong>
                </div>

                <div>
                  <span>Hotel</span>
                  <strong>
                    {room || hotel
                      ? "Selected"
                      : "Not selected"}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className="shared-trip-continue-button"
                onClick={handleContinue}
              >
                Continue with this trip
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="shared-trip-back-button"
                onClick={handleBackHome}
              >
                <ArrowLeft size={16} />
                Back to Havenway
              </button>
            </div>

            <div className="shared-trip-trust">
              <CheckCircle2 size={17} />

              <p>
                This itinerary was created using
                Havenway Travel's secure sharing system.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default SharedTripPage;