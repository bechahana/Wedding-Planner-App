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

export const loginAccount = (payload) =>
  api.post("/auth/login", payload).then((res) => res.data);

export const registerAccount = (payload) =>
  api.post("/auth/register", payload).then((res) => res.data);

/* -----------------------------
   ADMIN: CREATE SERVICE
------------------------------ */
export const createService = async (payload) => {
  const formData = new FormData();

  // Basic fields
  formData.append("service_type", payload.service_type);
  formData.append("name", payload.name || "");
  formData.append("address", payload.address || "");
  formData.append("price", payload.price || "");
  formData.append("description", payload.description || "");
  formData.append("phone_number", payload.phone_number || "");
  formData.append("email", payload.email || "");

  if (payload.capacity !== undefined) {
    formData.append("capacity", payload.capacity || "");
  }

  // Dates as JSON string
  if (Array.isArray(payload.dates)) {
    formData.append("dates", JSON.stringify(payload.dates));
  }

  // Photos
  if (Array.isArray(payload.photos)) {
    payload.photos.forEach((file) => {
      formData.append("photos", file);
    });
  }

  const { data } = await api.post("/services", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data; // { ok, serviceId }
};
/* -----------------------------
   ADMIN: LIST SERVICES
------------------------------ */
export const listServices = async (options = {}) => {
  // options can contain { service_type }
  const params = {};

  if (options.service_type && options.service_type !== "All") {
    params.service_type = options.service_type;
  }

  const { data } = await api.get("/services", { params });
  // data is { ok, services }
  return data.services || [];
};



export default api;
