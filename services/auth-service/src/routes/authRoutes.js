const express = require("express");
const router = express.Router();
const { register, login, getAllUsers, deleteUser } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { verifyDoctor } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/users", protect, authorize("admin"), getAllUsers);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);
router.put("/verify-doctor/:id", protect, authorize("admin"), verifyDoctor);

module.exports = router;