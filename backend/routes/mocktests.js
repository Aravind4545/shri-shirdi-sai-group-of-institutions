const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const isTeacher = require('../middleware/teacher');
const isAdmin = require('../middleware/admin');




const { GoogleGenerativeAI } = require('@google/generative-ai');

// ...
// Inside the upload route logic ...
// (I will replace the whole block)

const upload = multer({ dest: 'uploads/mocktests/' });

// Initialize Gemini API
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   POST /api/mocktests/upload
// @desc    Upload PDF, visually extract questions using Gemini 1.5, and save Mock Test
// @access  Teacher/Admin
router.post('/upload', auth, isTeacher, upload.single('pdf'), async (req, res) => {
  try {
    const { title, targetProgram, targetExam, totalMarks, durationMinutes } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ msg: 'No PDF file uploaded' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ msg: 'GEMINI_API_KEY is missing in backend .env file. Please add your Google Gemini API key to enable AI Mock Test parsing.' });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const base64Data = dataBuffer.toString('base64');
    
    // Clean up uploaded file immediately
    fs.unlinkSync(req.file.path);

    const prompt = `
      You are an expert exam parser. I have attached a Mock Test PDF.
      Extract ALL the multiple-choice questions from this PDF. 
      Read the equations, math symbols, and physics formulas perfectly.
      Also look for an Answer Key at the end of the document to find the correct options.

      You MUST respond ONLY with a raw JSON array. Do not wrap it in markdown blockquotes like \`\`\`json.
      The JSON array should contain objects with the following schema:
      {
        "questionNumber": Number,
        "questionText": "String (the full text of the question, including equations)",
        "options": ["A) first option", "B) second option", "C) third option", "D) fourth option"],
        "correctOption": "String (just the letter A, B, C, or D if you found an answer key, otherwise omit)"
      }
    `;

    // Call Gemini 1.5 Flash with retry logic
    let response;
    let retries = 3;
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    while (retries > 0) {
        try {
            const result = await model.generateContent([
                {
                    inlineData: {
                        mimeType: 'application/pdf',
                        data: base64Data
                    }
                },
                prompt
            ]);
            response = result.response;
            break; // Success, exit retry loop
        } catch (apiErr) {
            if (apiErr.status === 503 && retries > 1) {
                console.log(`Gemini API 503 error. Retrying... (${retries - 1} attempts left)`);
                retries--;
                await new Promise(r => setTimeout(r, 2000)); // wait 2s before retry
            } else {
                console.error("Gemini API Error:", apiErr);
                return res.status(500).json({ msg: apiErr.status === 503 ? 'Google AI Service is currently experiencing high demand. Please try again in a few minutes.' : 'An error occurred with the AI parsing engine. Ensure your API key has enough quota.' });
            }
        }
    }

    let aiText = response.text();
    
    // Clean up potential markdown formatting if the AI ignored instructions
    if (aiText.startsWith('\`\`\`json')) {
      aiText = aiText.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
    } else if (aiText.startsWith('\`\`\`')) {
      aiText = aiText.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
    }

    let questions;
    try {
      questions = JSON.parse(aiText);
    } catch (parseError) {
      console.error("Failed to parse Gemini output:", aiText);
      return res.status(500).json({ msg: 'AI successfully read the PDF but failed to output valid JSON format.' });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ msg: 'AI could not find any recognizable questions in this PDF.' });
    }

    const test = await prisma.mockTest.create({
      data: {
        title,
        teacherId: req.user.id,
        targetProgram,
        targetExam,
        totalMarks: totalMarks || questions.length * 4,
        durationMinutes: durationMinutes || 180,
        questions
      }
    });

    res.json(test);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error: ' + err.message });
  }
});

