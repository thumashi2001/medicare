import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
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
  const isMobile = window.innerWidth <= 900;

  const responsiveStyles = useMemo(() => {
    return {
      heroSection: {
        ...styles.heroSection,
        gridTemplateColumns: isMobile ? "1fr" : "1.12fr 0.88fr",
        padding: isMobile ? "28px 18px 18px" : "48px 28px 20px"
      },
      header: {
        ...styles.header,
        padding: isMobile ? "16px 18px" : "20px 28px"
      },
      nav: {
        ...styles.nav,
        display: isMobile ? "none" : "flex"
      },
      heroTitle: {
        ...styles.heroTitle,
        fontSize: isMobile ? "38px" : "58px",
        lineHeight: isMobile ? "1.14" : "1.04"
      },
      heroButtons: {
        ...styles.heroButtons,
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "center"
      },
      quickStats: {
        ...styles.quickStats,
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))"
      },
      heroVisualWrap: {
        ...styles.heroVisualWrap,
        minHeight: isMobile ? "420px" : "620px",
        marginTop: isMobile ? "8px" : "0"
      },
      doctorFigure: {
        ...styles.doctorFigure,
        width: isMobile ? "82%" : "88%",
        maxWidth: isMobile ? "360px" : "520px",
        bottom: isMobile ? "16px" : "22px"
      },
      floatingCardTop: {
        ...styles.floatingCardTop,
        top: isMobile ? "18px" : "26px",
        right: isMobile ? "18px" : "26px",
        width: isMobile ? "180px" : "220px"
      },
      floatingCardBottom: {
        ...styles.floatingCardBottom,
        left: isMobile ? "18px" : "26px",
        bottom: isMobile ? "24px" : "32px",
        width: isMobile ? "190px" : "235px"
      },
      section: {
        ...styles.section,
        padding: isMobile ? "10px 18px 42px" : "10px 28px 48px"
      },
      cardGrid: {
        ...styles.cardGrid,
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))"
      },
      processGrid: {
        ...styles.processGrid,
        gridTemplateColumns: isMobile ? "1fr" : "repeat(4, minmax(0, 1fr))"
      },
      trustStrip: {
        ...styles.trustStrip,
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, minmax(0, 1fr))"
      },
      footer: {
        ...styles.footer,
        gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr 0.9fr 0.9fr"
      }
    };
  }, [isMobile]);

  const handleGoToDashboard = () => {
    navigate(getDashboardRoute(role));
  };

  return (
    <div style={styles.page}>
      <header style={responsiveStyles.header}>
        <div style={styles.logoWrap}>
          <AppLogo width={190} />
        </div>

        <nav style={responsiveStyles.nav}>
          <a href="#home" style={styles.navLinkActive}>Home</a>
          <a href="#services" style={styles.navLink}>Find Doctors</a>
          <a href="#how-it-works" style={styles.navLink}>How It Works</a>
          <a href="#contact" style={styles.navLink}>Contact</a>
        </nav>

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

      <section id="home" style={responsiveStyles.heroSection}>
        <div style={styles.heroLeft}>
          <div style={styles.badge}>
            <AppLogo type="icon" width={20} />
            <span>Trusted digital healthcare platform</span>
          </div>

          <h1 style={responsiveStyles.heroTitle}>Your health, our priority</h1>

          <p style={styles.heroText}>
            Book appointments, consult doctors online, receive digital prescriptions,
            and access your records from one simple and reliable platform.
          </p>

          <div style={responsiveStyles.heroButtons}>
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

          <div style={responsiveStyles.quickStats}>
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
          <div style={responsiveStyles.heroVisualWrap}>
            <div style={styles.heroGlowOne}></div>
            <div style={styles.heroGlowTwo}></div>

            <div style={responsiveStyles.floatingCardTop}>
              <div style={styles.floatingCardIcon}>
                <AppLogo type="icon" width={24} />
              </div>
              <div>
                <div style={styles.floatingCardTitle}>Book with ease</div>
                <div style={styles.floatingCardText}>Find doctors and schedule in minutes</div>
              </div>
            </div>

            <img
              src="https://png.pngtree.com/png-clipart/20231002/original/pngtree-young-afro-professional-doctor-png-image_13227671.png"
              alt="Doctor"
              style={responsiveStyles.doctorFigure}
            />

            <div style={responsiveStyles.floatingCardBottom}>
              <div style={styles.floatingSmallRow}>
                <div style={styles.onlineDot}></div>
                <span style={styles.floatingSmallText}>24/7 Online Support</span>
              </div>
              <div style={styles.floatingBottomTitle}>Video consultations</div>
              <div style={styles.floatingBottomText}>
                Secure sessions, digital prescriptions, and quick follow-ups.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.trustSection}>
        <div style={responsiveStyles.trustStrip}>
          <div style={styles.trustItem}>
            <div style={styles.trustIcon}>👥</div>
            <div>
              <div style={styles.trustValue}>10,000+</div>
              <div style={styles.trustLabel}>Happy Patients</div>
            </div>
          </div>

          <div style={styles.trustItem}>
            <div style={styles.trustIcon}>🩺</div>
            <div>
              <div style={styles.trustValue}>500+</div>
              <div style={styles.trustLabel}>Verified Doctors</div>
            </div>
          </div>

          <div style={styles.trustItem}>
            <div style={styles.trustIcon}>📅</div>
            <div>
              <div style={styles.trustValue}>25,000+</div>
              <div style={styles.trustLabel}>Appointments Completed</div>
            </div>
          </div>

          <div style={styles.trustItem}>
            <div style={styles.trustIcon}>💬</div>
            <div>
              <div style={styles.trustValue}>5,000+</div>
              <div style={styles.trustLabel}>Online Consultations</div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" style={responsiveStyles.section}>
        <div style={styles.sectionHeadingWrap}>
          <p style={styles.sectionTag}>Services</p>
          <h2 style={styles.sectionTitle}>Everything you need in one place</h2>
          <p style={styles.sectionSubtitle}>
            Built to make healthcare more convenient, more accessible, and easier to manage.
          </p>
        </div>

        <div style={responsiveStyles.cardGrid}>
          <div style={styles.infoCard}>
            <div style={styles.serviceTop}>
              <AppLogo type="icon" width={30} />
              <span style={styles.servicePill}>Appointments</span>
            </div>
            <h3 style={styles.infoTitle}>Book with ease</h3>
            <p style={styles.infoText}>
              Choose a doctor, select a slot, and confirm your appointment in seconds.
            </p>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.serviceTop}>
              <AppLogo type="icon" width={30} />
              <span style={styles.servicePill}>Consultation</span>
            </div>
            <h3 style={styles.infoTitle}>Consult from anywhere</h3>
            <p style={styles.infoText}>
              Connect with doctors online and get care without unnecessary travel.
            </p>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.serviceTop}>
              <AppLogo type="icon" width={30} />
              <span style={styles.servicePill}>Records</span>
            </div>
            <h3 style={styles.infoTitle}>Keep everything organized</h3>
            <p style={styles.infoText}>
              Access prescriptions, reports, and health details whenever you need them.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" style={responsiveStyles.section}>
        <div style={styles.sectionHeadingWrap}>
          <p style={styles.sectionTag}>How it works</p>
          <h2 style={styles.sectionTitle}>Healthcare made simple</h2>
        </div>

        <div style={responsiveStyles.processGrid}>
          <div style={styles.processCard}>
            <div style={styles.cardStep}>1</div>
            <h3 style={styles.infoTitle}>Find a doctor</h3>
            <p style={styles.infoText}>
              Search by specialty and choose the doctor that fits your needs.
            </p>
          </div>

          <div style={styles.processCard}>
            <div style={styles.cardStep}>2</div>
            <h3 style={styles.infoTitle}>Book appointment</h3>
            <p style={styles.infoText}>
              Select the date and time that works best for you.
            </p>
          </div>

          <div style={styles.processCard}>
            <div style={styles.cardStep}>3</div>
            <h3 style={styles.infoTitle}>Consult online</h3>
            <p style={styles.infoText}>
              Meet your doctor through a secure consultation flow.
            </p>
          </div>

          <div style={styles.processCard}>
            <div style={styles.cardStep}>4</div>
            <h3 style={styles.infoTitle}>Get prescription</h3>
            <p style={styles.infoText}>
              Receive digital prescriptions and manage your records with ease.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <div style={styles.ctaCard}>
          <div>
            <h2 style={styles.ctaTitle}>Ready to take control of your health?</h2>
            <p style={styles.ctaText}>
              Join MediCare today and experience smarter, simpler healthcare.
            </p>
          </div>

          <div style={styles.ctaButtons}>
            {!token ? (
              <>
                <Link to="/login" style={styles.ctaSecondary}>
                  Login
                </Link>
                <Link to="/signup" style={styles.ctaPrimary}>
                  Create Account
                </Link>
              </>
            ) : (
              <button onClick={handleGoToDashboard} style={styles.ctaPrimary}>
                Open Dashboard
              </button>
            )}
          </div>
        </div>
      </section>

      <footer id="contact" style={responsiveStyles.footer}>
        <div>
          <AppLogo width={170} />
          <p style={styles.footerText}>
            A smarter way to healthcare. Safe, simple, and reliable.
          </p>
        </div>

        <div>
          <h4 style={styles.footerHeading}>Quick Links</h4>
          <div style={styles.footerLinks}>
            <a href="#home" style={styles.footerLink}>Home</a>
            <a href="#services" style={styles.footerLink}>Find Doctors</a>
            <a href="#how-it-works" style={styles.footerLink}>How It Works</a>
          </div>
        </div>

        <div>
          <h4 style={styles.footerHeading}>Services</h4>
          <div style={styles.footerLinks}>
            <span style={styles.footerLink}>Video Consultation</span>
            <span style={styles.footerLink}>Appointment Booking</span>
            <span style={styles.footerLink}>Digital Prescriptions</span>
          </div>
        </div>

        <div>
          <h4 style={styles.footerHeading}>Contact</h4>
          <div style={styles.footerLinks}>
            <span style={styles.footerLink}>+94 11 234 5678</span>
            <span style={styles.footerLink}>support@medicareplus.lk</span>
            <span style={styles.footerLink}>Mon - Fri: 8:00 AM - 8:00 PM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(46,204,113,0.10), transparent 28%), radial-gradient(circle at bottom right, rgba(52,152,219,0.10), transparent 28%), #f6f8fb"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 28px",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #e8edf3",
    position: "sticky",
    top: 0,
    zIndex: 10
  },
  logoWrap: {
    display: "flex",
    alignItems: "center"
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "26px"
  },
  navLink: {
    color: "#2c3e50",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px"
  },
  navLinkActive: {
    color: "#1f8f55",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "15px"
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
    maxWidth: "1260px",
    margin: "0 auto",
    padding: "48px 28px 20px",
    display: "grid",
    gridTemplateColumns: "1.12fr 0.88fr",
    gap: "24px",
    alignItems: "center"
  },
  heroLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
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
    fontSize: "58px",
    lineHeight: "1.04",
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
  heroVisualWrap: {
    width: "100%",
    minHeight: "620px",
    position: "relative",
    borderRadius: "32px",
    overflow: "hidden",
    background:
      "linear-gradient(180deg, rgba(216,232,255,0.95) 0%, rgba(232,248,245,0.95) 100%)",
    border: "1px solid #e6edf7",
    boxShadow: "0 18px 42px rgba(44, 62, 80, 0.10)"
  },
  heroGlowOne: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "rgba(52,152,219,0.18)",
    top: "-50px",
    right: "-40px",
    filter: "blur(10px)"
  },
  heroGlowTwo: {
    position: "absolute",
    width: "280px",
    height: "280px",
    borderRadius: "50%",
    background: "rgba(46,204,113,0.14)",
    bottom: "-60px",
    left: "-40px",
    filter: "blur(10px)"
  },
  doctorFigure: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: "22px",
    width: "88%",
    maxWidth: "520px",
    height: "auto",
    objectFit: "contain",
    zIndex: 2
  },
  floatingCardTop: {
    position: "absolute",
    top: "26px",
    right: "26px",
    width: "220px",
    padding: "16px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.94)",
    boxShadow: "0 18px 36px rgba(0,0,0,0.10)",
    zIndex: 3
  },
  floatingCardIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    background: "#eef9f3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px"
  },
  floatingCardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#243445",
    marginBottom: "6px"
  },
  floatingCardText: {
    fontSize: "14px",
    color: "#667788",
    lineHeight: "1.6"
  },
  floatingCardBottom: {
    position: "absolute",
    left: "26px",
    bottom: "32px",
    width: "235px",
    padding: "16px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 18px 36px rgba(0,0,0,0.10)",
    zIndex: 3
  },
  floatingSmallRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px"
  },
  onlineDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#2ecc71"
  },
  floatingSmallText: {
    fontSize: "13px",
    color: "#1f8f55",
    fontWeight: "700"
  },
  floatingBottomTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#243445",
    marginBottom: "6px"
  },
  floatingBottomText: {
    fontSize: "14px",
    color: "#667788",
    lineHeight: "1.6"
  },
  trustSection: {
    maxWidth: "1260px",
    margin: "0 auto",
    padding: "0 28px"
  },
  trustStrip: {
    background: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 14px 34px rgba(0,0,0,0.06)",
    padding: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    transform: "translateY(-28px)"
  },
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  trustIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background: "#f2f8ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px"
  },
  trustValue: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#243445"
  },
  trustLabel: {
    color: "#6b7b8c",
    fontSize: "14px"
  },
  section: {
    maxWidth: "1260px",
    margin: "0 auto",
    padding: "10px 28px 48px"
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
    margin: "10px 0 8px",
    fontSize: "34px",
    color: "#243445"
  },
  sectionSubtitle: {
    margin: 0,
    color: "#6b7b8c",
    lineHeight: "1.7",
    maxWidth: "720px"
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "18px"
  },
  processGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "18px"
  },
  infoCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.06)"
  },
  processCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.06)"
  },
  serviceTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "18px"
  },
  servicePill: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#eef9f3",
    color: "#27ae60",
    fontWeight: "700",
    fontSize: "12px"
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
  },
  ctaSection: {
    maxWidth: "1260px",
    margin: "0 auto",
    padding: "0 28px 48px"
  },
  ctaCard: {
    background: "linear-gradient(135deg, #1f66db 0%, #174fba 100%)",
    color: "#ffffff",
    borderRadius: "28px",
    padding: "28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap"
  },
  ctaTitle: {
    margin: "0 0 8px",
    fontSize: "34px"
  },
  ctaText: {
    margin: 0,
    opacity: 0.92,
    lineHeight: "1.7"
  },
  ctaButtons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  },
  ctaPrimary: {
    textDecoration: "none",
    border: "none",
    padding: "13px 20px",
    borderRadius: "14px",
    background: "#ffffff",
    color: "#174fba",
    fontWeight: "700",
    cursor: "pointer"
  },
  ctaSecondary: {
    textDecoration: "none",
    padding: "13px 20px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.4)",
    color: "#ffffff",
    fontWeight: "700",
    background: "transparent"
  },
  footer: {
    maxWidth: "1260px",
    margin: "0 auto",
    padding: "0 28px 44px",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr 0.9fr 0.9fr",
    gap: "20px"
  },
  footerText: {
    color: "#6b7b8c",
    lineHeight: "1.7",
    maxWidth: "320px"
  },
  footerHeading: {
    color: "#243445",
    marginTop: 0,
    marginBottom: "14px"
  },
  footerLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  footerLink: {
    color: "#6b7b8c",
    textDecoration: "none",
    lineHeight: "1.6"
  }
};