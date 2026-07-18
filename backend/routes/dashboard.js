const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Helper to get user's program
const getUserProgramInfo = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ? user.programInfo : null;
};

// @route   GET /api/dashboard/stats
// @desc    Get dashboard overview stats
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const results = await prisma.testResult.findMany({ where: { studentId: req.user.id } });
    const testsCompleted = results.length;
    
    // Calculate average score if they took tests
    let averageScore = 0;
    if (testsCompleted > 0) {
      const totalScore = results.reduce((acc, curr) => acc + curr.score, 0);
      averageScore = Math.round(totalScore / testsCompleted);
    }

    // Attendance Calculation
    const attendanceRecords = await prisma.attendance.findMany({ where: { studentId: req.user.id } });
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(r => r.status === 'Present').length;
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

    // Study Hours (Mocked for now)
    const studyHours = Math.floor(Math.random() * 50) + 10; 

    res.json({
      testsCompleted,
      averageScore,
      attendancePercentage,
      studyHours
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/dashboard/materials
// @desc    Get study materials for student's program
router.get('/materials', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const materials = await prisma.material.findMany({
      where: { program: user.programInfo_program }
    });
    res.json(materials);
  } catch (err) {
    console.error(err.message); res.status(500).send('Server Error');
  }
});

// @route   GET /api/dashboard/announcements
// @desc    Get announcements
router.get('/announcements', auth, async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(announcements);
  } catch (err) {
    console.error(err.message); res.status(500).send('Server Error');
  }
});

// @route   GET /api/dashboard/tests
// @desc    Get mock tests for student's program
router.get('/tests', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const tests = await prisma.mockTest.findMany({
      where: { targetProgram: user.programInfo_program }
    });
    res.json(tests);
  } catch (err) {
    console.error(err.message); res.status(500).send('Server Error');
  }
});

// @route   GET /api/dashboard/results
// @desc    Get test results for student
router.get('/results', auth, async (req, res) => {
  try {
    const results = await prisma.testResult.findMany({
      where: { studentId: req.user.id }
    });
    res.json(results);
  } catch (err) {
    console.error(err.message); res.status(500).send('Server Error');
  }
});

// @route   GET /api/dashboard/attendance
// @desc    Get detailed attendance
// @access  Private
router.get('/attendance', auth, async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      where: { studentId: req.user.id },
      orderBy: { date: 'desc' }
    });
    res.json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
