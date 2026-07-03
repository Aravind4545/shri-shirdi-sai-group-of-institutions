const prisma = require('../prisma/client');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');



// @route   GET /api/messages/users
// @desc    Get list of users available to chat with
router.get('/users', auth, async (req, res) => {
  try {
    const currentUser = await prisma.user.findUnique({ where: { id: req.user.id } });
    let users = [];

    if (currentUser.role === 'Student') {
      // Students can chat with other students in their program and teachers
      users = await prisma.user.findMany({
        where: {
          OR: [
            { role: 'Student', programInfo: { is: { program: currentUser.programInfo?.program } }, id: { not: currentUser.id } },
            { role: 'Teacher' }
          ]
        },
        select: { id: true, fullName: true, role: true, profilePhoto: true, programInfo: true }
      });
    } else if (currentUser.role === 'Teacher') {
      // Teachers can chat with their students and other teachers
      users = await prisma.user.findMany({
        where: {
          OR: [
            { role: 'Student', programInfo: { is: { program: currentUser.assignedProgram } } },
            { role: 'Teacher', id: { not: currentUser.id } }
          ]
        },
        select: { id: true, fullName: true, role: true, profilePhoto: true, programInfo: true }
      });
    }

    // Attach unread message counts and last message
    const formattedUsers = await Promise.all(users.map(async (u) => {
      const unreadCount = await prisma.message.count({ where: {
        sender: u.id || u._id,
        receiver: currentUser.id || currentUser._id,
        read: false
      } });

      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { sender: u.id || u._id, receiver: currentUser.id || currentUser._id },
            { sender: currentUser.id || currentUser._id, receiver: u.id || u._id }
          ]
        },
        orderBy: { timestamp: 'desc' }
      });

      return {
        _id: u.id || u._id,
        id: u.id || u._id,
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
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { sender: req.user.id, receiver: req.params.userId },
          { sender: req.params.userId, receiver: req.user.id }
        ]
      },
      orderBy: { timestamp: 'asc' }
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: { sender: req.params.userId, receiver: req.user.id, read: false },
      data: { read: true }
    });

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

    const message = await prisma.message.create({
      data: {
        sender: req.user.id,
        receiver: req.params.userId,
        content
      }
    });

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
