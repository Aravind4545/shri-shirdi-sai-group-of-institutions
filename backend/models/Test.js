const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  program: { type: String, required: true },
  stream: { type: String, required: true },
  subject: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  durationMinutes: { type: Number, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  description: String,
  negativeMarking: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', testSchema);
