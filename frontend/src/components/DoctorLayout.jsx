import { NavLink, Outlet, useNavigate } from "react-router-dom";
import AppLogo from "./AppLogo";

export default function DoctorLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", to: "/doctor" },
    { label: "Profile", to: "/doctor/profile" },
    { label: "Availability", to: "/doctor/availability" },
    { label: "Prescriptions", to: "/doctor/prescriptions" },
    { label: "Appointments", to: "/doctor/appointments" },
    { label: "Notifications", to: "/doctor/notifications" },
    { label: "Reports", to: "/doctor/reports" }
  ];

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.logoWrap}>
            <AppLogo width={170} />
            <p style={styles.sidebarSubtext}>Doctor Workspace</p>
          </div>

          <nav style={styles.nav}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/doctor"}
                style={({ isActive }) => ({
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {})
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </aside>

      <main style={styles.main}>
        <div style={styles.topbar}>
          <div>
            <h1 style={styles.topbarTitle}>Doctor Panel</h1>
            <p style={styles.topbarText}>Manage your services from one place</p>
          </div>
        </div>

        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    background: "#f6f8fb"
  },
  sidebar: {
    background: "#ffffff",
    borderRight: "1px solid #e8edf3",
    padding: "24px 18px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "24px"
  },
  logoWrap: { marginBottom: "28px" },
  sidebarSubtext: { margin: "8px 0 0", color: "#6b7b8c", fontSize: "14px" },
  nav: { display: "flex", flexDirection: "column", gap: "10px" },
  navItem: {
    padding: "14px 16px",
    borderRadius: "14px",
    color: "#2c3e50",
    textDecoration: "none",
    fontWeight: "600",
    transition: "0.2s ease"
  },
  navItemActive: {
    background: "linear-gradient(135deg, #2ecc71 0%, #3498db 100%)",
    color: "#ffffff",
    boxShadow: "0 10px 20px rgba(52, 152, 219, 0.18)"
  },
  logoutButton: {
    border: "none",
    background: "#e74c3c",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600"
  },
  main: { display: "flex", flexDirection: "column" },
  topbar: {
    background: "#ffffff",
    borderBottom: "1px solid #e8edf3",
    padding: "22px 28px"
  },
  topbarTitle: { margin: 0, color: "#243445", fontSize: "28px" },
  topbarText: { margin: "6px 0 0", color: "#6b7b8c", fontSize: "14px" },
  content: { padding: "28px" }
};
