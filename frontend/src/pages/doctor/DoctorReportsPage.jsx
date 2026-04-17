export default function DoctorReportsPage() {
  const dummyReports = [
    {
      id: "REP-001",
      patientId: "patient123",
      title: "Blood Test Report",
      uploadedAt: "2026-04-12",
      status: "Available"
    },
    {
      id: "REP-002",
      patientId: "patient456",
      title: "MRI Scan Summary",
      uploadedAt: "2026-04-10",
      status: "Available"
    },
    {
      id: "REP-003",
      patientId: "patient789",
      title: "X-Ray Report",
      uploadedAt: "2026-04-08",
      status: "Pending Integration"
    }
  ];

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerCard}>
        <p style={styles.tag}>Patient Reports</p>
        <h2 style={styles.headerTitle}>View Uploaded Reports</h2>
        <p style={styles.headerText}>
          Review patient-uploaded medical documents and keep track of report history from one place.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.notice}>
          This page is ready for integration with the patient-service report upload module.
        </div>

        <div style={styles.reportList}>
          {dummyReports.map((report) => (
            <div key={report.id} style={styles.reportCard}>
              <div>
                <div style={styles.reportTitle}>{report.title}</div>
                <div style={styles.reportMeta}>Patient ID: {report.patientId}</div>
                <div style={styles.reportMeta}>Uploaded: {report.uploadedAt}</div>
              </div>

              <div style={styles.rightSide}>
                <span
                  style={{
                    ...styles.statusBadge,
                    ...(report.status === "Available"
                      ? styles.availableBadge
                      : styles.pendingBadge)
                  }}
                >
                  {report.status}
                </span>

                <button style={styles.viewButton}>View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  headerCard: {
    background: "linear-gradient(135deg, #2ecc71 0%, #3498db 100%)",
    color: "#fff",
    padding: "28px",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(52, 152, 219, 0.18)"
  },
  tag: {
    margin: 0,
    fontWeight: "700",
    opacity: 0.95
  },
  headerTitle: {
    margin: "8px 0 10px",
    fontSize: "32px"
  },
  headerText: {
    margin: 0,
    maxWidth: "760px",
    lineHeight: "1.7",
    opacity: 0.95
  },
  card: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "22px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.06)"
  },
  notice: {
    marginBottom: "18px",
    padding: "12px 14px",
    borderRadius: "12px",
    background: "#f7fbff",
    color: "#5f6f81",
    border: "1px solid #e7eef7",
    fontSize: "14px"
  },
  reportList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  reportCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    padding: "18px",
    borderRadius: "16px",
    background: "#f8fbff",
    border: "1px solid #e7eef7"
  },
  reportTitle: {
    fontWeight: "700",
    color: "#243445",
    marginBottom: "6px"
  },
  reportMeta: {
    color: "#6b7b8c",
    fontSize: "14px",
    lineHeight: "1.6"
  },
  rightSide: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  statusBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700"
  },
  availableBadge: {
    background: "#edfdf3",
    color: "#1f8f55"
  },
  pendingBadge: {
    background: "#fff7e6",
    color: "#c27a00"
  },
  viewButton: {
    border: "none",
    background: "#3498db",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600"
  }
};