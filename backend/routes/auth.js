const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');


// Middleware to verify token
const authMiddleware = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new student
router.post('/register', [
  body('fullName', 'Full Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  body('mobileNumber', 'Mobile Number is required').not().isEmpty(),
  body('gender', 'Gender is required').not().isEmpty(),
  body('dateOfBirth', 'Date of birth is required').not().isEmpty(),
  body('academicInfo.intermediateYear', 'Intermediate Year is required').not().isEmpty(),
  body('academicInfo.collegeName', 'College Name is required').not().isEmpty(),
  body('academicInfo.state', 'State is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password, mobileNumber, gender, dateOfBirth, academicInfo, programInfo } = req.body;

  try {
    let user = await prisma.user.findFirst({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        mobileNumber,
        gender,
        dateOfBirth,
        academicInfo,
        programInfo,
        isApproved: false
      }
    });

    res.status(201).json({ msg: 'Registration successful. Waiting for Admin approval.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ msg: 'Account is suspended. Please contact administrator.' });
    }

    if (user.role === 'Student' && !user.isApproved) {
      return res.status(403).json({ msg: 'Your account is pending admin approval.' });
    }

    const payload = {
      user: { id: user.id, role: user.role }
    };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/auth/me
// @desc    Get logged in user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user) {
      delete user.password;
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
