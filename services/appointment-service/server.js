const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//TEST API
app.get("/api/appointments/test", (req, res) => {
    res.json({ message: "Appointment service working" });
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
    console.log(`Appointment Service running on port ${PORT}`);
});