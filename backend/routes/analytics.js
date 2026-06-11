const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const TopicAnalytics = require('../models/TopicAnalytics');
const SubjectAnalytics = require('../models/SubjectAnalytics');

// @route   GET /api/analytics/student/overview
// @desc    Get complete analytics overview for a student
router.get('/student/overview', auth, async (req, res) => {
  try {
    const subjects = await SubjectAnalytics.find({ studentId: req.user.id }).sort({ averageAccuracy: -1 });
    const topics = await TopicAnalytics.find({ studentId: req.user.id });

    const strongTopics = topics.filter(t => t.status === 'Strong').map(t => t.topic);
    const weakTopics = topics.filter(t => t.status === 'Weak' || t.status === 'Critical').map(t => t.topic);

    res.json({
      subjects,
      bestSubject: subjects.length > 0 ? subjects[0].subject : 'N/A',
      weakSubject: subjects.length > 0 ? subjects[subjects.length - 1].subject : 'N/A',
      strongTopics: strongTopics.slice(0, 5),
      weakTopics: weakTopics.slice(0, 5),
      topicData: topics
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/analytics/teacher/batch
// @desc    Get analytics for teacher's batch
router.get('/teacher/batch', auth, async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id);
    
    // Aggregate analytics across all students in the teacher's program
    const batchTopics = await TopicAnalytics.aggregate([
      { $match: { program: teacher.programInfo.program } },
      { $group: {
          _id: "$topic",
          subject: { $first: "$subject" },
          chapter: { $first: "$chapter" },
          avgAccuracy: { $avg: "$accuracy" },
          totalAttempts: { $sum: "$totalAttempts" }
      }},
      { $sort: { avgAccuracy: 1 } } // Sort by lowest accuracy first (weakest topics)
    ]);

    const batchSubjects = await SubjectAnalytics.aggregate([
      { $match: { program: teacher.programInfo.program } },
      { $group: {
          _id: "$subject",
          avgAccuracy: { $avg: "$averageAccuracy" }
      }}
    ]);

    res.json({
      weakTopics: batchTopics.slice(0, 10), // Top 10 weakest areas
      subjects: batchSubjects
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/analytics/admin/institution
// @desc    Get institution-wide analytics
router.get('/admin/institution', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!['Admin', 'SuperAdmin'].includes(user.role)) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const programPerformance = await SubjectAnalytics.aggregate([
      { $group: {
          _id: "$program",
          avgAccuracy: { $avg: "$averageAccuracy" }
      }}
    ]);

    res.json({
      programPerformance
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/analytics/sync
// @desc    Sync/Calculate analytics for a student (Mock util for now)
router.post('/sync', auth, async (req, res) => {
  try {
    const { studentId, subject, chapter, topic, isCorrect, timeTaken } = req.body;
    const user = await User.findById(studentId || req.user.id);
    
    let topicStat = await TopicAnalytics.findOne({ studentId: user._id, topic });
    if (!topicStat) {
      topicStat = new TopicAnalytics({
        studentId: user._id,
        program: user.programInfo.program,
        subject,
        chapter,
        topic
      });
    }

    topicStat.totalAttempts += 1;
    if (isCorrect) topicStat.correctAttempts += 1;
    else topicStat.wrongAttempts += 1;
    
    // Simple rolling average for time taken
    topicStat.averageTimeTaken = ((topicStat.averageTimeTaken * (topicStat.totalAttempts - 1)) + timeTaken) / topicStat.totalAttempts;
    
    await topicStat.save(); // pre-save calculates accuracy and status

    // Update Subject Analytics
    let subjectStat = await SubjectAnalytics.findOne({ studentId: user._id, subject });
    if (!subjectStat) {
      subjectStat = new SubjectAnalytics({
        studentId: user._id,
        program: user.programInfo.program,
        subject
      });
    }

    // Re-calculate average accuracy for subject
    const allTopics = await TopicAnalytics.find({ studentId: user._id, subject });
    const avgAcc = allTopics.reduce((acc, curr) => acc + curr.accuracy, 0) / allTopics.length;
    
    subjectStat.averageAccuracy = avgAcc;
    subjectStat.improvementTrend.push({ date: Date.now(), accuracy: avgAcc });
    await subjectStat.save();

    res.json({ msg: 'Analytics synced', topicStat, subjectStat });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
