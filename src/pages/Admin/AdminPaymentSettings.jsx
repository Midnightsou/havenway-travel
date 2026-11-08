import { useEffect, useState } from "react";
import { Save, Wallet } from "lucide-react";
import { API_BASE_URL } from "../../utils/api";

async function readApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    if (response.status === 404 || contentType.includes("text/html")) {
      throw new Error(
        "The payment settings API is not available on the server yet. Deploy/restart the updated backend, then try again."
      );
    }
    throw new Error(`The server returned an unexpected response (HTTP ${response.status}).`);
  }

  try {
    return await response.json();
  } catch {
    throw new Error("The server returned invalid JSON. Check the backend deployment and logs.");
  }
}

export default function AdminPaymentSettings({ headers }) {
  const [address, setAddress] = useState("");
  const [source, setSource] = useState("unset");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/api/admin/payment-settings/bitcoin-address`, { headers })
      .then(async (response) => {
        const result = await readApiResponse(response);
        if (!response.ok || !result.success) {
          throw new Error(result.error || "Could not load the Bitcoin address.");
        }
        if (active) {
          setAddress(result.address || "");
          setSource(result.source || "unset");
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Could not load payment settings.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [headers]);

  const saveAddress = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/payment-settings/bitcoin-address`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ address }),
      });
      const result = await readApiResponse(response);
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not save the Bitcoin address.");
      }
      setAddress(result.address);
      setSource("admin");
      setMessage("Bitcoin receiving address updated. New payment sessions will use this address.");
    } catch (saveError) {
      setError(saveError.message || "Could not save the Bitcoin address.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-empty">Loading payment settings…</div>;

  return (
    <section className="admin-form admin-payment-settings">
      <div className="admin-payment-settings-title">
        <div className="admin-stat-icon"><Wallet size={22} /></div>
        <div>
          <h2>Bitcoin payments</h2>
          <p>Choose the wallet address customers should pay for new bookings.</p>
        </div>
      </div>

      <form onSubmit={saveAddress}>
        <div className="admin-field">
          <label htmlFor="btc-receiving-address">Bitcoin receiving address</label>
          <input
            id="btc-receiving-address"
            autoComplete="off"
            spellCheck="false"
            inputMode="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Enter a Bitcoin mainnet address"
            required
          />
          <p className="admin-field-hint">
            Current value comes from {source === "admin" ? "admin settings" : source === "environment" ? "server configuration" : "no configuration"}.
          </p>
        </div>

        <div className="admin-payment-settings-note">
          New payments and unpaid pending sessions use this address when their payment page is opened again. Payments already detected or confirmed keep their assigned address.
        </div>

        {message && <p className="admin-catalog-message" role="status">{message}</p>}
        {error && <p className="admin-catalog-error" role="alert">{error}</p>}

        <div className="admin-actions">
          <button className="admin-btn admin-btn-primary" type="submit" disabled={saving || !address.trim()}>
            <Save size={16} />
            {saving ? "Saving…" : "Save address"}
          </button>
        </div>
      </form>
    </section>
  );
}
