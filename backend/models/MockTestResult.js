const mongoose = require('mongoose');

const mockTestResultSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'MockTest', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  incorrectAnswers: { type: Number, required: true },
  unattempted: { type: Number, required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId },
    selectedOption: { type: String }, // 'A', 'B', 'C', 'D'
    isCorrect: { type: Boolean }
  }],
  topicAnalysis: [{
    subject: { type: String },
    topic: { type: String },
    total: { type: Number },
    correct: { type: Number },
    incorrect: { type: Number }
  }],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MockTestResult', mockTestResultSchema);
