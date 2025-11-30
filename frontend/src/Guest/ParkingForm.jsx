// src/Guest/ParkingForm.jsx
import { useState, useEffect } from "react";
import { submitGuestParking, getParkingAvailability } from "../api/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ParkingForm({ invitationId }) {
  const [availableSpots, setAvailableSpots] = useState("");
  const [note, setNote] = useState("");
  const [weddingPlace, setWeddingPlace] = useState("");
  const [weddingTime, setWeddingTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [parkingLeft, setParkingLeft] = useState(null); // you can show this later if you want

  // Fetch current parking availability (optional info for later use)
  useEffect(() => {
    async function fetchAvailability() {
      try {
        const available = await getParkingAvailability();
        setParkingLeft(available);
      } catch (err) {
        console.error("Failed to fetch availability", err);
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

      // ✅ Success toast – auto hides thanks to ToastContainer autoClose
      toast.success(
        "Thank you! Your form has been submitted. We will inform you about the available parking places."
      );

      // Clear form
      setAvailableSpots("");
      setNote("");
      setWeddingPlace("");
      setWeddingTime("");

      // Refresh availability (optional)
      const updated = await getParkingAvailability();
      setParkingLeft(updated);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Sorry, something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  const style = `
    .parking-wrapper {
      max-width: 620px;
      margin: 40px auto;
      padding: 0 16px 40px;
      font-family: 'Inter', sans-serif;
    }

    .parking-card {
      background: white;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.08);
      animation: fadeIn 0.35s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .parking-title {
      font-size: 22px;
      font-weight: 700;
      color: #b03386;
      text-align: left;
      margin-bottom: 25px;
    }

    .parking-field {
      margin-bottom: 18px;
      display: flex;
      flex-direction: column;
    }

    .parking-label {
      margin-bottom: 6px;
      color: #514369;
      font-weight: 500;
      font-size: 14px;
    }

    .parking-input,
    .parking-textarea {
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid #e0d5f4;
      background: #faf8ff;
      font-size: 14px;
      transition: 0.2s;
    }

    .parking-input:focus,
    .parking-textarea:focus {
      border-color: #c0abea;
      background: #f4f0ff;
      outline: none;
      box-shadow: 0 0 0 2px rgba(192,171,234,0.25);
    }

    .parking-row {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    @media (min-width: 640px) {
      .parking-row {
        flex-direction: row;
      }
      .parking-row .parking-field {
        flex: 1;
      }
    }

    .submit-btn {
      width: 100%;
      margin-top: 15px;
      padding: 13px 0;
      border-radius: 14px;
      border: none;
      background: linear-gradient(90deg, #b872d9, #a246c7);
      color: white;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      transition: 0.25s;
    }

    .submit-btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: default;
    }
  `;

  return (
    <>
      <style>{style}</style>

      <div className="parking-wrapper">
        <form className="parking-card" onSubmit={onSubmit}>
          <h2 className="parking-title">Inform Parking Capacity</h2>

          <div className="parking-field">
            <label className="parking-label">Wedding Place Name</label>
            <input
              className="parking-input"
              type="text"
              placeholder="e.g., Grand Palace Hotel, Garden Venue…"
              value={weddingPlace}
              onChange={(e) => setWeddingPlace(e.target.value)}
              required
            />
          </div>

          <div className="parking-row">
            <div className="parking-field">
              <label className="parking-label">Wedding Date & Time</label>
              <input
                className="parking-input"
                type="datetime-local"
                value={weddingTime}
                onChange={(e) => setWeddingTime(e.target.value)}
                required
              />
            </div>

            <div className="parking-field">
              <label className="parking-label">Number of Cars</label>
              <input
                className="parking-input"
                type="number"
                min="0"
                placeholder="e.g., 4"
                value={availableSpots}
                onChange={(e) => setAvailableSpots(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="parking-field">
            <label className="parking-label">Note</label>
            <textarea
              className="parking-textarea"
              placeholder="Describe location, timing, or constraints…"
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button className="submit-btn" disabled={busy} type="submit">
            {busy ? "Sending…" : "Submit"}
          </button>
        </form>

        {/* Toast popup – autoClose=3000 makes it disappear after 3 seconds */}
        <ToastContainer position="top-right" autoClose={false} />
      </div>
    </>
  );
}
