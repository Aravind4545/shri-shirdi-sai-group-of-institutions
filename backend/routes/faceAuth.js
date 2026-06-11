const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FaceAuditLog = require('../models/FaceAuditLog');
const TeacherAttendance = require('../models/TeacherAttendance');
const jwt = require('jsonwebtoken');
const { cosineSimilarity } = require('../utils/math');

const AI_SERVICE_URL = 'http://localhost:8000';
const MATCH_THRESHOLD = 0.50; // InsightFace Buffalo_L cosine similarity threshold for same person is usually around 0.4 - 0.6.
const LIVENESS_THRESHOLD = 0.80;

// Admin registers a teacher's face
router.post('/register', async (req, res) => {
  try {
    const { email, imageBase64 } = req.body;
    
    if (!email || !imageBase64) {
      return res.status(400).json({ msg: 'Email and image are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Call AI Service
    const aiResponse = await fetch(`${AI_SERVICE_URL}/extract-embedding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_base64: imageBase64 })
    });

    if (!aiResponse.ok) {
      return res.status(500).json({ msg: 'AI Service failed to process image' });
    }

    const aiData = await aiResponse.json();
    if (!aiData.success) {
      return res.status(400).json({ msg: aiData.message || 'Face extraction failed' });
    }

    const { embedding } = aiData;

    // Check for duplicate face across all users
    const allUsers = await User.find({ faceLoginEnabled: true, faceEmbedding: { $exists: true, $not: {$size: 0} } }).select('+faceEmbedding fullName email');
    
    for (const u of allUsers) {
      if (u.email === email) continue; // Skip checking against themselves if they are updating their face
      
      const score = cosineSimilarity(embedding, u.faceEmbedding);
      if (score >= MATCH_THRESHOLD) {
        return res.status(400).json({ msg: `Face already matches an existing user: ${u.fullName} (${u.email})` });
      }
    }

    user.faceEmbedding = embedding;
    user.faceLoginEnabled = true;
    await user.save();

    res.json({ msg: 'Face registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Face Login
router.post('/login', async (req, res) => {
  try {
    const { imageBase64, email } = req.body;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    if (!imageBase64) {
      return res.status(400).json({ msg: 'Image is required' });
    }

    // If email is provided, we do 1:1 matching. If not, we do 1:N matching.
    // The instructions say "Universal Login Page" and "Face Login Flow" doesn't strictly say they type email first.
    // Assuming 1:N matching if email is absent, or 1:1 if present. Let's do 1:N for magical experience.
    
    // 1. Get embedding from AI Service
    const aiResponse = await fetch(`${AI_SERVICE_URL}/extract-embedding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_base64: imageBase64 })
    });

    if (!aiResponse.ok) {
      await createLog(null, email || 'unknown', clientIp, 0, 0, 'Error');
      return res.status(500).json({ msg: 'AI Service error' });
    }

    const aiData = await aiResponse.json();
    if (!aiData.success) {
      await createLog(null, email || 'unknown', clientIp, 0, 0, 'Error');
      return res.status(400).json({ msg: aiData.message || 'No face found' });
    }

    const { embedding, liveness_score } = aiData;

    // 2. Liveness Check
    if (liveness_score < LIVENESS_THRESHOLD) {
      await createLog(null, email || 'unknown', clientIp, 0, liveness_score, 'Failed - Spoof Detected');
      return res.status(401).json({ msg: 'Liveness check failed. Spoof detected.' });
    }

    // 3. Find Best Match
    // In production with millions of users, use a vector DB like Milvus/Pinecone.
    // For this prototype, fetch all users with faceLoginEnabled and calculate in-memory.
    let usersQuery = { faceLoginEnabled: true, faceEmbedding: { $exists: true, $not: {$size: 0} } };
    if (email) {
      usersQuery.email = email;
    }
    
    // Need to explicitly select faceEmbedding since it's select:false
    const users = await User.find(usersQuery).select('+faceEmbedding');

    if (users.length === 0) {
      await createLog(null, email || 'unknown', clientIp, 0, liveness_score, 'Failed - User Not Found');
      return res.status(404).json({ msg: 'No users with face login registered.' });
    }

    let bestMatchUser = null;
    let highestScore = -1;

    for (const u of users) {
      if (u.faceEmbedding && u.faceEmbedding.length > 0) {
        const score = cosineSimilarity(embedding, u.faceEmbedding);
        if (score > highestScore) {
          highestScore = score;
          bestMatchUser = u;
        }
      }
    }

    if (highestScore >= MATCH_THRESHOLD && bestMatchUser) {
      if (bestMatchUser.status === 'Inactive') {
        await createLog(bestMatchUser._id, bestMatchUser.email, clientIp, highestScore, liveness_score, 'Failed - Account Suspended');
        return res.status(403).json({ msg: 'Account is suspended. Please contact administrator.' });
      }

      // 4. Success Login
      await createLog(bestMatchUser._id, bestMatchUser.email, clientIp, highestScore, liveness_score, 'Success');

      // 5. Teacher Attendance Logic
      if (bestMatchUser.role === 'Teacher') {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of day

        const existingAttendance = await TeacherAttendance.findOne({
          teacherId: bestMatchUser._id,
          date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
        });

        if (!existingAttendance) {
          await TeacherAttendance.create({
            teacherId: bestMatchUser._id,
            date: new Date(),
            status: 'Present'
          });
        }
      }

      const payload = { user: { id: bestMatchUser.id, role: bestMatchUser.role } };
      jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', { expiresIn: '5h' }, (err, token) => {
        if (err) throw err;
        // Don't send embedding back to client
        bestMatchUser.faceEmbedding = undefined;
        res.json({ 
          token, 
          user: { 
            id: bestMatchUser.id, 
            email: bestMatchUser.email, 
            fullName: bestMatchUser.fullName, 
            role: bestMatchUser.role,
            programInfo: bestMatchUser.programInfo
          },
          matchScore: highestScore
        });
      });
    } else {
      await createLog(null, email || 'unknown', clientIp, highestScore, liveness_score, 'Failed - Low Match');
      return res.status(401).json({ msg: 'Face recognition failed. No match found.', score: highestScore });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

async function createLog(userId, email, ip, matchScore, livenessScore, status) {
  try {
    await FaceAuditLog.create({
      userId,
      emailAttempted: email,
      ipAddress: ip,
      matchScore,
      livenessScore,
      status
    });
  } catch(e) {
    console.error('Audit log failed', e);
  }
}

// Get Audit Logs (Admin)
router.get('/logs', async (req, res) => {
  try {
    const logs = await FaceAuditLog.find().sort({ attemptTime: -1 }).limit(100).populate('userId', 'fullName email');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
