import axios from "axios";

// ── Axios instances ───────────────────────────────────────────────────────────

const appointmentAPI = axios.create({
  baseURL: "http://localhost:5005/api",
});

const doctorAPI = axios.create({
  baseURL: "http://localhost:5002/api",
});

// Attach JWT from localStorage to every outgoing request
const attachToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

appointmentAPI.interceptors.request.use(attachToken, (error) =>
  Promise.reject(error)
);
doctorAPI.interceptors.request.use(attachToken, (error) =>
  Promise.reject(error)
);

// ── Appointment Endpoints ─────────────────────────────────────────────────────

/** POST /api/appointments — Create a new appointment */
export const createAppointment = (data) =>
  appointmentAPI.post("/appointments", data);

/** GET /api/appointments/patient/:patientId — All appointments for a patient */
export const getPatientAppointments = (patientId) =>
  appointmentAPI.get(`/appointments/patient/${patientId}`);

/** GET /api/appointments/:id — Single appointment by ID */
export const getAppointmentById = (id) =>
  appointmentAPI.get(`/appointments/${id}`);

/** PUT /api/appointments/:id/status — Update appointment status */
export const updateAppointmentStatus = (id, status) =>
  appointmentAPI.put(`/appointments/${id}/status`, { status });

/** DELETE /api/appointments/:id — Cancel/delete an appointment */
export const deleteAppointment = (id) =>
  appointmentAPI.delete(`/appointments/${id}`);

// ── Notification Endpoints ────────────────────────────────────────────────────

/** GET /api/notifications/:userId — All notifications for a user */
export const getUserNotifications = (userId) =>
  appointmentAPI.get(`/notifications/${userId}`);

/** PUT /api/notifications/:id/read — Mark a notification as read */
export const markNotificationRead = (id) =>
  appointmentAPI.put(`/notifications/${id}/read`);

// ── Doctor Service ────────────────────────────────────────────────────────────

/**
 * getDoctors — Fetches doctors from the Doctor Management Service.
 * Falls back to mock data if the service is unavailable.
 */
export const getDoctors = async () => {
  try {
    const res = await doctorAPI.get("/doctors");
    return res;
  } catch {
    // Return mock data so the UI works independently
    return {
      data: [
        {
          _id: "DOC_001",
          name: "Dr. Kavinda Silva",
          specialty: "Cardiologist",
          experience: "12 years",
          rating: 4.9,
          fee: 2500,
          hospital: "National Hospital Colombo",
        },
        {
          _id: "DOC_002",
          name: "Dr. Nirmali Perera",
          specialty: "Cardiologist",
          experience: "8 years",
          rating: 4.7,
          fee: 2200,
          hospital: "Asiri Medical Hospital",
        },
        {
          _id: "DOC_003",
          name: "Dr. Wasantha Jayasinghe",
          specialty: "Dermatologist",
          experience: "15 years",
          rating: 4.8,
          fee: 3000,
          hospital: "Lanka Hospitals",
        },
      ],
    };
  }
};

// ── Helper: decode patient ID from JWT ───────────────────────────────────────

/** Extracts the user ID from the JWT stored in localStorage */
export const getPatientIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return "PATIENT_123";
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.id || decoded._id || "PATIENT_123";
  } catch {
    return "PATIENT_123";
  }
};
