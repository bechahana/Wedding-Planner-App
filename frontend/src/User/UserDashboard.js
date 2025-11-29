// src/User/UserDashboard.js
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./user-pages.css";
import BookAppointment from "./BookAppointment/BookAppointment";
import ManageServices from "./ManageServices/ManageWeddingServices";
import SendInvitations from "./SendInvitations/SendInvitations";
import "../global.css";

export default function UserDashboard() {
  const [tab, setTab] = useState("book");
  const navigate = useNavigate();
  const { id } = useParams(); // user id from /user/:id

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    navigate("/login", { replace: true });
    window.history.pushState(null, "", "/login");
  };

  const NavItem = ({ id: tabId, label }) => (
    <button
      onClick={() => setTab(tabId)}
      className={`user-nav-item ${tab === tabId ? "active" : ""}`}
    >
      {label}
    </button>
  );

  return (
    <div className="user-root">
      {/* Topbar */}
      <div className="user-topbar">
        <div className="user-topbar-left">
          <div className="user-logo-circle">WP</div>
          <div className="user-topbar-text">
            <div className="user-app-name">Wedding Planner</div>
            <div className="user-app-subtitle">User #{id}</div>
          </div>
        </div>

        <div className="user-topbar-right">
          <span className="user-topbar-caption">User Panel</span>
          <button className="user-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main layout: vertical sidebar + content */}
      <div className="user-layout">
        {/* Sidebar */}
        <aside className="user-sidebar">
          <div className="user-section-title">User Panel</div>
          <NavItem id="book" label="Book Appointment" />
          <NavItem id="manage" label="Manage Services" />
          <NavItem id="invite" label="Send Invitations" />
        </aside>

        {/* Content */}
        <main className="user-content">
          {tab === "book" && <BookAppointment userId={id} />}
          {tab === "manage" && <ManageServices />}
          {tab === "invite" && <SendInvitations userId={id} />}
        </main>
      </div>
    </div>
  );
}
