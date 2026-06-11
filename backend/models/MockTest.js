const mongoose = require('mongoose');

const mockTestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetProgram: { type: String, enum: ['Lakshya', 'Deekshya', 'DAFNE', 'All'], required: true },
  targetExam: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  durationMinutes: { type: Number, required: true, default: 180 },
  questions: [{
    questionNumber: { type: Number },
    questionText: { type: String, required: true },
    options: [{ type: String }],
    correctOption: { type: String }, // 'A', 'B', 'C', 'D'
    marks: { type: Number, default: 4 },
    negativeMarks: { type: Number, default: 1 },
    subject: { type: String, default: 'General' },
    topic: { type: String, default: 'Uncategorized' }
  }],
  status: { type: String, enum: ['Draft', 'Published', 'Closed'], default: 'Published' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MockTest', mockTestSchema);
