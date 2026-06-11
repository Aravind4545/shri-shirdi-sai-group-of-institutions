const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  type: { type: String, enum: ['TabSwitch', 'FullscreenExit', 'Refresh'] },
  timestamp: { type: Date, default: Date.now },
  details: { type: String }
});

const examSessionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  status: { type: String, enum: ['InProgress', 'Submitted', 'AutoSubmitted'], default: 'InProgress' },
  responses: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedOptions: [{ type: String }],
    status: { type: String, enum: ['Attempted', 'NotAttempted', 'MarkedForReview'], default: 'NotAttempted' },
    timeSpentSeconds: { type: Number, default: 0 }
  }],
  violations: [violationSchema]
});

module.exports = mongoose.model('ExamSession', examSessionSchema);
