const crypto = require("crypto");
const Payment = require("../models/Payment");
const PriceConfig = require("../models/PriceConfig");

const generateMd5 = (string) =>
  crypto.createHash("md5").update(string).digest("hex").toUpperCase();

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
      { patientUsername, amount: config.amount, status: "PENDING" },
      { upsert: true },
    );

    const hashedSecret = generateMd5(process.env.PAYHERE_SECRET);
    const mainHash = generateMd5(
      process.env.PAYHERE_MERCHANT_ID +
        appointmentId +
        amountFormatted +
        currency +
        hashedSecret,
    );

    res.status(200).json({
      merchant_id: process.env.PAYHERE_MERCHANT_ID,
      order_id: appointmentId,
      amount: amountFormatted,
      currency,
      hash: mainHash,
    });
  } catch (error) {
    res.status(500).json({ error: "Initiation failed" });
  }
};

// PAYHERE: Webhook Notification
exports.handleNotification = async (req, res) => {
  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
  } = req.body;

  try {
    // 1. Re-enable security: Verify the signature
    const hashedSecret = generateMd5(process.env.PAYHERE_SECRET);
    const localSig = generateMd5(
      merchant_id + 
      order_id + 
      payhere_amount + 
      payhere_currency + 
      status_code + 
      hashedSecret
    );

    // If the signatures don't match, someone is trying to fake a payment!
    if (localSig !== md5sig) {
      console.warn(`⚠️ Security Alert: Invalid signature for Order ${order_id}`);
      return res.status(400).send("Invalid Signature");
    }

    // 2. Check if the status is "2" (PayHere's code for 'Success')
    if (status_code === "2") {
      await Payment.findOneAndUpdate(
        { appointmentId: order_id },
        { status: "SUCCESS", paidAt: Date.now() },
        { new: true }
      );
      
      console.log(`✅ Payment Verified: Appointment ${order_id} is now SUCCESS`);
      return res.status(200).send("OK"); // PayHere expects a 200 OK response
    } else {
      // If status is not 2, update it to FAILED
      await Payment.findOneAndUpdate(
        { appointmentId: order_id },
        { status: "FAILED" }
      );
      return res.status(200).send("Payment Failed Status Recorded");
    }

  } catch (error) {
    console.error("❌ Webhook Error:", error);
    res.status(500).send("Internal Server Error");
  }
};