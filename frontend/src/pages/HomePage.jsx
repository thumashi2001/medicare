import { Link, useNavigate } from "react-router-dom";
import AppLogo from "../components/AppLogo";

function getDashboardRoute(role) {
  if (role === "doctor") return "/doctor";
  if (role === "patient") return "/patient";
  if (role === "admin") return "/admin";
  return "/login";
}

export default function HomePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleGoToDashboard = () => {
    navigate(getDashboardRoute(role));
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logoWrap}>
          <AppLogo width={180} />
        </div>

        <div style={styles.headerActions}>
          {!token ? (
            <>
              <Link to="/login" style={styles.loginButton}>
                Login
              </Link>
              <Link to="/signup" style={styles.signupButton}>
                Register
              </Link>
            </>
          ) : (
            <button onClick={handleGoToDashboard} style={styles.signupButton}>
              Go to Dashboard
            </button>
          )}
        </div>
      </header>

      <section style={styles.heroSection}>
        <div style={styles.heroLeft}>
          <div style={styles.badge}>Healthcare made simple</div>
          <h1 style={styles.heroTitle}>Your health, our priority</h1>
          <p style={styles.heroText}>
            Book appointments, connect with doctors, access your records, and manage care from one
            trusted platform.
          </p>

          <div style={styles.heroButtons}>
            {!token ? (
              <>
                <Link to="/signup" style={styles.primaryButton}>
                  Create Account
                </Link>
                <Link to="/login" style={styles.secondaryButton}>
                  Login
                </Link>
              </>
            ) : (
              <button onClick={handleGoToDashboard} style={styles.primaryButton}>
                Open Dashboard
              </button>
            )}
          </div>

          <div style={styles.quickStats}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>500+</div>
              <div style={styles.statLabel}>Verified Doctors</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>25,000+</div>
              <div style={styles.statLabel}>Appointments</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>24/7</div>
              <div style={styles.statLabel}>Easy Access</div>
            </div>
          </div>
        </div>

        <div style={styles.heroRight}>
          <div style={styles.featurePanel}>
            <h3 style={styles.panelTitle}>What you can do</h3>

            <div style={styles.featureList}>
              <div style={styles.featureItem}>Book appointments with ease</div>
              <div style={styles.featureItem}>Consult doctors online</div>
              <div style={styles.featureItem}>Receive digital prescriptions</div>
              <div style={styles.featureItem}>Access records anytime</div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeadingWrap}>
          <p style={styles.sectionTag}>How it works</p>
          <h2 style={styles.sectionTitle}>Healthcare made easier for everyone</h2>
        </div>

        <div style={styles.cardGrid}>
          <div style={styles.infoCard}>
            <div style={styles.cardStep}>1</div>
            <h3 style={styles.infoTitle}>Find a doctor</h3>
            <p style={styles.infoText}>
              Search by specialty and choose the care that fits your needs.
            </p>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.cardStep}>2</div>
            <h3 style={styles.infoTitle}>Book an appointment</h3>
            <p style={styles.infoText}>
              Pick a time slot that works for you and confirm in seconds.
            </p>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.cardStep}>3</div>
            <h3 style={styles.infoTitle}>Consult and follow up</h3>
            <p style={styles.infoText}>
              Meet your doctor, receive prescriptions, and manage your records online.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(46,204,113,0.10), transparent 30%), radial-gradient(circle at bottom right, rgba(52,152,219,0.10), transparent 30%), #f6f8fb"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "22px 28px",
    background: "#ffffff",
    borderBottom: "1px solid #e8edf3",
    position: "sticky",
    top: 0,
    zIndex: 10
  },
  logoWrap: {
    display: "flex",
    alignItems: "center"
  },
  headerActions: {
    display: "flex",
    gap: "12px",
    alignItems: "center"
  },
  loginButton: {
    textDecoration: "none",
    padding: "10px 18px",
    borderRadius: "12px",
    border: "1px solid #dbe3ec",
    color: "#243445",
    fontWeight: "600",
    background: "#ffffff"
  },
  signupButton: {
    border: "none",
    textDecoration: "none",
    padding: "10px 18px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer"
  },
  heroSection: {
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "48px 28px",
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "28px",
    alignItems: "center"
  },
  heroLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },
  badge: {
    display: "inline-block",
    width: "fit-content",
    padding: "10px 16px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#27ae60",
    fontWeight: "700",
    boxShadow: "0 8px 18px rgba(0,0,0,0.05)"
  },
  heroTitle: {
    margin: 0,
    fontSize: "56px",
    lineHeight: "1.08",
    color: "#243445"
  },
  heroText: {
    margin: 0,
    fontSize: "18px",
    lineHeight: "1.8",
    color: "#5f6f81",
    maxWidth: "760px"
  },
  heroButtons: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "8px"
  },
  primaryButton: {
    textDecoration: "none",
    border: "none",
    padding: "14px 22px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
    color: "#ffffff",
    fontWeight: "700",
    boxShadow: "0 14px 28px rgba(39, 174, 96, 0.2)",
    cursor: "pointer"
  },
  secondaryButton: {
    textDecoration: "none",
    padding: "14px 22px",
    borderRadius: "14px",
    border: "1px solid #dbe3ec",
    color: "#243445",
    fontWeight: "700",
    background: "#ffffff"
  },
  quickStats: {
    marginTop: "8px",
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px"
  },
  statCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.05)"
  },
  statNumber: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#243445",
    marginBottom: "6px"
  },
  statLabel: {
    color: "#6b7b8c",
    fontSize: "14px"
  },
  heroRight: {
    display: "flex",
    justifyContent: "center"
  },
  featurePanel: {
    width: "100%",
    background: "#ffffff",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 18px 40px rgba(44, 62, 80, 0.10)",
    border: "1px solid #eef2f7"
  },
  panelTitle: {
    marginTop: 0,
    marginBottom: "18px",
    fontSize: "24px",
    color: "#243445"
  },
  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  featureItem: {
    background: "#f8fbff",
    border: "1px solid #e7eef7",
    padding: "14px 16px",
    borderRadius: "14px",
    color: "#2c3e50",
    fontWeight: "600"
  },
  section: {
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "8px 28px 48px"
  },
  sectionHeadingWrap: {
    marginBottom: "20px"
  },
  sectionTag: {
    margin: 0,
    color: "#3498db",
    fontWeight: "700",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.06em"
  },
  sectionTitle: {
    margin: "10px 0 0",
    fontSize: "34px",
    color: "#243445"
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "18px"
  },
  infoCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.06)"
  },
  cardStep: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#e8f8f5",
    color: "#27ae60",
    fontWeight: "800",
    marginBottom: "16px"
  },
  infoTitle: {
    margin: "0 0 10px",
    color: "#243445"
  },
  infoText: {
    margin: 0,
    color: "#6b7b8c",
    lineHeight: "1.7"
  }
};