const mongoose = require('mongoose');

const aiConversationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  program: { type: String }, // Lakshya, Deekshya, DAFNE
  messages: [{
    role: { type: String, enum: ['user', 'assistant', 'system'] },
    content: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  attachments: [{
    fileUrl: { type: String },
    fileType: { type: String } // image, pdf
  }],
  topicContext: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIConversation', aiConversationSchema);
