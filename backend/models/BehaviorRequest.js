const mongoose = require('mongoose');

const behaviorRequestSchema = new mongoose.Schema({
  period: {
    type: String,
    enum: ['1 day', '1 week', '1 month'],
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Closed'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BehaviorRequest', behaviorRequestSchema);
