import "./patientAppointments.css";

export default function PatientAppointments() {
  const appointments = [
    {
      doctor: "Dr. Kavinda Silva",
      specialty: "Cardiologist",
      time: "Tomorrow, 10:30 AM",
      status: "Pending"
    },
    {
      doctor: "Dr. Nirmali Perera",
      specialty: "Dermatologist",
      time: "25 May 2024, 02:00 PM",
      status: "Confirmed"
    },
    {
      doctor: "Dr. Wasantha Jayasinghe",
      specialty: "General Physician",
      time: "10 May 2024, 09:00 AM",
      status: "Completed"
    }
  ];

  return (
    <div className="appointments-page">
      <div className="page-header">
        <div>
          <h2>My Appointments</h2>
          <p>View and manage your bookings</p>
        </div>
        <button className="book-btn">Book New Appointment</button>
      </div>

      <div className="appointment-tabs">
        <button className="active">Upcoming</button>
        <button>Completed</button>
        <button>Cancelled</button>
      </div>

      <div className="appointments-list">
        {appointments.map((item, index) => (
          <div className="appointment-item" key={index}>
            <div>
              <h4>{item.doctor}</h4>
              <p>{item.specialty}</p>
              <span>{item.time}</span>
            </div>
            <div className="appointment-actions">
              <span className={`status-pill ${item.status.toLowerCase()}`}>
                {item.status}
              </span>
              <button>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}