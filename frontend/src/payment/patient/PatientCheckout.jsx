import React, { useState, useEffect } from "react";
import axios from "axios";

const PatientCheckout = ({ appointmentId, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // All details captured via inputs manually to avoid API 404s
  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

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

  const handlePayment = async () => {
    if (!billing.firstName || !billing.email || !billing.phone || !billing.address) {
      alert("All fields are required.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Backend Initiation
      // Uses the manually entered email as patientUsername
      const { data } = await axios.post(
        "http://localhost:5007/api/payments/initiate",
        {
          appointmentId: appointmentId,
          patientUsername: billing.email,
        }
      );

      const payment = {
        sandbox: data.sandbox,
        merchant_id: data.merchant_id,
        return_url: `${window.location.origin}/patient/appointments`,
        cancel_url: `${window.location.origin}/patient/appointments`,
        notify_url: data.notify_url,
        order_id: data.order_id,
        items: `Consultation: ${appointmentId}`,
        amount: data.amount,
        currency: data.currency,
        hash: data.hash,
        first_name: billing.firstName,
        last_name: billing.lastName,
        email: billing.email,
        phone: billing.phone,
        address: billing.address,
        city: "Colombo",
        country: "Sri Lanka",
      };

      window.payhere.startPayment(payment);

      window.payhere.onCompleted = () => {
        setPaymentStatus("success");
        setIsProcessing(false);
        setTimeout(() => { if (onSuccess) onSuccess(); }, 2000);
      };

      window.payhere.onDismissed = () => setIsProcessing(false);
      window.payhere.onError = (err) => {
        console.error(err);
        setIsProcessing(false);
      };
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || "Payment Initiation Failed";
      alert(`Error: ${msg}`);
      setIsProcessing(false);
    }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#F39C12] outline-none transition-all";
  const labelClass = "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1";

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-xl border border-[#E0E0E0]">
      <h2 className="text-2xl font-bold text-center text-[#2C3E50] mb-6">Billing Information</h2>

      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>First Name</label>
            <input type="text" className={inputClass} placeholder="First Name" value={billing.firstName} onChange={(e) => setBilling({...billing, firstName: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input type="text" className={inputClass} placeholder="Last Name" value={billing.lastName} onChange={(e) => setBilling({...billing, lastName: e.target.value})} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Email Address</label>
          <input type="email" className={inputClass} placeholder="Email" value={billing.email} onChange={(e) => setBilling({...billing, email: e.target.value})} />
        </div>
        <div>
          <label className={labelClass}>Phone Number</label>
          <input type="text" className={inputClass} placeholder="07XXXXXXXX" value={billing.phone} onChange={(e) => setBilling({...billing, phone: e.target.value})} />
        </div>
        <div>
          <label className={labelClass}>Address</label>
          <input type="text" className={inputClass} placeholder="Street Address" value={billing.address} onChange={(e) => setBilling({...billing, address: e.target.value})} />
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing || paymentStatus === "success"}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          isProcessing || paymentStatus === "success" 
            ? "bg-gray-100 text-gray-400" 
            : "bg-[#F39C12] text-white hover:bg-[#e67e22] active:scale-95 shadow-lg shadow-[#F39C12]/20"
        }`}
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PatientCheckout;