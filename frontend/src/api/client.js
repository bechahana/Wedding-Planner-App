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

// ADMIN: CREATE SERVICE
export const createService = async (serviceData) => {
  const formData = new FormData();

  formData.append("service_type", serviceData.service_type);
  formData.append("name", serviceData.name);
  formData.append("address", serviceData.address || "");
  formData.append("price", serviceData.price);
  formData.append("description", serviceData.description || "");
  formData.append("phone_number", serviceData.phone_number || "");
  formData.append("email", serviceData.email);

  if (serviceData.capacity) {
    formData.append("capacity", serviceData.capacity);
  }

  formData.append(
    "dates",
    JSON.stringify(Array.isArray(serviceData.dates) ? serviceData.dates : [])
  );

  if (Array.isArray(serviceData.photos)) {
    serviceData.photos.forEach((file) => {
      formData.append("photos", file); // MUST be "photos" to match upload.array("photos")
    });
  }

  try {
    const res = await api.post("/services", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("createService error:", err.response?.data || err.message);
    throw err; // so AddService catches and shows the red alert
  }
};

/* -----------------------------
   LIST SERVICES (admin + user)
------------------------------ */
export const listServices = async (options = {}) => {
  const params = {};

  // options.service_type should be exactly one of:
  // "DJ", "Chef", "Cake Baker", "Florist", "Waiter", "Venue"
  if (options.service_type && options.service_type !== "All") {
    params.service_type = options.service_type;
  }

  const { data } = await api.get("/services", { params });
  return Array.isArray(data.services) ? data.services : [];
};

export const listVendorsWithSlots = async (appointmentType) => {
  const { data } = await api.get("/appointments/vendors", {
    params: { type: appointmentType }
  });
  return Array.isArray(data.vendors) ? data.vendors : [];
};

export const bookAppointment = async (details) => {
  const { data } = await api.post("/appointments", details);
  return data;
};

export const listUserAppointments = async (user_id) => {
  const { data } = await api.get("/appointments/my", { params: { user_id } });
  return Array.isArray(data.appointments) ? data.appointments : [];
};
// If you want a “user-named” alias:
export const listServicesForUser = listServices;


export const sendInvitations = async (venue_id, invitations, message, sender_id) => {
  const { data } = await api.post("/invitations", {
    sender_id,
    venue_id,
    invitations,
    message
  });
  return data;
};

export const listUserInvitations = async (sender_id) => {
  const { data } = await api.get("/invitations/my", { params: { sender_id } });
  return Array.isArray(data.invitations) ? data.invitations : [];
};

export const getInvitationById = async (id) => {
  const { data } = await api.get(`/invitations/${id}`);
  return data.invitation;
};


export default api;
