import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminPaymentDashboard from "./payment/admin/AdminPaymentDashboard";
import PatientCheckout from "./payment/patient/PatientCheckout";
import AppointmentList from "./telemedicine/AppointmentList"; 
import TelemedicineSession from "./telemedicine/TelemedicineSession"; 

const App = () => {
  // Logic to generate a unique ID when the user clicks "Book Appointment"
  const generateAppointmentId = () => `APP-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <Router>
      <div className="min-h-screen bg-[#F5F7FA]">
        <nav className="p-4 bg-[#2C3E50] text-white flex justify-between items-center shadow-md">
          <div className="font-bold text-[#2ECC71] tracking-tighter text-xl">✚ SMART HEALTH</div>
          <div className="flex gap-6 text-xs uppercase tracking-widest font-bold items-center">
            <Link to="/" className="hover:text-[#2ECC71]">Admin</Link>
            <Link to="/telemedicine" className="hover:text-[#2ECC71] border-l border-gray-600 pl-6">Telemedicine</Link>
            
            {/* Nav Link now generates a random ID on click */}
            <Link 
              to={`/pay/${generateAppointmentId()}`} 
              className="bg-[#F39C12] px-4 py-2 rounded-lg hover:bg-[#e67e22] transition-all shadow-md"
            >
              Book Appointment
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<AdminPaymentDashboard />} />
          <Route path="/telemedicine" element={<AppointmentList />} />
          <Route path="/video-room/:appointmentId" element={<TelemedicineSession />} />
          
          {/* Dynamic Payment Route */}
          <Route path="/pay/:appointmentId" element={<PatientCheckout />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;