const mongoose = require('mongoose');

const rankHistorySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  globalRank: { type: Number },
  programRank: { type: Number },
  overallScore: { type: Number },
  weeklyGrowth: { type: Number, default: 0 },
  monthlyGrowth: { type: Number, default: 0 }
});

module.exports = mongoose.model('RankHistory', rankHistorySchema);
