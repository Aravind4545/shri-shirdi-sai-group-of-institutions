const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const auth = require('../middleware/auth');

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        fullName: true,
        mobileNumber: true,
        email: true,
        gender: true,
        dateOfBirth: true,
        academicInfo_intermediateYear: true,
        academicInfo_collegeName: true,
        academicInfo_state: true,
        programInfo_program: true,
        programInfo_stream: true,
        programInfo_exams: true,
        role: true,
        isApproved: true,
        profileImage: true,
        faceLoginEnabled: true,
        assignedProgram: true,
        designation: true,
        profilePhoto: true,
        teacherId: true,
        employeeId: true,
        subject: true,
        status: true,
        companionSettings_style: true,
        companionSettings_companionName: true,
        companionSettings_studentNickname: true,
        companionSettings_isConfigured: true,
        createdAt: true
      }
    });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [auth, [
  body('fullName', 'Full Name is required').not().isEmpty(),
  body('mobileNumber', 'Mobile Number is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullName, mobileNumber, password } = req.body;

  try {
    let user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const updateData = {
      fullName,
      mobileNumber
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: updateData
    });
    
    res.json({ msg: 'Profile updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
