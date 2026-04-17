import { useNavigate } from "react-router-dom";

export default function DoctorHome() {
  const navigate = useNavigate();

  const cards = [
    { title: "Profile Management", description: "Update your doctor profile, specialization, and consultation details.", action: () => navigate("/doctor/profile") },
    { title: "Availability Schedule", description: "Manage the time slots when patients can book you.", action: () => navigate("/doctor/availability") },
    { title: "Digital Prescriptions", description: "Create and review prescriptions for your patients.", action: () => navigate("/doctor/prescriptions") },
    { title: "Appointment Requests", description: "View appointment requests and accept or reject them.", action: () => navigate("/doctor/appointments") },
    { title: "Patient Reports", description: "Review uploaded medical reports and patient documents.", action: () => navigate("/doctor/reports") }
  ];

  return (
    <div>
      <div style={styles.heroCard}>
        <p style={styles.tag}>Doctor Portal</p>
        <h2 style={styles.title}>Welcome back, Doctor</h2>
        <p style={styles.subtitle}>Manage your profile, availability, prescriptions, and appointment requests from one place.</p>
      </div>

      <div style={styles.grid}>
        {cards.map((card) => (
          <button key={card.title} onClick={card.action} style={styles.card}>
            <div style={styles.cardTitle}>{card.title}</div>
            <div style={styles.cardDescription}>{card.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  heroCard: { background: "linear-gradient(135deg, #2ecc71 0%, #3498db 100%)", color: "#ffffff", padding: "32px", borderRadius: "28px", boxShadow: "0 20px 40px rgba(52, 152, 219, 0.18)" },
  tag: { margin: 0, fontWeight: "700", opacity: 0.9 },
  title: { margin: "10px 0 10px", fontSize: "38px" },
  subtitle: { margin: 0, maxWidth: "700px", lineHeight: "1.7", opacity: 0.95 },
  grid: { marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px" },
  card: { background: "#ffffff", borderRadius: "22px", padding: "24px", boxShadow: "0 12px 28px rgba(0,0,0,0.06)", border: "none", textAlign: "left", cursor: "pointer" },
  cardTitle: { fontWeight: "700", color: "#2c3e50", marginBottom: "10px", fontSize: "18px" },
  cardDescription: { color: "#6b7b8c", lineHeight: "1.7", fontSize: "14px" }
};
