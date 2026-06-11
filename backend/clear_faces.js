const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/shirdisai')
  .then(async () => {
    const res = await User.updateMany({}, { $unset: { faceEmbedding: 1 } });
    console.log('Cleared face data', res);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
