export default function PatientHeader() {
  const name = localStorage.getItem("name") || "Patient";

  return (
    <header className="patient-header">
      <div>
        <h3>{name}</h3>
        <span>Patient</span>
      </div>
      <div className="patient-avatar">
        {name.charAt(0).toUpperCase()}
      </div>
    </header>
  );
}