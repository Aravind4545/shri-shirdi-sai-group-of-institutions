const mongoose = require('mongoose');
require('dotenv').config();
const MockTest = require('./models/MockTest');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shirdi_sai').then(async () => {
  await MockTest.updateMany({ targetExam: 'AP MSET' }, { $set: { targetExam: 'AP EAMCET' }});
  await MockTest.updateMany({ targetExam: 'JEE Mains' }, { $set: { targetExam: 'JEE Main' }});
  console.log('Updated MockTests to match Student exam strings.');
  process.exit();
});
