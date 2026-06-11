const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const User = require('../models/User');
const Material = require('../models/Material');
const Test = require('../models/Test');
const TestResult = require('../models/TestResult');
const Announcement = require('../models/Announcement');
const Attendance = require('../models/Attendance');
const CMSContent = require('../models/CMSContent');

// @route   GET /api/admin/stats
// @desc    Get complete admin dashboard stats
router.get('/stats', [auth, admin], async (req, res) => {
  try {
    const students = await User.find({ role: 'Student' });
    const lakshya = students.filter(s => s.programInfo?.program === 'Lakshya').length;
    const deekshya = students.filter(s => s.programInfo?.program === 'Deekshya').length;
    const dafne = students.filter(s => s.programInfo?.program === 'DAFNE').length;

    const activeTests = await Test.countDocuments();
    const studyMaterials = await Material.countDocuments();
    const announcements = await Announcement.countDocuments();
    
    // Calculate global attendance %
    const attendanceRecords = await Attendance.find();
    let attPercentage = 100;
    if (attendanceRecords.length > 0) {
      const present = attendanceRecords.filter(r => r.status === 'Present').length;
      attPercentage = Math.round((present / attendanceRecords.length) * 100);
    }

    res.json({
      totalStudents: students.length,
      lakshyaStudents: lakshya,
      deekshyaStudents: deekshya,
      dafneStudents: dafne,
      activeTests,
      studyMaterials,
      announcements,
      attendancePercentage: attPercentage
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ==========================================
// STUDENT MANAGEMENT
// ==========================================
router.get('/students', [auth, admin], async (req, res) => {
  try {
    const students = await User.find({ role: 'Student' }).select('-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.put('/students/:id', [auth, admin], async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.delete('/students/:id', [auth, admin], async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Student deleted' });
  } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// MATERIAL MANAGEMENT
// ==========================================
router.get('/materials', [auth, admin], async (req, res) => {
  try {
    const materials = await Material.find().sort({ uploadedAt: -1 });
    res.json(materials);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.post('/materials', [auth, admin], async (req, res) => {
  try {
    const material = new Material(req.body);
    await material.save();
    res.json(material);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.delete('/materials/:id', [auth, admin], async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Material deleted' });
  } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// TEST MANAGEMENT
// ==========================================
router.get('/tests', [auth, admin], async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.post('/tests', [auth, admin], async (req, res) => {
  try {
    const test = new Test(req.body);
    await test.save();
    res.json(test);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.delete('/tests/:id', [auth, admin], async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Test deleted' });
  } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// ANNOUNCEMENT MANAGEMENT
// ==========================================
router.get('/announcements', [auth, admin], async (req, res) => {
  try {
    const ann = await Announcement.find().sort({ date: -1 });
    res.json(ann);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.post('/announcements', [auth, admin], async (req, res) => {
  try {
    const ann = new Announcement(req.body);
    await ann.save();
    res.json(ann);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.delete('/announcements/:id', [auth, admin], async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Announcement deleted' });
  } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// CMS MANAGEMENT
// ==========================================
router.get('/cms', [auth, admin], async (req, res) => {
  try {
    const content = await CMSContent.find();
    res.json(content);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.post('/cms', [auth, admin], async (req, res) => {
  try {
    // Upsert logic for CMS content
    const { page, section, content } = req.body;
    let cms = await CMSContent.findOne({ page, section });
    if (cms) {
      cms.content = content;
      cms.updatedAt = Date.now();
      await cms.save();
    } else {
      cms = new CMSContent({ page, section, content });
      await cms.save();
    }
    res.json(cms);
  } catch (err) { res.status(500).send('Server Error'); }
});

const TeacherAttendance = require('../models/TeacherAttendance');

// ==========================================
// TEACHER ATTENDANCE MANAGEMENT
// ==========================================
router.get('/teacher-attendance', [auth, admin], async (req, res) => {
  try {
    const teachers = await User.find({ role: 'Teacher' }).select('-password -faceEmbedding');
    const teacherIds = teachers.map(t => t._id);
    
    // Get all attendance records for these teachers
    const attendanceRecords = await TeacherAttendance.find({ teacherId: { $in: teacherIds } }).sort({ date: -1 });

    // Send both back so the frontend can map and display them easily
    res.json({ teachers, attendanceRecords });
  } catch (err) { 
    console.error(err);
    res.status(500).send('Server Error'); 
  }
});

// ==========================================
// REGISTRATION APPROVALS
// ==========================================

// @route   GET /api/admin/pending-approvals
// @desc    Get all students pending admin approval
router.get('/pending-approvals', [auth, admin], async (req, res) => {
  try {
    const pendingStudents = await User.find({ role: 'Student', isApproved: false }).select('-password').sort({ createdAt: -1 });
    res.json(pendingStudents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/admin/approve-student/:id
// @desc    Approve a student registration
router.post('/approve-student/:id', [auth, admin], async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'Student') {
      return res.status(404).json({ msg: 'Student not found' });
    }

    student.isApproved = true;
    await student.save();

    res.json({ msg: 'Student approved successfully', student });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
