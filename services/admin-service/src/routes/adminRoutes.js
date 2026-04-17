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

module.exports = router;