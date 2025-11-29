import React, { useRef, useState } from "react";
import "./admin.css";
import { createService } from "../api/client"; // adjust path if needed

const SERVICE_TYPES = ["DJ", "Chef", "Cake Baker", "Florist", "Waiter", "Venue"];

export default function AddService() {
  const [type, setType] = useState("DJ");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [dates, setDates] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const fileInputRef = useRef(null);

  const isVenue = type === "Venue";

  const addDate = () => {
    if (!newDate) return;
    if (dates.includes(newDate)) {
      setAlert({ type: "warn", msg: "This date is already added." });
      return;
    }
    setDates((prev) => [...prev, newDate]);
    setNewDate("");
  };

  const removeDate = (d) => {
    setDates((prev) => prev.filter((x) => x !== d));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const all = [...files, ...newFiles];
    setFiles(all);
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews(all.map((f) => URL.createObjectURL(f)));
  };

  const removePhoto = (idx) => {
    const updated = files.filter((_, i) => i !== idx);
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles(updated);
    setPreviews(updated.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!name || !email || !price) {
      setAlert({
        type: "danger",
        msg: "Please fill in at least Name, Email and Price.",
      });
      return;
    }

    setSaving(true);

    try {
      const payload = {
        service_type: type,
        name,
        address,
        price,
        description: bio,
        phone_number: phone,
        email,
        capacity: isVenue ? capacity : undefined,
        dates,
        photos: files,
      };

      const res = await createService(payload);

      if (res.ok) {
        setAlert({ type: "ok", msg: "Service added successfully!" });

        // Reset Form
        setName("");
        setAddress("");
        setBio("");
        setPhone("");
        setEmail("");
        setPrice("");
        setCapacity("");
        setDates([]);
        setFiles([]);
        previews.forEach((url) => URL.revokeObjectURL(url));
        setPreviews([]);
        setType("DJ");
      } else {
        setAlert({
          type: "danger",
          msg: res.error || "Failed to save service.",
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({
        type: "danger",
        msg: "Unexpected error while saving service.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="panel">
      <h2>Add Service</h2>

      {alert && (
        <div className={`alert ${alert.type}`} style={{ marginBottom: 15 }}>
          {alert.msg}
        </div>
      )}

<form onSubmit={handleSubmit}>
        {/* TOP FIELDS IN TWO COLUMNS */}
        <div className="form-grid">
          {/* SERVICE TYPE */}
          <div className="field">
            <label className="label">Service Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {SERVICE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* NAME */}
          <div className="field">
            <label className="label">Service Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
            />
          </div>

          {/* ADDRESS */}
          <div className="field">
            <label className="label">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
            />
          </div>

          {/* PRICE */}
          <div className="field">
            <label className="label">Price (€)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </div>

          {/* CAPACITY FOR VENUE ONLY */}
          {isVenue && (
            <div className="field">
              <label className="label">Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Enter capacity"
              />
            </div>
          )}

          {/* PHONE */}
          <div className="field">
            <label className="label">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+49 123 456 789"
            />
          </div>

          {/* EMAIL */}
          <div className="field">
            <label className="label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>
        </div>

        {/* DESCRIPTION – FULL WIDTH */}
        <div className="field">
          <label className="label">Description</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Describe the service"
          />
        </div>

        {/* DATES – FULL WIDTH */}
                {/* DATES */}
                <div className="field">
          <label className="label">Available Dates</label>
          <div className="row">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-accent"
              onClick={addDate}
              style={{ minWidth: 0 }}  // so flex can shrink nicely
            >
              Add Date
            </button>
          </div>

          {dates.length > 0 && (
            <div className="date-grid" style={{ marginTop: 12 }}>
              {dates.map((d) => (
                <div key={d} className="date-pill">
                  {d}
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => removeDate(d)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PHOTOS – FULL WIDTH */}
        <div className="field">
          <label className="label">Upload Photos</label>
          <label className="uploader" htmlFor="photos">
            <input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div>Click or drag files here</div>
          </label>

          {previews.length > 0 && (
            <div className="preview-grid" style={{ marginTop: 10 }}>
              {previews.map((src, i) => (
                <div key={i} className="thumb">
                  <img src={src} alt={`Preview ${i + 1}`} />
                  <button
                    type="button"
                    className="remove"
                    onClick={() => removePhoto(i)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Service"}
        </button>
      </form>

    </div>
  );
}
