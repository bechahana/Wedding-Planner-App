// src/components/Album.jsx
//this is the new file conatin the fronetend page which everyguest can unter the couple name and get all the images related to that couple 
import React, { useState } from "react";
import './album.css';  // Adjust the path if necessary

import axios from "axios";

export default function WeddingAlbum() {
  const [coupleName, setCoupleName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);

const fetchPhotos = async () => {
  try {
    // Get the API URL from the environment variable
    const apiUrl = process.env.REACT_APP_API_URL;

    const response = await axios.get(
      `${apiUrl}/api/wedding/photos?couple_name=${coupleName}`
    );
    setPhotos(response.data);
    setError(null); // Clear any previous errors
  } catch (err) {
    setError("Failed to fetch photos.");
    setPhotos([]);  // Clear previous photos
  }
};


  return (
    <div>
      <h2>Wedding Album</h2>

      <input
        type="text"
        placeholder="Enter couple's name"
        value={coupleName}
        onChange={(e) => setCoupleName(e.target.value)}
      />
      <button onClick={fetchPhotos}>Show Album</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {photos.length > 0 ? (
        <div>
          <h3>Album of {coupleName}</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {photos.map((photo) => (
              <div key={photo.photo_url} style={{ width: "200px" }}>
                <img
                  src={`http://localhost:5000/${photo.photo_url}`}
                  alt="Wedding"
                  style={{ width: "100%" }}
                />
                <p>Uploaded by: {photo.uploaded_by}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No photos found for this couple.</p>
      )}
    </div>
  );
}
