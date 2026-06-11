const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badgeName: { type: String, required: true }, // e.g. "Top Performer", "Consistent Learner"
  description: { type: String },
  icon: { type: String }, // e.g. "Trophy", "Star"
  earnedAt: { type: Date, default: Date.now },
  category: { type: String, enum: ['Academic', 'Engagement', 'Improvement'] }
});

module.exports = mongoose.model('Achievement', achievementSchema);
