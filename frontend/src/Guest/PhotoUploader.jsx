// frontend/src/Guest/PhotoUploader.jsx
import React, { useState } from "react";
import axios from "axios";

export default function PhotoUploader() {
  const [coupleName, setCoupleName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      alert("Please choose a photo first.");
      return;
    }
    if (!coupleName.trim()) {
      alert("Please enter the couple's name.");
      return;
    }

    try {
      setBusy(true);

      const formData = new FormData();
      formData.append("coupleName", coupleName.trim());
      formData.append("guestName", guestName.trim());
      // field name MUST be "photos" because of upload.array("photos", ...)
      formData.append("photos", file);

      await axios.post(
        "http://localhost:5000/api/guests/events/photos",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Upload success!");
      setFile(null);
      setCoupleName("");
      setGuestName("");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="add-form-inner" onSubmit={handleSubmit}>
      {/* Couple name input */}
      <div className="field">
        <label>Couple's Name</label>
        <input
          type="text"
          placeholder="e.g., Emma & David"
          value={coupleName}
          onChange={(e) => setCoupleName(e.target.value)}
        />
      </div>

      {/* Guest name input */}
      <div className="field">
        <label>Your Name (optional)</label>
        <input
          type="text"
          placeholder="e.g., Yosr"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />
      </div>

      {/* File input */}
      <div className="field">
        <label>Photo file</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0] || null)}
        />
      </div>

      <button type="submit" disabled={busy}>
        {busy ? "Uploading…" : "Upload Photo"}
      </button>
    </form>
  );
}
