import { useEffect, useState } from "react";
import axios from "axios";

const APPOINTMENT_API = "http://localhost:5005";

const getIdFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload.userId || payload._id;
  } catch {
    return null;
  }
};

export default function DoctorNotificationsPage() {
  const doctorId = getIdFromToken();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { if (doctorId) fetchNotifications(); }, [doctorId]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${APPOINTMENT_API}/api/notifications/${doctorId}`);
      setNotifications(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await axios.put(`${APPOINTMENT_API}/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {
      // silently ignore mark-read failures
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(unread.map((n) => markRead(n._id)));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerCard}>
        <p style={styles.tag}>Notifications</p>
        <h2 style={styles.headerTitle}>Your Notifications</h2>
        <p style={styles.headerText}>Stay up to date with new appointment requests and status changes.</p>
      </div>

      <div style={styles.card}>
        <div style={styles.toolbar}>
          <div style={styles.toolbarLeft}>
            <h3 style={styles.sectionTitle}>Inbox</h3>
            {unreadCount > 0 && (
              <span style={styles.badge}>{unreadCount} unread</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={styles.markAllBtn}>Mark all as read</button>
          )}
        </div>

        {loading ? (
          <p style={styles.text}>Loading notifications...</p>
        ) : error ? (
          <div style={styles.error}>{error}</div>
        ) : notifications.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔔</div>
            <p style={styles.emptyText}>No notifications yet. Notifications appear here when patients book or cancel appointments.</p>
          </div>
        ) : (
          <div style={styles.list}>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                style={{ ...styles.item, ...(notification.read ? {} : styles.itemUnread) }}
              >
                <div style={styles.itemContent}>
                  <div style={styles.itemHeader}>
                    <span style={styles.itemTitle}>{notification.title}</span>
                    {!notification.read && <span style={styles.dot} />}
                  </div>
                  <p style={styles.itemMessage}>{notification.message}</p>
                  <span style={styles.itemTime}>
                    {new Date(notification.createdAt).toLocaleString("en-US", {
                      weekday: "short", month: "short", day: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>
                {!notification.read && (
                  <button onClick={() => markRead(notification._id)} style={styles.readBtn}>Mark read</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", flexDirection: "column", gap: "20px" },
  headerCard: { background: "linear-gradient(135deg, #2ecc71 0%, #3498db 100%)", color: "#fff", padding: "28px", borderRadius: "24px", boxShadow: "0 20px 40px rgba(52, 152, 219, 0.18)" },
  tag: { margin: 0, fontWeight: "700", opacity: 0.95 },
  headerTitle: { margin: "8px 0 10px", fontSize: "32px" },
  headerText: { margin: 0, maxWidth: "760px", lineHeight: "1.7", opacity: 0.95 },
  card: { background: "#ffffff", padding: "28px", borderRadius: "22px", boxShadow: "0 12px 28px rgba(0,0,0,0.06)" },
  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  toolbarLeft: { display: "flex", alignItems: "center", gap: "12px" },
  sectionTitle: { margin: 0, color: "#243445" },
  badge: { background: "#3498db", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "700" },
  markAllBtn: { border: "none", background: "transparent", color: "#3498db", cursor: "pointer", fontWeight: "600", fontSize: "14px", textDecoration: "underline" },
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  item: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", padding: "18px 20px", borderRadius: "16px", background: "#f8fbff", border: "1px solid #e7eef7" },
  itemUnread: { background: "#edf6ff", borderColor: "#b8d9f5" },
  itemContent: { flex: 1 },
  itemHeader: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" },
  itemTitle: { fontWeight: "700", color: "#243445", fontSize: "15px" },
  dot: { width: "8px", height: "8px", borderRadius: "50%", background: "#3498db", flexShrink: 0 },
  itemMessage: { margin: "0 0 8px", color: "#445566", fontSize: "14px", lineHeight: "1.6" },
  itemTime: { color: "#8fa3b8", fontSize: "12px" },
  readBtn: { flexShrink: 0, border: "1px solid #3498db", background: "transparent", color: "#3498db", padding: "8px 14px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
  text: { color: "#6b7b8c" },
  error: { padding: "14px", borderRadius: "12px", background: "#fff3f2", color: "#d64541", border: "1px solid #ffd9d5" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", textAlign: "center" },
  emptyIcon: { fontSize: "48px", marginBottom: "16px" },
  emptyText: { color: "#6b7b8c", maxWidth: "400px", lineHeight: "1.7" }
};
