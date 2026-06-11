const mongoose = require('mongoose');

const riskPredictionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  program: { type: String },
  riskLevel: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low'
  },
  factors: [{
    category: { type: String, enum: ['Attendance', 'Performance', 'Engagement'] },
    description: String,
    severity: { type: String, enum: ['High', 'Medium', 'Low'] }
  }],
  interventionSuggestions: [{ type: String }],
  detectedAt: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false }
});

module.exports = mongoose.model('RiskPrediction', riskPredictionSchema);
