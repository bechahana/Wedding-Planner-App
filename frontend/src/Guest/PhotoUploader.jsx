// PhotoUploader.jsx
import React, { useState } from "react";
import axios from "axios";

const PhotoUploader = ({ invitationId }) => {
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!photo) {
      setMessage("Please select a photo to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("invitationId", invitationId);

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/guests/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Upload successful! ✨");
      setPhoto(null);
    } catch (err) {
      setMessage("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const isError =
    message.toLowerCase().includes("fail") ||
    message.toLowerCase().includes("please");

  return (
    <div className="add-form-inner">
      {message && (
        <div
          className="status-badge"
          style={isError ? { background: "#ffe6e6", color: "#c0392b" } : {}}
        >
          {message}
        </div>
      )}

      <label className="upload-label" htmlFor="photo-input">
        Photo file
      </label>

      <div className="upload-dropzone">
        <div className="upload-icon">📷</div>
        <div className="upload-copy">
          <span className="upload-title">
            {photo ? photo.name : "Click to choose a photo"}
          </span>
          <span className="upload-subtitle">
            JPG / PNG – max ~10 MB
          </span>
        </div>
        {/* real input is invisible but clickable */}
        <input
          id="photo-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <button
        type="button"
        className="btn-upload"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading…" : "Upload Photo"}
      </button>
    </div>
  );
};

export default PhotoUploader;
