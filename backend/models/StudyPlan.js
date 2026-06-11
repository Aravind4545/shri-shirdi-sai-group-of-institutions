const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planType: { type: String, enum: ['Daily', 'Weekly', 'Monthly'] },
  targetExams: [{ type: String }],
  tasks: [{
    subject: { type: String },
    topic: { type: String },
    taskType: { type: String, enum: ['Revision', 'Practice', 'Mock Test', 'Reading'] },
    estimatedMinutes: { type: Number },
    isCompleted: { type: Boolean, default: false }
  }],
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
