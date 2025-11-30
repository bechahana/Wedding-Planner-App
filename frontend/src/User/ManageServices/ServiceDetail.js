import React, { useEffect, useState } from "react";
import "../user-pages.css";
import api, { getServiceDetails } from "../../api/client";

export default function ServiceDetail({ service, onBack, onAddToPlan }) {
  const [availability, setAvailability] = useState([]);
  const [loadingAvail, setLoadingAvail] = useState(true);
  const [errorAvail, setErrorAvail] = useState("");

  // 🔹 derive backend base URL from axios baseURL (http://localhost:5000/api → http://localhost:5000)
  const apiBase = api.defaults.baseURL || "";
  const backendBase = apiBase.replace(/\/api\/?$/, "");

  useEffect(() => {
    if (!service) return;

    setLoadingAvail(true);

    getServiceDetails(service.id)
      .then((data) => {
        if (!data.ok) throw new Error("Failed to load");
        setAvailability(data.availability || []);
        setErrorAvail("");
      })
      .catch((err) => {
        console.error(err);
        setErrorAvail("Could not load availability");
      })
      .finally(() => setLoadingAvail(false));
  }, [service]);

  if (!service) {
    return (
      <div className="user-section">
        <button onClick={onBack} className="user-back">
          ← Back to Services
        </button>
        <p>No service selected.</p>
      </div>
    );
  }

  const openDates = availability.filter((d) => !d.is_booked);
  const hasAvailability = openDates.length > 0;

  let availabilityText = "Unavailable";

  if (loadingAvail) {
    availabilityText = "Checking...";
  } else if (errorAvail) {
    availabilityText = "Unavailable";
  } else if (availability.length === 0) {
    availabilityText = "Unavailable";
  } else if (hasAvailability) {
    availabilityText = openDates
      .map((d) => new Date(d.available_date).toLocaleDateString())
      .join(", ");
  } else {
    availabilityText = "Fully booked";
  }

  const canAddToPlan = true;

  const badgeClass =
    hasAvailability && !loadingAvail && !errorAvail
      ? "user-badge-success"
      : "user-badge-danger";

  // 🔹 first photo from listServices() result
  const firstPhoto =
    service.photos && service.photos.length > 0 ? service.photos[0] : null;

  // 🔹 build full URL to backend: http://localhost:5000/uploads/services/xxx.jpg
  const firstPhotoUrl =
    firstPhoto && firstPhoto.startsWith("http")
      ? firstPhoto
      : firstPhoto
      ? `${backendBase}${firstPhoto}`
      : null;

  return (
    <div className="user-section">
      <button onClick={onBack} className="user-back">
        ← Back to Services
      </button>

      <div className="user-card">
        <div
          className="user-grid user-grid-2"
          style={{ alignItems: "flex-start" }}
        >
          {/* LEFT: text, availability, button */}
          <div>
            <h2 className="user-title" style={{ marginTop: 0 }}>
              {service.name}
            </h2>

            <p className="user-subtitle" style={{ marginBottom: "1.5rem" }}>
              {service.description}
            </p>

            <div
              className="user-grid user-grid-3"
              style={{ marginBottom: "1.5rem" }}
            >
              <div>
                <div className="user-label">Price</div>
                <div
                  className="user-card-price"
                  style={{ fontSize: "1.5rem" }}
                >
                  ${service.price}
                </div>
              </div>

              <div>
                <div className="user-label">Availability</div>
                <div>
                  <span className={`user-badge ${badgeClass}`}>
                    {availabilityText}
                  </span>
                </div>
              </div>

              {service.capacity ? (
                <div>
                  <div className="user-label">Capacity</div>
                  <div
                    style={{ fontWeight: 600, fontSize: "1.1rem" }}
                  >
                    {service.capacity} guests
                  </div>
                </div>
              ) : null}
            </div>

            <div>
              <button
                onClick={() => onAddToPlan(service)}
                disabled={!canAddToPlan}
                className={`user-btn ${
                  canAddToPlan ? "user-btn-success" : ""
                }`}
                style={{
                  opacity: canAddToPlan ? 1 : 0.5,
                  cursor: canAddToPlan ? "pointer" : "not-allowed",
                }}
              >
                Add to Plan
              </button>
            </div>
          </div>

          {/* RIGHT: photo */}
          <div>
            {firstPhotoUrl && (
              <img
                src={firstPhotoUrl}
                alt={service.name}
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  height: "240px",
                  objectFit: "cover",
                  borderRadius: "16px",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



