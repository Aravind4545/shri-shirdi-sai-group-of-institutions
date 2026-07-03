const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');






// ==========================================
// EXAM TAKING
// ==========================================

// Start Exam (or resume)
router.post('/start/:testId', auth, async (req, res) => {
  try {
    const test = await prisma.test.findUnique({
      where: { id: req.params.testId },
      include: { questions: true }
    });
    if (!test) return res.status(404).json({ msg: 'Test not found' });

    let session = await prisma.examSession.findFirst({ where: { studentId: req.user.id, testId: req.params.testId } });
    
    if (!session) {
      session = await prisma.examSession.create({
        data: {
          studentId: req.user.id,
          testId: req.params.testId,
          responses: test.questions.map(q => ({
            questionId: q.id || q._id,
            selectedOptions: [],
            status: 'NotAttempted'
          }))
        }
      });
    }

    res.json({ session, test });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Save Progress (called periodically or on next/prev)
router.put('/progress/:sessionId', auth, async (req, res) => {
  try {
    const { questionId, selectedOptions, status, timeSpentSeconds } = req.body;
    const session = await prisma.examSession.findUnique({ where: { id: req.params.sessionId } });
    
    if (!session || session.studentId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const respIndex = session.responses.findIndex(r => r.questionId.toString() === questionId);
    if (respIndex > -1) {
      session.responses[respIndex].selectedOptions = selectedOptions;
      session.responses[respIndex].status = status;
      session.responses[respIndex].timeSpentSeconds += timeSpentSeconds || 0;
    }

    await prisma.examSession.update({
      where: { id: req.params.sessionId },
      data: { responses: session.responses }
    });
    res.json({ msg: 'Progress saved' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Log Violation
router.post('/violation/:sessionId', auth, async (req, res) => {
  try {
    const { type, details } = req.body;
    const session = await prisma.examSession.findUnique({ where: { id: req.params.sessionId } });
    if (session) {
      session.violations.push({ type, details });
      await prisma.examSession.update({
        where: { id: req.params.sessionId },
        data: { violations: session.violations }
      });
    }
    res.json({ msg: 'Violation logged' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Submit Exam & Auto-Evaluate
router.post('/submit/:sessionId', auth, async (req, res) => {
  try {
    const session = await prisma.examSession.findUnique({
      where: { id: req.params.sessionId },
      include: {
        responses: {
          include: { questionId: true }
        }
      }
    });
    if (!session || session.studentId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const test = await prisma.test.findUnique({ where: { id: session.testId } });

    session.status = 'Submitted';
    session.endTime = new Date();
    await prisma.examSession.update({
      where: { id: req.params.sessionId },
      data: { status: session.status, endTime: session.endTime }
    });

    let score = 0;
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    let subjectPerformance = {};

    session.responses.forEach(r => {
      const q = r.questionId;
      if (!q) return;

      const subj = q.subject || 'General';
      if (!subjectPerformance[subj]) subjectPerformance[subj] = { total: 0, correct: 0 };
      subjectPerformance[subj].total += 1;

      if (!r.selectedOptions || r.selectedOptions.length === 0) {
        unattempted++;
      } else {
        // Compare sorted options for multi-correct support
        const isCorrect = JSON.stringify([...(r.selectedOptions || [])].sort()) === JSON.stringify([...(q.correctAnswers || [])].sort());
        if (isCorrect) {
          correct++;
          score += q.marks;
          subjectPerformance[subj].correct += 1;
        } else {
          wrong++;
          if (test.negativeMarking) score -= q.negativeMarks;
        }
      }
    });

    const accuracy = correct + wrong > 0 ? (correct / (correct + wrong)) * 100 : 0;
    
    // Simple AI Recommendation Mock
    const aiRecommendations = [];
    let weakAreas = [];
    let strongAreas = [];

    for (const [subj, perf] of Object.entries(subjectPerformance)) {
      const perfAcc = perf.correct / perf.total;
      if (perfAcc < 0.5) {
        weakAreas.push(subj);
        aiRecommendations.push(`Focus more on ${subj}. Review fundamental concepts.`);
      } else {
        strongAreas.push(subj);
      }
    }

    if (accuracy < 60) aiRecommendations.push(`Work on improving accuracy to reduce negative marks.`);

    const result = await prisma.testResult.create({
      data: {
        studentId: req.user.id,
        testId: session.testId,
        score,
        correctAnswers: correct,
        wrongAnswers: wrong,
        unattempted,
        accuracyPercentage: Math.round(accuracy),
        weakAreas,
        strongAreas,
        aiRecommendations
      }
    });

    res.json(result);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Analytics Dashboard
router.get('/analytics', auth, async (req, res) => {
  try {
    const results = await prisma.testResult.findMany({
      where: { studentId: req.user.id },
      include: {
        testId: { select: { title: true, subject: true, createdAt: true } }
      }
    });
    res.json(results);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
