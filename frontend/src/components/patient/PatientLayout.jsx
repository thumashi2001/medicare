import { Outlet } from "react-router-dom";
import PatientSidebar from "./PatientSidebar";
import PatientHeader from "./PatientHeader";
import "./patientLayout.css";

export default function PatientLayout() {
  return (
    <div className="patient-layout">
      <PatientSidebar />
      <div className="patient-main">
        <PatientHeader />
        <div className="patient-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}