// @route   GET /api/mocktests/teacher
// @desc    Get mock tests created by the teacher
// @access  Teacher
router.get('/teacher', auth, isTeacher, async (req, res) => {
  try {
    const tests = await prisma.mockTest.findMany({
      where: { teacherId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/mocktests/student
// @desc    Get mock tests assigned to student
// @access  Student
router.get('/student', auth, async (req, res) => {
  try {
    // Get student's program
    const student = await prisma.user.findUnique({ where: { id: req.user.id } });
    const program = student.programInfo?.program;
    const exams = student.programInfo?.exams || [];
    
    // Find tests for their program (or 'All')
    let query = { status: 'Published' };
    if (program) {
      query.targetProgram = { in: [program, 'All'] };
    }
    // Also filter by specific exam if the student has exams enrolled
    if (exams.length > 0) {
      query.targetExam = { in: exams };
    }

    const tests = await prisma.mockTest.findMany({
      where: query,
      orderBy: { createdAt: 'desc' }
    });
    
    // Get their submissions to mark completed tests
    const results = await prisma.mockTestResult.findMany({ where: { studentId: req.user.id } });
    const submittedTestIds = results.map(r => r.testId.toString());

    const testsWithStatus = tests.map(test => {
      const isCompleted = submittedTestIds.includes(test.id ? test.id.toString() : (test._id ? test._id.toString() : ''));
      const result = results.find(r => r.testId.toString() === (test.id ? test.id.toString() : (test._id ? test._id.toString() : '')));
      
      const modifiedTest = { ...test };
      if (Array.isArray(modifiedTest.questions)) {
        modifiedTest.questions = modifiedTest.questions.map(q => {
          const newQ = { ...q };
          delete newQ.correctOption;
          return newQ;
        });
      }
      
      return {
        ...modifiedTest,
        isCompleted,
        score: isCompleted ? result.score : null
      };
    });

    res.json(testsWithStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/mocktests/:id/take
// @desc    Get specific mock test to take
// @access  Student
router.get('/:id/take', auth, async (req, res) => {
  try {
    const test = await prisma.mockTest.findUnique({ where: { id: req.params.id } });
    if (!test) return res.status(404).json({ msg: 'Test not found' });
    
    if (Array.isArray(test.questions)) {
      test.questions = test.questions.map(q => {
        const newQ = { ...q };
        delete newQ.correctOption;
        return newQ;
      });
    }

    res.json(test);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/mocktests/:id/submit
// @desc    Submit mock test
// @access  Student
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionId, selectedOption }
    const test = await prisma.mockTest.findUnique({ where: { id: req.params.id } });
    
    if (!test) return res.status(404).json({ msg: 'Test not found' });

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let score = 0;

    const evaluatedAnswers = [];
    const topicAnalysisMap = {}; // "Subject|Topic" -> { total, correct, incorrect }

    if (Array.isArray(test.questions)) {
      test.questions.forEach(q => {
        const qId = q.id || q._id;
        const studentAns = answers.find(a => a.questionId.toString() === (qId ? qId.toString() : ''));
        if (!studentAns || !studentAns.selectedOption) {
          unattemptedCount++;
          evaluatedAnswers.push({ questionId: qId, selectedOption: null, isCorrect: false });
        } else {
          // Match option letter (e.g. "A) Option" -> "A")
          const optLetterMatch = studentAns.selectedOption.match(/^([A-D])/i);
          const optLetter = optLetterMatch ? optLetterMatch[1].toUpperCase() : studentAns.selectedOption;
          
          const isCorrect = q.correctOption && q.correctOption === optLetter;
          if (isCorrect) {
            correctCount++;
            score += (q.marks || 4);
          } else {
            incorrectCount++;
            score -= (q.negativeMarks || 1);
          }
          evaluatedAnswers.push({ questionId: qId, selectedOption: optLetter, isCorrect });
        }

        // Aggregate Topic Analysis
        const subject = q.subject || 'General';
        const topic = q.topic || 'Uncategorized';
        const key = `${subject}|${topic}`;
        
        if (!topicAnalysisMap[key]) {
          topicAnalysisMap[key] = { subject, topic, total: 0, correct: 0, incorrect: 0 };
        }
        
        topicAnalysisMap[key].total++;
        
        const topicStudentAns = answers.find(a => a.questionId.toString() === (qId ? qId.toString() : ''));
        if (topicStudentAns && topicStudentAns.selectedOption) {
          const optLetterMatch = topicStudentAns.selectedOption.match(/^([A-D])/i);
          const optLetter = optLetterMatch ? optLetterMatch[1].toUpperCase() : topicStudentAns.selectedOption;
          const isCorrect = q.correctOption && q.correctOption === optLetter;
          
          if (isCorrect) topicAnalysisMap[key].correct++;
          else topicAnalysisMap[key].incorrect++;
        }
      });
    }

    const topicAnalysis = Object.values(topicAnalysisMap);

    const newResult = await prisma.mockTestResult.create({
      data: {
        testId: test.id || test._id,
        studentId: req.user.id,
        score,
        totalQuestions: Array.isArray(test.questions) ? test.questions.length : 0,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        unattempted: unattemptedCount,
        answers: evaluatedAnswers,
        topicAnalysis
      }
    });

    res.json(newResult);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/mocktests/:id/results
// @desc    Get all results for a specific test
// @access  Teacher/Admin
router.get('/:id/results', auth, async (req, res) => {
  try {
    const results = await prisma.mockTestResult.findMany({
      where: { testId: req.params.id },
      include: {
        student: {
          select: { fullName: true, email: true, programInfo_program: true, programInfo_stream: true }
        }
      }
    });
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/mocktests/all-results
// @desc    Get all mock test results (for admin)
// @access  Admin
router.get('/all-results', auth, isAdmin, async (req, res) => {
  try {
    const results = await prisma.mockTestResult.findMany({
      include: {
        student: {
          select: { fullName: true }
        },
        test: {
          select: { title: true, targetProgram: true, targetExam: true }
        }
      }
    });
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
