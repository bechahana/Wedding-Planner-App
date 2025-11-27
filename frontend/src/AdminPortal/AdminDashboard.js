import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import AddService from "./AddService";
import Accounts from "./Accounts";
import Feedback from "./Feedback";

export default function AdminDashboard() {
  const [tab, setTab] = useState("add-service");
  const navigate = useNavigate(); // 🚀

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");

    navigate("/login", { replace: true });

    // 🛑 Prevent back button from returning to admin pages
    window.history.pushState(null, "", "/login");
  };

  const NavItem = ({ id, label }) => (
    <button
      onClick={() => setTab(id)}
      className={`nav-item ${tab === id ? "active" : ""}`}
    >
      {label}
    </button>
  );

  return (
    <div className="admin">
      {/* Topbar */}
      <div className="topbar">
        <div className="brand">Wedding Planner — Admin</div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="section-title">Admin Panel</div>
          <NavItem id="add-service" label="Add Service" />
          <NavItem id="accounts" label="Accounts" />
          <NavItem id="feedback" label="Feedback" />
        </aside>

        {/* Content */}
        <main className="content">
          {tab === "add-service" && <AddService />}
          {tab === "accounts" && <Accounts />}
          {tab === "feedback" && <Feedback />}
        </main>
      </div>
    </div>
  );
}
