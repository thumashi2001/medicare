import { useEffect, useState } from "react";
import adminAPI from "../../api/adminApi";
import "./adminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingDoctors: 0,
    transactions: "Rs. 0.00",
    activeAppointments: 0
  });

  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          adminAPI.get("/stats"),
          adminAPI.get("/recent-activities")
        ]);

        const statsData = statsRes.data || {};
        const activitiesData = activitiesRes.data || [];

        setStats({
          totalUsers: statsData.totalUsers || 0,
          pendingDoctors: statsData.pendingDoctors || 0,
          transactions: statsData.transactions || "Rs. 0.00",
          activeAppointments: statsData.activeAppointments || 0
        });

        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
      } catch (error) {
        console.error("Admin dashboard fetch error:", error);
        setMessage("Could not load admin dashboard data.");
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="admin-dashboard-page">
      <h2>Admin Dashboard</h2>
      <p className="admin-subtitle">Monitor and manage the MediCare+ platform</p>

      {message && <p className="admin-message">{message}</p>}

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h4>Total Users</h4>
          <h3 className="blue">{stats.totalUsers}</h3>
        </div>

        <div className="admin-stat-card">
          <h4>Pending Doctor Verifications</h4>
          <h3 className="danger">{stats.pendingDoctors}</h3>
        </div>

        <div className="admin-stat-card">
          <h4>Today's Transactions</h4>
          <h3 className="warning">{stats.transactions}</h3>
        </div>

        <div className="admin-stat-card">
          <h4>Active Appointments</h4>
          <h3>{stats.activeAppointments}</h3>
        </div>
      </div>

      <div className="admin-dashboard-bottom">
        <div className="admin-panel">
          <div className="panel-header">
            <h3>Recent Activities</h3>
          </div>

          {activities.length > 0 ? (
            activities.map((item, index) => (
              <div key={index} className="activity-item">
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            ))
          ) : (
            <p>No recent activities found</p>
          )}
        </div>

        <div className="admin-panel quick-actions">
          <h3>Quick Actions</h3>
          <button type="button">Manage Users</button>
          <button type="button">Verify Doctors</button>
          <button type="button">View Transactions</button>
        </div>
      </div>
    </div>
  );
}