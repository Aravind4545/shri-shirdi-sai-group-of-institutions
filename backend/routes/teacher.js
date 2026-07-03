const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const teacher = require('../middleware/teacher');


// @route   GET api/teacher/dashboard
// @desc    Get dashboard stats filtered by assigned program
router.get('/dashboard', auth, teacher, async (req, res) => {
  try {
    const filter = (!req.user.assignedProgram || req.user.assignedProgram === 'All') ? { role: 'Student' } : { role: 'Student', programInfo_program: req.user.assignedProgram };
    
    const totalStudents = await prisma.user.count({ where: filter });
    
    const students = await prisma.user.findMany({ where: filter, select: { id: true } });
    const studentIds = students.map(s => s.id);
    
    const totalAttendance = await prisma.attendance.count({ where: { studentId: { in: studentIds } } });
    const presentAttendance = await prisma.attendance.count({ where: { studentId: { in: studentIds }, status: 'Present' } });
    const attendancePercentage = totalAttendance === 0 ? 0 : Math.round((presentAttendance / totalAttendance) * 100);

    const programFilter = (!req.user.assignedProgram || req.user.assignedProgram === 'All') ? {} : { program: req.user.assignedProgram };
    const testsConducted = await prisma.test.count({ where: programFilter });
    const studyMaterialsUploaded = await prisma.material.count({ where: programFilter });
    
    const announcementsFilter = (!req.user.assignedProgram || req.user.assignedProgram === 'All') ? {} : { targetProgram: req.user.assignedProgram };
    const announcementsPosted = await prisma.announcement.count({ where: announcementsFilter });
    
    res.json({
      totalStudents,
      attendancePercentage,
      testsConducted,
      studyMaterialsUploaded,
      announcementsPosted
    });
  } catch (err) { 
    console.error(err);
    res.status(500).send('Server Error'); 
  }
});

// @route   GET api/teacher/students
// @desc    Get all students belonging to the teacher's program
router.get('/students', auth, teacher, async (req, res) => {
  try {
    const filter = (!req.user.assignedProgram || req.user.assignedProgram === 'All') ? { role: 'Student' } : { role: 'Student', programInfo_program: req.user.assignedProgram };
    const students = await prisma.user.findMany({ where: filter }).then(users => users.map(u => {
      const { password, ...rest } = u;
      return rest;
    }));
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



// @route   GET api/teacher/attendance
// @desc    Get attendance records for the teacher's students for a specific date
router.get('/attendance', auth, teacher, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ msg: 'Date is required' });

    // Ensure it falls on the exact day
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const filter = (!req.user.assignedProgram || req.user.assignedProgram === 'All') ? { role: 'Student' } : { role: 'Student', programInfo_program: req.user.assignedProgram };
    const students = await prisma.user.findMany({ where: filter, select: { id: true, _id: true } });
    const studentIds = students.map(s => s.id || s._id);

    const attendanceRecords = await prisma.attendance.findMany({ where: {
      studentId: { in: studentIds },
      date: { gte: queryDate, lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000) }
    } });

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
      let existingRecord = await prisma.attendance.findFirst({ where: {
        studentId,
        date: { gte: queryDate, lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000) }
      } });

      if (existingRecord) {
        await prisma.attendance.update({
          where: { id: existingRecord.id || existingRecord._id },
          data: { status }
        });
      } else {
        await prisma.attendance.create({ data: {
          studentId,
          date: queryDate,
          status
        } });
      }
    }

    res.json({ msg: 'Attendance saved successfully' });
  } catch (err) { 
    console.error(err);
    res.status(500).send('Server Error'); 
  }
});

module.exports = router;
