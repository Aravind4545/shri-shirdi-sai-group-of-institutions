const fs = require('fs');
const mongoose = require('mongoose');
const User = require('./models/User');

const AI_SERVICE_URL = 'http://localhost:8000';
const MONGO_URI = 'mongodb://127.0.0.1:27017/shirdisai';

async function registerFace(email, imagePath) {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found!');
      process.exit(1);
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');

    console.log('Sending to AI Service...');
    const aiResponse = await fetch(`${AI_SERVICE_URL}/extract-embedding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_base64: imageBase64 })
    });

    const aiData = await aiResponse.json();
    if (!aiData.success) {
      console.log('AI Service failed to detect face:', aiData.message);
      process.exit(1);
    }

    user.faceEmbedding = aiData.embedding;
    user.faceLoginEnabled = true;
    await user.save();

    console.log(`Successfully registered face embedding for ${email}!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

const email = process.argv[2];
const imagePath = process.argv[3];

if (!email || !imagePath) {
  console.log('Usage: node register_face_cli.js <email> <imagePath>');
  process.exit(1);
}

registerFace(email, imagePath);
