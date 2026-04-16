const express = require("express");
const router = express.Router();

const {
    getUsers,
    deleteUser,
    verifyDoctor
} = require("../controllers/adminController");

const { protect, authorize } = require("../middleware/authmiddleware");

//Only admin can access
router.get("/users", protect, authorize("admin"), getUsers);

router.delete("/users/:id", protect, authorize("admin"), deleteUser);

router.put("/verify-doctor/:id", protect, authorize("admin"), verifyDoctor);

router.get("/stats", protect, authorize("admin"), getStats);

router.get("/recent-activities", protect, authorize("admin"), getRecentActivities);

router.get("/users/search", protect, authorize("admin"), searchUsers);

router.get("/doctors/pending", protect, authorize("admin"), getPendingDoctors);

router.get("/doctors/verified", protect, authorize("admin"), getVerifiedDoctors);

router.put("/reject-doctor/:id", protect, authorize("admin"), rejectDoctor);

module.exports = router;