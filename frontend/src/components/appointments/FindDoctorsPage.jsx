import { useState, useEffect } from "react";
import { getDoctors } from "../../services/appointmentApi";
import BookingModal from "./BookingModal";

const SPECIALTIES = ["All", "Cardiologist", "Dermatologist", "General Physician", "Neurologist", "Orthopedic"];

const StarRating = ({ rating }) => (
  <span className="text-yellow-400 text-sm">
    {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
    <span className="text-gray-500 ml-1 text-xs">{rating}</span>
  </span>
);

const DoctorAvatar = ({ name }) => {
  const initials = name
    .split(" ")
    .filter((w) => w !== "Dr.")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold bg-green-dark flex-shrink-0">
      {initials}
    </div>
  );
};

export default function FindDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getDoctors();
        setDoctors(res.data);
        setFiltered(res.data);
      } catch {
        setError("Unable to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    let list = [...doctors];
    if (specialty !== "All") {
      list = list.filter((d) => d.specialty === specialty);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          (d.hospital && d.hospital.toLowerCase().includes(q))
      );
    }
    setFiltered(list);
  }, [search, specialty, doctors]);

  return (
    <div className="min-h-screen bg-green-light p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Find a Doctor</h1>
        <p className="text-gray-500 mt-1">Search and book appointments with our specialists</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, specialty or hospital..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-primary"
        />
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-primary"
        >
          {SPECIALTIES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* State Messages */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-green-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No doctors found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      )}

      {/* Doctor Cards Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4"
            >
              {/* Top Section */}
              <div className="flex items-start gap-4">
                <DoctorAvatar name={doctor.name} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{doctor.name}</h3>
                  <span className="inline-block text-xs font-medium bg-green-light text-green-dark px-2 py-0.5 rounded-full mt-0.5">
                    {doctor.specialty}
                  </span>
                  <div className="mt-1">
                    <StarRating rating={doctor.rating} />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm text-gray-600">
                {doctor.hospital && (
                  <div className="flex items-center gap-2">
                    <span className="text-green-dark">🏥</span>
                    <span className="truncate">{doctor.hospital}</span>
                  </div>
                )}
                {doctor.experience && (
                  <div className="flex items-center gap-2">
                    <span className="text-green-dark">🩺</span>
                    <span>{doctor.experience} experience</span>
                  </div>
                )}
                {doctor.fee && (
                  <div className="flex items-center gap-2">
                    <span className="text-green-dark">💵</span>
                    <span>Consultation Fee: <strong>LKR {doctor.fee.toLocaleString()}</strong></span>
                  </div>
                )}
              </div>

              {/* Book Button */}
              <button
                onClick={() => setSelectedDoctor(doctor)}
                className="mt-auto w-full bg-green-primary hover:bg-green-dark text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
}
