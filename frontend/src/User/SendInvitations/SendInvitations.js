import React, { useState, useEffect, useMemo } from "react";
import "../user-pages.css";
import { sendInvitations, listUserInvitations, listServices } from "../../api/client";

const STORAGE_KEY_PLAN = "weddingPlanServices";

function loadPlan() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLAN);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export default function SendInvitations({ onExit, userId }) {
  const [design, setDesign] = useState({
    template: "elegant",
    primaryColor: "#8b5cf6",
    secondaryColor: "#f3e8ff",
    coupleName: "",
    eventDate: "",
    eventTime: "",
    venueName: "",
  });
  const [recipients, setRecipients] = useState([""]);
  const [shareableLink, setShareableLink] = useState("");
  const [sent, setSent] = useState(false);
  const [allInvitations, setAllInvitations] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState("");
  const [allVenues, setAllVenues] = useState([]);

  useEffect(() => {
    listServices({ service_type: "Venue" }).then(setAllVenues);
  }, []);

  const venueService = useMemo(() => {
    const currentPlan = loadPlan();
    const planVenue = currentPlan.find((service) => service.categoryId === "venue");
    if (allVenues.length > 0) {
      if (planVenue) {
        const matchedVenue = allVenues.find((v) => v.name === planVenue.name);
        if (matchedVenue) return matchedVenue;
      }
      return allVenues[0];
    }
    return null;
  }, [refreshTrigger, allVenues]);
  const hasVenue = true;

  useEffect(() => {
    if (userId) listUserInvitations(userId).then(setAllInvitations);
  }, [sent, userId]);

  useEffect(() => {
    if (venueService) {
      setDesign((prev) => ({ ...prev, venueName: venueService.name || "" }));
    }
  }, [venueService]);

  function handleDesignChange(field, value) {
    setDesign((prev) => ({ ...prev, [field]: value }));
  }

  function handleRecipientChange(index, value) {
    const newRecipients = [...recipients];
    newRecipients[index] = value;
    setRecipients(newRecipients);
  }

  function addRecipient() {
    setRecipients([...recipients, ""]);
  }

  function removeRecipient(index) {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index));
    }
  }

  async function handleSendInvitations() {
    setError("");
    const validRecipients = recipients.filter((email) => email.trim() !== "");
    if (validRecipients.length === 0) {
      setError("At least one recipient email is required.");
      return;
    }
    if (!design.coupleName || !design.eventDate || !design.eventTime) {
      setError("Please fill in couple name, event date, and event time.");
      return;
    }
    try {
      const message = JSON.stringify({ ...design });
      const venue_id = venueService ? Number(venueService.id) : null;
      const result = await sendInvitations(
        venue_id,
        validRecipients.map((e) => ({ recipient_name: e, recipient_email: e })),
        message,
        userId
      );
      const invitationId = result.invitation_id || Date.now();
      setShareableLink(`${window.location.origin}/invitation/shared/${invitationId}`);
      setSent(true);
      setRecipients([""]);
      setRefreshTrigger((r) => r + 1);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Send failed.");
    }
  }

  const templates = [
    { id: "elegant", name: "Elegant", preview: "🎩" },
    { id: "romantic", name: "Romantic", preview: "💕" },
    { id: "modern", name: "Modern", preview: "✨" },
    { id: "classic", name: "Classic", preview: "👗" },
  ];

  return (
    <div className="user-page">
      <div className="user-container">
        <div className="user-two-column">
          <div>
            <div className="user-header">
              <h2 className="user-title">Send Invitations</h2>
              <button onClick={onExit} className="user-btn-link">Exit</button>
            </div>
            {error && (<div className="user-alert user-alert-danger">{error}</div>)}
            {!sent ? (
              <>
                <div className="user-section">
                  <div className="user-card">
                    <h3 className="user-section-title">Design Customization</h3>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label className="user-label">Template</label>
                      <div className="user-nav">
                        {templates.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => handleDesignChange("template", t.id)}
                            className={`user-nav-item ${design.template === t.id ? "active" : ""}`}
                          >
                            {t.preview} {t.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                      <div>
                        <label className="user-label">Primary Color</label>
                        <input
                          type="color"
                          value={design.primaryColor}
                          onChange={(e) => handleDesignChange("primaryColor", e.target.value)}
                          className="user-input"
                          style={{ height: "48px", padding: "4px", cursor: "pointer" }}
                        />
                      </div>
                      <div>
                        <label className="user-label">Secondary Color</label>
                        <input
                          type="color"
                          value={design.secondaryColor}
                          onChange={(e) => handleDesignChange("secondaryColor", e.target.value)}
                          className="user-input"
                          style={{ height: "48px", padding: "4px", cursor: "pointer" }}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label className="user-label">Couple Name</label>
                      <input
                        type="text"
                        value={design.coupleName}
                        onChange={(e) => handleDesignChange("coupleName", e.target.value)}
                        placeholder="John & Jane"
                        className="user-input"
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                      <div>
                        <label className="user-label">Event Date</label>
                        <input
                          type="date"
                          value={design.eventDate}
                          onChange={(e) => handleDesignChange("eventDate", e.target.value)}
                          className="user-input"
                        />
                      </div>
                      <div>
                        <label className="user-label">Event Time</label>
                        <input
                          type="time"
                          value={design.eventTime}
                          onChange={(e) => handleDesignChange("eventTime", e.target.value)}
                          className="user-input"
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label className="user-label">Venue Name</label>
                      <input
                        type="text"
                        value={design.venueName}
                        onChange={(e) => handleDesignChange("venueName", e.target.value)}
                        placeholder="Venue name"
                        className="user-input"
                      />
                    </div>
                  </div>
                </div>
                <div className="user-section">
                  <div className="user-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <h3 className="user-section-title" style={{ margin: 0 }}>Recipient List</h3>
                      <button
                        onClick={addRecipient}
                        className="user-btn user-btn-small"
                      >
                        + Add Recipient
                      </button>
                    </div>
                    <div style={{ display: "grid", gap: "0.75rem" }}>
                      {recipients.map((email, index) => (
                        <div key={index} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => handleRecipientChange(index, e.target.value)}
                            placeholder="guest@example.com"
                            className="user-input"
                            style={{ flex: 1 }}
                          />
                          {recipients.length > 1 && (
                            <button
                              onClick={() => removeRecipient(index)}
                              className="user-btn user-btn-danger user-btn-small"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="user-section">
                  <div className="user-card" style={{ background: design.secondaryColor }}>
                    <h3 className="user-section-title">Preview</h3>
                    <div style={{ border: "2px solid", borderColor: design.primaryColor, borderRadius: "12px", padding: "2rem", background: "#fff", textAlign: "center" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 600, color: design.primaryColor, marginBottom: "0.75rem" }}>
                        {design.coupleName || "Couple Name"}
                      </div>
                      <div style={{ fontSize: "1rem", color: "#666", marginBottom: "0.5rem" }}>
                        You're Invited!
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.25rem" }}>
                        {design.eventDate || "Event Date"} at {design.eventTime || "Event Time"}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        {design.venueName || "Venue Name"}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSendInvitations}
                  className="user-btn"
                  style={{ width: "100%", background: design.primaryColor, fontSize: "1rem", padding: "1rem" }}
                >
                  Send Invitations
                </button>
              </>
            ) : (
              <div className="user-alert user-alert-success">
                <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Invitations Sent Successfully!</div>
                <div style={{ marginBottom: "1rem" }}>
                  Invitations have been sent to {recipients.filter((e) => e.trim() !== "").length} recipient(s).
                </div>
                {shareableLink && (
                  <div style={{ marginBottom: "1rem" }}>
                    <div className="user-label" style={{ marginBottom: "0.5rem" }}>Shareable Link:</div>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <input
                        type="text"
                        value={shareableLink}
                        readOnly
                        className="user-input"
                        style={{ flex: 1 }}
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(shareableLink);
                          alert("Link copied to clipboard!");
                        }}
                        className="user-btn user-btn-success"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => {
                      setSent(false);
                      setRecipients([""]);
                      setShareableLink("");
                    }}
                    className="user-btn-secondary"
                  >
                    Send Another
                  </button>
                  <button
                    onClick={onExit}
                    className="user-btn"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
          <aside className="user-sidebar">
            <div className="user-sidebar-title">Invitation History</div>
            {allInvitations.length === 0 ? (
              <div className="user-empty">
                <div className="user-empty-text">No invitations sent yet.</div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {allInvitations.map((inv) => (
                  <div key={inv.id} className="user-sidebar-item">
                    <div className="user-sidebar-item-title">{inv.recipient_name}</div>
                    <div className="user-sidebar-item-text">{inv.recipient_email}</div>
                    <div className="user-sidebar-item-text">Venue: {inv.venue_address}</div>
                    <span className="user-badge user-badge-success" style={{ marginTop: "0.5rem", display: "inline-block" }}>sent</span>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

