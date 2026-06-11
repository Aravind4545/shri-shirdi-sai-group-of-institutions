const mongoose = require('mongoose');

const academicReportSchema = new mongoose.Schema({
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportType: { type: String, enum: ['Student', 'Teacher', 'Program', 'Institution'] },
  format: { type: String, enum: ['PDF', 'Excel'] },
  fileUrl: { type: String }, // path to the generated file or signed url
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AcademicReport', academicReportSchema);
