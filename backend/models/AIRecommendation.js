const mongoose = require('mongoose');

const aiRecommendationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weakTopics: [{
    subject: String,
    chapter: String,
    topic: String,
    confidenceScore: Number
  }],
  strongTopics: [{
    subject: String,
    chapter: String,
    topic: String,
    confidenceScore: Number
  }],
  recommendations: [{
    actionText: String, // e.g., "Revise Trigonometry Concepts"
    type: { type: String, enum: ['Video', 'Practice', 'Revision', 'Assignment'] },
    priority: { type: String, enum: ['High', 'Medium', 'Low'] }
  }],
  learningPath: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIRecommendation', aiRecommendationSchema);
