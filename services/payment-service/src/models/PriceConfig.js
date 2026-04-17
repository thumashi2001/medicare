const mongoose = require("mongoose");

const priceConfigSchema = new mongoose.Schema({
  amount: { type: String, required: true }, // The single value the admin defines
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PriceConfig", priceConfigSchema);
