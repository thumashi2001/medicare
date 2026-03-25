import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DummyAppointmentList from "./telemedicine/AppointmentList";

import TelemedicineSession from "./telemedicine/TelemedicineSession";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DummyAppointmentList />} />

        {/* just a dummy appointemnt list page for testing purposes in telemedicine*/}
        <Route path="/appointments" element={<DummyAppointmentList />} />
        <Route
          path="/video-room/:appointmentId"
          element={<TelemedicineSession />}
        />
      </Routes>
    </Router>
  );
}

export default App;
