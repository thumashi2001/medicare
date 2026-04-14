const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  handleNotification,
} = require("../controllers/paymentController");

const {
  setGlobalPrice,
  getPaymentHistory,
} = require("../controllers/adminController");

// User routes
router.post("/initiate", initiatePayment);
router.post("/notify", handleNotification);

// Admin routes
router.put("/admin/set-price", setGlobalPrice);
router.get("/admin/history", getPaymentHistory);

module.exports = router;
