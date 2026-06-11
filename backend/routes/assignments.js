const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const User = require('../models/User');

// @route   POST /api/assignments/create
// @desc    Create an assignment (Teacher/Admin only)
router.post('/create', auth, upload.array('files', 5), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!['Teacher', 'Admin', 'SuperAdmin'].includes(user.role)) {
      return res.status(403).json({ msg: 'Unauthorized to create assignments' });
    }

    const { title, description, instructions, program, stream, dueDate, maxMarks } = req.body;

    const attachments = req.files ? req.files.map(file => ({
      filename: file.originalname,
      url: `/uploads/${file.filename}`,
      fileType: file.mimetype
    })) : [];

    const assignment = new Assignment({
      title,
      description,
      instructions,
      program: program || user.programInfo.program,
      stream: stream || user.programInfo.stream,
      dueDate,
      maxMarks: maxMarks || 100,
      teacherId: req.user.id,
      attachments
    });

    await assignment.save();
    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/assignments/teacher
// @desc    Get assignments created by the teacher
router.get('/teacher', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacherId: req.user.id }).sort({ createdAt: -1 });
    
    // Get stats for each assignment
    const assignmentsWithStats = await Promise.all(assignments.map(async (assignment) => {
      const submissions = await AssignmentSubmission.find({ assignmentId: assignment._id });
      const pendingEvals = submissions.filter(s => s.status === 'Submitted' || s.status === 'Late').length;
      return {
        ...assignment.toObject(),
        totalSubmissions: submissions.length,
        pendingEvals
      };
    }));

    res.json(assignmentsWithStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/assignments/student
// @desc    Get assignments for a student's program
router.get('/student', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const assignments = await Assignment.find({ 
      program: user.programInfo.program,
      status: 'Active' 
    }).populate('teacherId', 'fullName').sort({ dueDate: 1 });

    const submissions = await AssignmentSubmission.find({ studentId: req.user.id });

    // Map submissions to assignments
    const assignmentsWithStatus = assignments.map(assignment => {
      const submission = submissions.find(s => s.assignmentId.toString() === assignment._id.toString());
      
      let status = 'Pending';
      if (submission) {
        status = submission.status;
      } else if (new Date() > new Date(assignment.dueDate)) {
        status = 'Overdue';
      }

      return {
        ...assignment.toObject(),
        submissionStatus: status,
        submissionDetails: submission || null
      };
    });

    res.json(assignmentsWithStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/assignments/:id/submit
// @desc    Submit an assignment (Student)
router.post('/:id/submit', auth, upload.array('files', 5), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ msg: 'Assignment not found' });
    }

    const isLate = new Date() > new Date(assignment.dueDate);
    
    const files = req.files ? req.files.map(file => ({
      filename: file.originalname,
      url: `/uploads/${file.filename}`,
      fileType: file.mimetype
    })) : [];

    let submission = await AssignmentSubmission.findOne({ 
      assignmentId: req.params.id, 
      studentId: req.user.id 
    });

    if (submission) {
      // Update existing submission
      submission.files = files.length > 0 ? files : submission.files;
      submission.status = isLate ? 'Late' : 'Submitted';
      submission.submissionDate = Date.now();
      await submission.save();
    } else {
      // Create new submission
      submission = new AssignmentSubmission({
        assignmentId: req.params.id,
        studentId: req.user.id,
        status: isLate ? 'Late' : 'Submitted',
        files
      });
      await submission.save();
    }

    res.json(submission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/assignments/:id/submissions
// @desc    Get all submissions for an assignment (Teacher)
router.get('/:id/submissions', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (assignment.teacherId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to view these submissions' });
    }

    const submissions = await AssignmentSubmission.find({ assignmentId: req.params.id })
      .populate('studentId', 'fullName email mobileNumber programInfo')
      .sort({ submissionDate: -1 });

    res.json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/assignments/:id/grade/:submissionId
// @desc    Grade a submission
router.post('/:id/grade/:submissionId', auth, async (req, res) => {
  try {
    const { marks, feedback } = req.body;
    
    const submission = await AssignmentSubmission.findById(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ msg: 'Submission not found' });
    }

    submission.marksAwarded = marks;
    submission.feedback = feedback;
    submission.status = 'Graded';
    await submission.save();

    res.json(submission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
