import React, { useMemo, useState, useEffect } from "react";
import "../user-pages.css";

const STORAGE_KEY = "weddingAppointments";

function loadAppointments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveAppointments(appointments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

export default function BookAppointment({ onExit }) {
  const appointmentTypes = [
    { id: "venue_check", label: "Check Venue" },
    { id: "cake_tasting", label: "Taste Cake" }
  ];

  const vendors = useMemo(
    () => [
      {
        id: "venue_grandhall",
        name: "Grand Hall Venue",
        type: "venue_check",
        description: "Elegant ballroom in city center",
        slots: ["2025-11-10 10:00", "2025-11-10 13:00", "2025-11-12 16:00"]
      },
      {
        id: "venue_garden",
        name: "Garden Terrace Venue",
        type: "venue_check",
        description: "Outdoor venue with greenery",
        slots: ["2025-11-11 09:30", "2025-11-14 15:00"]
      },
      {
        id: "bakery_gourmet",
        name: "Gourmet Cakes",
        type: "cake_tasting",
        description: "Artisanal wedding cakes and tastings",
        slots: ["2025-11-09 11:00", "2025-11-15 14:30"]
      },
      {
        id: "bakery_casual",
        name: "Casual Bites Bakery",
        type: "cake_tasting",
        description: "Comfort cakes and frostings",
        slots: [] // demonstrate alternative flow: no slots
      }
    ],
    []
  );

  const [appointments, setAppointments] = useState(() => loadAppointments());
  const [selectedType, setSelectedType] = useState(appointmentTypes[0].id);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    saveAppointments(appointments);
  }, [appointments]);

  const filteredVendors = useMemo(
    () => vendors.filter((v) => v.type === selectedType),
    [vendors, selectedType]
  );

  const activeVendor = useMemo(
    () => filteredVendors.find((v) => v.id === selectedVendorId) || null,
    [filteredVendors, selectedVendorId]
  );

  function resetSelection() {
    setSelectedVendorId(null);
    setSelectedSlot(null);
    setConfirmation(null);
  }

  function handleConfirm() {
    if (!activeVendor || !selectedSlot) return;
    const newBooking = {
      id: `${activeVendor.id}_${selectedSlot}`,
      vendorId: activeVendor.id,
      vendorName: activeVendor.name,
      type: selectedType,
      slot: selectedSlot,
      createdAt: new Date().toISOString()
    };
    setAppointments((prev) => {
      const exists = prev.find((a) => a.id === newBooking.id);
      if (exists) return prev;
      return [...prev, newBooking];
    });
    setConfirmation(newBooking);
  }

  return (
    <div className="user-page">
      <div className="user-container">
        <div className="user-two-column">
          <div>
            <div className="user-header">
              <h2 className="user-title">Book Appointment</h2>
              <button onClick={onExit} className="user-btn-link">Exit</button>
            </div>

            <div className="user-nav">
              {appointmentTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedType(t.id); resetSelection(); }}
                  className={`user-nav-item ${selectedType === t.id ? "active" : ""}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {!activeVendor && (
              <div className="user-section">
                <p className="user-subtitle">Select a vendor</p>
                <div className="user-grid user-grid-2">
                  {filteredVendors.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVendorId(v.id)}
                      className="user-card"
                      style={{ textAlign: "left" }}
                    >
                      <div className="user-card-title">{v.name}</div>
                      <div className="user-card-description">{v.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeVendor && !confirmation && (
              <div className="user-section">
                <button onClick={resetSelection} className="user-back">← Back to Vendors</button>
                <h3 className="user-title" style={{ marginTop: "0.5rem" }}>{activeVendor.name}</h3>
                <p className="user-subtitle">{activeVendor.description}</p>

                {activeVendor.slots.length === 0 ? (
                  <div className="user-alert user-alert-warning">
                    No slots available. Please choose another vendor or change the appointment type to reschedule.
                  </div>
                ) : (
                  <div>
                    <div className="user-label" style={{ marginBottom: "1rem" }}>Select a time slot</div>
                    <div className="user-grid user-grid-3" style={{ marginBottom: "1.5rem" }}>
                      {activeVendor.slots.map((s) => (
                        <label
                          key={s}
                          className="user-card"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            cursor: "pointer",
                            background: selectedSlot === s ? "#f3e8ff" : "#fff",
                            borderColor: selectedSlot === s ? "#8b5cf6" : "#e5e5e5"
                          }}
                        >
                          <input
                            type="radio"
                            name="slot"
                            checked={selectedSlot === s}
                            onChange={() => setSelectedSlot(s)}
                            className="user-radio"
                            style={{ margin: 0 }}
                          />
                          <span>{s}</span>
                        </label>
                      ))}
                    </div>
                    <div>
                      <button
                        onClick={handleConfirm}
                        disabled={!selectedSlot}
                        className="user-btn"
                        style={{ opacity: selectedSlot ? 1 : 0.5, cursor: selectedSlot ? "pointer" : "not-allowed" }}
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {confirmation && (
              <div className="user-alert user-alert-success">
                <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Appointment Confirmed</div>
                <div style={{ marginBottom: "1rem" }}>
                  {confirmation.vendorName} — {confirmation.slot}
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button onClick={() => { resetSelection(); }} className="user-btn-secondary">Book another</button>
                  <button onClick={onExit} className="user-btn">Done</button>
                </div>
              </div>
            )}
          </div>

          <aside className="user-sidebar">
            <div className="user-sidebar-title">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Your Appointments</span>
                <span className="user-badge user-badge-info">{appointments.length}</span>
              </div>
            </div>
            {appointments.length === 0 ? (
              <div className="user-empty">
                <div className="user-empty-text">No appointments booked yet.</div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {appointments.map((a) => (
                  <div key={a.id} className="user-sidebar-item">
                    <div className="user-sidebar-item-title">{a.vendorName}</div>
                    <div className="user-sidebar-item-text">{a.slot}</div>
                    <div className="user-sidebar-item-text" style={{ marginTop: "0.25rem" }}>
                      Type: {a.type === "venue_check" ? "Check Venue" : a.type === "cake_tasting" ? "Taste Cake" : a.type}
                    </div>
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




