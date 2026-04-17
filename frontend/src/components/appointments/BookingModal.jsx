import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAppointment, getPatientIdFromToken } from "../../services/appointmentApi";

const TIME_SLOTS = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

// Minimum date = today
const todayISO = new Date().toISOString().split("T")[0];

export default function BookingModal({ doctor, onClose }) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!selectedDate) {
      setError("Please select an appointment date.");
      return;
    }
    if (!selectedTime) {
      setError("Please select a time slot.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const patientId = getPatientIdFromToken();

      const payload = {
        patientId,
        doctorId: doctor._id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
      };

      const res = await createAppointment(payload);
      const appointmentId = res.data?.data?._id;

      // Redirect to payment page with appointment ID
      navigate(`/payment?apt_id=${appointmentId}`);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to book appointment. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Prevent backdrop click from bubbling
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="bg-green-dark px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Book Appointment</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Doctor Info */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-light flex items-center justify-center text-green-dark font-bold text-lg flex-shrink-0">
            {doctor.name
              .split(" ")
              .filter((w) => w !== "Dr.")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{doctor.name}</p>
            <p className="text-sm text-green-dark">{doctor.specialty}</p>
            {doctor.fee && (
              <p className="text-xs text-gray-500 mt-0.5">
                Fee: <span className="font-medium text-gray-700">LKR {doctor.fee.toLocaleString()}</span>
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-5">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select Date
            </label>
            <input
              type="date"
              min={todayISO}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary"
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time Slot
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`text-xs py-2 rounded-lg border font-medium transition-colors ${
                    selectedTime === slot
                      ? "bg-green-primary border-green-primary text-white"
                      : "border-gray-200 text-gray-600 hover:border-green-primary hover:text-green-dark"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Summary */}
          {selectedDate && selectedTime && (
            <div className="bg-green-light rounded-xl p-3 text-sm text-gray-700">
              <span className="font-medium">Summary: </span>
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              at {selectedTime}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-green-primary hover:bg-green-dark text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Booking...
              </>
            ) : (
              "Confirm Booking →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
