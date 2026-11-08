import { useEffect, useState } from "react";
import { CalendarDays, Plus, Save, Trash2 } from "lucide-react";
import { itineraryTemplateDefaults } from "../../data/itinerary";
import { notifyCatalogUpdated } from "../../data/catalogStore";
import { API_BASE_URL } from "../../utils/api";

const dayLabels = {
  arrival: "Arrival day",
  explore: "Explore day",
  freeDay: "Free day",
  departure: "Departure day",
};

const eventTypes = [
  { value: "flight", label: "Flight" },
  { value: "arrival", label: "Arrival" },
  { value: "hotel", label: "Hotel" },
  { value: "activity", label: "Activity" },
  { value: "free", label: "Free time" },
];

function copyTemplates(templates = itineraryTemplateDefaults) {
  return Object.fromEntries(
    Object.entries(itineraryTemplateDefaults).map(([key, fallback]) => {
      const saved = templates[key];
      return [
        key,
        {
          title: saved?.title ?? fallback.title,
          events: (saved?.events ?? fallback.events).map((event) => ({ ...event })),
        },
      ];
    })
  );
}

async function readApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    if (response.status === 404 || contentType.includes("text/html")) {
      throw new Error("The itinerary API is not available on the server yet. Deploy/restart the updated backend, then try again.");
    }
    throw new Error(`The server returned an unexpected response (HTTP ${response.status}).`);
  }
  try {
    return await response.json();
  } catch {
    throw new Error("The server returned invalid JSON. Check the backend deployment and logs.");
  }
}

export default function AdminItinerary({ headers }) {
  const [templates, setTemplates] = useState(() => copyTemplates());
  const [activeDay, setActiveDay] = useState("arrival");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/api/admin/itinerary-templates`, { headers })
      .then(async (response) => {
        const result = await readApiResponse(response);
        if (!response.ok || !result.success) {
          throw new Error(result.error || "Could not load itinerary templates.");
        }
        if (active && result.templates) {
          setTemplates(copyTemplates(result.templates));
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Could not load itinerary templates.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [headers]);

  const updateDay = (update) => {
    setTemplates((current) => ({
      ...current,
      [activeDay]: update(current[activeDay]),
    }));
    setMessage("");
  };

  const updateEvent = (eventIndex, field, value) => {
    updateDay((day) => ({
      ...day,
      events: day.events.map((event, index) =>
        index === eventIndex ? { ...event, [field]: value } : event
      ),
    }));
  };

  const addEvent = () => {
    updateDay((day) => ({
      ...day,
      events: [
        ...day.events,
        {
          id: `event-${Date.now()}`,
          time: "",
          type: "activity",
          title: "",
          description: "",
          details: "",
        },
      ],
    }));
  };

  const removeEvent = (eventIndex) => {
    updateDay((day) => ({
      ...day,
      events: day.events.filter((_, index) => index !== eventIndex),
    }));
  };

  const saveTemplates = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/itinerary-templates`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ templates }),
      });
      const result = await readApiResponse(response);
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not save itinerary templates.");
      }
      setTemplates(copyTemplates(result.templates));
      setMessage("Itinerary changes saved and published to customer trips.");
      notifyCatalogUpdated();
    } catch (saveError) {
      setError(saveError.message || "Could not save itinerary templates.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-empty">Loading itinerary templates…</div>;

  const day = templates[activeDay];

  return (
    <section className="admin-form admin-itinerary">
      <div className="admin-payment-settings-title">
        <div className="admin-stat-icon"><CalendarDays size={22} /></div>
        <div>
          <h2>Trip itinerary</h2>
          <p>Manage the headings and events customers see for each kind of trip day.</p>
        </div>
      </div>

      <form onSubmit={saveTemplates}>
        <div className="admin-field">
          <label htmlFor="itinerary-day">Day template</label>
          <select
            id="itinerary-day"
            value={activeDay}
            onChange={(event) => setActiveDay(event.target.value)}
          >
            {Object.entries(dayLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label htmlFor="itinerary-day-title">Day heading</label>
          <input
            id="itinerary-day-title"
            value={day.title}
            maxLength={200}
            onChange={(event) => updateDay((current) => ({ ...current, title: event.target.value }))}
            required
          />
        </div>

        <div className="admin-itinerary-events">
          {day.events.map((event, index) => (
            <fieldset className="admin-itinerary-event" key={`${event.id}-${index}`}>
              <legend>Event {index + 1}</legend>
              <div className="admin-itinerary-event-fields">
                <div className="admin-field">
                  <label htmlFor={`event-time-${index}`}>Time</label>
                  <input
                    id={`event-time-${index}`}
                    value={event.time}
                    maxLength={50}
                    onChange={(change) => updateEvent(index, "time", change.target.value)}
                    placeholder="e.g. 3:00 PM"
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor={`event-type-${index}`}>Type</label>
                  <select
                    id={`event-type-${index}`}
                    value={event.type}
                    onChange={(change) => updateEvent(index, "type", change.target.value)}
                  >
                    {eventTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-field admin-itinerary-event-title">
                  <label htmlFor={`event-title-${index}`}>Event title</label>
                  <input
                    id={`event-title-${index}`}
                    value={event.title}
                    maxLength={200}
                    onChange={(change) => updateEvent(index, "title", change.target.value)}
                    required
                  />
                </div>
                <div className="admin-field admin-itinerary-event-description">
                  <label htmlFor={`event-description-${index}`}>Description</label>
                  <textarea
                    id={`event-description-${index}`}
                    value={event.description}
                    maxLength={2000}
                    onChange={(change) => updateEvent(index, "description", change.target.value)}
                    rows={3}
                  />
                </div>
                <div className="admin-field admin-itinerary-event-details">
                  <label htmlFor={`event-details-${index}`}>Location or extra details</label>
                  <input
                    id={`event-details-${index}`}
                    value={event.details}
                    maxLength={500}
                    onChange={(change) => updateEvent(index, "details", change.target.value)}
                  />
                </div>
                <button
                  className="admin-btn admin-btn-secondary admin-itinerary-remove"
                  type="button"
                  onClick={() => removeEvent(index)}
                  aria-label={`Remove event ${index + 1}`}
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </fieldset>
          ))}
        </div>

        <div className="admin-actions">
          <button className="admin-btn admin-btn-secondary" type="button" onClick={addEvent}>
            <Plus size={16} /> Add event
          </button>
          <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>
            <Save size={16} /> {saving ? "Saving…" : "Save itinerary"}
          </button>
        </div>
        {message && <p className="admin-catalog-message" role="status">{message}</p>}
        {error && <p className="admin-catalog-error" role="alert">{error}</p>}
      </form>
    </section>
  );
}
