const mongoose = require('mongoose');

const TeacherFeedbackSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  learningRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  classesRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  doubtsRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comments: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TeacherFeedback', TeacherFeedbackSchema);
