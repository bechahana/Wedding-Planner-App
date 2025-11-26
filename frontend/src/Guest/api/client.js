// src/Guest/api/client.js
import axios from "axios";

// In Create React App we use process.env.REACT_APP_*
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

// Base API client
const api = axios.create({
  baseURL: API_BASE_URL,
});

/* -----------------------------
   UPLOAD GUEST PHOTOS
------------------------------ */
export const uploadGuestPhotos = async (invitationId, files) => {
  const formData = new FormData();
  [...files].forEach((f) => formData.append("photos", f));

  const { data } = await api.post(
    `/guests/events/${invitationId}/photos`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return data; // { ok, count, ... }
};

/* -----------------------------
   SUBMIT GUEST PARKING INFO
------------------------------ */
export const submitGuestParking = async (invitationId, payload) => {
  const { data } = await api.post(
    `/guests/events/${invitationId}/parking`,
    payload
  );
  return data; // { ok: true, ... }
};

/* -----------------------------
   GET PARKING AVAILABILITY
------------------------------ */
export const getParkingAvailability = async () => {
  const { data } = await api.get("/guests/parking/availability");
  return data.available; // number
};

export default api;
