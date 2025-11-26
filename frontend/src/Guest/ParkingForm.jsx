import { useState, useEffect } from "react";
import { submitGuestParking, getParkingAvailability } from "./api/client";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

export default function ParkingForm({ invitationId }) {
  const [availableSpots, setAvailableSpots] = useState("");
  const [note, setNote] = useState("");
  const [weddingPlace, setWeddingPlace] = useState("");
  const [weddingTime, setWeddingTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [parkingLeft, setParkingLeft] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch real-time parking availability
  useEffect(() => {
    async function fetchAvailability() {
      try {
        const available = await getParkingAvailability();
        setParkingLeft(available);
      } catch (err) {
        console.error("Failed to fetch availability");
      }
    }
    fetchAvailability();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      await submitGuestParking(invitationId, {
        availableSpots: availableSpots === "" ? null : Number(availableSpots),
        note: note.trim() || null,
        weddingPlace: weddingPlace.trim() || null,
        weddingTime: weddingTime.trim() || null,
      });

      toast.success("Thanks! Your parking info has been recorded.");
      setModalOpen(true);

      // Reset form
      setAvailableSpots("");
      setNote("");
      setWeddingPlace("");
      setWeddingTime("");

      // Refresh availability
      const updated = await getParkingAvailability();
      setParkingLeft(updated);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submission failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <form className="card" onSubmit={onSubmit}>
        <h2 className="card-title">Inform Parking Capacity</h2>

        {parkingLeft !== null && (
          <p className="status">🅿️ Available parking spots: {parkingLeft}</p>
        )}

        <label>
          Wedding Place Name
          <input
            type="text"
            placeholder="e.g., Grand Palace Hotel, Garden Venue..."
            value={weddingPlace}
            onChange={(e) => setWeddingPlace(e.target.value)}
          />
        </label>

        <label>
          Wedding Date & Time
          <input
            type="datetime-local"
            value={weddingTime}
            onChange={(e) => setWeddingTime(e.target.value)}
          />
        </label>

        <label>
          Number of Cars
          <input
            type="number"
            min="0"
            placeholder="e.g., 4"
            value={availableSpots}
            onChange={(e) => setAvailableSpots(e.target.value)}
          />
        </label>

        <label>
          Note
          <textarea
            rows="3"
            placeholder="Describe location, timing, or constraints…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>

        <button type="submit" disabled={busy}>
          {busy ? "Sending…" : "Submit"}
        </button>
      </form>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Confirmation modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Confirmation"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>🎉 Submission Successful</h2>
        <p>Your parking details have been saved. Thank you!</p>
        <button onClick={() => setModalOpen(false)}>Close</button>
      </Modal>
    </div>
  );
}
