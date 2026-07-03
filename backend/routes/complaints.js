const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

// @route   POST /api/complaints
// @desc    Submit a new complaint (Student/Teacher)
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { type, title, description } = req.body;
    
    if (!type || !title || !description) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const complaint = await prisma.complaint.create({
      data: {
        user: req.user.id,
        type,
        title,
        description
      }
    });

    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/complaints/my
// @desc    Get current user's complaints
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      where: { user: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/complaints
// @desc    Get all complaints (Admin only)
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const complaints = await prisma.complaint.findMany({
      include: {
        user: {
          select: { fullName: true, email: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/complaints/:id/status
// @desc    Update complaint status (Admin only)
// @access  Private (Admin)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const { status } = req.body;
    
    let complaint = await prisma.complaint.findUnique({ where: { id: req.params.id } });
    if (!complaint) return res.status(404).json({ msg: 'Complaint not found' });

    complaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
