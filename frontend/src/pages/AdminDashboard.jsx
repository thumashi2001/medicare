import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>Admin Dashboard</h1>
        <p>Login successful. Admin area can be built next.</p>
        <button onClick={handleLogout} style={styles.button}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f6f8fb",
    padding: "20px"
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "32px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
    textAlign: "center"
  },
  button: {
    marginTop: "16px",
    border: "none",
    background: "#e74c3c",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "12px",
    cursor: "pointer"
  }
};