import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("nc_user");
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">Netflix</span>
        <nav className="navbar-links">
          <button type="button" className="nav-link active">
            Home
          </button>
          <button type="button" className="nav-link">
            TV Shows
          </button>
          <button type="button" className="nav-link">
            Movies
          </button>
          <button type="button" className="nav-link">
            My List
          </button>
        </nav>
      </div>
      <div className="navbar-right">
        <button type="button" className="nav-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

