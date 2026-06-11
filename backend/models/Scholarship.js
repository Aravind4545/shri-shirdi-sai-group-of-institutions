const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Merit Based', 'Need Based', 'Special Category'], required: true },
  discountPercentage: { type: Number }, // Either percentage
  discountAmount: { type: Number },     // Or flat amount
  reason: { type: String },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who approved
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
