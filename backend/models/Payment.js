const mongoose = require('mongoose');

const installmentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Paid', 'Overdue'], default: 'Pending' },
  paidDate: { type: Date },
  lateFee: { type: Number, default: 0 }
});

const paymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  admissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission' },
  
  // Total Fee Tracking
  totalAmountDue: { type: Number, required: true },
  totalAmountPaid: { type: Number, default: 0 },
  scholarshipApplied: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' },
  
  // Payment Type
  paymentPlan: { type: String, enum: ['One-time', 'Monthly', 'Quarterly'], default: 'One-time' },
  installments: [installmentSchema],
  
  // Transaction History (Each successful transaction)
  transactions: [{
    transactionId: { type: String }, // e.g. TXN123456
    amount: { type: Number },
    method: { type: String, enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash', 'Offline'] },
    status: { type: String, enum: ['Success', 'Failed', 'Pending Verification'], default: 'Success' },
    receiptUrl: { type: String },
    date: { type: Date, default: Date.now }
  }],
  
  createdAt: { type: Date, default: Date.now }
});

paymentSchema.index({ studentId: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
