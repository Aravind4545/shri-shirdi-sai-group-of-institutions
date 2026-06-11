const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['PDF', 'Video', 'Note'], required: true },
  program: { type: String, required: true },
  stream: { type: String, required: true },
  subject: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', materialSchema);
