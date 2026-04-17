const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  handleNotification,
} = require("../controllers/paymentController");

const {
  setGlobalPrice,
  getPaymentHistory,
  getCurrentPrice,
  updatePaymentStatus,
  deletePayment,
} = require("../controllers/adminController");

// User routes
router.post("/initiate", initiatePayment);
router.post("/notify", handleNotification);

// Admin routes
router.put("/admin/set-price", setGlobalPrice);
router.get("/admin/history", getPaymentHistory);

// GET current price for Admin Dashboard
router.get("/admin/get-price", getCurrentPrice);

// Admin: Update status (PATCH is better for partial updates)
router.patch("/admin/payment/:id/status", updatePaymentStatus);

module.exports = router;
