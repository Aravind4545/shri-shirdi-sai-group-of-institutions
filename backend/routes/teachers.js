const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


// GET all teachers
router.get('/', async (req, res) => {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: 'Teacher' },
      select: {
        id: true,
        fullName: true,
        mobileNumber: true,
        email: true,
        gender: true,
        dateOfBirth: true,
        academicInfo_intermediateYear: true,
        academicInfo_collegeName: true,
        academicInfo_state: true,
        programInfo_program: true,
        programInfo_stream: true,
        programInfo_exams: true,
        role: true,
        isApproved: true,
        profileImage: true,
        faceLoginEnabled: true,
        assignedProgram: true,
        designation: true,
        profilePhoto: true,
        teacherId: true,
        employeeId: true,
        subject: true,
        status: true,
        companionSettings_style: true,
        companionSettings_companionName: true,
        companionSettings_studentNickname: true,
        companionSettings_isConfigured: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// CREATE a teacher
router.post('/', async (req, res) => {
  try {
    const { fullName, email, mobileNumber, password, assignedProgram, subject, employeeId } = req.body;

    let user = await prisma.user.findFirst({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: 'Teacher with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await prisma.user.create({
      data: {
        fullName,
        email,
        mobileNumber,
        password: hashedPassword,
        role: 'Teacher',
        assignedProgram,
        subject,
        employeeId,
        status: 'Active',
        teacherId: `TCH-${Math.floor(1000 + Math.random() * 9000)}`
      }
    });
    
    // Remove password from response
    user.password = undefined;
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// UPDATE a teacher
router.put('/:id', async (req, res) => {
  try {
    const { fullName, email, mobileNumber, password, assignedProgram, subject, employeeId, status, faceLoginEnabled } = req.body;

    let user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ msg: 'Teacher not found' });

    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (assignedProgram) updateData.assignedProgram = assignedProgram;
    if (subject) updateData.subject = subject;
    if (employeeId) updateData.employeeId = employeeId;
    if (status) updateData.status = status;
    if (typeof faceLoginEnabled === 'boolean') updateData.faceLoginEnabled = faceLoginEnabled;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    user = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData
    });

    user.password = undefined;
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE a teacher
router.delete('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ msg: 'Teacher not found' });

    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ msg: 'Teacher removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
