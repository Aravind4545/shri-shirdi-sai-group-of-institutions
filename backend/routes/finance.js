const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const FeeStructure = require('../models/FeeStructure');
const Payment = require('../models/Payment');
const Scholarship = require('../models/Scholarship');
const Admission = require('../models/Admission');

// ==========================================
// FEE STRUCTURE MANAGEMENT (ADMIN)
// ==========================================

router.post('/structures', [auth, admin], async (req, res) => {
  try {
    let fee = await FeeStructure.findOne({ program: req.body.program });
    if (fee) {
      fee = await FeeStructure.findOneAndUpdate({ program: req.body.program }, req.body, { new: true });
    } else {
      fee = new FeeStructure(req.body);
      await fee.save();
    }
    res.json(fee);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/structures', async (req, res) => {
  try {
    const fees = await FeeStructure.find();
    res.json(fees);
  } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// PAYMENTS & INSTALLMENTS
// ==========================================

// Get my payments (Student)
router.get('/my-payments', auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({ studentId: req.user.id }).populate('scholarshipApplied');
    res.json(payment);
  } catch (err) { res.status(500).send('Server Error'); }
});

// Generate Payment Record upon Admission Approval (Internal use or triggered by Admin)
router.post('/generate-record/:admissionId', [auth, admin], async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.admissionId);
    if (!admission || admission.status !== 'Approved') return res.status(400).json({ msg: 'Invalid admission' });

    const feeStruct = await FeeStructure.findOne({ program: admission.program });
    if (!feeStruct) return res.status(400).json({ msg: 'Fee structure not defined for program' });

    let existingPayment = await Payment.findOne({ admissionId: admission._id });
    if (existingPayment) return res.status(400).json({ msg: 'Record exists' });

    // Handle Scholarships
    const scholarship = await Scholarship.findOne({ studentId: admission.studentId, status: 'Approved' });
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

    const payment = new Payment({
      studentId: admission.studentId,
      admissionId: admission._id,
      totalAmountDue: totalDue,
      scholarshipApplied: scholarship ? scholarship._id : null,
      paymentPlan: req.body.paymentPlan || 'One-time',
      installments
    });

    await payment.save();
    res.json(payment);
  } catch (err) { res.status(500).send('Server Error'); }
});

// Process Online Payment (Student)
router.post('/pay', auth, async (req, res) => {
  try {
    const { amount, method, installmentId } = req.body;
    let payment = await Payment.findOne({ studentId: req.user.id });
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
      const inst = payment.installments.id(installmentId);
      if (inst) {
        inst.status = 'Paid';
        inst.paidDate = new Date();
      }
    }

    await payment.save();
    res.json({ msg: 'Payment Successful', transactionId, receiptUrl: `/receipts/${transactionId}.pdf` });
  } catch (err) { res.status(500).send('Server Error'); }
});

// Get all payments (Admin)
router.get('/all-payments', [auth, admin], async (req, res) => {
  try {
    const payments = await Payment.find().populate('studentId', 'fullName email').populate('scholarshipApplied');
    res.json(payments);
  } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// SCHOLARSHIP MANAGEMENT
// ==========================================

router.post('/scholarships', [auth, admin], async (req, res) => {
  try {
    const scholarship = new Scholarship({ ...req.body, approvedBy: req.user.id });
    await scholarship.save();
    res.json(scholarship);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/scholarships', [auth, admin], async (req, res) => {
  try {
    const scholarships = await Scholarship.find().populate('studentId', 'fullName email').populate('approvedBy', 'fullName');
    res.json(scholarships);
  } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;
