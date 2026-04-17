import { useEffect, useState } from "react";
import API from "../../api/axios";
import { getPatientAppointments, getPatientIdFromToken } from "../../services/appointmentApi";
import "./patientDashboard.css";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export default function PatientDashboard() {
  const [stats, setStats] = useState({ upcoming: 0, confirmed: 0, reports: 0, prescriptions: 0 });
  const [nextAppointment, setNextAppointment] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const patientId = getPatientIdFromToken();

        const [profileRes, prescriptionsRes, apptRes] = await Promise.all([
          API.get("/patients/profile").catch(() => ({ data: {} })),
          API.get("/patients/prescriptions").catch(() => ({ data: [] })),
          getPatientAppointments(patientId).catch(() => ({ data: { data: [] } })),
        ]);

        const profileData = profileRes.data || {};
        const reports = Array.isArray(profileData.reports) ? profileData.reports : [];
        const prescriptions = Array.isArray(prescriptionsRes.data) ? prescriptionsRes.data : [];
        const appointments = apptRes.data?.data || [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingAppts = appointments.filter(
          (a) =>
            (a.status === "Pending" || a.status === "Confirmed") &&
            new Date(a.appointmentDate) >= today
        );

        const confirmedCount = appointments.filter((a) => a.status === "Confirmed").length;

        setStats({
          upcoming: upcomingAppts.length,
          confirmed: confirmedCount,
          reports: reports.length,
          prescriptions: prescriptions.length,
        });

        const sorted = [...upcomingAppts].sort(
          (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
        );
        setNextAppointment(sorted[0] || null);

        const mappedReports = reports
          .slice(-3)
          .reverse()
          .map((report, index) => ({
            id: report._id || index,
            name:
              report.originalName ||
              report.filePath?.split("\\").pop()?.split("/").pop() ||
              `Report ${index + 1}`,
            uploadedAt: report.uploadedAt
              ? new Date(report.uploadedAt).toLocaleDateString()
              : "N/A",
          }));

        setRecentReports(mappedReports);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setMessage("Could not load some dashboard data.");
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

      {message && <p className="dashboard-message">{message}</p>}

      <div className="summary-grid">
        <div className="summary-card">
          <h2 className="summary-blue">{stats.upcoming}</h2>
          <p>Upcoming</p>
        </div>

        <div className="summary-card">
          <h2 className="summary-green">{stats.confirmed}</h2>
          <p>Confirmed</p>
        </div>

        <div className="summary-card">
          <h2 className="summary-orange">{stats.reports}</h2>
          <p>Reports</p>
        </div>

        <div className="summary-card">
          <h2 className="summary-red">{stats.prescriptions}</h2>
          <p>Prescriptions</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Upcoming Appointment</h3>

        {nextAppointment ? (
          <div className="appointment-card">
            <div className="appointment-left">
              <div className="doctor-avatar">
                {nextAppointment.doctorName
                  ?.split(" ")
                  .filter((w) => w !== "Dr.")
                  .map((w) => w[0])
                  .slice(0, 1)
                  .join("") || "D"}
              </div>

              <div className="appointment-info">
                <h4>{nextAppointment.doctorName}</h4>
                <p>{nextAppointment.doctorSpecialty}</p>
                <span>
                  {formatDate(nextAppointment.appointmentDate)} &bull;{" "}
                  {nextAppointment.appointmentTime}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => (window.location.href = "/patient/appointments")}
            >
              View Details
            </button>
          </div>
        ) : (
          <div className="empty-state">
            <p>No upcoming appointments.</p>
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Reports</h3>
          <a href="/patient/reports">View All</a>
        </div>

        {recentReports.length > 0 ? (
          recentReports.map((report) => (
            <div className="report-item" key={report.id}>
              <div className="report-text">
                <strong>{report.name}</strong>
                <p>Uploaded on {report.uploadedAt}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No recent reports found</p>
          </div>
        )}
      </div>
    </div>
  );
}
