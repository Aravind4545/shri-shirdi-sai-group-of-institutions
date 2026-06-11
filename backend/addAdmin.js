require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Admin Creation'))
  .catch(err => console.error(err));

const createAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@shirdisai.com' });
    if (existingAdmin) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      fullName: 'Super Admin',
      mobileNumber: '9999999999',
      email: 'admin@shirdisai.com',
      password: hashedPassword,
      gender: 'Male',
      dateOfBirth: new Date(),
      role: 'Admin',
      academicInfo: {
        intermediateYear: '1st Year',
        collegeName: 'N/A',
        state: 'N/A'
      },
      programInfo: { program: 'All', stream: 'All' }
    });

    await adminUser.save();
    console.log('Super Admin created successfully. Email: admin@shirdisai.com | Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
