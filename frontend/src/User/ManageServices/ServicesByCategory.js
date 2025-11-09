import React from "react";
import "../user-pages.css";

export default function ServicesByCategory({ category, services, onBack, onViewDetails, onToggleCompare, compareSet }) {
  return (
    <div className="user-section">
      <button onClick={onBack} className="user-back">← Back to Categories</button>
      <h2 className="user-title">{category.name}</h2>
      <p className="user-subtitle">{category.description}</p>

      <div className="user-grid user-grid-2">
        {services.map((svc) => (
          <div key={svc.id} className="user-card">
            <div className="user-card-title">{svc.name}</div>
            <div className="user-card-description">{svc.description}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", marginBottom: "1rem" }}>
              <div className="user-card-price">${svc.price}</div>
              <span className={`user-badge ${svc.available ? "user-badge-success" : "user-badge-danger"}`}>
                {svc.available ? "Available" : "Unavailable"}
              </span>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <button onClick={() => onViewDetails(svc)} className="user-btn user-btn-small">View Details</button>
              <label className="user-checkbox" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  checked={compareSet.has(svc.id)}
                  onChange={() => onToggleCompare(svc)}
                />
                Compare
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


