const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", require("./src/routes/adminRoutes"));

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
    console.log(`Admin Service running on port ${PORT}`);
});