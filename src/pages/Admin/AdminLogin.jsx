import { useState } from "react";
import { Shield, Lock } from "lucide-react";
import "./Admin.css";
import { API_BASE_URL } from "../../utils/api";

export default function AdminLogin({ onLogin }) {
  const [token, setToken] = useState("Admin123");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    if (!token.trim()) {
      setError("Please enter your admin password.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        localStorage.setItem("admin_token", token);
        onLogin(token);
      } else {
        setError(res.status === 401
          ? "Invalid admin password. Please try again."
          : "The admin service could not verify your password. Please try again.");
      }
    } catch {
      setError("Unable to reach the admin service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <Shield size={26} />
          <h2 style={{ margin: 0, fontSize: 22, color: "#0f172a" }}>Admin Login</h2>
        </div>
        <p>Enter your admin token to manage travel data.</p>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label>Admin Token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter admin password"
            />
            <span className="admin-field-hint">Default: Admin123</span>
          </div>
          <div className="admin-actions">
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={submitting}
            >
              {submitting ? "Signing in…" : (
                <>
                  <Lock size={16} style={{ marginRight: 6 }} /> Sign in
                </>
              )}
            </button>
          </div>
        </form>
        <p style={{ marginTop: 16, fontSize: 12, color: "#94a3b8" }}>
          Set the ADMIN_TOKEN environment variable to change the token.
        </p>
      </div>
    </div>
  );
}