const mongoose = require('mongoose');

const subjectAnalyticsSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  program: { type: String, required: true },
  subject: { type: String, required: true },
  totalScore: { type: Number, default: 0 },
  averageAccuracy: { type: Number, default: 0 }, // percentage
  rank: { type: Number, default: 0 }, // relative to cohort
  improvementTrend: [{
    date: { type: Date, default: Date.now },
    accuracy: { type: Number }
  }],
  lastUpdated: { type: Date, default: Date.now }
});

subjectAnalyticsSchema.index({ studentId: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('SubjectAnalytics', subjectAnalyticsSchema);
