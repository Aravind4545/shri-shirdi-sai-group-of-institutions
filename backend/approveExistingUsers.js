const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shirdi_sai').then(async () => {
  await User.updateMany({}, { $set: { isApproved: true }});
  console.log('All existing users approved.');
  process.exit();
});
