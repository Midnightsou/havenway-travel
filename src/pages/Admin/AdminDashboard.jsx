import { useState, useEffect } from "react";
import {
  Plane,
  Hotel,
  Bed,
  Car,
  MapPin,
  Package,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { API_BASE_URL } from "../../utils/api";
import { notifyCatalogUpdated } from "../../data/catalogStore";

const statItems = [
  { key: "flights", label: "Flight Plans", icon: Plane },
  { key: "hotels", label: "Hotels", icon: Hotel },
  { key: "rooms", label: "Rooms", icon: Bed },
  { key: "cars", label: "Cars", icon: Car },
  { key: "activities", label: "Activities", icon: MapPin },
  { key: "packages", label: "Packages", icon: Package },
  { key: "bookings", label: "Bookings", icon: CreditCard },
];

export default function AdminDashboard({ headers, onNavigate }) {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [importCounts, setImportCounts] = useState(null);
  const [importWarning, setImportWarning] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/stats`, { headers })
      .then((r) => r.json())
      .then((data) => {
        setStats(data.data || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [headers]);

  const importStarterCatalog = async () => {
    setImporting(true);
    setMessage("");
    setError("");
    setImportCounts(null);
    setImportWarning("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/seed`, {
        method: "POST",
        headers,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        setImportCounts(result?.counts || null);
        const details = result?.errors
          ? ` Details: ${JSON.stringify(result.errors)}${result.counts ? ` Current row counts: ${JSON.stringify(result.counts)}` : ""}`
          : "";
        throw new Error(`${result?.error || `Import failed (HTTP ${response.status}).`}${details}`);
      }
      setMessage(result.message);
      setImportCounts(result.counts || null);
      if (result.warnings) {
        setImportWarning(`Catalog imported, but there is a setup warning: ${JSON.stringify(result.warnings)}`);
      }
      notifyCatalogUpdated();
      const statsResponse = await fetch(`${API_BASE_URL}/api/admin/stats`, { headers });
      const statsResult = await statsResponse.json();
      if (statsResponse.ok && statsResult.success) setStats(statsResult.data);
    } catch (importError) {
      setError(importError.message || "Catalog import failed.");
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-empty">Loading stats…</div>
    );
  }

  return (
    <div>
      <section className="admin-catalog-setup">
        <div>
          <h2>Manage your travel catalog</h2>
          <p>Import the current website listings once, then add or edit items from the admin sections.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={importStarterCatalog} disabled={importing}>
          {importing ? "Importing…" : "Import current listings"}
        </button>
        {message && <p className="admin-catalog-message" role="status">{message}</p>}
        {importCounts && (
          <div className="admin-catalog-counts" role="status">
            {Object.entries(importCounts).map(([table, count]) => (
              <span key={table}>{table.replace("admin_", "")}: {count}</span>
            ))}
          </div>
        )}
        {importWarning && <p className="admin-catalog-error" role="status">{importWarning}</p>}
        {error && <p className="admin-catalog-error" role="alert">{error}</p>}
      </section>
      <div className="admin-stats">
        {statItems.map((item) => {
          const Icon = item.icon;
          const value = stats[item.key] ?? 0;
          return (
            <div key={item.key} className="admin-stat-card">
              <div className="admin-stat-icon"><Icon /></div>
              <div className="admin-stat-info">
                <h3>{value}</h3>
                <p>{item.label}</p>
              </div>
              <ArrowRight size={14} style={{ color: "#cbd5e1" }} />
            </div>
          );
        })}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Count</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {statItems.map((item) => {
              const value = stats[item.key] ?? 0;
              return (
                <tr key={item.key}>
                  <td>{item.label}</td>
                  <td>{value}</td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary"
                      onClick={() => onNavigate?.(item.key)}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}