const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const prisma = require('../prisma/client');

// Utility to calculate or mock ranks dynamically for demo
const ensureRanks = async () => {
  const students = await prisma.user.findMany({ where: { role: 'Student' } });
  for (let [index, student] of students.entries()) {
    let rank = await prisma.ranking.findFirst({ where: { studentId: student.id } });
    if (!rank) {
      rank = await prisma.ranking.create({
        data: {
          studentId: student.id,
          program: student.programInfo.program,
          globalRank: index + 1,
          programRank: index + 1,
          overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
          attendanceScore: Math.floor(Math.random() * 20) + 80,
          assignmentScore: Math.floor(Math.random() * 30) + 70,
          testScore: Math.floor(Math.random() * 40) + 60,
          healthScore: Math.floor(Math.random() * 25) + 75,
          subjectScores: [
            { subject: 'Physics', score: Math.floor(Math.random() * 40) + 60, rank: index + 1 },
            { subject: 'Chemistry', score: Math.floor(Math.random() * 40) + 60, rank: index + 1 }
          ]
        }
      });

      // Add a default achievement
      if (index === 0) {
        await prisma.achievement.create({
          data: {
            studentId: student.id,
            badgeName: 'Top Performer',
            description: 'Achieved top 1% in Global Rankings',
            icon: 'Trophy',
            category: 'Academic'
          }
        });
      }
    }
  }
};

// @route   GET /api/leaderboard/global
// @desc    Get Global Leaderboard
router.get('/global', auth, async (req, res) => {
  try {
    await ensureRanks();
    const rankings = await prisma.ranking.findMany({
      include: { student: { select: { fullName: true, profilePicture: true, programInfo_program: true, programInfo_stream: true } } },
      orderBy: { overallScore: 'desc' },
      take: 50
    });
    res.json(rankings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/leaderboard/program/:program
// @desc    Get Program-wise Leaderboard
router.get('/program/:program', auth, async (req, res) => {
  try {
    await ensureRanks();
    const rankings = await prisma.ranking.findMany({
      where: { program: req.params.program },
      include: { student: { select: { fullName: true, profilePicture: true, programInfo_program: true, programInfo_stream: true } } },
      orderBy: { overallScore: 'desc' },
      take: 50
    });
    res.json(rankings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/leaderboard/me
// @desc    Get logged-in student rank, achievements, and history
router.get('/me', auth, async (req, res) => {
  try {
    await ensureRanks();
    const rank = await prisma.ranking.findFirst({
      where: { studentId: req.user.id },
      include: { student: { select: { fullName: true, programInfo_program: true, programInfo_stream: true } } }
    });
    const achievements = await prisma.achievement.findMany({
      where: { studentId: req.user.id },
      orderBy: { earnedAt: 'desc' }
    });
    
    // Mock rank history if none
    let history = await prisma.rankHistory.findMany({
      where: { studentId: req.user.id },
      orderBy: { timestamp: 'asc' }
    });
    if (history.length === 0) {
        history = [
            { timestamp: new Date(Date.now() - 30*24*60*60*1000), globalRank: rank ? rank.globalRank + 5 : 10, overallScore: 75 },
            { timestamp: new Date(Date.now() - 15*24*60*60*1000), globalRank: rank ? rank.globalRank + 2 : 7, overallScore: 82 },
            { timestamp: new Date(), globalRank: rank ? rank.globalRank : 5, overallScore: rank ? rank.overallScore : 88 }
        ];
    }

    res.json({ rank, achievements, history });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/leaderboard/teacher
// @desc    Get rankings for a teacher's batch
router.get('/teacher', auth, async (req, res) => {
  try {
    const teacher = await prisma.user.findUnique({ where: { id: req.user.id } });
    const rankings = await prisma.ranking.findMany({
      where: { program: teacher.programInfo.program },
      include: { student: { select: { fullName: true, email: true } } },
      orderBy: { overallScore: 'desc' }
    });
    res.json(rankings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
