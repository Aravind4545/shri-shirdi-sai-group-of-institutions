const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Message = require('../models/Message');

// @route   GET /api/messages/users
// @desc    Get list of users available to chat with
router.get('/users', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    let users = [];

    if (currentUser.role === 'Student') {
      // Students can chat with other students in their program and teachers
      users = await User.find({
        $or: [
          { role: 'Student', 'programInfo.program': currentUser.programInfo.program, _id: { $ne: currentUser._id } },
          { role: 'Teacher' }
        ]
      }).select('fullName role profilePhoto programInfo');
    } else if (currentUser.role === 'Teacher') {
      // Teachers can chat with their students and other teachers
      users = await User.find({
        $or: [
          { role: 'Student', 'programInfo.program': currentUser.assignedProgram },
          { role: 'Teacher', _id: { $ne: currentUser._id } }
        ]
      }).select('fullName role profilePhoto programInfo');
    }

    // Attach unread message counts and last message
    const formattedUsers = await Promise.all(users.map(async (u) => {
      const unreadCount = await Message.countDocuments({
        sender: u._id,
        receiver: currentUser._id,
        read: false
      });

      const lastMessage = await Message.findOne({
        $or: [
          { sender: u._id, receiver: currentUser._id },
          { sender: currentUser._id, receiver: u._id }
        ]
      }).sort({ timestamp: -1 });

      return {
        _id: u._id,
        fullName: u.fullName,
        role: u.role,
        unreadCount,
        lastMessage: lastMessage ? lastMessage.content : null,
        lastMessageTime: lastMessage ? lastMessage.timestamp : null
      };
    }));

    // Sort by most recent message
    formattedUsers.sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });

    res.json(formattedUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/messages/conversation/:userId
// @desc    Get chat history with a specific user
router.get('/conversation/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).sort({ timestamp: 1 });

    // Mark messages as read
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user.id, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/messages/send/:userId
// @desc    Send a message
router.post('/send/:userId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ msg: 'Message content is required' });

    const message = new Message({
      sender: req.user.id,
      receiver: req.params.userId,
      content
    });

    await message.save();
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
