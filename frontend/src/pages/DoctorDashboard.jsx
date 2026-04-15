import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <div>
          <h2 style={styles.logo}>MediCare+</h2>
          <p style={styles.smallText}>Doctor Workspace</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.heroCard}>
          <div>
            <p style={styles.tag}>Doctor Portal</p>
            <h1 style={styles.title}>Welcome back, Doctor</h1>
            <p style={styles.subtitle}>
              Manage your profile, availability, appointments, and prescriptions from one place.
            </p>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>Profile Management</div>
          <div style={styles.card}>Availability Schedule</div>
          <div style={styles.card}>Digital Prescriptions</div>
          <div style={styles.card}>Appointment Requests</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f8fb"
  },
  navbar: {
    padding: "22px 28px",
    background: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e8edf3"
  },
  logo: {
    margin: 0,
    color: "#2c3e50"
  },
  smallText: {
    margin: "4px 0 0",
    color: "#6b7b8c",
    fontSize: "14px"
  },
  logoutButton: {
    border: "none",
    background: "#e74c3c",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600"
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "28px"
  },
  heroCard: {
    background: "linear-gradient(135deg, #2ecc71 0%, #3498db 100%)",
    color: "#ffffff",
    padding: "32px",
    borderRadius: "28px",
    boxShadow: "0 20px 40px rgba(52, 152, 219, 0.18)"
  },
  tag: {
    margin: 0,
    fontWeight: "700",
    opacity: 0.9
  },
  title: {
    margin: "10px 0 10px",
    fontSize: "38px"
  },
  subtitle: {
    margin: 0,
    maxWidth: "700px",
    lineHeight: "1.7",
    opacity: 0.95
  },
  grid: {
    marginTop: "24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "18px"
  },
  card: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "28px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.06)",
    fontWeight: "700",
    color: "#2c3e50"
  }
};