import React, { useState, useEffect, useMemo } from "react";
import "../user-pages.css";

const STORAGE_KEY_PLAN = "weddingPlanServices";
const STORAGE_KEY_INVITATIONS = "weddingInvitations";

function loadPlan() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLAN);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function loadInvitations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INVITATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveInvitations(invitations) {
  localStorage.setItem(STORAGE_KEY_INVITATIONS, JSON.stringify(invitations));
}

export default function SendInvitations({ onExit }) {
  const [invitations, setInvitations] = useState(() => loadInvitations());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const [design, setDesign] = useState({
    template: "elegant",
    primaryColor: "#8b5cf6",
    secondaryColor: "#f3e8ff",
    coupleName: "",
    eventDate: "",
    eventTime: "",
    venueName: ""
  });

  const [recipients, setRecipients] = useState([""]);
  const [shareableLink, setShareableLink] = useState("");
  const [sent, setSent] = useState(false);

  // Check if venue is booked (reads from localStorage directly for real-time updates)
  const hasVenue = useMemo(() => {
    const currentPlan = loadPlan();
    return currentPlan.some((service) => service.categoryId === "venue");
  }, [refreshTrigger]);

  // Get venue name for invitation (reads from localStorage directly)
  const venueService = useMemo(() => {
    const currentPlan = loadPlan();
    return currentPlan.find((service) => service.categoryId === "venue") || null;
  }, [refreshTrigger]);

  // Refresh plan data when component mounts or when user might have added a venue
  useEffect(() => {
    // Refresh on mount to get latest data
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Update venue name when venue service changes
  useEffect(() => {
    if (venueService) {
      setDesign((prev) => ({
        ...prev,
        venueName: venueService.name || ""
      }));
    }
  }, [venueService]);

  // Generate shareable link
  function generateShareableLink() {
    const linkId = `invite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const link = `${window.location.origin}/invitation/${linkId}`;
    setShareableLink(link);
    return link;
  }

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

  function handleSendInvitations() {
    const validRecipients = recipients.filter((email) => email.trim() !== "");
    
    if (validRecipients.length === 0) {
      alert("Please add at least one recipient email address.");
      return;
    }

    if (!design.coupleName || !design.eventDate || !design.eventTime) {
      alert("Please fill in couple name, event date, and event time.");
      return;
    }

    const link = generateShareableLink();
    const newInvitation = {
      id: `invite-${Date.now()}`,
      design: { ...design },
      recipients: validRecipients,
      shareableLink: link,
      sentAt: new Date().toISOString(),
      status: "sent"
    };

    setInvitations((prev) => [...prev, newInvitation]);
    setSent(true);

    // Simulate sending emails
    console.log("Sending invitations to:", validRecipients);
    console.log("Shareable link:", link);
  }

  const templates = [
    { id: "elegant", name: "Elegant", preview: "🎩" },
    { id: "romantic", name: "Romantic", preview: "💕" },
    { id: "modern", name: "Modern", preview: "✨" },
    { id: "classic", name: "Classic", preview: "👗" }
  ];

  if (!hasVenue) {
    return (
      <div className="user-page">
        <div className="user-container">
          <div className="user-header">
            <h2 className="user-title">Send Invitations</h2>
            <button onClick={onExit} className="user-btn-link">Exit</button>
          </div>
          <div className="user-alert user-alert-warning">
            <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Venue Required</div>
            <div style={{ marginBottom: "1rem" }}>
              Please book a venue in "Manage Wedding Services" before sending invitations.
            </div>
            <button onClick={onExit} className="user-btn-secondary">Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      <div className="user-container">
        <div className="user-two-column">
          <div>
            <div className="user-header">
              <h2 className="user-title">Send Invitations</h2>
              <button onClick={onExit} className="user-btn-link">Exit</button>
            </div>

            {!sent ? (
              <>
                {/* Design Customization */}
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

                {/* Recipient List */}
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

                {/* Preview */}
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

          {/* Sidebar - Sent Invitations History */}
          <aside className="user-sidebar">
            <div className="user-sidebar-title">Invitation History</div>
            {invitations.length === 0 ? (
              <div className="user-empty">
                <div className="user-empty-text">No invitations sent yet.</div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {invitations.map((inv) => (
                  <div key={inv.id} className="user-sidebar-item">
                    <div className="user-sidebar-item-title">{inv.design.coupleName || "Untitled"}</div>
                    <div className="user-sidebar-item-text">
                      {inv.recipients.length} recipient(s)
                    </div>
                    <div className="user-sidebar-item-text">
                      {new Date(inv.sentAt).toLocaleDateString()}
                    </div>
                    <span className="user-badge user-badge-success" style={{ marginTop: "0.5rem", display: "inline-block" }}>{inv.status}</span>
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

