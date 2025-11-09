import React from "react";
import "../user-pages.css";

export default function ServiceDetail({ service, onBack, onAddToPlan }) {
  if (!service) return null;

  return (
    <div className="user-section">
      <button onClick={onBack} className="user-back">← Back to Services</button>
      <div className="user-card">
        <h2 className="user-title" style={{ marginTop: 0 }}>{service.name}</h2>
        <p className="user-subtitle" style={{ marginBottom: "1.5rem" }}>{service.description}</p>
        <div className="user-grid user-grid-3" style={{ marginBottom: "1.5rem" }}>
          <div>
            <div className="user-label">Price</div>
            <div className="user-card-price" style={{ fontSize: "1.5rem" }}>${service.price}</div>
          </div>
          <div>
            <div className="user-label">Availability</div>
            <div>
              <span className={`user-badge ${service.available ? "user-badge-success" : "user-badge-danger"}`}>
                {service.available ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>
          {service.capacity ? (
            <div>
              <div className="user-label">Capacity</div>
              <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>{service.capacity} guests</div>
            </div>
          ) : null}
        </div>

        <div>
          <button
            onClick={() => onAddToPlan(service)}
            disabled={!service.available}
            className={`user-btn ${service.available ? "user-btn-success" : ""}`}
            style={{ opacity: service.available ? 1 : 0.5, cursor: service.available ? "pointer" : "not-allowed" }}
          >
            Add to Plan
          </button>
        </div>
      </div>
    </div>
  );
}


