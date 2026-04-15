import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./patientDashboard.css";

export default function PatientDashboard() {
  const [stats, setStats] = useState({
    upcoming: 1,
    completed: 2,
    reports: 0,
    prescriptions: 0
  });

  const [recentReports, setRecentReports] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, prescriptionsRes] = await Promise.all([
          API.get("/patients/profile"),
          API.get("/patients/prescriptions")
        ]);

        const profileData = profileRes.data || {};
        const reports = Array.isArray(profileData.reports) ? profileData.reports : [];
        const prescriptions = Array.isArray(prescriptionsRes.data)
          ? prescriptionsRes.data
          : [];

        setStats({
          upcoming: 1,
          completed: 2,
          reports: reports.length,
          prescriptions: prescriptions.length
        });

        const mappedReports = reports
          .slice(-2)
          .reverse()
          .map((report, index) => ({
            id: report._id || index,
            name:
              report.originalName ||
              report.filePath?.split("\\").pop()?.split("/").pop() ||
              `Report ${index + 1}`,
            uploadedAt: report.uploadedAt
              ? new Date(report.uploadedAt).toLocaleDateString()
              : "N/A"
          }));

        setRecentReports(mappedReports);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setMessage("Could not load dashboard data from backend.");
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-intro">
        <h1>Welcome, {localStorage.getItem("name") || "Patient"}!</h1>
        <p>Manage your health and appointments</p>
      </div>

      {message && (
        <p style={{ color: "#e67e22", fontWeight: "600", marginTop: "10px" }}>
          {message}
        </p>
      )}

      <div className="summary-grid">
        <div className="summary-card">
          <h2 style={{ color: "#3498DB" }}>{stats.upcoming}</h2>
          <p>Upcoming</p>
        </div>

        <div className="summary-card">
          <h2 style={{ color: "#27AE60" }}>{stats.completed}</h2>
          <p>Completed</p>
        </div>

        <div className="summary-card">
          <h2 style={{ color: "#F39C12" }}>{stats.reports}</h2>
          <p>Reports</p>
        </div>

        <div className="summary-card">
          <h2 style={{ color: "#E74C3C" }}>{stats.prescriptions}</h2>
          <p>Prescriptions</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Upcoming Appointment</h3>
        <div className="appointment-card">
          <div>
            <h4>Dr. Kavinda Silva</h4>
            <p>Cardiologist</p>
            <span>Tomorrow • 10:30 AM</span>
          </div>
          <button type="button">View Details</button>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Reports</h3>
          <a href="/patient/reports">View All</a>
        </div>

        {recentReports.length > 0 ? (
          recentReports.map((report) => (
            <div className="report-item" key={report.id}>
              <div>
                <strong>{report.name}</strong>
                <p>Uploaded on {report.uploadedAt}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No recent reports found</p>
        )}
      </div>
    </div>
  );
}