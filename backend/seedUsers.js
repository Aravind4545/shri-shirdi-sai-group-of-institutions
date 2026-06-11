require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Seed Users'))
  .catch(err => console.error(err));

const seedUsers = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const usersToCreate = [
      // Teachers
      {
        fullName: 'Dr. Kavita Sharma',
        mobileNumber: '9876543211',
        email: 'teacher.deekshya@test.com',
        password: hashedPassword,
        gender: 'Female',
        role: 'Teacher',
        assignedProgram: 'Deekshya',
        designation: 'Senior Botany Faculty'
      },
      {
        fullName: 'Prof. Anil Kumar',
        mobileNumber: '9876543212',
        email: 'teacher.dafne@test.com',
        password: hashedPassword,
        gender: 'Male',
        role: 'Teacher',
        assignedProgram: 'DAFNE',
        designation: 'UPSC Polity Faculty'
      },
      // HOD
      {
        fullName: 'Dr. Ramesh Kumar (HOD)',
        mobileNumber: '9876543213',
        email: 'hod.physics@test.com',
        password: hashedPassword,
        gender: 'Male',
        role: 'HOD',
        assignedProgram: 'All',
        designation: 'Head of Physics Department'
      },
      // Students
      {
        fullName: 'Priya Reddy',
        mobileNumber: '9123456781',
        email: 'student.deekshya@test.com',
        password: hashedPassword,
        gender: 'Female',
        role: 'Student',
        programInfo: { program: 'Deekshya', stream: 'BiPC', exams: ['NEET'] },
        academicInfo: { intermediateYear: '2nd Year', collegeName: 'Sri Shirdi Sai', state: 'AP' }
      },
      {
        fullName: 'Rahul Verma',
        mobileNumber: '9123456782',
        email: 'student.dafne@test.com',
        password: hashedPassword,
        gender: 'Male',
        role: 'Student',
        programInfo: { program: 'DAFNE', stream: 'MEC', exams: ['UPSC'] },
        academicInfo: { intermediateYear: '1st Year', collegeName: 'Sri Shirdi Sai', state: 'AP' }
      }
    ];

    for (const u of usersToCreate) {
      let existingUser = await User.findOne({ email: u.email });
      if (!existingUser) {
        await User.create(u);
        console.log(`Created: ${u.email}`);
      } else {
        console.log(`Already exists: ${u.email}`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUsers();
