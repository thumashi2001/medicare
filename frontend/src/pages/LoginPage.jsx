import { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AUTH_API = "http://localhost:5001";

function getDashboardRoute(role) {
  if (role === "doctor") return "/doctor";
  if (role === "patient") return "/patient";
  if (role === "admin") return "/admin";
  return "/login";
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isMobile = window.innerWidth <= 900;

  const responsiveStyles = useMemo(() => {
    return {
      page: {
        ...styles.page,
        gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr"
      },
      leftPanel: {
        ...styles.leftPanel,
        padding: isMobile ? "28px 20px" : "48px 56px",
        display: isMobile ? "none" : "flex"
      },
      rightPanel: {
        ...styles.rightPanel,
        padding: isMobile ? "20px" : "32px"
      },
      heading: {
        ...styles.heading,
        fontSize: isMobile ? "34px" : "52px"
      },
      featureGrid: {
        ...styles.featureGrid,
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))"
      },
      card: {
        ...styles.card,
        padding: isMobile ? "26px 20px" : "34px"
      },
      title: {
        ...styles.title,
        fontSize: isMobile ? "28px" : "34px"
      }
    };
  }, [isMobile]);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${AUTH_API}/api/auth/login`, formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      navigate(getDashboardRoute(response.data.role));
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={responsiveStyles.page}>
      <div style={responsiveStyles.leftPanel}>
        <div style={styles.brandWrap}>
          <div style={styles.logo}>+</div>
          <div>
            <h2 style={styles.brand}>MediCare+</h2>
            <p style={styles.brandText}>Smart Healthcare Platform</p>
          </div>
        </div>

        <div style={styles.heroContent}>
          <div style={styles.badge}>Secure • Modern • Role-based Access</div>
          <h1 style={responsiveStyles.heading}>Welcome back to your healthcare workspace</h1>
          <p style={styles.description}>
            Sign in to continue managing appointments, prescriptions, records, and telemedicine
            workflows through one unified platform.
          </p>

          <div style={responsiveStyles.featureGrid}>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>🩺</span>
              <span>Doctor tools</span>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>📅</span>
              <span>Appointments</span>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>💊</span>
              <span>Prescriptions</span>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>🔐</span>
              <span>Secure login</span>
            </div>
          </div>
        </div>
      </div>

      <div style={responsiveStyles.rightPanel}>
        <div style={responsiveStyles.card}>
          <div style={styles.cardTop}>
            <div style={styles.miniBadge}>Universal Login</div>
            <h2 style={responsiveStyles.title}>Sign in</h2>
            <p style={styles.subtitle}>
              Patients, doctors, and admins can use the same secure login portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />

            {error ? <div style={styles.error}>{error}</div> : null}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div style={styles.infoBox}>
            <strong>Role-based access:</strong> After login, users are automatically redirected to
            their dashboard.
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr"
  },
  leftPanel: {
    padding: "48px 56px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background:
      "linear-gradient(135deg, rgba(46,204,113,0.10) 0%, rgba(52,152,219,0.12) 100%)"
  },
  brandWrap: {
    display: "flex",
    alignItems: "center",
    gap: "14px"
  },
  logo: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #2ecc71 0%, #3498db 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "700",
    boxShadow: "0 16px 30px rgba(46, 204, 113, 0.22)"
  },
  brand: {
    margin: 0,
    fontSize: "28px",
    color: "#2c3e50"
  },
  brandText: {
    margin: "4px 0 0",
    color: "#5f6f81"
  },
  heroContent: {
    maxWidth: "620px"
  },
  badge: {
    display: "inline-block",
    padding: "10px 16px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#27ae60",
    fontWeight: "600",
    marginBottom: "24px",
    boxShadow: "0 8px 18px rgba(0,0,0,0.05)"
  },
  heading: {
    fontSize: "52px",
    lineHeight: "1.08",
    margin: "0 0 18px",
    color: "#243445"
  },
  description: {
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#5f6f81",
    margin: "0 0 32px"
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px"
  },
  featureCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontWeight: "600",
    color: "#2c3e50",
    boxShadow: "0 12px 24px rgba(0,0,0,0.05)"
  },
  featureIcon: {
    fontSize: "20px"
  },
  rightPanel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px"
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    background: "#ffffff",
    borderRadius: "28px",
    padding: "34px",
    boxShadow: "0 24px 60px rgba(44, 62, 80, 0.12)",
    border: "1px solid #eef2f7"
  },
  cardTop: {
    marginBottom: "26px"
  },
  miniBadge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#e8f8f5",
    color: "#27ae60",
    fontWeight: "700",
    fontSize: "13px",
    marginBottom: "14px"
  },
  title: {
    margin: 0,
    fontSize: "34px",
    color: "#243445"
  },
  subtitle: {
    margin: "10px 0 0",
    color: "#667788",
    lineHeight: "1.7"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
    marginTop: "4px"
  },
  input: {
    width: "100%",
    padding: "15px 16px",
    borderRadius: "14px",
    border: "1px solid #dbe3ec",
    background: "#fbfdff",
    fontSize: "15px",
    outline: "none"
  },
  button: {
    marginTop: "10px",
    width: "100%",
    padding: "15px 18px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 14px 28px rgba(39, 174, 96, 0.25)"
  },
  error: {
    marginTop: "4px",
    padding: "12px 14px",
    borderRadius: "12px",
    background: "#fff3f2",
    color: "#d64541",
    fontSize: "14px",
    border: "1px solid #ffd9d5"
  },
  infoBox: {
    marginTop: "20px",
    padding: "14px 16px",
    borderRadius: "14px",
    background: "#f7fbff",
    color: "#5f6f81",
    fontSize: "14px",
    lineHeight: "1.6",
    border: "1px solid #e7eef7"
  }
};