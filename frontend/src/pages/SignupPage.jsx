import { useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AppLogo from "../components/AppLogo";

const AUTH_API = "http://localhost:5001";

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isMobile = window.innerWidth <= 900;

  const responsiveStyles = useMemo(() => {
    return {
      page: {
        ...styles.page,
        gridTemplateColumns: isMobile ? "1fr" : "1.05fr 0.95fr"
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
        fontSize: isMobile ? "34px" : "50px"
      },
      card: {
        ...styles.card,
        padding: isMobile ? "26px 20px" : "34px"
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
    setSuccess("");

    try {
      await axios.post(`${AUTH_API}/api/auth/register`, formData);
      setSuccess("Account created successfully. You can log in now.");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={responsiveStyles.page}>
      <div style={responsiveStyles.leftPanel}>
        <div>
          <AppLogo width={220} />
        </div>

        <div style={styles.heroContent}>
          <div style={styles.badge}>Quick Registration</div>
          <h1 style={responsiveStyles.heading}>Create your account and get started</h1>
          <p style={styles.description}>
            Register as a patient or doctor to access appointments, records, prescriptions, and
            platform services.
          </p>
        </div>
      </div>

      <div style={responsiveStyles.rightPanel}>
        <div style={responsiveStyles.card}>
          <div style={styles.mobileLogoWrap}>
            <AppLogo width={190} />
          </div>

          <div style={styles.miniBadge}>Universal Signup</div>
          <h2 style={styles.title}>Create account</h2>
          <p style={styles.subtitle}>
            Admins should be created separately. Patients and doctors can register here.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Full name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <label style={styles.label}>Register as</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>

            {error ? <div style={styles.error}>{error}</div> : null}
            {success ? <div style={styles.success}>{success}</div> : null}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p style={styles.bottomText}>
            Already have an account?{" "}
            <Link to="/login" style={styles.link}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr"
  },
  leftPanel: {
    padding: "48px 56px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background:
      "linear-gradient(135deg, rgba(46,204,113,0.10) 0%, rgba(52,152,219,0.12) 100%)"
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
    fontSize: "50px",
    lineHeight: "1.08",
    margin: "0 0 18px",
    color: "#243445"
  },
  description: {
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#5f6f81",
    margin: 0
  },
  rightPanel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px"
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    background: "#ffffff",
    borderRadius: "28px",
    padding: "34px",
    boxShadow: "0 24px 60px rgba(44, 62, 80, 0.12)",
    border: "1px solid #eef2f7"
  },
  mobileLogoWrap: {
    marginBottom: "14px"
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
    margin: "10px 0 24px",
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
  success: {
    marginTop: "4px",
    padding: "12px 14px",
    borderRadius: "12px",
    background: "#edfdf3",
    color: "#1f8f55",
    fontSize: "14px",
    border: "1px solid #ccefd9"
  },
  bottomText: {
    marginTop: "18px",
    marginBottom: 0,
    color: "#5f6f81",
    fontSize: "14px",
    textAlign: "center"
  },
  link: {
    color: "#3498db",
    fontWeight: "700"
  }
};