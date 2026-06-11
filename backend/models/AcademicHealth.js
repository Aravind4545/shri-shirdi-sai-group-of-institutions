const mongoose = require('mongoose');

const academicHealthSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  healthScore: { type: Number, default: 0 }, // 0-100
  components: {
    attendanceScore: { type: Number, default: 0 },
    testScore: { type: Number, default: 0 },
    assignmentScore: { type: Number, default: 0 },
    studyActivityScore: { type: Number, default: 0 }
  },
  status: { 
    type: String, 
    enum: ['Excellent', 'Good', 'Average', 'Needs Improvement', 'Critical'],
    default: 'Average'
  },
  calculatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AcademicHealth', academicHealthSchema);
