const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true, unique: true },
  patientUsername: { type: String, required: true }, // Added for Admin visibility
  amount: { type: Number, required: true },
  currency: { type: String, default: 'LKR' },
  status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);