// src/components/PhotoUploader.jsx
import { useState } from "react";
import { uploadGuestPhotos } from "./api/client";

export default function PhotoUploader({ invitationId }) {
  const [coupleName, setCoupleName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setStatus(`📸 ${selected.length} photo(s) selected for ${coupleName || "this wedding"}`);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!files.length) {
      setError("Please select at least one photo.");
      return;
    }

    try {
      setIsUploading(true);

      // Call our API client – this builds the URL:
      // POST {VITE_API_BASE_URL}/guests/events/:invitationId/photos
      const result = await uploadGuestPhotos(invitationId, files);

      setStatus(
        `✅ Upload success! ${result?.count || files.length} photo(s) uploaded for ${coupleName || "this wedding"}.`
      );
      setFiles([]);
    } catch (err) {
      console.error("Upload failed:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Unknown error while uploading";

      setError(`Upload failed: ${msg}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <label>Couple&apos;s Name:</label>
      <input
        type="text"
        placeholder="e.g., Emma & Liam"
        value={coupleName}
        onChange={(e) => setCoupleName(e.target.value)}
      />

      <label>Your Name:</label>
      <input
        type="text"
        placeholder="Enter your name"
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
      />

      <label>Select Photos:</label>
      <input type="file" multiple onChange={handleFilesChange} />

      <button className="btn-upload" type="submit" disabled={isUploading}>
        {isUploading ? "Uploading…" : "Upload Photos"}
      </button>

      {status && <p className="status-badge">{status}</p>}
      {error && (
        <p style={{ color: "#d32f2f", marginTop: "8px", fontSize: "0.95rem" }}>
          ❌ {error}
        </p>
      )}
    </form>
  );
}
