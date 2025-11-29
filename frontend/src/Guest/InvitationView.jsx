import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getInvitationById } from "../api/client";
import "../global.css";

export default function InvitationView() {
  const { id } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInvitation() {
      try {
        setLoading(true);
        const data = await getInvitationById(id);
        setInvitation(data);
      } catch (err) {
        setError(err?.response?.data?.error || "Invitation not found");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchInvitation();
  }, [id]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <div style={{ color: "white", fontSize: "1.5rem" }}>Loading invitation...</div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <div style={{ 
          background: "white", 
          padding: "2rem", 
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <h2 style={{ color: "#dc2626", marginBottom: "1rem" }}>Invitation Not Found</h2>
          <p>{error || "The invitation you're looking for doesn't exist."}</p>
        </div>
      </div>
    );
  }

  // Parse the message JSON to get design details
  let design = {
    template: "elegant",
    primaryColor: "#8b5cf6",
    secondaryColor: "#f3e8ff",
    coupleName: "",
    eventDate: "",
    eventTime: "",
    venueName: invitation.venue_name || invitation.venue_address || ""
  };

  try {
    if (invitation.message) {
      const parsed = JSON.parse(invitation.message);
      design = { ...design, ...parsed };
    }
  } catch (e) {
    console.error("Failed to parse invitation message:", e);
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: design.secondaryColor || "#f3e8ff",
      padding: "2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        maxWidth: "600px",
        width: "100%",
        background: "white",
        borderRadius: "20px",
        padding: "3rem",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        textAlign: "center"
      }}>
        {/* Decorative border */}
        <div style={{
          border: `3px solid ${design.primaryColor || "#8b5cf6"}`,
          borderRadius: "16px",
          padding: "2.5rem",
          background: "white"
        }}>
          {/* Couple Name */}
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: 600,
            color: design.primaryColor || "#8b5cf6",
            marginBottom: "1rem",
            fontFamily: "serif"
          }}>
            {design.coupleName || "You're Invited!"}
          </h1>

          {/* Invitation Text */}
          <div style={{
            fontSize: "1.2rem",
            color: "#666",
            marginBottom: "2rem",
            fontStyle: "italic"
          }}>
            You're Cordially Invited
          </div>

          {/* Event Details */}
          <div style={{
            fontSize: "1.1rem",
            color: "#333",
            marginBottom: "1rem",
            lineHeight: "1.8"
          }}>
            {design.eventDate && (
              <div style={{ marginBottom: "0.5rem" }}>
                📅 <strong>Date:</strong> {new Date(design.eventDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            )}
            {design.eventTime && (
              <div style={{ marginBottom: "0.5rem" }}>
                ⏰ <strong>Time:</strong> {design.eventTime}
              </div>
            )}
            {design.venueName && (
              <div style={{ marginBottom: "0.5rem" }}>
                📍 <strong>Venue:</strong> {design.venueName}
              </div>
            )}
            {invitation.venue_address && (
              <div style={{ marginBottom: "0.5rem", fontSize: "0.95rem", color: "#666" }}>
                {invitation.venue_address}
              </div>
            )}
          </div>

          {/* Recipient Info */}
          <div style={{
            marginTop: "2rem",
            paddingTop: "2rem",
            borderTop: `1px solid ${design.secondaryColor || "#f3e8ff"}`,
            fontSize: "0.9rem",
            color: "#666"
          }}>
            <div>To: {invitation.recipient_name || invitation.recipient_email}</div>
          </div>

          {/* Decorative Element */}
          <div style={{
            marginTop: "2rem",
            fontSize: "2rem"
          }}>
            💐
          </div>
        </div>
      </div>
    </div>
  );
}

