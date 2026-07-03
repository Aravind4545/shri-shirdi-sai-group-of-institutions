const mongoose = require('mongoose');

const topicAnalyticsSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  program: { type: String, required: true }, // IIT, NEET, UPSC
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  topic: { type: String, required: true },
  totalAttempts: { type: Number, default: 0 },
  correctAttempts: { type: Number, default: 0 },
  wrongAttempts: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 }, // percentage
  averageTimeTaken: { type: Number, default: 0 }, // in seconds
  status: { 
    type: String, 
    enum: ['Strong', 'Average', 'Weak', 'Critical'],
    default: 'Average'
  },
  lastPracticed: { type: Date, default: Date.now }
});

// Calculate accuracy and status before saving
topicAnalyticsSchema.pre('save', function(next) {
  if (this.totalAttempts > 0) {
    this.accuracy = (this.correctAttempts / this.totalAttempts) * 100;
  }
  
  if (this.accuracy >= 80) this.status = 'Strong';
  else if (this.accuracy >= 60) this.status = 'Average';
  else if (this.accuracy >= 40) this.status = 'Weak';
  else this.status = 'Critical';
  
  next();
});

topicAnalyticsSchema.index({ studentId: 1, subject: 1, chapter: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('TopicAnalytics', topicAnalyticsSchema);
