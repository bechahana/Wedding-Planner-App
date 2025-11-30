// src/Guest/album.jsx
import React, { useState } from "react";
import "./album.css";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000"; // 🔒 backend where server.js runs

export default function WeddingAlbum() {
  const [coupleName, setCoupleName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/wedding/photos`, {
        params: { couple_name: coupleName }, // ✅ handles spaces and '&'
      });

      setPhotos(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch photos.");
      setPhotos([]);
    }
  };

  return (
    <div className="album-center-wrapper">
      <div className="album-center-box">
        {/* small top spacing */}
        <div style={{ height: "10px" }}></div>

        <input
          className="album-center-input"
          type="text"
          placeholder="Couple's name"
          value={coupleName}
          onChange={(e) => setCoupleName(e.target.value)}
        />

        {/* space between input and button */}
        <div style={{ height: "10px" }}></div>

        <button className="album-center-btn" onClick={fetchPhotos}>
          Show Album
        </button>

        {error && <p className="album-center-error">{error}</p>}

        {photos.length > 0 ? (
          <div className="album-gallery-wrapper">
            <div className="album-gallery">
              {photos.map((photo) => (
                <div className="album-photo-card" key={photo.photo_url}>
                  <img
                    src={`${BACKEND_URL}/${photo.photo_url}`}
                    alt="Wedding"
                  />
                  
                </div>
              ))}
            </div>
          </div>
        ) : (
          !error && (
            <div className="album-center-empty">
              No photos found for this couple yet. Try another name or ask the
              guests to upload some memories. 🌸
            </div>
          )
        )}
      </div>
    </div>
  );
}
