const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Ranking = require('../models/Ranking');
const Achievement = require('../models/Achievement');
const RankHistory = require('../models/RankHistory');

// Utility to calculate or mock ranks dynamically for demo
const ensureRanks = async () => {
  const students = await User.find({ role: 'Student' });
  for (let [index, student] of students.entries()) {
    let rank = await Ranking.findOne({ studentId: student._id });
    if (!rank) {
      rank = new Ranking({
        studentId: student._id,
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
      });
      await rank.save();

      // Add a default achievement
      if (index === 0) {
        await new Achievement({
          studentId: student._id,
          badgeName: 'Top Performer',
          description: 'Achieved top 1% in Global Rankings',
          icon: 'Trophy',
          category: 'Academic'
        }).save();
      }
    }
  }
};

// @route   GET /api/leaderboard/global
// @desc    Get Global Leaderboard
router.get('/global', auth, async (req, res) => {
  try {
    await ensureRanks();
    const rankings = await Ranking.find().populate('studentId', 'fullName profilePicture programInfo').sort({ overallScore: -1 }).limit(50);
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
    const rankings = await Ranking.find({ program: req.params.program })
      .populate('studentId', 'fullName profilePicture programInfo')
      .sort({ overallScore: -1 })
      .limit(50);
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
    const rank = await Ranking.findOne({ studentId: req.user.id }).populate('studentId', 'fullName programInfo');
    const achievements = await Achievement.find({ studentId: req.user.id }).sort({ earnedAt: -1 });
    
    // Mock rank history if none
    let history = await RankHistory.find({ studentId: req.user.id }).sort({ timestamp: 1 });
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
    const teacher = await User.findById(req.user.id);
    const rankings = await Ranking.find({ program: teacher.programInfo.program })
      .populate('studentId', 'fullName email')
      .sort({ overallScore: -1 });
    res.json(rankings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
