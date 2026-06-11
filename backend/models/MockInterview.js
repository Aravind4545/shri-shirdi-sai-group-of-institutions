const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interviewType: { type: String, default: 'Civil Services Foundation' },
  durationMinutes: { type: Number },
  transcript: [{
    speaker: { type: String, enum: ['Interviewer', 'Student'] },
    text: { type: String }
  }],
  feedback: {
    communicationScore: { type: Number },
    confidenceScore: { type: Number },
    knowledgeScore: { type: Number },
    overallRemarks: { type: String }
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
