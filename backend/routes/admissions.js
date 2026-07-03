const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


// Apply for Admission (Student)
router.post('/apply', auth, async (req, res) => {
  try {
    const existing = await prisma.admission.findFirst({ where: { studentId: req.user.id } });
    if (existing) return res.status(400).json({ msg: 'Application already submitted' });

    const newAdmission = await prisma.admission.create({
      data: {
        studentId: req.user.id,
        ...req.body
      }
    });
    res.json(newAdmission);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get My Admission (Student)
router.get('/my-application', auth, async (req, res) => {
  try {
    const admission = await prisma.admission.findFirst({ where: { studentId: req.user.id } });
    res.json(admission);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get All Admissions (Admin)
router.get('/all', [auth, admin], async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.program) filters.program = req.query.program;

    const admissions = await prisma.admission.findMany({
      where: filters,
      include: { student: { select: { fullName: true, email: true, role: true } } },
      orderBy: { applicationDate: 'desc' }
    });
    res.json(admissions);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
