const PriceConfig = require("../models/PriceConfig");
const Payment = require("../models/Payment");

// Admin: Define the payment value
exports.setGlobalPrice = async (req, res) => {
  const { newAmount } = req.body;
  try {
    // We use findOneAndUpdate with an empty filter {} because there is only ONE price record
    await PriceConfig.findOneAndUpdate(
      {},
      { amount: newAmount, updatedAt: Date.now() },
      { upsert: true, new: true },
    );
    res.json({ message: "Global consultation price updated by Admin" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update price" });
  }
};

//Get the current price
exports.getCurrentPrice = async (req, res) => {
  try {
    const config = await PriceConfig.findOne();
    res.status(200).json({ amount: config ? config.amount : 0 });
  } catch (error) {
    res.status(500).json({ message: "Error fetching price" });
  }
};

// Admin: Get all payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const history = await Payment.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

// Admin: Update payment status manually
exports.updatePaymentStatus = async (req, res) => {
  const { id } = req.params; // The MongoDB _id
  const { status } = req.body; // e.g., 'SUCCESS', 'FAILED', or 'PENDING'

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { _id: id },
      { status: status },
      { new: true },
    );

    if (!updatedPayment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    res.json({ message: "Payment status updated", data: updatedPayment });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

