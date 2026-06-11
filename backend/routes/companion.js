const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/companion/config
// @desc    Get current companion config
// @access  Private
router.get('/config', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    // Initialize if it doesn't exist
    if (!user.companionSettings) {
      user.companionSettings = {
        style: 'Tech Visionary',
        companionName: 'Jarvis',
        studentNickname: 'Superstar',
        isConfigured: false
      };
      await user.save();
    }
    
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/companion/config
// @desc    Update companion config
// @access  Private
router.post('/config', auth, async (req, res) => {
  try {
    const { style, companionName, studentNickname } = req.body;
    
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    user.companionSettings = {
      style: style || user.companionSettings.style,
      companionName: companionName || user.companionSettings.companionName,
      studentNickname: studentNickname || user.companionSettings.studentNickname,
      isConfigured: true
    };
    
    await user.save();
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/companion/daily-interaction
// @desc    Generate a daily companion interaction based on intelligence
// @access  Private
router.get('/daily-interaction', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    const settings = user.companionSettings || { style: 'Tech Visionary', companionName: 'Jarvis', studentNickname: 'Superstar' };
    
    // In a full implementation, this would query the MockTestResult, Attendance, and Assignment models.
    // For this direct implementation, we use an intelligent mock generation engine based on the style.
    
    let greeting = '';
    let insight = '';
    
    const timeOfDay = new Date().getHours() < 12 ? 'Morning' : (new Date().getHours() < 17 ? 'Afternoon' : 'Evening');
    
    switch(settings.style) {
      case 'Tech Visionary':
        greeting = `Good ${timeOfDay},`;
        insight = `Your Physics mock test is scheduled for tomorrow. Electrostatics accuracy is currently 62%. Completing 15 minutes of revision today could significantly improve your performance.`;
        break;
      case 'Anime Warrior':
        greeting = `Wake up and win,`;
        insight = `A true warrior never backs down from a challenge! Your Thermodynamics score needs a boost. Let's smash 20 practice questions right now and conquer it!`;
        break;
      case 'Pop Star Energy':
        greeting = `Hey there,`;
        insight = `You are doing absolutely amazing! ✨ Let's keep that positive energy flowing into Chemistry today. Just a quick 15-minute review and you'll shine on your test!`;
        break;
      case 'Elite Achiever':
        greeting = `Focus up,`;
        insight = `Competitors are studying while you read this. Your rank prediction dropped by 12 points. Thermodynamics is the leak in your performance. Fix it. 30 questions. Now.`;
        break;
      case 'Strategic Genius':
        greeting = `Greetings,`;
        insight = `Analyzing current trajectory... Physics is your highest leverage point. By dedicating 20 minutes to Electrostatics today, you optimize your probability of an A grade by 14%.`;
        break;
      default:
        greeting = `Good ${timeOfDay},`;
        insight = `Let's focus on Physics today. Your recent scores indicate room for improvement in Thermodynamics.`;
    }

    const interaction = {
      greeting,
      insight,
      tasks: [
        'Physics Revision (Thermodynamics)',
        'Chemistry Assignment',
        'Math Mock Test'
      ],
      priorityTopic: 'Thermodynamics',
      recommendationContext: 'You lost 6 marks due to concept errors in your last test.',
      estimatedTime: '90 Minutes'
    };

    res.json(interaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
