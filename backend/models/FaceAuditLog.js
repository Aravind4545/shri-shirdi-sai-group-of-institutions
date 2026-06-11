const mongoose = require('mongoose');

const FaceAuditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  emailAttempted: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String
  },
  matchScore: {
    type: Number,
    required: true
  },
  livenessScore: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Success', 'Failed - Low Match', 'Failed - Spoof Detected', 'Failed - User Not Found', 'Error'],
    required: true
  },
  attemptTime: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FaceAuditLog', FaceAuditLogSchema);
