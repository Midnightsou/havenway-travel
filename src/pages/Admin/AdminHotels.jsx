import { useState, useEffect, useMemo, useCallback } from "react";
import { Hotel, Plus, Trash2, Save, Edit2, MapPin, BedDouble, Image, Search } from "lucide-react";
import { API_BASE_URL } from "../../utils/api";
import { notifyCatalogUpdated } from "../../data/catalogStore";
import ImageGalleryField from "./ImageGalleryField";

export default function AdminHotels({ headers, onNavigate }) {
  const [items, setItems] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", location: "", rating: "", rating_label: "", review_count: "",
    description: "", long_description: "", check_in: "", check_out: "",
    amenities: [], highlights: [], images: [],
  });

  const load = useCallback(async () => {
    setError("");
    try {
      const [hotelResponse, roomsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/hotels`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/rooms`, { headers }),
      ]);
      const [hotelResult, roomsResult] = await Promise.all([
        hotelResponse.json(),
        roomsResponse.json(),
      ]);
      if (!hotelResponse.ok || !hotelResult.success) {
        throw new Error(hotelResult.error || "Could not load hotels.");
      }
      setItems(hotelResult.data || []);
      setRooms(roomsResponse.ok && roomsResult.success ? roomsResult.data || [] : []);
    } catch (loadError) {
      setError(loadError.message || "Could not load hotels.");
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = () => {
    setEditing("new");
    setForm({ name: "", location: "", rating: "", rating_label: "", review_count: "",
      description: "", long_description: "", check_in: "", check_out: "",
      amenities: [], highlights: [], images: [] });
  };

  const handleEdit = (item) => { setEditing(item.id); setForm({ ...item }); };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const body = { ...form };
    const url = editing === "new"
      ? `${API_BASE_URL}/api/admin/hotels`
      : `${API_BASE_URL}/api/admin/hotels/${editing}`;
    const method = editing === "new" ? "POST" : "PUT";
    try {
      const response = await fetch(url, { method, headers, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save hotel.");
      }
      setEditing(null);
      await load();
      notifyCatalogUpdated();
    } catch (saveError) {
      setError(saveError.message || "Failed to save hotel.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this hotel?")) return;
    const response = await fetch(`${API_BASE_URL}/api/admin/hotels/${id}`, { method: "DELETE", headers });
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setError(result?.error || "Failed to delete hotel.");
      return;
    }
    await load();
    notifyCatalogUpdated();
  };

  const visibleHotels = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((hotel) =>
      `${hotel.name || ""} ${hotel.location || ""}`.toLowerCase().includes(query)
    );
  }, [items, search]);

  if (loading) return <div className="admin-empty">Loading hotels…</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Hotel management</h2>
        <button className="admin-btn-add" onClick={handleCreate}>
          <Plus size={16} /> Add Hotel
        </button>
      </div>

      <div className="admin-hotel-summary">
        <div><Hotel size={19} /><strong>{items.length}</strong><span>Properties</span></div>
        <div><BedDouble size={19} /><strong>{rooms.length}</strong><span>Rooms managed</span></div>
        <div><Image size={19} /><strong>{items.filter((hotel) => hotel.images?.length).length}</strong><span>With photos</span></div>
      </div>

      <label className="admin-hotel-search">
        <Search size={18} />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search hotels by name or location"
          aria-label="Search hotels by name or location"
        />
      </label>

      {error && <p className="admin-catalog-error" role="alert">{error}</p>}

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
            <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
              <Save size={16} style={{ marginRight: 6 }} /> {saving ? "Saving…" : "Save hotel"}
            </button>
          </div>
        </div>
      )}

      <div className="admin-hotel-grid">
        {visibleHotels.map((hotel) => {
          const roomCount = rooms.filter((room) => String(room.hotel_id ?? room.hotelId) === String(hotel.id)).length;
          const photo = Array.isArray(hotel.images) ? hotel.images[0] : "";
          return (
            <article className="admin-hotel-card" key={hotel.id}>
              <div className="admin-hotel-card-image">
                {photo ? <img src={photo} alt="" /> : <Hotel size={30} />}
                <span>{roomCount} {roomCount === 1 ? "room" : "rooms"}</span>
              </div>
              <div className="admin-hotel-card-content">
                <h3>{hotel.name}</h3>
                <p><MapPin size={15} />{hotel.location || "Location not set"}</p>
                <div className="admin-hotel-card-meta">
                  <span>{hotel.rating ? `★ ${hotel.rating} ${hotel.rating_label || hotel.ratingLabel || ""}` : "No rating set"}</span>
                  <span>{hotel.images?.length || 0} photos</span>
                </div>
                <div className="admin-hotel-card-actions">
                  <button className="admin-btn admin-btn-secondary" onClick={() => handleEdit(hotel)}>
                    <Edit2 size={15} /> Edit property
                  </button>
                  <button
                    className="admin-btn admin-btn-secondary"
                    onClick={() => onNavigate?.("rooms")}
                    aria-label={`Manage rooms for ${hotel.name}`}
                  >
                    <BedDouble size={15} /> Rooms
                  </button>
                  <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(hotel.id)} aria-label={`Delete ${hotel.name}`}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {visibleHotels.length === 0 && (
        <div className="admin-empty">{items.length ? "No hotels match your search." : "No hotels found."}</div>
      )}
    </div>
  );
}