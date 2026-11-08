import { useState, useEffect } from "react";
import { Package, Plus, Trash2, Save, Edit2 } from "lucide-react";
import { API_BASE_URL } from "../../utils/api";
import { notifyCatalogUpdated } from "../../data/catalogStore";

export default function AdminPackages({ headers }) {
  const [items, setItems] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", type: "", description: "", room_id: "", discount: "" });

  const load = () => {
    fetch(`${API_BASE_URL}/api/admin/packages`, { headers })
      .then((r) => r.json()).then((d) => { setItems(d.data || []); setLoading(false); });
  };
  useEffect(() => {
    load();
    fetch(`${API_BASE_URL}/api/admin/rooms`, { headers })
      .then((response) => response.json())
      .then((result) => setRooms(result.data || []));
  }, [headers]);

  const handleCreate = () => { setEditing("new"); setForm({ name: "", type: "", description: "", room_id: "", discount: "" }); };
  const handleEdit = (item) => { setEditing(item.id); setForm({ ...item }); };
  const handleSave = async () => {
    const body = { ...form };
    const url = editing === "new" ? `${API_BASE_URL}/api/admin/packages` : `${API_BASE_URL}/api/admin/packages/${editing}`;
    const method = editing === "new" ? "POST" : "PUT";
    const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
    if (res.ok) { setEditing(null); load(); notifyCatalogUpdated(); } else { alert("Failed to save"); }
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this package?")) return;
    const response = await fetch(`${API_BASE_URL}/api/admin/packages/${id}`, { method: "DELETE", headers });
    if (!response.ok) { alert("Failed to delete package"); return; }
    load();
    notifyCatalogUpdated();
  };

  if (loading) return <div className="admin-empty">Loading packages…</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Packages</h2>
        <button className="admin-btn-add" onClick={handleCreate}><Plus size={16} /> Add Package</button>
      </div>

      {editing !== null && (
        <div className="admin-form" style={{ marginBottom: 24 }}>
          <h2>{editing === "new" ? "Add Package" : "Edit Package"}</h2>
          <div className="admin-field"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="admin-field"><label>Type</label><input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /></div>
          <div className="admin-field"><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="admin-field">
            <label>Included room</label>
            <select value={form.room_id} onChange={(e) => setForm({ ...form, room_id: e.target.value })}>
              <option value="">Select a room</option>
              {rooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
            </select>
          </div>
          <div className="admin-field"><label>Discount (e.g. 0.15)</label><input type="number" step="0.01" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} /></div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={handleSave}><Save size={16} style={{ marginRight: 6 }} /> Save</button>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Type</th><th>Room ID</th><th>Discount</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.name}</strong></td><td>{p.type}</td><td>{rooms.find((room) => String(room.id) === String(p.room_id))?.name || "—"}</td><td>{p.discount}</td>
                <td>
                  <button className="admin-btn admin-btn-secondary" style={{ padding: "6px 10px", fontSize: "12px" }} onClick={() => handleEdit(p)}><Edit2 size={14} /> Edit</button>
                  <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && <div className="admin-empty">No packages found.</div>}
    </div>
  );
}