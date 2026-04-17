const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/patients", require("./src/routes/patientRoutes"));

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`Patient Service running on port ${PORT}`);
});