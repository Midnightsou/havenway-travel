import { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, Save, Edit2 } from "lucide-react";
import { API_BASE_URL } from "../../utils/api";
import { notifyCatalogUpdated } from "../../data/catalogStore";

export default function AdminActivities({ headers }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", location: "", duration: "", price_per_person: "", rating: "", reviews: "", description: "", includes: [] });

  const load = () => {
    fetch(`${API_BASE_URL}/api/admin/activities`, { headers })
      .then((r) => r.json()).then((d) => { setItems(d.data || []); setLoading(false); });
  };
  useEffect(() => { load(); }, [headers]);

  const handleCreate = () => { setEditing("new"); setForm({ name: "", location: "", duration: "", price_per_person: "", rating: "", reviews: "", description: "", includes: [] }); };
  const handleEdit = (item) => { setEditing(item.id); setForm({ ...item }); };
  const handleSave = async () => {
    const body = { ...form, includes: Array.isArray(form.includes) ? form.includes : form.includes.split(",").map(s=>s.trim()).filter(Boolean) };
    const url = editing === "new" ? `${API_BASE_URL}/api/admin/activities` : `${API_BASE_URL}/api/admin/activities/${editing}`;
    const method = editing === "new" ? "POST" : "PUT";
    const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
    if (res.ok) { setEditing(null); load(); notifyCatalogUpdated(); } else { alert("Failed to save"); }
  };
  const handleDelete = async (id) => { if (!confirm("Delete this activity?")) return; const response = await fetch(`${API_BASE_URL}/api/admin/activities/${id}`, { method: "DELETE", headers }); if (!response.ok) { alert("Failed to delete activity"); return; } load(); notifyCatalogUpdated(); };

  if (loading) return <div className="admin-empty">Loading activities…</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Activities</h2>
        <button className="admin-btn-add" onClick={handleCreate}><Plus size={16} /> Add Activity</button>
      </div>

      {editing !== null && (
        <div className="admin-form" style={{ marginBottom: 24 }}>
          <h2>{editing === "new" ? "Add Activity" : "Edit Activity"}</h2>
          <div className="admin-field"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="admin-field"><label>Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          <div className="admin-field"><label>Duration</label><input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
          <div className="admin-field"><label>Price per Person</label><input type="number" value={form.price_per_person} onChange={(e) => setForm({ ...form, price_per_person: e.target.value })} /></div>
          <div className="admin-field"><label>Rating</label><input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
          <div className="admin-field"><label>Reviews</label><input type="number" value={form.reviews} onChange={(e) => setForm({ ...form, reviews: e.target.value })} /></div>
          <div className="admin-field"><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="admin-field"><label>Includes (comma-separated)</label><input value={Array.isArray(form.includes) ? form.includes.join(", ") : form.includes || ""} onChange={(e) => setForm({ ...form, includes: e.target.value.split(",").map(s=>s.trim()).filter(Boolean) })} /></div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={handleSave}><Save size={16} style={{ marginRight: 6 }} /> Save</button>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Location</th><th>Duration</th><th>Price/Person</th><th>Rating</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td><strong>{a.name}</strong></td><td>{a.location}</td><td>{a.duration}</td><td>${a.price_per_person}</td><td>{a.rating}</td>
                <td>
                  <button className="admin-btn admin-btn-secondary" style={{ padding: "6px 10px", fontSize: "12px" }} onClick={() => handleEdit(a)}><Edit2 size={14} /> Edit</button>
                  <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(a.id)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && <div className="admin-empty">No activities found.</div>}
    </div>
  );
}