const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');




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
    await prisma.behaviorRequest.updateMany({ where: { status: 'Active' }, data: { status: 'Closed' } });

    const newRequest = await prisma.behaviorRequest.create({
      data: { period, status: 'Active' }
    });

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
    const activeRequest = await prisma.behaviorRequest.findFirst({
      where: { status: 'Active' },
      orderBy: { createdAt: 'desc' }
    });
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
    const teacher = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!teacher || teacher.role !== 'Teacher') {
      return res.status(403).json({ msg: 'Not authorized as teacher' });
    }

    let query = { role: 'Student' };
    if (teacher.assignedProgram && teacher.assignedProgram !== 'All') {
      query.programInfo_program = teacher.assignedProgram;
    }

    const students = await prisma.user.findMany({
      where: query,
      select: { fullName: true, email: true, programInfo_program: true, programInfo_stream: true }
    });
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
    let feedback = await prisma.behaviorFeedback.findFirst({
      where: { request: requestId, teacher: req.user.id, student: studentId }
    });

    if (feedback) {
      feedback = await prisma.behaviorFeedback.update({
        where: { id: feedback.id },
        data: { rating, comments, createdAt: new Date() }
      });
    } else {
      feedback = await prisma.behaviorFeedback.create({
        data: { request: requestId, teacher: req.user.id, student: studentId, rating, comments, createdAt: new Date() }
      });
    }

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
    const feedbacks = await prisma.behaviorFeedback.findMany({ where: {
      request: req.params.requestId,
      teacher: req.user.id
    } });
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

    const feedbacks = await prisma.behaviorFeedback.findMany({
      include: {
        request: true,
        teacher: { select: { fullName: true, email: true } },
        student: { select: { fullName: true, email: true, programInfo_program: true, programInfo_stream: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
