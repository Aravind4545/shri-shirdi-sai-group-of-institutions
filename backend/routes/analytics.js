const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route   GET /api/analytics/student/overview
// @desc    Get complete analytics overview for a student
router.get('/student/overview', auth, async (req, res) => {
  try {
    const subjects = await prisma.subjectAnalytics.findMany({
      where: { studentId: req.user.id },
      orderBy: { averageAccuracy: 'desc' }
    });
    const topics = await prisma.topicAnalytics.findMany({ where: { studentId: req.user.id } });

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
    const teacher = await prisma.user.findUnique({ where: { id: req.user.id } });
    
    // Aggregate analytics across all students in the teacher's program
    let batchTopics = await prisma.topicAnalytics.groupBy({
      by: ['topic', 'subject', 'chapter'],
      where: { program: teacher.programInfo.program },
      _avg: { accuracy: true },
      _sum: { totalAttempts: true },
      orderBy: { _avg: { accuracy: 'asc' } }
    });
    batchTopics = batchTopics.map(bt => ({
      _id: bt.topic,
      subject: bt.subject,
      chapter: bt.chapter,
      avgAccuracy: bt._avg.accuracy,
      totalAttempts: bt._sum.totalAttempts
    }));

    let batchSubjects = await prisma.subjectAnalytics.groupBy({
      by: ['subject'],
      where: { program: teacher.programInfo.program },
      _avg: { averageAccuracy: true }
    });
    batchSubjects = batchSubjects.map(bs => ({
      _id: bs.subject,
      avgAccuracy: bs._avg.averageAccuracy
    }));

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
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!['Admin', 'SuperAdmin'].includes(user.role)) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    let programPerformance = await prisma.subjectAnalytics.groupBy({
      by: ['program'],
      _avg: { averageAccuracy: true }
    });
    programPerformance = programPerformance.map(pp => ({
      _id: pp.program,
      avgAccuracy: pp._avg.averageAccuracy
    }));

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
    const user = await prisma.user.findUnique({ where: { id: studentId || req.user.id } });
    
    const userId = user.id || user._id;
    let topicStat = await prisma.topicAnalytics.findFirst({ where: { studentId: userId, topic } });
    
    const isNewTopicStat = !topicStat;
    if (!topicStat) {
      topicStat = {
        studentId: userId,
        program: user.programInfo?.program,
        subject,
        chapter,
        topic,
        totalAttempts: 0,
        correctAttempts: 0,
        wrongAttempts: 0,
        averageTimeTaken: 0
      };
    }

    topicStat.totalAttempts = (topicStat.totalAttempts || 0) + 1;
    if (isCorrect) {
      topicStat.correctAttempts = (topicStat.correctAttempts || 0) + 1;
      topicStat.wrongAttempts = topicStat.wrongAttempts || 0;
    } else {
      topicStat.wrongAttempts = (topicStat.wrongAttempts || 0) + 1;
      topicStat.correctAttempts = topicStat.correctAttempts || 0;
    }
    
    // Simple rolling average for time taken
    topicStat.averageTimeTaken = (((topicStat.averageTimeTaken || 0) * (topicStat.totalAttempts - 1)) + timeTaken) / topicStat.totalAttempts;
    topicStat.accuracy = (topicStat.correctAttempts / topicStat.totalAttempts) * 100;
    if (topicStat.accuracy >= 80) topicStat.status = 'Strong';
    else if (topicStat.accuracy >= 50) topicStat.status = 'Average';
    else if (topicStat.accuracy >= 30) topicStat.status = 'Weak';
    else topicStat.status = 'Critical';
    
    if (isNewTopicStat) {
      topicStat = await prisma.topicAnalytics.create({ data: topicStat });
    } else {
      topicStat = await prisma.topicAnalytics.update({ where: { id: topicStat.id }, data: topicStat });
    }

    // Update Subject Analytics
    let subjectStat = await prisma.subjectAnalytics.findFirst({ where: { studentId: userId, subject } });
    const isNewSubjectStat = !subjectStat;
    if (!subjectStat) {
      subjectStat = {
        studentId: userId,
        program: user.programInfo?.program,
        subject,
        improvementTrend: []
      };
    }

    // Re-calculate average accuracy for subject
    const allTopics = await prisma.topicAnalytics.findMany({ where: { studentId: userId, subject } });
    const avgAcc = allTopics.length > 0 ? allTopics.reduce((acc, curr) => acc + curr.accuracy, 0) / allTopics.length : 0;
    
    subjectStat.averageAccuracy = avgAcc;
    subjectStat.improvementTrend = subjectStat.improvementTrend || [];
    subjectStat.improvementTrend.push({ date: new Date(), accuracy: avgAcc });
    
    if (isNewSubjectStat) {
      subjectStat = await prisma.subjectAnalytics.create({ data: subjectStat });
    } else {
      subjectStat = await prisma.subjectAnalytics.update({ where: { id: subjectStat.id }, data: subjectStat });
    }

    res.json({ msg: 'Analytics synced', topicStat, subjectStat });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
