import { useState } from "react";
import {
  LayoutDashboard,
  Plane,
  Hotel,
  Bed,
  Car,
  MapPin,
  Package,
  CreditCard,
  LogOut,
  Shield,
  ChevronRight,
  Menu,
  X,
  Wallet,
  CalendarDays,
} from "lucide-react";
import "./Admin.css";
const navItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "flights", label: "Flights", icon: Plane },
  { key: "hotels", label: "Hotels", icon: Hotel },
  { key: "rooms", label: "Rooms", icon: Bed },
  { key: "cars", label: "Cars", icon: Car },
  { key: "activities", label: "Activities", icon: MapPin },
  { key: "packages", label: "Packages", icon: Package },
  { key: "bookings", label: "Bookings", icon: CreditCard },
  { key: "payment-settings", label: "Payment Settings", icon: Wallet },
  { key: "itinerary", label: "Itinerary", icon: CalendarDays },
];

export default function AdminLayout({ active, setActive, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ADMIN_TOKEN = localStorage.getItem("admin_token");

  const headers = {
    Authorization: `Bearer ${ADMIN_TOKEN}`,
    "Content-Type": "application/json",
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/";
  };

  return (
    <div className="admin-layout">
      {mobileOpen && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Close admin navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="admin-brand">
          <Shield size={24} />
          <span>Havenway Admin</span>
        </div>

        <button
          className="admin-collapse-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronRight className="admin-collapse-icon" size={18} />
          )}
        </button>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`admin-nav-item ${active === item.key ? "active" : ""}`}
                onClick={() => {
                  setActive(item.key);
                  setMobileOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-nav-item" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-header">
          <button
            className="admin-sidebar-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <h1>{navItems.find((i) => i.key === active)?.label}</h1>
          <div className="admin-user">
            <span>Admin</span>
          </div>
        </header>

        <main className="admin-main">
          {children ? (
            children({ active, setActive, headers })
          ) : null}
        </main>
      </div>
    </div>
  );
}