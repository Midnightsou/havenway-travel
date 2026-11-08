import { useState, useEffect } from "react";
import { Hotel, Plus, Trash2, Save, Edit2 } from "lucide-react";
import { API_BASE_URL } from "../../utils/api";
import { notifyCatalogUpdated } from "../../data/catalogStore";
import ImageGalleryField from "./ImageGalleryField";

export default function AdminHotels({ headers }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "", location: "", rating: "", rating_label: "", review_count: "",
    description: "", long_description: "", check_in: "", check_out: "",
    amenities: [], highlights: [], images: [],
  });

  const load = () => {
    fetch(`${API_BASE_URL}/api/admin/hotels`, { headers })
      .then((r) => r.json())
      .then((d) => { setItems(d.data || []); setLoading(false); });
  };

  useEffect(() => { load(); }, [headers]);

  const handleCreate = () => {
    setEditing("new");
    setForm({ name: "", location: "", rating: "", rating_label: "", review_count: "",
      description: "", long_description: "", check_in: "", check_out: "",
      amenities: [], highlights: [], images: [] });
  };

  const handleEdit = (item) => { setEditing(item.id); setForm({ ...item }); };

  const handleSave = async () => {
    const body = { ...form };
    const url = editing === "new"
      ? `${API_BASE_URL}/api/admin/hotels`
      : `${API_BASE_URL}/api/admin/hotels/${editing}`;
    const method = editing === "new" ? "POST" : "PUT";
    const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
    if (res.ok) { setEditing(null); load(); notifyCatalogUpdated(); } else { alert("Failed to save"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this hotel?")) return;
    const response = await fetch(`${API_BASE_URL}/api/admin/hotels/${id}`, { method: "DELETE", headers });
    if (!response.ok) { alert("Failed to delete hotel"); return; }
    load();
    notifyCatalogUpdated();
  };

  if (loading) return <div className="admin-empty">Loading hotels…</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Hotels</h2>
        <button className="admin-btn-add" onClick={handleCreate}>
          <Plus size={16} /> Add Hotel
        </button>
      </div>

      {editing !== null && (
        <div className="admin-form" style={{ marginBottom: 24 }}>
          <h2>{editing === "new" ? "Add Hotel" : "Edit Hotel"}</h2>
          <div className="admin-field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Location</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Rating</label>
            <input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Rating Label</label>
            <input value={form.rating_label} onChange={(e) => setForm({ ...form, rating_label: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Review Count</label>
            <input type="number" value={form.review_count} onChange={(e) => setForm({ ...form, review_count: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Check In</label>
            <input value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Check Out</label>
            <input value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Full Description</label>
            <textarea value={form.long_description || ""} onChange={(e) => setForm({ ...form, long_description: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Highlights (comma-separated)</label>
            <input value={Array.isArray(form.highlights) ? form.highlights.join(", ") : form.highlights || ""}
              onChange={(e) => setForm({ ...form, highlights: e.target.value.split(",").map((value) => value.trim()).filter(Boolean) })}
            />
          </div>
          <div className="admin-field">
            <label>Amenities (comma-separated)</label>
            <input value={Array.isArray(form.amenities) ? form.amenities.join(", ") : form.amenities || ""}
              onChange={(e) => setForm({ ...form, amenities: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
            />
          </div>
          <ImageGalleryField
            label="Hotel photos"
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
          <thead><tr><th>Name</th><th>Location</th><th>Rating</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((h) => (
              <tr key={h.id}>
                <td><strong>{h.name}</strong></td>
                <td>{h.location}</td>
                <td>{h.rating}</td>
                <td>
                  <button className="admin-btn admin-btn-secondary" style={{ padding: "6px 10px", fontSize: "12px" }} onClick={() => handleEdit(h)}><Edit2 size={14} /> Edit</button>
                  <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(h.id)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && <div className="admin-empty">No hotels found.</div>}
    </div>
  );
}