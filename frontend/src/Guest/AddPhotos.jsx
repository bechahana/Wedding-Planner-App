import { useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


export default function AddPhotos() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [coupleName, setCoupleName] = useState("");
  const [guestName, setGuestName] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0] || null);
  };

  const handleUpload = async () => {
    if (!coupleName.trim()) {
      alert("Please enter the couple's name.");
      return;
    }

    if (!selectedFile) {
      alert("Please choose a photo first.");
      return;
    }

    const formData = new FormData();
    // MUST match backend field names:
    // router.post("/photos", upload.array("photos", 10) ...)
    formData.append("coupleName", coupleName.trim());
    formData.append("guestName", guestName.trim());
    formData.append("photos", selectedFile);

    try {
      await axios.post(
        "http://localhost:5000/api/guests/events/photos",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Photo uploaded successfully!");
      setSelectedFile(null);
      setCoupleName("");
      setGuestName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  const pageStyle = `
    body {
      background: #fcf7fa;
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .guest-upload-page {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px 16px;
    }

    .guest-upload-card {
      width: 100%;
      max-width: 520px;
      background: #ffffff;
      border-radius: 24px;
      box-shadow: 0 14px 35px rgba(0, 0, 0, 0.09);
      padding: 36px 32px 32px;
      text-align: center;
      animation: fadeIn 0.35s ease;
    }

    .guest-upload-title {
      font-size: 26px;
      font-weight: 700;
      color: #b03386;
      margin-bottom: 6px;
    }

    .guest-upload-subtitle {
      font-size: 18px;
      color: #7a4ba1;
      margin-bottom: 18px;
    }

    .guest-upload-desc {
      font-size: 15px;
      color: #555;
      margin-bottom: 26px;
    }

    .guest-upload-label {
      display: block;
      text-align: left;
      font-size: 14px;
      font-weight: 500;
      color: #5a4c73;
      margin-bottom: 6px;
    }

    /* Hide native browser file input */
    .guest-upload-input-hidden {
      display: none;
    }

    /* Custom pretty file selector */
    .guest-upload-input-fake {
      width: 100%;
      padding: 10px 14px;
      border-radius: 12px;
      border: 1px solid #e0d5f4;
      background: #faf8ff;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    }

    .guest-upload-input-fake:hover {
      border-color: #c0abea;
      background: #f4f0ff;
      box-shadow: 0 0 0 2px rgba(192, 171, 234, 0.25);
    }

    .guest-upload-input-btn {
      padding: 6px 12px;
      border-radius: 999px;
      background: #b872d9;
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
    }

    .guest-upload-input-text {
      font-size: 14px;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .guest-upload-btn {
      margin-top: 22px;
      width: 100%;
      padding: 13px 0;
      border-radius: 14px;
      border: none;
      background: linear-gradient(90deg, #b872d9, #a246c7);
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }

    .guest-upload-btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Simple text inputs above file selector */
    .guest-upload-text-input {
      width: 100%;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid #e0d5f4;
      background: #faf8ff;
      font-size: 14px;
      margin-bottom: 10px;
      box-sizing: border-box;
    }
  `;

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <style>{pageStyle}</style>

      <div className="guest-upload-page">
        <div className="guest-upload-card">
          <h1 className="guest-upload-title">Guest — Add Photos</h1>
          <h2 className="guest-upload-subtitle">Share Wedding Photos</h2>
          <p className="guest-upload-desc">
            Upload your favorite moments for the couple!
          </p>

          {/* Couple name + guest name */}
          <input
            className="guest-upload-text-input"
            type="text"
            placeholder="Couple's name e.g. Emma & David"
            value={coupleName}
            onChange={(e) => setCoupleName(e.target.value)}
          />
          <input
            className="guest-upload-text-input"
            type="text"
            placeholder="Your name (optional)"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />

          {/* Hidden real input */}
          <input
            ref={fileInputRef}
            id="photo-input"
            type="file"
            accept="image/*"
            className="guest-upload-input-hidden"
            onChange={handleFileChange}
          />

          {/* Custom file selector */}
          <div className="guest-upload-input-fake" onClick={triggerFileSelect}>
            <span className="guest-upload-input-btn">Choose a file</span>
            <span className="guest-upload-input-text">
              {selectedFile ? selectedFile.name : "No file selected"}
            </span>
          </div>

          <button className="guest-upload-btn" onClick={handleUpload}>
            Upload Photo
          </button>
           <Link
  to="/album"
  style={{
    display: "block",
    marginTop: "18px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#b03386",
    textDecoration: "none"
  }}
>
  📸 View Album
</Link>
        </div>
      </div>
    </>
    
  );


}
