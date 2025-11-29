import React, { useState, useEffect, useMemo } from "react";
import "../user-pages.css";
import { listVendorsWithSlots, bookAppointment, listUserAppointments } from "../../api/client";

// Mapping to match your DB service_type values
const APPOINTMENT_TYPE_TO_SERVICE_TYPE = {
  venue_check: "Venue",
  cake_tasting: "Cake Baker"
};

export default function BookAppointment({ onExit, userId }) {
  const appointmentTypes = [
    { id: "venue_check", label: "Check Venue" },
    { id: "cake_tasting", label: "Taste Cake" },
  ];

  const [vendors, setVendors] = useState([]);
  const [selectedType, setSelectedType] = useState(appointmentTypes[0].id);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [error, setError] = useState("");

  // Fetch vendors when appointment type changes (with fixed mapping)
  useEffect(() => {
    setLoadingVendors(true);
    setVendors([]);
    setSelectedVendorId(null);
    setSelectedSlot(null);
    setConfirmation(null);
    setError("");
    const serviceType = APPOINTMENT_TYPE_TO_SERVICE_TYPE[selectedType];
    listVendorsWithSlots(serviceType)
      .then((res) => setVendors(res))
      .catch(() => setError("Could not load vendors."))
      .finally(() => setLoadingVendors(false));
  }, [selectedType]);

  useEffect(() => {
    if (userId) listUserAppointments(userId).then(setAppointments);
  }, [confirmation, userId]);

  const filteredVendors = vendors;
  const activeVendor = useMemo(
    () => filteredVendors.find((v) => v.id === selectedVendorId) || null,
    [filteredVendors, selectedVendorId]
  );

  function resetSelection() {
    setSelectedVendorId(null);
    setSelectedSlot(null);
    setConfirmation(null);
    setError("");
  }

  async function handleConfirm() {
    if (!activeVendor || !selectedSlot) return;
    setLoadingBooking(true);
    setError("");
    try {
      const payload = {
        service_id: activeVendor.id,
        appointment_type: selectedType,
        start_datetime: selectedSlot,
      };
      const res = await bookAppointment({ ...payload, user_id: userId });
      if (res.ok) {
        setConfirmation({ vendorName: activeVendor.name, slot: selectedSlot });
      } else {
        setError(res.error || "Booking failed.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.error || err.message || "Could not book appointment."
      );
    } finally {
      setLoadingBooking(false);
    }
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
                  onClick={() => {
                    setSelectedType(t.id);
                    resetSelection();
                  }}
                  className={`user-nav-item ${selectedType === t.id ? "active" : ""}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {error && (
              <div className="user-alert user-alert-danger">{error}</div>
            )}
            {loadingVendors ? (
              <div className="user-section">Loading vendors...</div>
            ) : !activeVendor && (
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
                {(!activeVendor.slots || activeVendor.slots.length === 0) ? (
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
                          style={
                            {
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                              cursor: "pointer",
                              background: selectedSlot === s ? "#f3e8ff" : "#fff",
                              borderColor: selectedSlot === s ? "#8b5cf6" : "#e5e5e5"
                            }
                          }
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
                        disabled={!selectedSlot || loadingBooking}
                        className="user-btn"
                        style={{ opacity: selectedSlot ? 1 : 0.5, cursor: selectedSlot ? "pointer" : "not-allowed" }}
                      >
                        {loadingBooking ? "Confirming..." : "Confirm Booking"}
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
                  <button onClick={resetSelection} className="user-btn-secondary">Book another</button>
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
                    <div className="user-sidebar-item-title">{a.vendor_name || a.vendorName || a.name}</div>
                    <div className="user-sidebar-item-text">{a.start_datetime || a.slot}</div>
                    <div className="user-sidebar-item-text" style={{ marginTop: "0.25rem" }}>
                      Type: {a.appointment_type || a.type}
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




