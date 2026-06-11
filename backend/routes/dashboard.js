const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const Material = require('../models/Material');
const Test = require('../models/Test');
const TestResult = require('../models/TestResult');
const Attendance = require('../models/Attendance');

// Helper to get user's program
const getUserProgramInfo = async (userId) => {
  const user = await User.findById(userId);
  return user ? user.programInfo : null;
};

// @route   GET /api/dashboard/stats
// @desc    Get dashboard overview stats
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const results = await TestResult.find({ studentId: req.user.id });
    const testsCompleted = results.length;
    
    // Calculate average score if they took tests
    let averageScore = 0;
    if (testsCompleted > 0) {
      const totalScore = results.reduce((acc, curr) => acc + curr.score, 0);
      averageScore = Math.round(totalScore / testsCompleted);
    }

    // Attendance Calculation
    const attendanceRecords = await Attendance.find({ studentId: req.user.id });
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
// @access  Private
router.get('/materials', auth, async (req, res) => {
  try {
    const programInfo = await getUserProgramInfo(req.user.id);
    if (!programInfo) return res.status(404).json({ msg: 'User not found' });

    const materials = await Material.find({
      program: programInfo.program,
      $or: [{ stream: programInfo.stream }, { stream: 'All' }]
    }).sort({ uploadedAt: -1 });

    res.json(materials);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/dashboard/tests
// @desc    Get available tests for student
// @access  Private
router.get('/tests', auth, async (req, res) => {
  try {
    const programInfo = await getUserProgramInfo(req.user.id);
    const tests = await Test.find({
      program: programInfo.program,
      $or: [{ stream: programInfo.stream }, { stream: 'All' }]
    }).sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/dashboard/results
// @desc    Get student test results
// @access  Private
router.get('/results', auth, async (req, res) => {
  try {
    const results = await TestResult.find({ studentId: req.user.id })
      .populate('testId', 'title subject totalMarks')
      .sort({ submittedAt: -1 });
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/dashboard/announcements
// @desc    Get announcements for student
// @access  Private
router.get('/announcements', auth, async (req, res) => {
  try {
    const programInfo = await getUserProgramInfo(req.user.id);
    const announcements = await Announcement.find({
      targetProgram: { $in: ['All', programInfo.program] }
    }).sort({ date: -1 });
    res.json(announcements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/dashboard/attendance
// @desc    Get detailed attendance
// @access  Private
router.get('/attendance', auth, async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.user.id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
