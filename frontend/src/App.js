import React, { useState } from "react";
import "./App.css";
import "./User/user-pages.css";

// Import the pages
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";
import ManageWeddingServices from "./User/ManageServices/ManageWeddingServices";
import BookAppointment from "./User/BookAppointment/BookAppointment";
import SendInvitations from "./User/SendInvitations/SendInvitations";

function App() {
  // Control which page to display
  const [view, setView] = useState("login"); // default = login
  const [user, setUser] = useState(null);

  // Simulated login/signup success handlers
  function handleLogin(form) {
    console.log("Logged in:", form);
    setUser({ email: form.email });
    setView("home");
  }

  function handleSignUp(form) {
    console.log("Signed up:", form);
    setUser({ email: form.email });
    setView("home");
  }

  // === Render depending on the view ===
  if (view === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onGoSignUp={() => setView("signup")}
      />
    );
  }

  if (view === "signup") {
    return (
      <SignUp
        onSignUp={handleSignUp}
        onGoLogin={() => setView("login")}
      />
    );
  }

  // Authenticated area
  if (user) {
    if (view === "services") {
      return (
        <ManageWeddingServices onExit={() => setView("home")} />
      );
    }
    if (view === "appointments") {
      return (
        <BookAppointment onExit={() => setView("home")} />
      );
    }
    if (view === "invitations") {
      return (
        <SendInvitations onExit={() => setView("home")} />
      );
    }

    // Default home for authenticated user
    return (
      <div className="user-page">
        <div className="user-container">
          <div className="user-header">
            <div>
              <h2 className="user-title">Welcome</h2>
              <p className="user-subtitle" style={{ marginBottom: 0 }}>Manage your wedding planning</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ fontSize: "0.95rem", color: "#666" }}>{user.email}</div>
              <button onClick={() => { setUser(null); setView("login"); }} className="user-btn user-btn-small">
                Logout
              </button>
            </div>
          </div>

          <div className="user-grid user-grid-2" style={{ maxWidth: "100%" }}>
            <div className="user-card">
              <div className="user-card-title">Manage Wedding Services</div>
              <div className="user-card-description">
                Browse, compare, and select services for your wedding plan.
              </div>
              <button onClick={() => setView("services")} className="user-btn" style={{ marginTop: "1rem", width: "100%" }}>
                Open
              </button>
            </div>

            <div className="user-card">
              <div className="user-card-title">Book Appointment</div>
              <div className="user-card-description">
                Book vendor appointments for venue checks and cake tastings.
              </div>
              <button onClick={() => setView("appointments")} className="user-btn" style={{ marginTop: "1rem", width: "100%" }}>
                Open
              </button>
            </div>

            <div className="user-card">
              <div className="user-card-title">Send Invitations</div>
              <div className="user-card-description">
                Send digital invitations to guests. Requires a booked venue.
              </div>
              <button onClick={() => setView("invitations")} className="user-btn" style={{ marginTop: "1rem", width: "100%" }}>
                Open
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
