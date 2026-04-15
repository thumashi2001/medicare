export default function DoctorAvailabilityPage() {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Availability</h2>
      <p style={styles.text}>This page will connect to your availability API next.</p>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "22px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.06)"
  },
  title: {
    marginTop: 0,
    color: "#243445"
  },
  text: {
    color: "#6b7b8c"
  }
};