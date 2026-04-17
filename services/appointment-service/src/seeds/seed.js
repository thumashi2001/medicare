/**
 * Appointment Service — Seed Script
 * Populates the medicare_appointments database with sample appointments
 * and their auto-generated notifications.
 *
 * Run:  node src/seeds/seed.js
 *
 * Patient IDs match the auth-service seed:
 *   Patient 1 (Amal Perera)    → 507f1f77bcf86cd799439011
 *   Patient 2 (Nimali Fernando) → 507f1f77bcf86cd799439012
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// ── Inline models (avoid circular requires) ──────────────────────────────────
const appointmentSchema = new mongoose.Schema(
    {
        patientId: String,
        doctorId: String,
        doctorName: String,
        doctorSpecialty: String,
        appointmentDate: Date,
        appointmentTime: String,
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

const notificationSchema = new mongoose.Schema({
    userId: { type: String, index: true },
    title: String,
    message: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
const Notification = mongoose.model("Notification", notificationSchema);

// ── Seed data ─────────────────────────────────────────────────────────────────
const PATIENT_1 = "507f1f77bcf86cd799439011"; // Amal Perera
const PATIENT_2 = "507f1f77bcf86cd799439012"; // Nimali Fernando
const DOCTOR_1  = "507f1f77bcf86cd799439013"; // Dr. Kavinda Silva (matches auth-service seed)

const today = new Date();
const addDays = (d) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() + d);
    return dt;
};

const APPOINTMENTS = [
    // Amal — Upcoming / Confirmed
    {
        patientId: PATIENT_1,
        doctorId: DOCTOR_1,
        doctorName: "Dr. Kavinda Silva",
        doctorSpecialty: "Cardiologist",
        appointmentDate: addDays(3),
        appointmentTime: "10:00 AM",
        status: "Confirmed",
    },
    // Amal — Upcoming / Pending
    {
        patientId: PATIENT_1,
        doctorId: "DOC_003",
        doctorName: "Dr. Wasantha Jayasinghe",
        doctorSpecialty: "Dermatologist",
        appointmentDate: addDays(7),
        appointmentTime: "02:30 PM",
        status: "Pending",
    },
    // Amal — Cancelled
    {
        patientId: PATIENT_1,
        doctorId: DOCTOR_1,
        doctorName: "Dr. Kavinda Silva",
        doctorSpecialty: "Cardiologist",
        appointmentDate: addDays(-5),
        appointmentTime: "09:00 AM",
        status: "Cancelled",
    },
    // Nimali — Upcoming / Pending
    {
        patientId: PATIENT_2,
        doctorId: DOCTOR_1,
        doctorName: "Dr. Kavinda Silva",
        doctorSpecialty: "Cardiologist",
        appointmentDate: addDays(5),
        appointmentTime: "11:30 AM",
        status: "Pending",
    },
    // Nimali — Upcoming / Confirmed
    {
        patientId: PATIENT_2,
        doctorId: DOCTOR_1,
        doctorName: "Dr. Kavinda Silva",
        doctorSpecialty: "Cardiologist",
        appointmentDate: addDays(10),
        appointmentTime: "03:00 PM",
        status: "Confirmed",
    },
    // Amal — Pending (doctor view: incoming request)
    {
        patientId: PATIENT_1,
        doctorId: DOCTOR_1,
        doctorName: "Dr. Kavinda Silva",
        doctorSpecialty: "Cardiologist",
        appointmentDate: addDays(14),
        appointmentTime: "09:30 AM",
        status: "Pending",
    },
];

// Doctor notification for each appointment (new request / status update)
function buildDoctorNotification(apt) {
    const dateStr = apt.appointmentDate.toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
    if (apt.status === "Pending") {
        return {
            userId: apt.doctorId,
            title: "New Appointment Request",
            message: `A patient (ID: ${apt.patientId}) has requested an appointment on ${dateStr} at ${apt.appointmentTime}. Please confirm or cancel.`,
            read: false,
        };
    }
    if (apt.status === "Confirmed") {
        return {
            userId: apt.doctorId,
            title: "Appointment Confirmed",
            message: `Appointment with patient (ID: ${apt.patientId}) on ${dateStr} at ${apt.appointmentTime} is confirmed.`,
            read: true,
        };
    }
    return {
        userId: apt.doctorId,
        title: "Appointment Cancelled",
        message: `Appointment with patient (ID: ${apt.patientId}) on ${dateStr} at ${apt.appointmentTime} was cancelled.`,
        read: true,
    };
}

// Patient notifications matching each appointment status
function buildNotification(apt) {
    const dateStr = apt.appointmentDate.toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
    if (apt.status === "Confirmed") {
        return {
            userId: apt.patientId,
            title: "Appointment Confirmed",
            message: `Your appointment with ${apt.doctorName} (${apt.doctorSpecialty}) on ${dateStr} at ${apt.appointmentTime} has been confirmed.`,
            read: false,
        };
    }
    if (apt.status === "Cancelled") {
        return {
            userId: apt.patientId,
            title: "Appointment Cancelled",
            message: `Your appointment with ${apt.doctorName} (${apt.doctorSpecialty}) on ${dateStr} at ${apt.appointmentTime} has been cancelled.`,
            read: true,
        };
    }
    return {
        userId: apt.patientId,
        title: "Appointment Created (Pending Payment)",
        message: `Your appointment with ${apt.doctorName} (${apt.doctorSpecialty}) on ${dateStr} at ${apt.appointmentTime} has been created and is awaiting payment.`,
        read: false,
    };
}

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to Atlas — medicare_appointments");

        await Appointment.deleteMany({});
        await Notification.deleteMany({});
        console.log("🗑  Cleared existing appointments & notifications\n");

        const inserted = await Appointment.insertMany(APPOINTMENTS);
        const patientNotifications = inserted.map(buildNotification);
        const doctorNotifications = inserted.map(buildDoctorNotification);
        const allNotifications = [...patientNotifications, ...doctorNotifications];
        await Notification.insertMany(allNotifications);

        console.log(`🌱 Seeded ${inserted.length} appointments and ${allNotifications.length} notifications (${patientNotifications.length} patient + ${doctorNotifications.length} doctor):\n`);

        inserted.forEach((a) => {
            const dateStr = a.appointmentDate.toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
            });
            const patient = a.patientId === PATIENT_1 ? "Amal Perera     " : "Nimali Fernando ";
            console.log(`  [${a.status.padEnd(9)}] ${patient} → ${a.doctorName.padEnd(28)} ${dateStr} ${a.appointmentTime}`);
        });

        console.log("\n🩺 Doctor login: doctor@medicare.com / Doctor@123  (ID: " + DOCTOR_1 + ")");
        console.log("✅ Appointment seed complete!\n");
    } catch (err) {
        console.error("❌ Seed error:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
