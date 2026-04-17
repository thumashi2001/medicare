export default function DoctorReportsPage() {
  const reports = [
    { id: 1, title: "Monthly Consultation Summary", date: "2025-06-01", type: "Monthly", status: "Ready" },
    { id: 2, title: "Patient Feedback Report", date: "2025-05-15", type: "Feedback", status: "Ready" },
    { id: 3, title: "Appointment Analytics", date: "2025-05-01", type: "Analytics", status: "Processing" },
  ];

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerCard}>
        <p style={styles.tag}>Reports</p>
        <h2 style={styles.headerTitle}>My Reports</h2>
        <p style={styles.headerText}>View and download your practice reports and analytics.</p>
      </div>
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Available Reports</h3>
        <div style={styles.reportList}>
          {reports.map((report) => (
            <div key={report.id} style={styles.reportCard}>
              <div>
                <div style={styles.reportTitle}>{report.title}</div>
                <div style={styles.reportMeta}>{report.type} • {report.date}</div>
              </div>
              <div style={styles.rightSide}>
                <span style={{ ...styles.badge, ...(report.status === "Ready" ? styles.badgeReady : styles.badgePending) }}>{report.status}</span>
                {report.status === "Ready" && (
                  <button style={styles.downloadBtn}>Download</button>
                )}
              </div>
            </div>
          ))}
        </div>
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
  sectionTitle: { marginTop: 0, marginBottom: "18px", color: "#243445" },
  reportList: { display: "flex", flexDirection: "column", gap: "14px" },
  reportCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px", borderRadius: "16px", background: "#f8fbff", border: "1px solid #e7eef7" },
  reportTitle: { fontWeight: "700", color: "#243445", marginBottom: "6px" },
  reportMeta: { color: "#6b7b8c", fontSize: "14px" },
  rightSide: { display: "flex", alignItems: "center", gap: "12px" },
  badge: { padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "600" },
  badgeReady: { background: "#edfdf3", color: "#1f8f55" },
  badgePending: { background: "#fff8e1", color: "#c08000" },
  downloadBtn: { border: "none", background: "#3498db", color: "#fff", padding: "10px 16px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }
};
