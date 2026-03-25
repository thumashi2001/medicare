import React from "react";
import { useNavigate } from "react-router-dom";

const AppointmentList = () => {
  const navigate = useNavigate();

  // Mock data
  const myAppointments = [
    { id: "APP-9987", doctor: "Dr. Kamal Perera", time: "10:30 AM" },
    { id: "APP-5542", doctor: "Dr. Sarah Silva", time: "02:15 PM" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Appointments</h2>
      {myAppointments.map((appt) => (
        <div
          key={appt.id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <h4>{appt.doctor}</h4>
          <p>
            ID: {appt.id} | Time: {appt.time}
          </p>
          <button
            onClick={() => navigate(`/video-room/${appt.id}`)}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Join Video Call
          </button>
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;
