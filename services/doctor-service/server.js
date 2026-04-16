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
        message: "Doctor Service API is running"
    });
});

app.use("/api/doctors", require("./src/routes/doctorRoutes"));

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
    console.log(`Doctor Service running on port ${PORT}`);
});