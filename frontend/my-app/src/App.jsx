import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPaymentDashboard from "./payment/admin/AdminPaymentDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminPaymentDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
