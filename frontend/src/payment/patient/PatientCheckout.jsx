import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PatientCheckout = () => {
  const { appointmentId } = useParams(); // Get ID from URL
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // New State for User Input
  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    email: "yasantha@example.lk", // Default or empty
    phone: "0771234567",
    address: "123 Main Street",
    city: "Colombo",
    username: "user_" + Math.floor(Math.random() * 100), // Mock username
  });

  // SDK Loading Logic (Same as before)
  useEffect(() => {
    if (typeof window.payhere === "undefined") {
      const script = document.createElement("script");
      script.src = "https://www.payhere.lk/lib/payhere.js";
      script.type = "text/javascript";
      script.async = true;
      script.setAttribute("data-payhere-sdk", "true");
      document.head.appendChild(script);
    }
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault(); // Prevent form reload

    if (!patientData.firstName || !patientData.lastName) {
      alert("Please enter your full name");
      return;
    }

    if (typeof window.payhere === "undefined") {
      alert("Payment Gateway loading...");
      return;
    }

    setIsProcessing(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5007/api/payments/initiate",
        {
          appointmentId,
          patientUsername: patientData.username,
        },
      );

      const payment = {
        sandbox: true,
        merchant_id: data.merchant_id,
        return_url: window.location.href,
        cancel_url: window.location.href,
        notify_url:
          "https://spendable-unlit-pants.ngrok-free.dev/api/payments/notify",
        order_id: data.order_id,
        items: `Consultation: ${appointmentId}`,
        amount: String(data.amount),
        currency: data.currency,
        hash: data.hash,
        first_name: patientData.firstName,
        last_name: patientData.lastName,
        email: patientData.email,
        phone: patientData.phone,
        address: patientData.address,
        city: patientData.city,
        country: "Sri Lanka",
      };

      window.payhere.startPayment(payment);
      window.payhere.onCompleted = () => {
        setPaymentStatus("success");
        setIsProcessing(false);
      };
      window.payhere.onError = () => {
        setPaymentStatus("error");
        setIsProcessing(false);
      };
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-xl border border-[#E0E0E0]">
      <h2 className="text-2xl font-bold text-center text-[#2C3E50] mb-2">
        Book Appointment
      </h2>
      <p className="text-center text-gray-400 text-sm mb-6">
        ID: <span className="font-mono text-blue-500">{appointmentId}</span>
      </p>

      <form onSubmit={handlePayment} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">
              First Name
            </label>
            <input
              className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-[#2ECC71] outline-none"
              type="text"
              required
              value={patientData.firstName}
              onChange={(e) =>
                setPatientData({ ...patientData, firstName: e.target.value })
              }
              placeholder="First Name"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">
              Last Name
            </label>
            <input
              className="w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-[#2ECC71] outline-none"
              type="text"
              required
              value={patientData.lastName}
              onChange={(e) =>
                setPatientData({ ...patientData, lastName: e.target.value })
              }
              placeholder="Last Name"
            />
          </div>
        </div>

        {paymentStatus === "success" && (
          <div className="p-4 bg-[#E8F8F5] text-[#27AE60] rounded-xl text-center font-bold">
            ✓ Payment Successful
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || paymentStatus === "success"}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            isProcessing || paymentStatus === "success"
              ? "bg-gray-300"
              : "bg-[#F39C12] text-white hover:shadow-lg"
          }`}
        >
          {isProcessing
            ? "Processing..."
            : paymentStatus === "success"
              ? "Confirmed"
              : "Confirm & Pay"}
        </button>
      </form>
    </div>
  );
};

export default PatientCheckout;
