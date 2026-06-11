const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  targetProgram: { type: String, enum: ['All', 'Lakshya', 'Deekshya', 'DAFNE'], default: 'All' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', announcementSchema);
