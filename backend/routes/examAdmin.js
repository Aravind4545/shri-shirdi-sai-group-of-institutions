const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const Question = require('../models/Question');
const Test = require('../models/Test');

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

    const questions = await Question.find(filters).sort({ _id: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create question
router.post('/questions', [auth, admin], async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete question
router.delete('/questions/:id', [auth, admin], async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
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
    const test = new Test(req.body);
    await test.save();
    res.json(test);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Add questions to a test
router.post('/tests/:id/questions', [auth, admin], async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ msg: 'Test not found' });

    // Expecting array of question IDs
    const { questionIds } = req.body;
    test.questions.push(...questionIds);
    await test.save();
    
    res.json(test);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
