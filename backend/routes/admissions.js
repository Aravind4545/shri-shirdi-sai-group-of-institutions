const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Admission = require('../models/Admission');

// Apply for Admission (Student)
router.post('/apply', auth, async (req, res) => {
  try {
    const existing = await Admission.findOne({ studentId: req.user.id });
    if (existing) return res.status(400).json({ msg: 'Application already submitted' });

    const newAdmission = new Admission({
      studentId: req.user.id,
      ...req.body
    });

    await newAdmission.save();
    res.json(newAdmission);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get My Admission (Student)
router.get('/my-application', auth, async (req, res) => {
  try {
    const admission = await Admission.findOne({ studentId: req.user.id });
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

    const admissions = await Admission.find(filters).populate('studentId', 'fullName email role').sort({ applicationDate: -1 });
    res.json(admissions);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update Admission Status (Admin)
router.put('/status/:id', [auth, admin], async (req, res) => {
  try {
    const { status, reviewerNotes } = req.body;
    let admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ msg: 'Admission not found' });

    admission.status = status;
    if (reviewerNotes) admission.reviewerNotes = reviewerNotes;

    // Auto-generate ID if approved
    if (status === 'Approved' && !admission.assignedStudentId) {
      const count = await Admission.countDocuments({ status: 'Approved' });
      admission.assignedStudentId = `SSSI-2026-${String(count + 1).padStart(4, '0')}`;
    }

    await admission.save();
    res.json(admission);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
