require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function fix() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://Aravind:Aravind123@cluster0.v8wnt.mongodb.net/shirdi_sai?retryWrites=true&w=majority');
    console.log('Connected to MongoDB');

    const replaceMap = {
      'Lakshya': 'IIT',
      'Deekshya': 'NEET',
      'DAFNE': 'UPSC',
      'Dafne': 'UPSC',
      'lakshya': 'IIT',
      'deekshya': 'NEET',
      'dafne': 'UPSC'
    };

    const users = await User.find({});
    let count = 0;
    for (const user of users) {
      if (user.programInfo && user.programInfo.program) {
        const currentVal = user.programInfo.program;
        if (replaceMap[currentVal]) {
          user.programInfo.program = replaceMap[currentVal];
          // use user.markModified to ensure nested objects are saved correctly if needed
          user.markModified('programInfo');
          await user.save();
          count++;
        }
      }
    }
    console.log(`Updated ${count} users with nested programInfo.program field.`);
    
    process.exit(0);
  } catch (err) {
    console.error('Failed:', err);
    process.exit(1);
  }
}

fix();
