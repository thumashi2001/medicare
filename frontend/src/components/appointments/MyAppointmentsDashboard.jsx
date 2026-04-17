import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPatientAppointments,
  deleteAppointment,
  getPatientIdFromToken,
} from "../../services/appointmentApi";

const STATUS_COLORS = {
  Pending:   "bg-yellow-100 text-yellow-700 border-yellow-200",
  Confirmed: "bg-blue-100 text-blue-secondary border-blue-200",
  Cancelled: "bg-red-100 text-red-600 border-red-200",
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const DoctorAvatar = ({ name }) => {
  const initials = name
    .split(" ")
    .filter((w) => w !== "Dr.")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="w-11 h-11 rounded-full bg-green-light flex items-center justify-center text-green-dark font-bold text-sm flex-shrink-0">
      {initials}
    </div>
  );
};

export default function MyAppointmentsDashboard() {
  const navigate = useNavigate();
  const patientId = getPatientIdFromToken();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [cancellingId, setCancellingId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getPatientAppointments(patientId);
      setAppointments(res.data?.data || []);
    } catch {
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      setCancellingId(id);
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch {
      alert("Failed to cancel appointment. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const upcoming = appointments.filter((a) =>
    ["Pending", "Confirmed"].includes(a.status)
  );
  const cancelled = appointments.filter((a) => a.status === "Cancelled");
  const displayed = activeTab === "upcoming" ? upcoming : cancelled;

  return (
    <div className="min-h-screen bg-green-light p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage all your upcoming and past bookings</p>
        </div>
        <button
          onClick={() => navigate("/patient/find-doctors")}
          className="inline-flex items-center gap-2 bg-green-primary hover:bg-green-dark text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          + Book New Appointment
        </button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", count: appointments.length, color: "text-gray-700" },
          { label: "Upcoming", count: upcoming.length, color: "text-blue-secondary" },
          { label: "Cancelled", count: cancelled.length, color: "text-red-500" },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-white rounded-2xl px-4 py-3 shadow-sm text-center">
            <p className={`text-2xl font-bold ${color}`}>{count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm w-fit mb-5">
        {["upcoming", "cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-green-primary text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab} ({tab === "upcoming" ? upcoming.length : cancelled.length})
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-green-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchAppointments}
            className="text-red-700 underline text-xs ml-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && displayed.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-600 font-medium">
            No {activeTab === "upcoming" ? "upcoming" : "cancelled"} appointments
          </p>
          {activeTab === "upcoming" && (
            <button
              onClick={() => navigate("/patient/find-doctors")}
              className="mt-4 text-green-dark underline text-sm font-medium"
            >
              Book your first appointment →
            </button>
          )}
        </div>
      )}

      {/* Appointment List */}
      {!loading && !error && displayed.length > 0 && (
        <div className="space-y-4">
          {displayed.map((apt) => (
            <div
              key={apt._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <div className="flex items-start gap-4">
                <DoctorAvatar name={apt.doctorName} />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{apt.doctorName}</h3>
                      <p className="text-sm text-green-dark">{apt.doctorSpecialty}</p>
                    </div>
                    <span
                      className={`self-start sm:self-center text-xs font-medium px-3 py-1 rounded-full border ${STATUS_COLORS[apt.status]}`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <span>📅</span> {formatDate(apt.appointmentDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span>⏰</span> {apt.appointmentTime}
                    </span>
                  </div>

                  {/* Actions */}
                  {activeTab === "upcoming" && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleCancel(apt._id)}
                        disabled={cancellingId === apt._id}
                        className="text-xs font-medium px-4 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {cancellingId === apt._id ? "Cancelling..." : "Cancel Appointment"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
