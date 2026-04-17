import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AppointmentList = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5007/api/payments/admin/history",
        );
        setAppointments(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching from payment service:", err);
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading)
    return <div style={{ padding: "20px" }}>Loading Appointments...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px", color: "#2C3E50" }}>My Appointments</h2>
      
      {appointments.length === 0 ? (
        <p>No appointments found in the system.</p>
      ) : (
        appointments.map((appt) => (
          <div
            key={appt._id}
            style={{
              border: "1px solid #ddd",
              margin: "15px 0",
              padding: "20px",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: appt.status === "SUCCESS" ? "#fafffb" : "#fff",
            }}
          >
            <div>
              <h4 style={{ margin: "0 0 5px 0" }}>
                Patient: {appt.patientUsername}
              </h4>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                ID: <strong>{appt.appointmentId}</strong> | Amount:{" "}
                {appt.currency} {appt.amount}
              </p>
              
              <div style={{ marginTop: "8px" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    backgroundColor: appt.status === "SUCCESS" ? "#2ecc71" : "#E74C3C",
                    color: "white",
                  }}
                >
                  {appt.status === "SUCCESS" ? "PAID" : "NOT COMPLETED"}
                </span>
              </div>
            </div>

            <div>
              {/* Only show the button if payment is successful */}
              {appt.status === "SUCCESS" && (
                <button
                  onClick={() => navigate(`/video-room/${appt.appointmentId}`)}
                  style={{
                    backgroundColor: "#2ecc71",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Join Video Session
                </button>
              )}
              {/* No 'else' block here, so no button shows for unsuccessful payments */}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AppointmentList;