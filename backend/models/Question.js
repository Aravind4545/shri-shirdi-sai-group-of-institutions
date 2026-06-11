const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  image: { type: String }, // Optional image URL
  type: { type: String, enum: ['MCQ', 'MultipleCorrect', 'TrueFalse', 'AssertionReason', 'Passage'], default: 'MCQ' },
  program: { type: String, required: true },
  stream: { type: String, required: true },
  subject: { type: String, required: true },
  chapter: { type: String },
  topic: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  marks: { type: Number, default: 4 },
  negativeMarks: { type: Number, default: 1 },
  options: [{ type: String }],
  correctAnswers: [{ type: String }], // Array for multiple correct support
  explanation: { type: String }
});

module.exports = mongoose.model('Question', questionSchema);
