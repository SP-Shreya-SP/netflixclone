import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../AuthPages.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function LoginPage() {
  const [form, setForm] = useState({ userId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/home";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.userId || !form.password) {
      setError("User ID and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, form, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data?.success) {
        localStorage.setItem("nc_user", JSON.stringify(response.data.data));
        navigate(from, { replace: true });
      } else {
        setError(response.data?.message || "Login failed. Please try again.");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-overlay" />
      <div className="auth-content">
        <h1 className="logo-text">Netflix</h1>
        <div className="auth-card">
          <h2>Sign In</h2>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label htmlFor="userId">User ID</label>
              <input
                id="userId"
                name="userId"
                type="text"
                autoComplete="username"
                value={form.userId}
                onChange={handleChange}
                placeholder="Enter your user ID"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            <span>
              New to Netflix?{" "}
              <Link to="/register" className="auth-link">
                Sign up now.
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

