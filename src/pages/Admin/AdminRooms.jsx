import { useState, useEffect } from "react";
import { Bed, Plus, Trash2, Save, Edit2 } from "lucide-react";
import { API_BASE_URL } from "../../utils/api";
import { notifyCatalogUpdated } from "../../data/catalogStore";
import ImageGalleryField from "./ImageGalleryField";

export default function AdminRooms({ headers }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ hotel_id: "", name: "", beds: "", guests: "", price_per_night: "", amenities: [], images: [] });

  const load = () => {
    fetch(`${API_BASE_URL}/api/admin/rooms`, { headers })
      .then((r) => r.json()).then((d) => { setItems(d.data || []); setLoading(false); });
  };
  useEffect(() => {
    load();
    fetch(`${API_BASE_URL}/api/admin/hotels`, { headers })
      .then((response) => response.json())
      .then((result) => setHotels(result.data || []));
  }, [headers]);

  const handleCreate = () => { setEditing("new"); setForm({ hotel_id: "", name: "", beds: "", guests: "", price_per_night: "", amenities: [], images: [] }); };
  const handleEdit = (item) => { setEditing(item.id); setForm({ ...item }); };
  const handleSave = async () => {
    const body = { ...form, amenities: Array.isArray(form.amenities) ? form.amenities : form.amenities.split(",").map(s=>s.trim()).filter(Boolean), images: Array.isArray(form.images) ? form.images : form.images.split(",").map(s=>s.trim()).filter(Boolean) };
    const url = editing === "new" ? `${API_BASE_URL}/api/admin/rooms` : `${API_BASE_URL}/api/admin/rooms/${editing}`;
    const method = editing === "new" ? "POST" : "PUT";
    const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
    if (res.ok) { setEditing(null); load(); notifyCatalogUpdated(); } else { alert("Failed to save"); }
  };
  const handleDelete = async (id) => { if (!confirm("Delete this room?")) return; const response = await fetch(`${API_BASE_URL}/api/admin/rooms/${id}`, { method: "DELETE", headers }); if (!response.ok) { alert("Failed to delete room"); return; } load(); notifyCatalogUpdated(); };

  if (loading) return <div className="admin-empty">Loading rooms…</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Rooms</h2>
        <button className="admin-btn-add" onClick={handleCreate}><Plus size={16} /> Add Room</button>
      </div>

      {editing !== null && (
        <div className="admin-form" style={{ marginBottom: 24 }}>
          <h2>{editing === "new" ? "Add Room" : "Edit Room"}</h2>
          <div className="admin-field">
            <label>Hotel</label>
            <select value={form.hotel_id} onChange={(e) => setForm({ ...form, hotel_id: e.target.value })} required>
              <option value="">Select a hotel</option>
              {hotels.map((hotel) => <option key={hotel.id} value={hotel.id}>{hotel.name}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Beds</label>
            <input value={form.beds} onChange={(e) => setForm({ ...form, beds: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Guests</label>
            <input value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Price per Night</label>
            <input type="number" value={form.price_per_night} onChange={(e) => setForm({ ...form, price_per_night: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Amenities (comma-separated)</label>
            <input value={Array.isArray(form.amenities) ? form.amenities.join(", ") : form.amenities || ""}
              onChange={(e) => setForm({ ...form, amenities: e.target.value.split(",").map(s=>s.trim()).filter(Boolean) })}
            />
          </div>
          <ImageGalleryField
            label="Room photos"
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
          <thead><tr><th>Hotel ID</th><th>Name</th><th>Beds</th><th>Guests</th><th>Price/Night</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id}>
                <td>{hotels.find((hotel) => String(hotel.id) === String(r.hotel_id))?.name || "Hotel unavailable"}</td><td><strong>{r.name}</strong></td><td>{r.beds}</td><td>{r.guests}</td><td>${r.price_per_night}</td>
                <td>
                  <button className="admin-btn admin-btn-secondary" style={{ padding: "6px 10px", fontSize: "12px" }} onClick={() => handleEdit(r)}><Edit2 size={14} /> Edit</button>
                  <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(r.id)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && <div className="admin-empty">No rooms found.</div>}
    </div>
  );
}