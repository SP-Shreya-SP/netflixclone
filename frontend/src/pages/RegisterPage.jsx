import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../AuthPages.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function RegisterPage() {
  const [form, setForm] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.userId || !form.name || !form.email || !form.phone || !form.password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/register`, form, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data?.success) {
        setSuccess("Registration successful. Redirecting to login...");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      } else {
        setError(response.data?.message || "Registration failed. Please try again.");
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
          <h2>Sign Up</h2>
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label htmlFor="userId">User ID</label>
              <input
                id="userId"
                name="userId"
                type="text"
                value={form.userId}
                onChange={handleChange}
                placeholder="Choose a unique user ID"
              />
            </div>

            <div className="field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
              />
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="auth-footer">
            <span>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in.
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

