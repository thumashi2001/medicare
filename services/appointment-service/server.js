const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Appointment & Notification Service is running on port 5003"
    });
});

app.use("/api/appointments", require("./src/routes/appointmentRoutes"));
app.use("/api/notifications", require("./src/routes/notificationRoutes"));

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
    console.log(`Appointment Service running on port ${PORT}`);
});
