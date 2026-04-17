require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const paymentRoutes = require("./src/routes/paymentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// PayHere sends notifications as urlencoded data
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/payments", paymentRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Payment Service Database Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

const PORT = process.env.PORT || 5007;
app.listen(PORT, () =>
  console.log(`🚀 Payment Service running on port ${PORT}`),
);
