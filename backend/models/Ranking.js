const mongoose = require('mongoose');

const rankingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  program: { type: String },
  globalRank: { type: Number },
  programRank: { type: Number },
  overallScore: { type: Number, default: 0 },
  attendanceScore: { type: Number, default: 0 },
  assignmentScore: { type: Number, default: 0 },
  testScore: { type: Number, default: 0 },
  healthScore: { type: Number, default: 0 },
  subjectScores: [{
    subject: String,
    score: Number,
    rank: Number
  }],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ranking', rankingSchema);
