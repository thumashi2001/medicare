import { useSearchParams, useNavigate } from "react-router-dom";
import { getAppointmentById, updateAppointmentStatus } from "../services/appointmentApi";
import { useState, useEffect } from "react";
import PatientCheckout from "../payment/patient/PatientCheckout";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

function Steps({ step }) {
  const steps = ["Booking Summary", "Payment Details", "Confirmation"];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => {
        const num = i + 1;
        const active = step === num;
        const done = step > num;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  done ? "bg-green-primary border-green-primary text-white" : active ? "bg-white border-green-primary text-green-dark" : "bg-white border-gray-200 text-gray-400"
                }`}>
                {done ? "✓" : num}
              </div>
              <span className={`text-xs mt-1 font-medium whitespace-nowrap ${active ? "text-green-dark" : done ? "text-green-primary" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && <div className={`w-12 h-0.5 mb-5 mx-1 transition-colors ${step > num ? "bg-green-primary" : "bg-gray-200"}`} />}
          </div>
        );
      })}
    </div>
  );
}

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const aptId = searchParams.get("apt_id");

  const [step, setStep] = useState(1);
  const [appointment, setAppointment] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (!aptId) return navigate("/patient/appointments");
    const load = async () => {
      try {
        const res = await getAppointmentById(aptId);
        setAppointment(res.data?.data || res.data);
      } catch (err) {
        console.error("Error loading appointment:", err);
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [aptId, navigate]);

  // This function ensures the Appointment DB is updated once payment finishes
  const handlePaymentSuccess = async () => {
    try {
      await updateAppointmentStatus(aptId, "Confirmed");
      setStep(3);
    } catch (error) {
      console.error("Appointment DB update failed:", error);
      alert("Payment successful, but we couldn't update your appointment status. Please contact support.");
      setStep(3); 
    }
  };

  if (fetchLoading) return <div className="min-h-screen bg-green-light flex items-center justify-center"><div className="w-10 h-10 border-4 border-green-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-green-light flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Steps step={step} />
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h1 className="text-xl font-bold text-gray-800 mb-1">Booking Summary</h1>
          <p className="text-sm text-gray-500 mb-5">Verify your details before payment.</p>

          <div className="flex items-center gap-4 bg-green-light rounded-2xl p-4 mb-6 text-sm">
            <div className="w-12 h-12 rounded-full bg-green-dark flex items-center justify-center text-white font-bold">
              {appointment?.doctorName?.charAt(0) || "D"}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{appointment?.doctorName}</p>
              <p className="text-green-dark font-medium">{appointment?.doctorSpecialty}</p>
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 mb-8 text-sm">
            <div className="flex justify-between px-5 py-4">
              <span className="text-gray-400">Date</span>
              <span className="font-semibold text-gray-800">{formatDate(appointment?.appointmentDate)}</span>
            </div>
            <div className="flex justify-between px-5 py-4">
              <span className="text-gray-400">Time</span>
              <span className="font-semibold text-gray-800">{appointment?.appointmentTime}</span>
            </div>
          </div>

          <button onClick={() => setStep(2)} className="w-full bg-green-primary text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-green-dark transition-all">
            Proceed to Payment →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
          <PatientCheckout 
            appointmentId={aptId} 
            onSuccess={handlePaymentSuccess} 
          />
          <button onClick={() => setStep(1)} className="w-full mt-4 text-xs text-gray-400 font-black uppercase text-center hover:text-gray-600">← Back</button>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-sm w-full animate-in zoom-in-95 duration-300">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Success!</h2>
          <p className="text-gray-500 text-sm mb-6">Payment completed and appointment confirmed.</p>
          <button onClick={() => navigate("/patient/appointments")} className="w-full bg-green-primary text-white font-semibold py-3 rounded-xl shadow-lg">View My Appointments</button>
        </div>
      )}
    </div>
  );
}