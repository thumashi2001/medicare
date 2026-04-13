const crypto = require('crypto');
const Payment = require('../models/Payment');
const PriceConfig = require('../models/PriceConfig');

const generateMd5 = (string) => crypto.createHash('md5').update(string).digest('hex').toUpperCase();

// USER: Initiate Payment
exports.initiatePayment = async (req, res) => {
    const { appointmentId, patientUsername } = req.body;
    try {
        const config = await PriceConfig.findOne({});
        if (!config) return res.status(400).json({ msg: "Price not set by Admin" });

        const amountFormatted = parseFloat(config.amount).toFixed(2);
        const currency = "LKR";

        await Payment.findOneAndUpdate(
            { appointmentId },
            { patientUsername, amount: config.amount, status: 'PENDING' },
            { upsert: true }
        );

        const hashedSecret = generateMd5(process.env.PAYHERE_SECRET);
        const mainHash = generateMd5(process.env.PAYHERE_MERCHANT_ID + appointmentId + amountFormatted + currency + hashedSecret);

        res.status(200).json({
            merchant_id: process.env.PAYHERE_MERCHANT_ID,
            order_id: appointmentId,
            amount: amountFormatted,
            currency,
            hash: mainHash
        });
    } catch (error) {
        res.status(500).json({ error: "Initiation failed" });
    }
};

// PAYHERE: Webhook Notification
exports.handleNotification = async (req, res) => {
    const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;
    const hashedSecret = generateMd5(process.env.PAYHERE_SECRET);
    const localSig = generateMd5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret);

    if (localSig === md5sig && status_code === "2") {
        await Payment.findOneAndUpdate({ appointmentId: order_id }, { status: 'SUCCESS', paidAt: Date.now() });
        return res.status(200).send("Verified");
    }
    res.status(400).send("Invalid Signature");
};

// ADMIN: Set Price
exports.setGlobalPrice = async (req, res) => {
    try {
        await PriceConfig.findOneAndUpdate({}, { amount: req.body.newAmount }, { upsert: true });
        res.json({ msg: "Price updated" });
    } catch (error) { res.status(500).send(error); }
};

// ADMIN: Get History
exports.getPaymentHistory = async (req, res) => {
    try {
        const history = await Payment.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (error) { res.status(500).send(error); }
};