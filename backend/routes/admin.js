const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const prisma = require('../prisma/client');

// @route   GET /api/admin/stats
// @desc    Get complete admin dashboard stats
router.get('/stats', [auth, admin], async (req, res) => {
  try {
    const students = await prisma.user.findMany({ where: { role: 'Student' } });
    const lakshya = students.filter(s => s.programInfo?.program === 'Lakshya').length;
    const deekshya = students.filter(s => s.programInfo?.program === 'Deekshya').length;
    const dafne = students.filter(s => s.programInfo?.program === 'DAFNE').length;

    const activeTests = await prisma.test.count();
    const studyMaterials = await prisma.material.count();
    const announcements = await prisma.announcement.count();
    
    // Calculate global attendance %
    const attendanceRecords = await prisma.attendance.findMany();
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
    const students = await prisma.user.findMany({
      where: { role: 'Student' },
      select: { id: true, fullName: true, email: true, role: true, programInfo: true, isApproved: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(students);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.put('/students/:id', [auth, admin], async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
      select: { id: true, fullName: true, email: true, role: true, programInfo: true, isApproved: true, createdAt: true }
    });
    res.json(user);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.delete('/students/:id', [auth, admin], async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ msg: 'Student deleted' });
  } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// MATERIAL MANAGEMENT
// ==========================================
router.get('/materials', [auth, admin], async (req, res) => {
  try {
    const materials = await prisma.material.findMany({ orderBy: { uploadedAt: 'desc' } });
    res.json(materials);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.post('/materials', [auth, admin], async (req, res) => {
  try {
    const material = await prisma.material.create({ data: req.body });
    res.json(material);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.delete('/materials/:id', [auth, admin], async (req, res) => {
  try {
    await prisma.material.delete({ where: { id: req.params.id } });
    res.json({ msg: 'Material deleted' });
  } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// TEST MANAGEMENT
// ==========================================
router.get('/tests', [auth, admin], async (req, res) => {
  try {
    const tests = await prisma.test.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(tests);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.post('/tests', [auth, admin], async (req, res) => {
  try {
    const test = await prisma.test.create({ data: req.body });
    res.json(test);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.delete('/tests/:id', [auth, admin], async (req, res) => {
  try {
    await prisma.test.delete({ where: { id: req.params.id } });
    res.json({ msg: 'Test deleted' });
  } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// ANNOUNCEMENT MANAGEMENT
// ==========================================
router.get('/announcements', [auth, admin], async (req, res) => {
  try {
    const ann = await prisma.announcement.findMany({ orderBy: { date: 'desc' } });
    res.json(ann);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.post('/announcements', [auth, admin], async (req, res) => {
  try {
    const ann = await prisma.announcement.create({ data: req.body });
    res.json(ann);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.delete('/announcements/:id', [auth, admin], async (req, res) => {
  try {
    await prisma.announcement.delete({ where: { id: req.params.id } });
    res.json({ msg: 'Announcement deleted' });
  } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// CMS MANAGEMENT
// ==========================================
router.get('/cms', [auth, admin], async (req, res) => {
  try {
    const content = await prisma.cMSContent.findMany();
    res.json(content);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.post('/cms', [auth, admin], async (req, res) => {
  try {
    // Upsert logic for CMS content
    const { page, section, content } = req.body;
    let cms = await prisma.cMSContent.findFirst({ where: { page, section } });
    if (cms) {
      cms = await prisma.cMSContent.update({
        where: { id: cms.id },
        data: { content, updatedAt: new Date() }
      });
    } else {
      cms = await prisma.cMSContent.create({ data: { page, section, content } });
    }
    res.json(cms);
  } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// TEACHER ATTENDANCE MANAGEMENT
// ==========================================
router.get('/teacher-attendance', [auth, admin], async (req, res) => {
  try {
    const teachers = await prisma.user.findMany({ 
      where: { role: 'Teacher' },
      select: { id: true, fullName: true, email: true, role: true, programInfo: true, isApproved: true, createdAt: true }
    });
    const teacherIds = teachers.map(t => t.id);
    
    // Get all attendance records for these teachers
    const attendanceRecords = await prisma.teacherAttendance.findMany({ 
      where: { teacherId: { in: teacherIds } },
      orderBy: { date: 'desc' }
    });

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
    const pendingStudents = await prisma.user.findMany({ 
      where: { role: 'Student', isApproved: false },
      select: { id: true, fullName: true, email: true, role: true, programInfo: true, isApproved: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
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
    const student = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!student || student.role !== 'Student') {
      return res.status(404).json({ msg: 'Student not found' });
    }

    const updatedStudent = await prisma.user.update({
      where: { id: req.params.id },
      data: { isApproved: true }
    });

    res.json({ msg: 'Student approved successfully', student: updatedStudent });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
