const mongoose = require('mongoose');

const performanceInsightSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  performanceScore: { type: Number }, // 0-100
  growthScore: { type: Number }, // 0-100
  predictedRank: { type: Number },
  predictedPercentile: { type: Number },
  successProbability: { type: Number }, // 0-100%
  readinessLevel: { type: String, enum: ['Excellent', 'Good', 'Average', 'Needs Improvement', 'Critical'] },
  weeklyGrowth: { type: Number, default: 0 },
  monthlyGrowth: { type: Number, default: 0 },
  learningConsistencyScore: { type: Number, default: 0 },
  improvementScore: { type: Number, default: 0 },
  aiInsights: [{ type: String }],
  insightNotes: { type: String },
  calculatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PerformanceInsight', performanceInsightSchema);
