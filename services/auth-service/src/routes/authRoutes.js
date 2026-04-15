const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getAllUsers,
  deleteUser,
  verifyDoctor,
  getPendingDoctors,
  getVerifiedDoctors,
  rejectDoctor
} = require("../controllers/authController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/users", protect, authorize("admin"), getAllUsers);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

router.put("/verify-doctor/:id", protect, authorize("admin"), verifyDoctor);
router.put("/reject-doctor/:id", protect, authorize("admin"), rejectDoctor);

router.get("/doctors/pending", protect, authorize("admin"), getPendingDoctors);
router.get("/doctors/verified", protect, authorize("admin"), getVerifiedDoctors);

module.exports = router;