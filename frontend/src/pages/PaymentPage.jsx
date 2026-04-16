import { useSearchParams, useNavigate } from "react-router-dom";
import { updateAppointmentStatus, getAppointmentById } from "../services/appointmentApi";
import { useState, useEffect } from "react";

const CONSULTATION_FEE = 2500; // LKR — default fee shown on summary
const SERVICE_FEE = 250;

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ── Step indicator ────────────────────────────────────────────────────────────
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
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  done
                    ? "bg-green-primary border-green-primary text-white"
                    : active
                    ? "bg-white border-green-primary text-green-dark"
                    : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {done ? "✓" : num}
              </div>
              <span
                className={`text-xs mt-1 font-medium whitespace-nowrap ${
                  active ? "text-green-dark" : done ? "text-green-primary" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mb-5 mx-1 transition-colors ${
                  step > num ? "bg-green-primary" : "bg-gray-200"
                }`}
              />
            )}
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

  // step 1 = summary, step 2 = payment form, step 3 = success
  const [step, setStep] = useState(1);
  const [appointment, setAppointment] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");

  // Card form state
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [cardErrors, setCardErrors] = useState({});

  // Fetch appointment details on mount
  useEffect(() => {
    if (!aptId) {
      setFetchError("No appointment ID provided.");
      setFetchLoading(false);
      return;
    }
    const load = async () => {
      try {
        const res = await getAppointmentById(aptId);
        setAppointment(res.data?.data || res.data);
      } catch {
        setFetchError("Could not load appointment details.");
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [aptId]);

  // ── Card input formatters ─────────────────────────────────────────────────
  const handleCardNumber = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = val.replace(/(.{4})/g, "$1 ").trim();
    setCard((p) => ({ ...p, number: formatted }));
  };

  const handleExpiry = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted = val.length > 2 ? `${val.slice(0, 2)} / ${val.slice(2)}` : val;
    setCard((p) => ({ ...p, expiry: formatted }));
  };

  const validateCard = () => {
    const errs = {};
    if (card.number.replace(/\s/g, "").length < 16) errs.number = "Enter a valid 16-digit card number.";
    if (!card.name.trim()) errs.name = "Cardholder name is required.";
    if (card.expiry.replace(/\s\/\s/g, "").length < 4) errs.expiry = "Enter a valid expiry date.";
    if (card.cvv.length < 3) errs.cvv = "CVV must be 3 digits.";
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePay = async () => {
    if (!validateCard()) return;
    setPayLoading(true);
    setPayError("");
    try {
      await updateAppointmentStatus(aptId, "Confirmed");
      setStep(3);
    } catch {
      setPayError("Payment processing failed. Please try again.");
    } finally {
      setPayLoading(false);
    }
  };

  const total = CONSULTATION_FEE + SERVICE_FEE;

  // ── Loading / error state ─────────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-green-light flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-green-light flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-sm w-full">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="text-gray-700 font-medium">{fetchError}</p>
          <button
            onClick={() => navigate("/patient/appointments")}
            className="mt-5 w-full bg-green-primary hover:bg-green-dark text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  // ── Step 3 — Success ──────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="min-h-screen bg-green-light flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-sm w-full">
          <Steps step={3} />
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 text-sm mb-4">
            Your appointment with{" "}
            <span className="font-semibold text-gray-700">{appointment?.doctorName}</span> has been confirmed.
          </p>
          <div className="bg-green-light rounded-xl p-3 text-sm text-gray-700 mb-6 text-left space-y-1">
            <p><span className="text-gray-500">Date:</span> {appointment && formatDate(appointment.appointmentDate)}</p>
            <p><span className="text-gray-500">Time:</span> {appointment?.appointmentTime}</p>
            <p><span className="text-gray-500">Amount Paid:</span> <strong>LKR {total.toLocaleString()}</strong></p>
          </div>
          <button
            onClick={() => navigate("/patient/appointments")}
            className="w-full bg-green-primary hover:bg-green-dark text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            View My Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-light flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">

        <Steps step={step} />

        {/* ── STEP 1: Booking Summary ─────────────────────────────────────── */}
        {step === 1 && (
          <>
            <h1 className="text-xl font-bold text-gray-800 mb-1">Booking Summary</h1>
            <p className="text-sm text-gray-500 mb-5">Review your appointment before proceeding to payment.</p>

            {/* Doctor info */}
            <div className="flex items-center gap-4 bg-green-light rounded-2xl p-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-green-dark flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {appointment?.doctorName
                  ?.split(" ")
                  .filter((w) => w !== "Dr.")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("") || "DR"}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{appointment?.doctorName}</p>
                <p className="text-sm text-green-dark">{appointment?.doctorSpecialty}</p>
              </div>
            </div>

            {/* Appointment details */}
            <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 mb-4 text-sm">
              <div className="flex justify-between px-4 py-3">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-800">{formatDate(appointment?.appointmentDate)}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-gray-500">Time</span>
                <span className="font-medium text-gray-800">{appointment?.appointmentTime}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-gray-500">Status</span>
                <span className="text-yellow-600 font-medium bg-yellow-50 px-2 py-0.5 rounded-full text-xs">
                  {appointment?.status}
                </span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-gray-500">Appointment ID</span>
                <span className="font-mono text-xs text-gray-600">{aptId?.slice(-8).toUpperCase()}</span>
              </div>
            </div>

            {/* Fee breakdown */}
            <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 mb-6 text-sm">
              <div className="flex justify-between px-4 py-3">
                <span className="text-gray-500">Consultation Fee</span>
                <span className="font-medium text-gray-800">LKR {CONSULTATION_FEE.toLocaleString()}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-gray-500">Service Fee</span>
                <span className="font-medium text-gray-800">LKR {SERVICE_FEE.toLocaleString()}</span>
              </div>
              <div className="flex justify-between px-4 py-3 bg-green-light rounded-b-2xl">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-bold text-green-dark text-base">LKR {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-green-primary hover:bg-green-dark text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Proceed to Payment →
            </button>
            <button
              onClick={() => navigate("/patient/appointments")}
              className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              Cancel & go back
            </button>
          </>
        )}

        {/* ── STEP 2: Payment Form ────────────────────────────────────────── */}
        {step === 2 && (
          <>
            <h1 className="text-xl font-bold text-gray-800 mb-1">Payment Details</h1>
            <p className="text-sm text-gray-500 mb-5">
              Total payable: <span className="font-bold text-green-dark">LKR {total.toLocaleString()}</span>
            </p>

            {/* Card form */}
            <div className="space-y-4 mb-5">
              {/* Card number */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Card Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="1234 5678 9012 3456"
                  value={card.number}
                  onChange={handleCardNumber}
                  maxLength={19}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary tracking-widest ${
                    cardErrors.number ? "border-red-300" : "border-gray-200"
                  }`}
                />
                {cardErrors.number && <p className="text-xs text-red-500 mt-1">{cardErrors.number}</p>}
              </div>

              {/* Cardholder name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Name on card"
                  value={card.name}
                  onChange={(e) => setCard((p) => ({ ...p, name: e.target.value }))}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary ${
                    cardErrors.name ? "border-red-300" : "border-gray-200"
                  }`}
                />
                {cardErrors.name && <p className="text-xs text-red-500 mt-1">{cardErrors.name}</p>}
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM / YY"
                    value={card.expiry}
                    onChange={handleExpiry}
                    maxLength={7}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary ${
                      cardErrors.expiry ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                  {cardErrors.expiry && <p className="text-xs text-red-500 mt-1">{cardErrors.expiry}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">CVV</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    placeholder="•••"
                    value={card.cvv}
                    onChange={(e) =>
                      setCard((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) }))
                    }
                    maxLength={3}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary ${
                      cardErrors.cvv ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                  {cardErrors.cvv && <p className="text-xs text-red-500 mt-1">{cardErrors.cvv}</p>}
                </div>
              </div>
            </div>

            {/* Secure notice */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
              <span>🔒</span>
              <span>Your payment is secured with 256-bit SSL encryption.</span>
            </div>

            {payError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                {payError}
              </p>
            )}

            <button
              onClick={handlePay}
              disabled={payLoading}
              className="w-full bg-green-primary hover:bg-green-dark text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
            >
              {payLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>🔒 Pay LKR {total.toLocaleString()}</>
              )}
            </button>

            <button
              onClick={() => setStep(1)}
              disabled={payLoading}
              className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              ← Back to Summary
            </button>
          </>
        )}
      </div>
    </div>
  );
}
