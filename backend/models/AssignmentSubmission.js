const mongoose = require('mongoose');

const assignmentSubmissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Submitted', 'Late', 'Graded'],
    default: 'Pending'
  },
  files: [{
    filename: String,
    url: String,
    fileType: String
  }],
  marksAwarded: {
    type: Number,
    default: null
  },
  feedback: {
    type: String
  }
}, { timestamps: true });

// Ensure a student can only have one submission per assignment
assignmentSubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
