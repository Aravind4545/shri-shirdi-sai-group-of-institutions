const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const AIConversation = require('../models/AIConversation');
const StudyPlan = require('../models/StudyPlan');
const PerformanceInsight = require('../models/PerformanceInsight');
const KnowledgeBase = require('../models/KnowledgeBase');
const CurrentAffairs = require('../models/CurrentAffairs');
const MockInterview = require('../models/MockInterview');
const TopicAnalytics = require('../models/TopicAnalytics');
const AIRecommendation = require('../models/AIRecommendation');
const RiskPrediction = require('../models/RiskPrediction');

// ==========================================
// CHATBOT & DOUBT SOLVER
// ==========================================

router.post('/chat', auth, async (req, res) => {
  try {
    const { message, program, attachment } = req.body;
    let aiReply = "I understand you have a question. How can I help you further?";
    if (message.toLowerCase().includes('doubt') || message.toLowerCase().includes('solve')) {
      aiReply = `Here is a step-by-step solution for your ${program} doubt:\n\n1. Analyze the given values.\n2. Apply the fundamental formula.\n3. The correct answer is derived from this concept. Let me know if you need alternate methods!`;
    } else if (message.toLowerCase().includes('strategy') || message.toLowerCase().includes('plan')) {
      if (program === 'Lakshya') aiReply = "For JEE Mains, focus heavily on modern physics and coordinate geometry first.";
      if (program === 'Deekshya') aiReply = "For NEET, NCERT Biology is your bible. Memorize all diagrams.";
      if (program === 'DAFNE') aiReply = "For UPSC Foundation, start with reading The Hindu daily and mastering NCERT Polity.";
    }

    let conversation = await AIConversation.findOne({ studentId: req.user.id });
    if (!conversation) {
      conversation = new AIConversation({ studentId: req.user.id, program, messages: [] });
    }

    conversation.messages.push({ role: 'user', content: message });
    if (attachment) conversation.attachments.push(attachment);
    conversation.messages.push({ role: 'assistant', content: aiReply });
    conversation.updatedAt = new Date();
    await conversation.save();

    res.json({ reply: aiReply, conversation });
  } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/chat-history', auth, async (req, res) => {
  try {
    const conversation = await AIConversation.findOne({ studentId: req.user.id });
    res.json(conversation || { messages: [] });
  } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// STUDY PLANNER (AI Recommendations Integration)
// ==========================================

router.post('/generate-plan', auth, async (req, res) => {
  try {
    const { program, planType } = req.body;
    
    // In a real scenario, this AI would pull from TopicAnalytics
    const newPlan = new StudyPlan({
      studentId: req.user.id,
      planType: planType || 'Daily',
      targetExams: program === 'Lakshya' ? ['JEE Main'] : program === 'Deekshya' ? ['NEET'] : ['UPSC Foundation'],
      tasks: [
        { subject: 'Physics', topic: 'Thermodynamics', taskType: 'Revision', estimatedMinutes: 60 },
        { subject: 'Chemistry', topic: 'Organic Reactions', taskType: 'Practice', estimatedMinutes: 90 },
        { subject: 'Math/Bio', topic: 'Calculus / Genetics', taskType: 'Mock Test', estimatedMinutes: 120 }
      ]
    });

    await newPlan.save();
    res.json(newPlan);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/my-plan', auth, async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ studentId: req.user.id }).sort({ generatedAt: -1 });
    res.json(plan);
  } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// PERFORMANCE PREDICTION & INSIGHTS
// ==========================================

router.get('/predict-rank', auth, async (req, res) => {
  try {
    let insight = await PerformanceInsight.findOne({ studentId: req.user.id });
    if (!insight) {
      insight = new PerformanceInsight({
        studentId: req.user.id,
        performanceScore: 82,
        growthScore: 15,
        predictedRank: 12500,
        predictedPercentile: 96.5,
        successProbability: 88,
        insightNotes: 'You are showing strong improvement in Physics, but need more accuracy in Organic Chemistry.'
      });
      await insight.save();
    }
    res.json(insight);
  } catch (err) { res.status(500).send('Server Error'); }
});

// ==========================================
// AI RECOMMENDATIONS & WEAK TOPIC ENGINE
// ==========================================

router.get('/recommendations', auth, async (req, res) => {
  try {
    let recommendation = await AIRecommendation.findOne({ studentId: req.user.id }).sort({ generatedAt: -1 });
    
    if (!recommendation) {
      const topics = await TopicAnalytics.find({ studentId: req.user.id });
      const weakTopicsData = topics.filter(t => t.status === 'Weak' || t.status === 'Critical').map(t => ({
        subject: t.subject,
        chapter: t.chapter,
        topic: t.topic,
        confidenceScore: 100 - t.accuracy
      }));
      const strongTopicsData = topics.filter(t => t.status === 'Strong').map(t => ({
        subject: t.subject,
        chapter: t.chapter,
        topic: t.topic,
        confidenceScore: t.accuracy
      }));

      const generatedRecommendations = weakTopicsData.map(wt => ({
        actionText: `Revise concepts for ${wt.topic} (${wt.chapter})`,
        type: 'Revision',
        priority: wt.confidenceScore > 80 ? 'High' : 'Medium'
      }));

      // Add a fallback if no weak topics found
      if (generatedRecommendations.length === 0) {
        generatedRecommendations.push({ actionText: 'Take a comprehensive Mock Test to assess new topics.', type: 'Practice', priority: 'Medium' });
      }

      recommendation = new AIRecommendation({
        studentId: req.user.id,
        weakTopics: weakTopicsData,
        strongTopics: strongTopicsData,
        recommendations: generatedRecommendations,
        learningPath: 'Intermediate'
      });
      await recommendation.save();
    }

    res.json(recommendation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ==========================================
// RISK PREDICTION ENGINE
// ==========================================

router.get('/risk-predictions', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let query = {};
    
    if (user.role === 'Teacher') {
      query.program = user.programInfo.program;
    } else if (!['Admin', 'SuperAdmin'].includes(user.role)) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    let risks = await RiskPrediction.find(query).populate('studentId', 'fullName email programInfo');
    
    // Seed some mock data if empty for demo purposes
    if (risks.length === 0) {
        const students = await User.find({ role: 'Student', 'programInfo.program': query.program || { $exists: true } }).limit(2);
        for (let st of students) {
            const risk = new RiskPrediction({
                studentId: st._id,
                program: st.programInfo.program,
                riskLevel: 'High',
                factors: [{ category: 'Attendance', description: 'Missed 4 consecutive classes', severity: 'High' }],
                interventionSuggestions: ['Call parent to discuss attendance.', 'Provide makeup assignments.']
            });
            await risk.save();
        }
        risks = await RiskPrediction.find(query).populate('studentId', 'fullName email programInfo');
    }

    res.json(risks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
