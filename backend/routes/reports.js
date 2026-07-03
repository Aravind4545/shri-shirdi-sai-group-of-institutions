const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');




// Get high level dashboard analytics
router.get('/dashboard', [auth, admin], async (req, res) => {
  try {
    const totalAdmissions = await prisma.admission.count();
    const approvedAdmissions = await prisma.admission.count({ where: { status: 'Approved' } });
    const pendingAdmissions = await prisma.admission.count({ where: { status: 'Pending' } });

    const payments = await prisma.payment.findMany();
    let totalRevenue = 0;
    let pendingRevenue = 0;
    
    payments.forEach(p => {
      totalRevenue += p.totalAmountPaid;
      pendingRevenue += (p.totalAmountDue - p.totalAmountPaid);
    });

    const scholarshipsGranted = await prisma.scholarship.count({ where: { status: 'Approved' } });

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
