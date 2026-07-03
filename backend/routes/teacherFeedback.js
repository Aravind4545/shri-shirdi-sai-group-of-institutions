const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');



// @route   POST api/teacher-feedback
// @desc    Submit feedback on a teacher
// @access  Private (Student)
router.post('/', auth, async (req, res) => {
  try {
    const { teacherId, learningRating, classesRating, doubtsRating, comments } = req.body;

    const feedback = await prisma.teacherFeedback.create({
      data: {
        student: req.user.id,
        teacher: teacherId,
        learningRating,
        classesRating,
        doubtsRating,
        comments
      }
    });

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
    const feedback = await prisma.teacherFeedback.findMany({
      include: {
        student: { select: { fullName: true, email: true } },
        teacher: { select: { fullName: true, designation: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
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
    const teachers = await prisma.user.findMany({
      where: { role: 'Teacher' },
      select: { fullName: true, id: true, designation: true, profilePhoto: true }
    });
    res.json(teachers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
