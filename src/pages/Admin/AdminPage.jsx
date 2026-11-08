import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminFlights from "./AdminFlights";
import AdminHotels from "./AdminHotels";
import AdminRooms from "./AdminRooms";
import AdminCars from "./AdminCars";
import AdminActivities from "./AdminActivities";
import AdminPackages from "./AdminPackages";
import AdminBookings from "./AdminBookings";
import AdminPaymentSettings from "./AdminPaymentSettings";
import { API_BASE_URL } from "../../utils/api";

const sectionComponents = {
  dashboard: AdminDashboard,
  flights: AdminFlights,
  hotels: AdminHotels,
  rooms: AdminRooms,
  cars: AdminCars,
  activities: AdminActivities,
  packages: AdminPackages,
  bookings: AdminBookings,
  "payment-settings": AdminPaymentSettings,
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem("admin_token");

    if (!token) {
      setChecking(false);
      return () => {
        cancelled = true;
      };
    }

    fetch(`${API_BASE_URL}/api/admin/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          localStorage.removeItem("admin_token");
          return;
        }
        if (!cancelled) setAuthed(true);
      })
      .catch(() => localStorage.removeItem("admin_token"))
      .finally(() => {
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (checking) return null;

  if (!authed) {
    return <AdminLogin onLogin={(token) => { localStorage.setItem("admin_token", token); setAuthed(true); setActive("dashboard"); }} />;
  }

  const Section = sectionComponents[active] || AdminDashboard;

  return (
    <AdminLayout active={active} setActive={setActive}>
      {({ headers, setActive: setSection }) => (
        <Section headers={headers} onNavigate={setSection} />
      )}
    </AdminLayout>
  );
}