exports.initiatePayment = async (req, res) => {
    const { appointmentId, patientUsername } = req.body;

    try {
        // 1. Fetch the price currently set by the Admin
        const config = await PriceConfig.findOne({});
        if (!config) return res.status(400).json({ msg: "Price not set by Admin yet" });

        const amountToCharge = config.amount;

        // 2. Record the pending payment with the username
        await Payment.create({
            appointmentId,
            patientUsername,
            amount: amountToCharge,
            status: 'PENDING'
        });

        // 3. Proceed to generate PayHere Hash using amountToCharge...
        // (Hash logic remains the same)
        
    } catch (error) {
        res.status(500).json({ error: "Payment initiation failed" });
    }
};