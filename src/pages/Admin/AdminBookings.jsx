import { Fragment, useState, useEffect } from "react";
import { API_BASE_URL } from "../../utils/api";
import hotels from "../../data/hotel";
import rooms from "../../data/rooms";
import cars from "../../data/cars";
import flights from "../../data/flight";
import activities from "../../data/activities";
import packages from "../../data/packages";

function getSelectionName(items, id) {
  if (id == null || id === "") return "Not selected";
  const item = items.find((entry) => String(entry.id) === String(id));
  return item?.name || String(id);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
}

function formatMoney(value) {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
    : "—";
}

function BookingDetails({ booking }) {
  const selectedActivities = Array.isArray(booking.selected_activities)
    ? booking.selected_activities
    : [];
  const selectedFlight = flights[booking.selected_flight]?.name || booking.selected_flight || "Not selected";
  const status = booking.payment_status || booking.booking_status || "pending";

  const details = [
    ["Email", booking.payer_email || booking.email || "—"],
    ["Phone", booking.payer_phone || booking.phone || "—"],
    ["Travelers", booking.travellers ?? "—"],
    ["Travel dates", `${formatDate(booking.start_date)} – ${formatDate(booking.end_date)}`],
    ["Nights / days", `${booking.nights ?? 0} nights / ${booking.days ?? 0} days`],
    ["Hotel", getSelectionName(hotels, booking.selected_hotel)],
    ["Room", getSelectionName(rooms, booking.selected_room)],
    ["Flight", selectedFlight],
    ["Car", getSelectionName(cars, booking.selected_car)],
    [
      "Activities",
      selectedActivities.length
        ? selectedActivities.map((id) => getSelectionName(activities, id)).join(", ")
        : "None selected",
    ],
    ["Package", getSelectionName(packages, booking.selected_package)],
    ["Total", formatMoney(booking.usd_total)],
    ["Payment", `${status}${booking.booking_status && booking.booking_status !== status ? ` / ${booking.booking_status}` : ""}`],
    ["Expected BTC", booking.expected_btc ?? "—"],
    ["Transaction ID", booking.transaction_id || "—"],
  ];

  return (
    <div className="admin-booking-details">
      <h3>Booking details</h3>
      <dl>
        {details.map(([label, value]) => (
          <div className="admin-booking-detail" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="admin-booking-id">
        <strong>Booking ID:</strong> {booking.id}
      </div>
    </div>
  );
}

export default function AdminBookings({ headers }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/bookings`, { headers });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || "Unable to load bookings.");
        }
        if (!cancelled) setItems(result.data || []);
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || "Unable to load bookings.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [headers]);

  if (loading) return <div className="admin-empty">Loading bookings…</div>;
  if (error) return <div className="admin-login-error" role="alert">{error}</div>;

  return (
    <div>
      <h2 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Bookings</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Traveler</th><th>Email</th><th>Status</th><th>Created</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map((booking) => (
              <Fragment key={booking.id}>
                <tr key={booking.id}>
                  <td>{String(booking.id).slice(0, 8)}</td>
                  <td>{booking.payer_name || booking.name || "—"}</td>
                  <td>{booking.payer_email || booking.email || "—"}</td>
                  <td>
                    <span className={`admin-badge admin-badge-${booking.payment_status || "pending"}`}>
                      {booking.payment_status || "pending"}
                    </span>
                  </td>
                  <td>{formatDate(booking.created_at)}</td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: "6px 10px", fontSize: "12px" }}
                      aria-expanded={selectedId === booking.id}
                      onClick={() => setSelectedId(selectedId === booking.id ? null : booking.id)}
                    >
                      {selectedId === booking.id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>
                {selectedId === booking.id && (
                  <tr>
                    <td colSpan={6}><BookingDetails booking={booking} /></td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && <div className="admin-empty">No bookings found.</div>}
    </div>
  );
}
