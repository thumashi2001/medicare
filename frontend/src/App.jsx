import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminPaymentDashboard from "./payment/admin/AdminPaymentDashboard";
import PatientCheckout from "./payment/patient/PatientCheckout";

const App = () => {
  // Mock data for the patient
  const dummyPatient = {
    username: "yas_001",
    firstName: "Yasantha",
    lastName: "Perera",
    email: "yasantha@example.lk",
    phone: "0771234567",
    address: "123 Main Street",
    city: "Colombo"
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#F5F7FA]">
        {/* Navigation */}
        <nav className="p-4 bg-[#2C3E50] text-white flex justify-between items-center shadow-md">
          <div className="font-bold text-[#2ECC71] tracking-tighter text-xl">✚ SMART HEALTH</div>
          <div className="flex gap-6 text-xs uppercase tracking-widest font-bold items-center">
            <Link to="/" className="hover:text-[#2ECC71] transition-colors">
              Admin
            </Link>
            
            {/* Added Telemedicine Button */}
            <Link 
              to="/telemedicine" 
              className="hover:text-[#2ECC71] transition-colors border-l border-gray-600 pl-6"
            >
              Telemedicine
            </Link>

            <Link 
              to="/pay" 
              className="bg-[#F39C12] px-4 py-2 rounded-lg hover:bg-[#e67e22] transition-all shadow-md"
            >
              Pay
            </Link>
          </div>
        </nav>

        {/* Routing Logic */}
        <Routes>
          <Route path="/" element={<AdminPaymentDashboard />} />
          
          {/* Placeholder for Telemedicine Route */}
          <Route 
            path="/telemedicine" 
            element={<div className="p-10 text-center">Telemedicine Module Coming Soon...</div>} 
          />

          <Route 
            path="/pay" 
            element={
              <div className="py-16 px-4">
                <PatientCheckout 
                  appointmentId="APP-2026-X" 
                  patientData={dummyPatient} 
                />
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
