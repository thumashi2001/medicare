require("dotenv").config();
const express = require("express");
const cors = require("cors");
const agoraRoutes = require("./src/routes/agoraRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use Routes
app.use("/api/agora", agoraRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is breathing on port ${PORT} 🚀`);
});
