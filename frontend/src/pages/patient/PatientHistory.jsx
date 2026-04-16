import "./patientHistory.css";

export default function PatientHistory() {
  return (
    <div className="history-page">
      <h2>Health History</h2>
      <p className="page-subtitle">View your medical history</p>

      <div className="history-tabs">
        <button className="active">Summary</button>
        <button>Conditions</button>
        <button>Allergies</button>
        <button>Surgeries</button>
      </div>

      <div className="history-summary-grid">
        <div className="history-info-card">
          <span>Blood Group</span>
          <strong>O+</strong>
        </div>
        <div className="history-info-card">
          <span>Height</span>
          <strong>165 cm</strong>
        </div>
        <div className="history-info-card">
          <span>Weight</span>
          <strong>58 kg</strong>
        </div>
        <div className="history-info-card">
          <span>Last Checkup</span>
          <strong>12 Dec 2023</strong>
        </div>
      </div>

      <div className="history-section">
        <h3>Medical Conditions</h3>
        <ul>
          <li>Hypertension (Since 2022)</li>
          <li>Seasonal Allergies</li>
        </ul>
      </div>

      <div className="history-section">
        <h3>Allergies</h3>
        <ul>
          <li>Penicillin</li>
        </ul>
      </div>
    </div>
  );
}