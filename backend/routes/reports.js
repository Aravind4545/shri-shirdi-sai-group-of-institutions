const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Admission = require('../models/Admission');
const Payment = require('../models/Payment');
const Scholarship = require('../models/Scholarship');

// Get high level dashboard analytics
router.get('/dashboard', [auth, admin], async (req, res) => {
  try {
    const totalAdmissions = await Admission.countDocuments();
    const approvedAdmissions = await Admission.countDocuments({ status: 'Approved' });
    const pendingAdmissions = await Admission.countDocuments({ status: 'Pending' });

    const payments = await Payment.find();
    let totalRevenue = 0;
    let pendingRevenue = 0;
    
    payments.forEach(p => {
      totalRevenue += p.totalAmountPaid;
      pendingRevenue += (p.totalAmountDue - p.totalAmountPaid);
    });

    const scholarshipsGranted = await Scholarship.countDocuments({ status: 'Approved' });

    res.json({
      totalAdmissions,
      approvedAdmissions,
      pendingAdmissions,
      totalRevenue,
      pendingRevenue,
      scholarshipsGranted
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
