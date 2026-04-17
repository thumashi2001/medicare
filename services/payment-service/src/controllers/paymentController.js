const crypto = require("crypto");
const Payment = require("../models/Payment");
const PriceConfig = require("../models/PriceConfig");

const generateMd5 = (string) =>
  crypto.createHash("md5").update(string).digest("hex").toUpperCase();

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return String(value).trim();
}

function parseBoolEnv(name, defaultValue = false) {
  const raw = process.env[name];
  if (raw == null) return defaultValue;
  const normalized = String(raw).trim().toLowerCase();
  return ["1", "true", "yes", "y", "on"].includes(normalized);
}

// USER: Initiate Payment
exports.initiatePayment = async (req, res) => {
  const { appointmentId, patientUsername } = req.body;

  try {
    if (!appointmentId || !String(appointmentId).trim()) {
      return res.status(400).json({ error: "appointmentId is required" });
    }
    if (!patientUsername || !String(patientUsername).trim()) {
      return res.status(400).json({ error: "patientUsername is required" });
    }

    const config = await PriceConfig.findOne({});
    if (!config) {
      return res.status(400).json({ msg: "Price not set by Admin" });
    }

    // FORCE STRICT FORMAT
    const amount = Number(config.amount).toFixed(2);
    const currency = "LKR";

    await Payment.findOneAndUpdate(
      { appointmentId },
      {
        patientUsername,
        amount, // FIXED: store formatted string
        status: "PENDING",
      },
      { upsert: true },
    );

    const merchantId = requireEnv("PAYHERE_MERCHANT_ID");
    const secret = requireEnv("PAYHERE_SECRET");
    const hashedSecret = generateMd5(secret);

    const hash = generateMd5(
      merchantId + appointmentId + amount + currency + hashedSecret,
    );

    const sandbox = parseBoolEnv("PAYHERE_SANDBOX", true);
    // PayHere notify_url MUST be publicly reachable; keep it configurable.
    const notifyUrl = process.env.PAYHERE_NOTIFY_URL
      ? String(process.env.PAYHERE_NOTIFY_URL).trim()
      : null;

    return res.status(200).json({
      sandbox,
      merchant_id: merchantId,
      order_id: appointmentId,
      amount, // MUST MATCH HASH EXACTLY
      currency,
      hash,
      notify_url: notifyUrl,
    });
  } catch (error) {
    console.error("initiatePayment error:", error?.message || error);
    return res
      .status(500)
      .json({ error: "Initiation failed", detail: error?.message });
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
    const secret = requireEnv("PAYHERE_SECRET");
    const hashedSecret = generateMd5(secret);
    const localSig = generateMd5(
      merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        hashedSecret,
    );

    // If the signatures don't match, someone is trying to fake a payment!
    if (localSig !== md5sig) {
      console.warn(
        `⚠️ Security Alert: Invalid signature for Order ${order_id}`,
      );
      return res.status(400).send("Invalid Signature");
    }

    // 2. Check if the status is "2" (PayHere's code for 'Success')
    if (status_code === "2") {
      await Payment.findOneAndUpdate(
        { appointmentId: order_id },
        { status: "SUCCESS", paidAt: Date.now() },
        { new: true },
      );

      console.log(
        `✅ Payment Verified: Appointment ${order_id} is now SUCCESS`,
      );
      return res.status(200).send("OK"); // PayHere expects a 200 OK response
    } else {
      // If status is not 2, update it to FAILED
      await Payment.findOneAndUpdate(
        { appointmentId: order_id },
        { status: "FAILED" },
      );
      return res.status(200).send("Payment Failed Status Recorded");
    }
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
