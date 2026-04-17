import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createAppointment, getPatientIdFromToken } from "../../services/appointmentApi";

const DOCTOR_API = "http://localhost:5003";
const todayISO = new Date().toISOString().split("T")[0];

const getNameFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.name || "";
  } catch {
    return "";
  }
};

// "HH:MM" 24h â†’ "08:30 AM"
const to12h = (time24) => {
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr || "00";
  const ampm = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
};

// Generate 30-minute slots between startTime and endTime ("HH:MM" strings)
const generateSlots = (startTime, endTime) => {
  const slots = [];
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  let cur = sh * 60 + sm;
  const end = eh * 60 + em;
  while (cur + 30 <= end) {
    const h = Math.floor(cur / 60);
    const m = cur % 60;
    slots.push(to12h(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`));
    cur += 30;
  }
  return slots;
};

// "YYYY-MM-DD" â†’ day name e.g. "Monday"
const getDayName = (dateStr) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  // Parse as local date to avoid timezone shift
  const [y, mo, d] = dateStr.split("-").map(Number);
  return days[new Date(y, mo - 1, d).getDay()];
};

export default function BookingModal({ doctor, onClose }) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Availability fetched from doctor-service
  const [availSlots, setAvailSlots] = useState([]);   // raw availability records
  const [availDays, setAvailDays] = useState([]);      // ["Monday", "Wednesday", ...]
  const [timeSlots, setTimeSlots] = useState([]);      // slots for selected date
  const [availLoading, setAvailLoading] = useState(true);

  // Fetch doctor availability on mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${DOCTOR_API}/api/doctors/${doctor._id}/availability`);
        const data = res.data?.data || [];
        setAvailSlots(data);
        const days = [...new Set(data.map((s) => s.dayOfWeek))];
        setAvailDays(days);
      } catch {
        // fall back silently â€” user will see "no slots" message
      } finally {
        setAvailLoading(false);
      }
    };
    fetch();
  }, [doctor._id]);

  // Recompute time slots when date changes
  useEffect(() => {
    setSelectedTime("");
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }
    const dayName = getDayName(selectedDate);
    const daySlots = availSlots.filter((s) => s.dayOfWeek === dayName && s.isAvailable);
    const generated = [];
    daySlots.forEach((s) => {
      generateSlots(s.startTime, s.endTime).forEach((t) => {
        if (!generated.includes(t)) generated.push(t);
      });
    });
    setTimeSlots(generated);
  }, [selectedDate, availSlots]);

  const handleConfirm = async () => {
    if (!selectedDate) { setError("Please select an appointment date."); return; }
    if (!selectedTime) { setError("Please select a time slot."); return; }
    setError("");
    setLoading(true);
    try {
      const patientId = getPatientIdFromToken();
      const patientName = getNameFromToken();
      const payload = {
        patientId,
        patientName,
        doctorId: doctor._id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
      };
      const res = await createAppointment(payload);
      const appointmentId = res.data?.data?._id;
      navigate(`/payment?apt_id=${appointmentId}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const selectedDayName = selectedDate ? getDayName(selectedDate) : "";
  const dateHasNoSlots = selectedDate && !availLoading && timeSlots.length === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="bg-green-dark px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Book Appointment</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {/* Doctor Info */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-light flex items-center justify-center text-green-dark font-bold text-lg flex-shrink-0">
            {doctor.name.split(" ").filter((w) => w !== "Dr.").map((w) => w[0]).slice(0, 2).join("")}
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

        {/* Available Days Info */}
        {!availLoading && availDays.length > 0 && (
          <div className="px-6 pt-4 pb-0">
            <p className="text-xs text-gray-500">
              Available on:{" "}
              <span className="font-medium text-green-dark">{availDays.join(", ")}</span>
            </p>
          </div>
        )}
        {!availLoading && availDays.length === 0 && (
          <div className="px-6 pt-4 pb-0">
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              This doctor has not set availability yet. Please check back later.
            </p>
          </div>
        )}

        {/* Form */}
        <div className="px-6 py-5 space-y-5">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Date</label>
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
              {selectedDayName && (
                <span className="ml-2 text-xs font-normal text-gray-400">({selectedDayName})</span>
              )}
            </label>

            {availLoading ? (
              <p className="text-sm text-gray-400">Loading availabilityâ€¦</p>
            ) : !selectedDate ? (
              <p className="text-sm text-gray-400">Please select a date first.</p>
            ) : dateHasNoSlots ? (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                No slots available on {selectedDayName}. Please choose a different date.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
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
            )}
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
              {new Date(...selectedDate.split("-").map((v, i) => i === 1 ? Number(v) - 1 : Number(v))).toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
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
            disabled={loading || availDays.length === 0}
            className="flex-1 bg-green-primary hover:bg-green-dark text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Booking...
              </>
            ) : (
              <>Confirm Booking &#8594;</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
