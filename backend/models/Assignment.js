const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  instructions: {
    type: String
  },
  program: {
    type: String,
    required: true,
    enum: ['Lakshya', 'Deekshya', 'DAFNE', 'All']
  },
  stream: {
    type: String,
    default: 'All'
  },
  subject: {
    type: String
  },
  chapter: {
    type: String
  },
  topic: {
    type: String
  },
  dueDate: {
    type: Date,
    required: true
  },
  maxMarks: {
    type: Number,
    required: true,
    default: 100
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attachments: [{
    filename: String,
    url: String,
    fileType: String
  }],
  status: {
    type: String,
    enum: ['Active', 'Closed'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
