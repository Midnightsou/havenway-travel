import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Edit2 } from "lucide-react";
import { API_BASE_URL } from "../../utils/api";
import { notifyCatalogUpdated } from "../../data/catalogStore";
import ImageGalleryField from "./ImageGalleryField";

export default function AdminCars({ headers }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ type: "", name: "", price_per_day: "", seats: "", bags: "", transmission: "", features: [], images: [] });

  const load = () => {
    fetch(`${API_BASE_URL}/api/admin/cars`, { headers })
      .then((r) => r.json()).then((d) => { setItems(d.data || []); setLoading(false); });
  };
  useEffect(() => { load(); }, [headers]);

  const handleCreate = () => { setEditing("new"); setForm({ type: "", name: "", price_per_day: "", seats: "", bags: "", transmission: "", features: [], images: [] }); };
  const handleEdit = (item) => { setEditing(item.id); setForm({ ...item }); };
  const handleSave = async () => {
    const body = { ...form, features: Array.isArray(form.features) ? form.features : form.features.split(",").map(s=>s.trim()).filter(Boolean) };
    const url = editing === "new" ? `${API_BASE_URL}/api/admin/cars` : `${API_BASE_URL}/api/admin/cars/${editing}`;
    const method = editing === "new" ? "POST" : "PUT";
    const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
    if (res.ok) { setEditing(null); load(); notifyCatalogUpdated(); } else { alert("Failed to save"); }
  };
  const handleDelete = async (id) => { if (!confirm("Delete this car?")) return; const response = await fetch(`${API_BASE_URL}/api/admin/cars/${id}`, { method: "DELETE", headers }); if (!response.ok) { alert("Failed to delete car"); return; } load(); notifyCatalogUpdated(); };

  if (loading) return <div className="admin-empty">Loading cars…</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Cars</h2>
        <button className="admin-btn-add" onClick={handleCreate}><Plus size={16} /> Add Car</button>
      </div>

      {editing !== null && (
        <div className="admin-form" style={{ marginBottom: 24 }}>
          <h2>{editing === "new" ? "Add Car" : "Edit Car"}</h2>
          <div className="admin-field">
            <label>Type</label>
            <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Price per Day</label>
            <input type="number" value={form.price_per_day} onChange={(e) => setForm({ ...form, price_per_day: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Seats</label>
            <input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Bags</label>
            <input type="number" value={form.bags} onChange={(e) => setForm({ ...form, bags: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Transmission</label>
            <input value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Features (comma-separated)</label>
            <input value={Array.isArray(form.features) ? form.features.join(", ") : form.features || ""}
              onChange={(e) => setForm({ ...form, features: e.target.value.split(",").map(s=>s.trim()).filter(Boolean) })}
            />
          </div>
          <ImageGalleryField
            label="Car photos"
            images={form.images || []}
            headers={headers}
            onChange={(images) => setForm({ ...form, images })}
          />
          <div className="admin-actions">
            <button className="admin-btn admin-btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={handleSave}><Save size={16} style={{ marginRight: 6 }} /> Save</button>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Type</th><th>Name</th><th>Price/Day</th><th>Seats</th><th>Bags</th><th>Transmission</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td>{c.type}</td><td><strong>{c.name}</strong></td><td>${c.price_per_day}</td><td>{c.seats}</td><td>{c.bags}</td><td>{c.transmission}</td>
                <td>
                  <button className="admin-btn admin-btn-secondary" style={{ padding: "6px 10px", fontSize: "12px" }} onClick={() => handleEdit(c)}><Edit2 size={14} /> Edit</button>
                  <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && <div className="admin-empty">No cars found.</div>}
    </div>
  );
}