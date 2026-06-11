const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// GET all teachers
router.get('/', async (req, res) => {
  try {
    const teachers = await User.find({ role: 'Teacher' }).select('-password -faceEmbedding').sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// CREATE a teacher
router.post('/', async (req, res) => {
  try {
    const { fullName, email, mobileNumber, password, assignedProgram, subject, employeeId } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Teacher with this email already exists' });
    }

    user = new User({
      fullName,
      email,
      mobileNumber,
      password,
      role: 'Teacher',
      assignedProgram,
      subject,
      employeeId,
      status: 'Active',
      teacherId: `TCH-${Math.floor(1000 + Math.random() * 9000)}`
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    
    // Remove password from response
    user.password = undefined;
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// UPDATE a teacher
router.put('/:id', async (req, res) => {
  try {
    const { fullName, email, mobileNumber, password, assignedProgram, subject, employeeId, status, faceLoginEnabled } = req.body;

    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Teacher not found' });

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (assignedProgram) user.assignedProgram = assignedProgram;
    if (subject) user.subject = subject;
    if (employeeId) user.employeeId = employeeId;
    if (status) user.status = status;
    if (typeof faceLoginEnabled === 'boolean') user.faceLoginEnabled = faceLoginEnabled;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    user.password = undefined;
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE a teacher
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Teacher not found' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Teacher removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
