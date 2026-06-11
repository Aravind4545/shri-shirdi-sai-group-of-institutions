const mongoose = require('mongoose');

const teacherAttendanceSchema = new mongoose.Schema({
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Present', 'Absent'], 
    default: 'Present' 
  }
});

module.exports = mongoose.model('TeacherAttendance', teacherAttendanceSchema);
