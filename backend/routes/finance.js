const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');





// ==========================================
// FEE STRUCTURE MANAGEMENT (ADMIN)
// ==========================================

router.post('/structures', [auth, admin], async (req, res) => {
  try {
    let fee = await prisma.feeStructure.findFirst({ where: { program: req.body.program } });
    if (fee) {
      fee = await prisma.feeStructure.update({ where: { id: fee.id }, data: req.body });
    } else {
      fee = await prisma.feeStructure.create({ data: req.body });
    }
    res.json(fee);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/structures', async (req, res) => {
  try {
    const fees = await prisma.feeStructure.findMany();
    res.json(fees);
  } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// PAYMENTS & INSTALLMENTS
// ==========================================

// Get my payments (Student)
router.get('/my-payments', auth, async (req, res) => {
  try {
    const payment = await prisma.payment.findFirst({
      where: { studentId: req.user.id },
      include: { scholarshipApplied: true }
    });
    res.json(payment);
  } catch (err) { res.status(500).send('Server Error'); }
});

// Generate Payment Record upon Admission Approval (Internal use or triggered by Admin)
router.post('/generate-record/:admissionId', [auth, admin], async (req, res) => {
  try {
    const admission = await prisma.admission.findUnique({ where: { id: req.params.admissionId } });
    if (!admission || admission.status !== 'Approved') return res.status(400).json({ msg: 'Invalid admission' });

    const feeStruct = await prisma.feeStructure.findFirst({ where: { program: admission.program } });
    if (!feeStruct) return res.status(400).json({ msg: 'Fee structure not defined for program' });

    let existingPayment = await prisma.payment.findFirst({ where: { admissionId: admission.id } });
    if (existingPayment) return res.status(400).json({ msg: 'Record exists' });

    // Handle Scholarships
    const scholarship = await prisma.scholarship.findFirst({ where: { studentId: admission.studentId, status: 'Approved' } });
    let totalDue = feeStruct.totalFee;
    
    if (scholarship) {
      if (scholarship.discountPercentage) totalDue = totalDue - (totalDue * (scholarship.discountPercentage / 100));
      else if (scholarship.discountAmount) totalDue = totalDue - scholarship.discountAmount;
    }

    // Default Installment Setup
    const installments = [];
    if (req.body.paymentPlan === 'Monthly') {
      const perMonth = totalDue / 10;
      for(let i=0; i<10; i++) {
        let d = new Date(); d.setMonth(d.getMonth() + i);
        installments.push({ amount: perMonth, dueDate: d });
      }
    } else {
      installments.push({ amount: totalDue, dueDate: new Date() });
    }

    const payment = await prisma.payment.create({ data: {
      studentId: admission.studentId,
      admissionId: admission.id,
      totalAmountDue: totalDue,
      scholarshipAppliedId: scholarship ? scholarship.id : null,
      paymentPlan: req.body.paymentPlan || 'One-time',
      installments
    } });
    res.json(payment);
  } catch (err) { res.status(500).send('Server Error'); }
});

// Process Online Payment (Student)
router.post('/pay', auth, async (req, res) => {
  try {
    const { amount, method, installmentId } = req.body;
    let payment = await prisma.payment.findFirst({ where: { studentId: req.user.id } });
    if (!payment) return res.status(404).json({ msg: 'Payment record not found' });

    // Mocking Payment Gateway Success
    const transactionId = 'TXN' + Math.floor(Math.random() * 1000000000);
    
    payment.transactions.push({
      transactionId,
      amount,
      method,
      status: 'Success',
      receiptUrl: `/receipts/${transactionId}.pdf`
    });

    payment.totalAmountPaid += amount;

    // Update Installment Status
    if (installmentId) {
      const instIndex = payment.installments.findIndex(i => i.id === installmentId || i._id === installmentId);
      if (instIndex !== -1) {
        payment.installments[instIndex].status = 'Paid';
        payment.installments[instIndex].paidDate = new Date();
      }
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        transactions: payment.transactions,
        totalAmountPaid: payment.totalAmountPaid,
        installments: payment.installments
      }
    });
    res.json({ msg: 'Payment Successful', transactionId, receiptUrl: `/receipts/${transactionId}.pdf` });
  } catch (err) { res.status(500).send('Server Error'); }
});

// Get all payments (Admin)
router.get('/all-payments', [auth, admin], async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        student: { select: { fullName: true, email: true } },
        scholarshipApplied: true
      }
    });
    res.json(payments);
  } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// SCHOLARSHIP MANAGEMENT
// ==========================================

router.post('/scholarships', [auth, admin], async (req, res) => {
  try {
    const scholarship = await prisma.scholarship.create({ data: { ...req.body, approvedBy: req.user.id } });
    res.json(scholarship);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/scholarships', [auth, admin], async (req, res) => {
  try {
    const scholarships = await prisma.scholarship.findMany({
      include: {
        student: { select: { fullName: true, email: true } },
        approver: { select: { fullName: true } }
      }
    });
    res.json(scholarships);
  } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;
