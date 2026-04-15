import "./patientDashboard.css";

export default function PatientDashboard() {
  const summaryCards = [
    { label: "Upcoming", value: 3, color: "#3498DB" },
    { label: "Completed", value: 12, color: "#27AE60" },
    { label: "Reports", value: 5, color: "#F39C12" },
    { label: "Prescriptions", value: 2, color: "#E74C3C" },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-intro">
        <h1>Welcome, Anushka!</h1>
        <p>Manage your health and appointments</p>
      </div>

      <div className="summary-grid">
        {summaryCards.map((card) => (
          <div className="summary-card" key={card.label}>
            <h2 style={{ color: card.color }}>{card.value}</h2>
            <p>{card.label}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <h3>Upcoming Appointment</h3>
        <div className="appointment-card">
          <div>
            <h4>Dr. Kavinda Silva</h4>
            <p>Cardiologist</p>
            <span>Tomorrow • 10:30 AM</span>
          </div>
          <button>View Details</button>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Reports</h3>
          <a href="/patient/reports">View All</a>
        </div>

        <div className="report-item">
          <div>
            <strong>Blood Test Report</strong>
            <p>Uploaded on 2024-01-15</p>
          </div>
        </div>

        <div className="report-item">
          <div>
            <strong>X-Ray Chest</strong>
            <p>Uploaded on 2024-01-10</p>
          </div>
        </div>
      </div>
    </div>
  );
}