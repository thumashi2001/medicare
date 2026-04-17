const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Patient routes
app.use("/api/patients", require("./src/routes/patientRoutes"));

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Patient Service running on port ${PORT}`);
});