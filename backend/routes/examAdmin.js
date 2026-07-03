const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');




// ==========================================
// QUESTION BANK MANAGEMENT
// ==========================================

// Get all questions (with filters)
router.get('/questions', [auth, admin], async (req, res) => {
  try {
    const filters = {};
    if (req.query.program) filters.program = req.query.program;
    if (req.query.subject) filters.subject = req.query.subject;
    if (req.query.difficulty) filters.difficulty = req.query.difficulty;

    const questions = await prisma.question.findMany({
      where: filters,
      orderBy: { id: 'desc' }
    });
    res.json(questions);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create question
router.post('/questions', [auth, admin], async (req, res) => {
  try {
    const question = await prisma.question.create({ data: req.body });
    res.json(question);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete question
router.delete('/questions/:id', [auth, admin], async (req, res) => {
  try {
    await prisma.question.delete({ where: { id: req.params.id } });
    res.json({ msg: 'Question deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ==========================================
// EXAM / TEST ASSEMBLY
// ==========================================

// Create a new test with questions
router.post('/tests', [auth, admin], async (req, res) => {
  try {
    const test = await prisma.test.create({ data: req.body });
    res.json(test);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add questions to a test
router.post('/tests/:id/questions', [auth, admin], async (req, res) => {
  try {
    const test = await prisma.test.findUnique({ where: { id: req.params.id } });
    if (!test) return res.status(404).json({ msg: 'Test not found' });

    // Expecting array of question IDs
    const { questionIds } = req.body;
    const updatedQuestions = test.questions ? [...test.questions, ...questionIds] : questionIds;

    const updatedTest = await prisma.test.update({
      where: { id: req.params.id },
      data: { questions: updatedQuestions }
    });
    
    res.json(updatedTest);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
