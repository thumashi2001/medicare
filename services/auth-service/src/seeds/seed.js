/**
 * Auth Service — Seed Script
 * Populates the medicare_auth database with test users.
 *
 * Run:  node src/seeds/seed.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const userSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    isVerified: { type: Boolean, default: true },
    rejected: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

// ── Fixed ObjectIds so other seeds can reference these IDs ───────────────────
const USERS = [
  {
    _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
    name: "Amal Perera",
    email: "patient@medicare.com",
    plainPassword: "Patient@123",
    role: "patient",
  },
  {
    _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439012"),
    name: "Nimali Fernando",
    email: "nimali@medicare.com",
    plainPassword: "Patient@123",
    role: "patient",
  },
  {
    _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439013"),
    name: "Dr. Kavinda Silva",
    email: "doctor@medicare.com",
    plainPassword: "Doctor@123",
    role: "doctor",
  },
  {
    _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439014"),
    name: "Super Admin",
    email: "admin@medicare.com",
    plainPassword: "Admin@123",
    role: "admin",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to Atlas — medicare_auth");

    // Clear existing users
    await User.deleteMany({});
    console.log("🗑  Cleared existing users");

    // Hash passwords and insert
    const hashed = await Promise.all(
      USERS.map(async (u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        password: await bcrypt.hash(u.plainPassword, 10),
        role: u.role,
        isVerified: true,
        rejected: false,
      })),
    );

    await User.insertMany(hashed);

    console.log("\n🌱 Seeded users:");
    console.log(
      "┌─────────────────────────────┬──────────────────────────┬─────────────┬───────────────┐",
    );
    console.log(
      "│ Name                        │ Email                    │ Password    │ Role          │",
    );
    console.log(
      "├─────────────────────────────┼──────────────────────────┼─────────────┼───────────────┤",
    );
    USERS.forEach((u) => {
      const name = u.name.padEnd(27);
      const email = u.email.padEnd(24);
      const pass = u.plainPassword.padEnd(11);
      const role = u.role.padEnd(13);
      console.log(`│ ${name} │ ${email} │ ${pass} │ ${role} │`);
    });
    console.log(
      "└─────────────────────────────┴──────────────────────────┴─────────────┴───────────────┘",
    );

    console.log("\n✅ Auth seed complete!\n");
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
