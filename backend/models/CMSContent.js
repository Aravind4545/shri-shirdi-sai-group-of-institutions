const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema({
  page: { type: String, required: true }, // e.g., 'Homepage', 'Lakshya', 'Deekshya', 'DAFNE'
  section: { type: String, required: true }, // e.g., 'Hero', 'About', 'Features'
  content: { type: Object, required: true }, // Store flexible text, images, arrays, etc.
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CMSContent', cmsSchema);
