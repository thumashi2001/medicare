import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for internal navigation
import axios from "axios";

const DOCTOR_API = "http://localhost:5003";

export default function DoctorAppointmentsPage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // Initialize navigation hook

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState("");

  const authHeaders = {
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${DOCTOR_API}/api/doctors/appointments`, {
        headers: authHeaders
      });

      setAppointments(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, action) => {
    setProcessingId(appointmentId);
    setError("");
    setMessage("");

    try {
      await axios.put(
        `${DOCTOR_API}/api/doctors/appointments/${appointmentId}/${action}`,
        {},
        { headers: authHeaders }
      );

      setMessage(
        action === "accept"
          ? "Appointment accepted successfully."
          : "Appointment rejected successfully."
      );

      fetchAppointments();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${action} appointment.`
      );
    } finally {
      setProcessingId("");
    }
  };

  // Updated to use React Router navigation instead of window.open
  const joinConsultation = (appointmentId) => {
    navigate(`/video-room/${appointmentId}`);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerCard}>
        <p style={styles.tag}>Appointment Requests</p>
        <h2 style={styles.headerTitle}>Manage Appointments</h2>
        <p style={styles.headerText}>
          Review incoming appointment requests and accept or reject them based on your availability.
        </p>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Your Appointments</h3>

        {error ? <div style={styles.error}>{error}</div> : null}
        {message ? <div style={styles.success}>{message}</div> : null}

        {loading ? (
          <p style={styles.text}>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p style={styles.text}>No appointments found.</p>
        ) : (
          <div style={styles.appointmentList}>
            {appointments.map((appointment) => {
              const isPending = appointment.status === "pending";
              const isAccepted = appointment.status === "accepted";
              const isProcessing = processingId === appointment._id;

              return (
                <div key={appointment._id} style={styles.appointmentCard}>
                  <div style={styles.cardTop}>
                    <div>
                      <div style={styles.patientText}>
                        Patient: {appointment.patientId}
                      </div>
                      <div style={styles.metaText}>
                        Date: {appointment.date} | Time: {appointment.time}
                      </div>
                      <div style={styles.metaText}>
                        Appointment ID: {appointment._id}
                      </div>
                    </div>

                    <span
                      style={{
                        ...styles.statusBadge,
                        ...(appointment.status === "accepted"
                          ? styles.acceptedBadge
                          : appointment.status === "rejected"
                          ? styles.rejectedBadge
                          : styles.pendingBadge)
                      }}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <div style={styles.actionRow}>
                    <button
                      onClick={() => updateAppointmentStatus(appointment._id, "accept")}
                      style={{
                        ...styles.acceptButton,
                        opacity: !isPending || isProcessing ? 0.6 : 1,
                        cursor: !isPending || isProcessing ? "not-allowed" : "pointer"
                      }}
                      disabled={!isPending || isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Accept"}
                    </button>

                    <button
                      onClick={() => updateAppointmentStatus(appointment._id, "reject")}
                      style={{
                        ...styles.rejectButton,
                        opacity: !isPending || isProcessing ? 0.6 : 1,
                        cursor: !isPending || isProcessing ? "not-allowed" : "pointer"
                      }}
                      disabled={!isPending || isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Reject"}
                    </button>

                    {isAccepted ? (
                      <button
                        onClick={() => joinConsultation(appointment._id)}
                        style={styles.joinButton}
                      >
                        Join Consultation
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  headerCard: {
    background: "linear-gradient(135deg, #2ecc71 0%, #3498db 100%)",
    color: "#fff",
    padding: "28px",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(52, 152, 219, 0.18)"
  },
  tag: {
    margin: 0,
    fontWeight: "700",
    opacity: 0.95
  },
  headerTitle: {
    margin: "8px 0 10px",
    fontSize: "32px"
  },
  headerText: {
    margin: 0,
    maxWidth: "760px",
    lineHeight: "1.7",
    opacity: 0.95
  },
  card: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "22px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.06)"
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "18px",
    color: "#243445"
  },
  appointmentList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  appointmentCard: {
    padding: "18px",
    borderRadius: "16px",
    background: "#f8fbff",
    border: "1px solid #e7eef7"
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "center",
    marginBottom: "14px"
  },
  patientText: {
    fontWeight: "700",
    color: "#243445",
    marginBottom: "6px"
  },
  metaText: {
    color: "#6b7b8c",
    fontSize: "14px"
  },
  statusBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "capitalize"
  },
  pendingBadge: {
    background: "#fff7e6",
    color: "#c27a00"
  },
  acceptedBadge: {
    background: "#edfdf3",
    color: "#1f8f55"
  },
  rejectedBadge: {
    background: "#fff3f2",
    color: "#d64541"
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  acceptButton: {
    border: "none",
    background: "#2ecc71",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "12px",
    fontWeight: "600"
  },
  rejectButton: {
    border: "none",
    background: "#e74c3c",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "12px",
    fontWeight: "600"
  },
  joinButton: {
    border: "none",
    background: "#3498db",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer"
  },
  text: {
    color: "#6b7b8c"
  },
  error: {
    marginBottom: "14px",
    padding: "12px 14px",
    borderRadius: "12px",
    background: "#fff3f2",
    color: "#d64541",
    fontSize: "14px",
    border: "1px solid #ffd9d5"
  },
  success: {
    marginBottom: "14px",
    padding: "12px 14px",
    borderRadius: "12px",
    background: "#edfdf3",
    color: "#1f8f55",
    fontSize: "14px",
    border: "1px solid #ccefd9"
  }
};