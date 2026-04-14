import React, { useState, useEffect } from "react";
import axios from "axios";

const PatientCheckout = ({ appointmentId, patientData }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // 🛡️ SELF-LOADING SDK LOGIC
  useEffect(() => {
    if (typeof window.payhere === "undefined") {
      const script = document.createElement("script");
      script.src = "https://www.payhere.lk/lib/payhere.js";
      script.type = "text/javascript";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    // Check again before starting
    if (typeof window.payhere === "undefined") {
      alert(
        "Payment Gateway is still loading. Please wait 2 seconds and try again.",
      );
      return;
    }

    setIsProcessing(true);
    setPaymentStatus(null);

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
        return_url: `${window.location.origin}/pay`,
        cancel_url: `${window.location.origin}/pay`,
        notify_url: "https://your-ngrok-url.ngrok-free.app/api/payments/notify",
        order_id: data.order_id,
        items: `Consultation: ${appointmentId}`,
        amount: String(data.amount), // FIXED
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

      window.payhere.onDismissed = () => setIsProcessing(false);

      window.payhere.onError = (err) => {
        console.error(err);
        setPaymentStatus("error");
        setIsProcessing(false);
      };
    } catch (error) {
      alert("Backend connection failed.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-xl border border-[#E0E0E0]">
      <h2 className="text-2xl font-bold text-center text-[#2C3E50] mb-6">
        Confirm & Pay
      </h2>

      <div className="bg-[#F5F7FA] rounded-2xl p-5 mb-8 space-y-3 border border-[#E0E0E0]/50">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Appointment</span>
          <span className="font-mono font-bold text-[#3498DB]">
            {appointmentId}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Patient</span>
          <span className="font-semibold">
            {patientData.firstName} {patientData.lastName}
          </span>
        </div>
      </div>

      {paymentStatus === "success" && (
        <div className="mb-6 p-4 bg-[#E8F8F5] text-[#27AE60] rounded-xl text-center font-bold">
          ✓ Paid
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isProcessing || paymentStatus === "success"}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          isProcessing || paymentStatus === "success"
            ? "bg-gray-300 text-gray-500"
            : "bg-[#F39C12] text-white hover:bg-[#e67e22] shadow-lg shadow-[#F39C12]/20"
        }`}
      >
        {isProcessing
          ? "Processing..."
          : paymentStatus === "success"
            ? "Confirmed"
            : "Pay Now"}
      </button>

      <div className="mt-8 pt-6 border-t text-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          🔒 Secure SSL Payment via PayHere
        </span>
      </div>
    </div>
  );
};

export default PatientCheckout;
