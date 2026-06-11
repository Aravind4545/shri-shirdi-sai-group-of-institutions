const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // Extracted text for search
  documentUrl: { type: String }, // Original PDF link
  program: { type: String }, // Lakshya, Deekshya, DAFNE
  subject: { type: String },
  tags: [{ type: String }],
  vectorEmbedding: [{ type: Number }], // Simulated vector embedding
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
