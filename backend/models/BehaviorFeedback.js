const mongoose = require('mongoose');

const behaviorFeedbackSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BehaviorRequest',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: String,
    enum: ['Excellent', 'Good', 'Average', 'Needs Improvement', 'Poor'],
    required: true
  },
  comments: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a teacher only submits one feedback per student per request
behaviorFeedbackSchema.index({ request: 1, teacher: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('BehaviorFeedback', behaviorFeedbackSchema);
