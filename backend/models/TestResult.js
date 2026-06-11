const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  score: { type: Number, required: true },
  correctAnswers: { type: Number, default: 0 },
  wrongAnswers: { type: Number, default: 0 },
  unattempted: { type: Number, default: 0 },
  accuracyPercentage: { type: Number, default: 0 },
  percentile: { type: Number },
  rank: { type: Number },
  weakAreas: [{ type: String }],
  strongAreas: [{ type: String }],
  aiRecommendations: [{ type: String }],
  responses: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    isCorrect: { type: Boolean },
    timeTaken: { type: Number }, // in seconds
    subject: { type: String },
    chapter: { type: String },
    topic: { type: String }
  }],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestResult', testResultSchema);
