const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const TeacherFeedback = require('../models/TeacherFeedback');
const User = require('../models/User');

// @route   POST api/teacher-feedback
// @desc    Submit feedback on a teacher
// @access  Private (Student)
router.post('/', auth, async (req, res) => {
  try {
    const { teacherId, learningRating, classesRating, doubtsRating, comments } = req.body;

    const newFeedback = new TeacherFeedback({
      student: req.user.id,
      teacher: teacherId,
      learningRating,
      classesRating,
      doubtsRating,
      comments
    });

    const feedback = await newFeedback.save();
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/teacher-feedback
// @desc    Get all feedback for admins/HOD
// @access  Private (Admin/Teacher)
router.get('/', auth, async (req, res) => {
  try {
    const feedback = await TeacherFeedback.find()
      .populate('student', 'fullName email')
      .populate('teacher', 'fullName designation')
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/teacher-feedback/teachers
// @desc    Get list of all teachers for students to rate
// @access  Private
router.get('/teachers', auth, async (req, res) => {
  try {
    const teachers = await User.find({ role: 'Teacher' }).select('fullName _id designation profilePhoto');
    res.json(teachers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
