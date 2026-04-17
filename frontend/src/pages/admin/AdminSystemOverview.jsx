import "./adminSystemOverview.css";

export default function AdminSystemOverview() {
  const overview = {
    totalPatients: 860,
    totalDoctors: 394,
    verifiedDoctors: 376,
    pendingDoctors: 18,
    systemStatus: "Operational",
    databaseStatus: "Connected",
    apiStatus: "Healthy",
    lastBackup: "16/04/2026 • 01:30 AM"
  };

  return (
    <div className="admin-overview-page">
      <h2>System Overview</h2>
      <p>View high-level information about system performance and services</p>

      <div className="overview-grid">
        <div className="overview-card">
          <h4>Total Patients</h4>
          <h3>{overview.totalPatients}</h3>
        </div>

        <div className="overview-card">
          <h4>Total Doctors</h4>
          <h3>{overview.totalDoctors}</h3>
        </div>

        <div className="overview-card">
          <h4>Verified Doctors</h4>
          <h3 className="success">{overview.verifiedDoctors}</h3>
        </div>

        <div className="overview-card">
          <h4>Pending Doctors</h4>
          <h3 className="warning">{overview.pendingDoctors}</h3>
        </div>
      </div>

      <div className="overview-details-card">
        <h3>Service Health</h3>

        <div className="overview-row">
          <span>System Status</span>
          <strong className="success-text">{overview.systemStatus}</strong>
        </div>

        <div className="overview-row">
          <span>Database Status</span>
          <strong className="success-text">{overview.databaseStatus}</strong>
        </div>

        <div className="overview-row">
          <span>API Status</span>
          <strong className="success-text">{overview.apiStatus}</strong>
        </div>

        <div className="overview-row">
          <span>Last Backup</span>
          <strong>{overview.lastBackup}</strong>
        </div>
      </div>
    </div>
  );
}