const PriceConfig = require('../models/PriceConfig');
const Payment = require('../models/Payment');

// Admin: Define the payment value
exports.setGlobalPrice = async (req, res) => {
    const { newAmount } = req.body;
    try {
        // We use findOneAndUpdate with an empty filter {} because there is only ONE price record
        await PriceConfig.findOneAndUpdate(
            {}, 
            { amount: newAmount, updatedAt: Date.now() },
            { upsert: true, new: true }
        );
        res.json({ message: "Global consultation price updated by Admin" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update price" });
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