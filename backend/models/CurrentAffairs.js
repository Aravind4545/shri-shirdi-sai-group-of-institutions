const mongoose = require('mongoose');

const currentAffairsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['National', 'International', 'Economy', 'Science & Tech', 'Polity'] },
  date: { type: Date, default: Date.now },
  tags: [{ type: String }],
  isImportant: { type: Boolean, default: false }
});

module.exports = mongoose.model('CurrentAffairs', currentAffairsSchema);
