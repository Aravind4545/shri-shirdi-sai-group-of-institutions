const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const BehaviorRequest = require('../models/BehaviorRequest');
const BehaviorFeedback = require('../models/BehaviorFeedback');
const User = require('../models/User');

// @route   POST /api/behavior/requests
// @desc    Admin creates a new behavior feedback request
// @access  Admin
router.post('/requests', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const { period } = req.body;
    if (!['1 day', '1 week', '1 month'].includes(period)) {
      return res.status(400).json({ msg: 'Invalid period' });
    }

    // Close any previously active requests
    await BehaviorRequest.updateMany({ status: 'Active' }, { status: 'Closed' });

    const newRequest = new BehaviorRequest({ period, status: 'Active' });
    await newRequest.save();

    res.json(newRequest);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/behavior/requests/active
// @desc    Get the current active behavior request
// @access  Teacher
router.get('/requests/active', auth, async (req, res) => {
  try {
    const activeRequest = await BehaviorRequest.findOne({ status: 'Active' }).sort({ createdAt: -1 });
    res.json(activeRequest || null);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/behavior/students
// @desc    Get students for the logged-in teacher (based on assignedProgram)
// @access  Teacher
router.get('/students', auth, async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id);
    if (!teacher || teacher.role !== 'Teacher') {
      return res.status(403).json({ msg: 'Not authorized as teacher' });
    }

    // If teacher is assigned to 'All', get all students. Else, filter by program.
    let query = { role: 'Student' };
    if (teacher.assignedProgram && teacher.assignedProgram !== 'All') {
      query['programInfo.program'] = teacher.assignedProgram;
    }

    const students = await User.find(query).select('fullName email programInfo');
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/behavior/feedbacks
// @desc    Teacher submits behavior feedback for a student
// @access  Teacher
router.post('/feedbacks', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Teacher') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const { requestId, studentId, rating, comments } = req.body;

    if (!requestId || !studentId || !rating || !comments) {
      return res.status(400).json({ msg: 'Please provide all fields' });
    }

    // Update if exists, otherwise create
    const feedback = await BehaviorFeedback.findOneAndUpdate(
      { request: requestId, teacher: req.user.id, student: studentId },
      { rating, comments, createdAt: Date.now() },
      { new: true, upsert: true }
    );

    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/behavior/feedbacks/me/:requestId
// @desc    Get all feedbacks submitted by the logged-in teacher for a specific request
// @access  Teacher
router.get('/feedbacks/me/:requestId', auth, async (req, res) => {
  try {
    const feedbacks = await BehaviorFeedback.find({
      request: req.params.requestId,
      teacher: req.user.id
    });
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/behavior/feedbacks
// @desc    Admin gets all feedbacks
// @access  Admin
router.get('/feedbacks', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const feedbacks = await BehaviorFeedback.find()
      .populate('request')
      .populate('teacher', 'fullName email')
      .populate('student', 'fullName email programInfo')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
