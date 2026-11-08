import { useState, useEffect } from "react";
import { Plane, Plus, Trash2, Save, Edit2 } from "lucide-react";
import { API_BASE_URL } from "../../utils/api";
import { notifyCatalogUpdated } from "../../data/catalogStore";

export default function AdminFlights({ headers }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ plan_key: "", name: "", data: {} });

  useEffect(() => {
    load();
  }, [headers]);

  const load = () => {
    fetch(`${API_BASE_URL}/api/admin/flights`, { headers })
      .then((r) => r.json())
      .then((data) => {
        setFlights(data.data || []);
        setLoading(false);
      });
  };

  const handleCreate = () => {
    setEditing("new");
    setForm({ plan_key: "", name: "", data: {} });
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setForm({ ...item, data: item.data || {} });
  };

  const handleSave = async () => {
    const body = {
      plan_key: form.plan_key,
      name: form.name,
      data: typeof form.data === "string" ? JSON.parse(form.data || "{}") : form.data,
    };

    const url =
      editing === "new"
        ? `${API_BASE_URL}/api/admin/flights`
        : `${API_BASE_URL}/api/admin/flights/${editing}`;
    const method = editing === "new" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      setEditing(null);
      load();
      notifyCatalogUpdated();
    } else {
      alert(data.error || "Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this flight plan?")) return;
    const response = await fetch(`${API_BASE_URL}/api/admin/flights/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) { alert("Failed to delete flight plan"); return; }
    load();
    notifyCatalogUpdated();
  };

  if (loading) return <div className="admin-empty">Loading flights…</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Flight Plans</h2>
        <button className="admin-btn-add" onClick={handleCreate}>
          <Plus size={16} /> Add Flight Plan
        </button>
      </div>

      {editing !== null && (
        <div className="admin-form" style={{ marginBottom: 24 }}>
          <h2>{editing === "new" ? "Add Flight Plan" : "Edit Flight Plan"}</h2>
          <div className="admin-field">
            <label>Plan Key</label>
            <input
              value={form.plan_key}
              onChange={(e) => setForm({ ...form, plan_key: e.target.value })}
              placeholder="e.g. economy"
            />
            <span className="admin-field-hint">Unique key (economy, business, first)</span>
          </div>
          <div className="admin-field">
            <label>Display Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Economy"
            />
          </div>
          <div className="admin-field">
            <label>Outbound price (USD)</label>
            <input
              type="number"
              min="0"
              value={form.data?.outbound?.price ?? ""}
              onChange={(e) => setForm({
                ...form,
                data: {
                  ...form.data,
                  outbound: { ...form.data?.outbound, price: Number(e.target.value) },
                },
              })}
            />
          </div>
          <div className="admin-field">
            <label>Return price (USD)</label>
            <input
              type="number"
              min="0"
              value={form.data?.return?.price ?? ""}
              onChange={(e) => setForm({
                ...form,
                data: {
                  ...form.data,
                  return: { ...form.data?.return, price: Number(e.target.value) },
                },
              })}
            />
          </div>
          <div className="admin-field">
            <label>Flight Data (JSON)</label>
            <textarea
              className="admin-json"
              value={typeof form.data === "string" ? form.data : JSON.stringify(form.data, null, 2)}
              onChange={(e) => {
                try {
                  setForm({ ...form, data: JSON.parse(e.target.value || "{}") });
                } catch {
                  setForm({ ...form, data: e.target.value });
                }
              }}
            />
            <span className="admin-field-hint">Full flight plan JSON (outbound, return, prices, cabin, etc.)</span>
          </div>
          <div className="admin-actions">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleSave}
            >
              <Save size={16} style={{ marginRight: 6 }} /> Save
            </button>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Plan Key</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((f) => (
              <tr key={f.id}>
                <td>
                  <strong>{f.plan_key}</strong>
                </td>
                <td>{f.name}</td>
                <td>
                  <button
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: "6px 10px", fontSize: "12px" }}
                    onClick={() => handleEdit(f)}
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    className="admin-btn admin-btn-danger"
                    onClick={() => handleDelete(f.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {flights.length === 0 && <div className="admin-empty">No flight plans found.</div>}
    </div>
  );
}