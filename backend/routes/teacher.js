const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const teacher = require('../middleware/teacher');
const User = require('../models/User');

// @route   GET api/teacher/dashboard
// @desc    Get dashboard stats filtered by assigned program
router.get('/dashboard', auth, teacher, async (req, res) => {
  try {
    const filter = req.user.assignedProgram === 'All' ? { role: 'Student' } : { role: 'Student', 'programInfo.program': req.user.assignedProgram };
    
    const totalStudents = await User.countDocuments(filter);
    
    // Mocks for other stats, would query respective models in prod
    res.json({
      totalStudents,
      attendancePercentage: 88,
      testsConducted: 12,
      studyMaterialsUploaded: 45,
      announcementsPosted: 8
    });
  } catch (err) { res.status(500).send('Server Error'); }
});

// @route   GET api/teacher/students
// @desc    Get all students belonging to the teacher's program
router.get('/students', auth, teacher, async (req, res) => {
  try {
    const filter = req.user.assignedProgram === 'All' ? { role: 'Student' } : { role: 'Student', 'programInfo.program': req.user.assignedProgram };
    const students = await User.find(filter).select('-password');
    res.json(students);
  } catch (err) { res.status(500).send('Server Error'); }
});

// @route   GET api/teacher/analytics
// @desc    Get result analytics for the teacher's program
router.get('/analytics', auth, teacher, async (req, res) => {
  try {
    // Mock analytics
    res.json({
      batchPerformance: 76,
      topRanker: 'Ravi Kumar',
      weakTopics: ['Organic Chemistry', 'Integration'],
      strongTopics: ['Mechanics', 'Trigonometry']
    });
  } catch (err) { res.status(500).send('Server Error'); }
});

const Attendance = require('../models/Attendance');

// @route   GET api/teacher/attendance
// @desc    Get attendance records for the teacher's students for a specific date
router.get('/attendance', auth, teacher, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ msg: 'Date is required' });

    // Ensure it falls on the exact day
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const filter = req.user.assignedProgram === 'All' ? { role: 'Student' } : { role: 'Student', 'programInfo.program': req.user.assignedProgram };
    const students = await User.find(filter).select('_id');
    const studentIds = students.map(s => s._id);

    const attendanceRecords = await Attendance.find({
      studentId: { $in: studentIds },
      date: { $gte: queryDate, $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000) }
    });

    res.json(attendanceRecords);
  } catch (err) { res.status(500).send('Server Error'); }
});

// @route   POST api/teacher/attendance
// @desc    Save/Update attendance for the teacher's students
router.post('/attendance', auth, teacher, async (req, res) => {
  try {
    const { date, records } = req.body;
    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({ msg: 'Date and records array are required' });
    }

    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    for (let record of records) {
      const { studentId, status } = record;
      
      // Upsert the attendance record
      let existingRecord = await Attendance.findOne({
        studentId,
        date: { $gte: queryDate, $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000) }
      });

      if (existingRecord) {
        existingRecord.status = status;
        await existingRecord.save();
      } else {
        await Attendance.create({
          studentId,
          date: queryDate,
          status
        });
      }
    }

    res.json({ msg: 'Attendance saved successfully' });
  } catch (err) { 
    console.error(err);
    res.status(500).send('Server Error'); 
  }
});

module.exports = router;
