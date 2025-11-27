// src/User/UserDashboard.js
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./user-pages.css";
import BookAppointment from "./BookAppointment/BookAppointment";
import ManageServices from "./ManageServices/ManageWeddingServices";
import SendInvitations from "./SendInvitations/SendInvitations";


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
        <div className="user-brand">Wedding Planner — User #{id}</div>
        <button className="user-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

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
          {tab === "book" && <BookAppointment />}
          {tab === "manage" && <ManageServices />}
          {tab === "invite" && <SendInvitations />}
        </main>
      </div>
    </div>
  );
}
