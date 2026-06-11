require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Announcement = require('./models/Announcement');
const Material = require('./models/Material');
const Test = require('./models/Test');
const TestResult = require('./models/TestResult');
const Attendance = require('./models/Attendance');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.error(err));

const seedDB = async () => {
  try {
    // Clear existing dash data
    await Announcement.deleteMany();
    await Material.deleteMany();
    await Test.deleteMany();
    await TestResult.deleteMany();
    await Attendance.deleteMany();

    console.log('Cleared existing dashboard data.');

    // 1. Announcements
    await Announcement.insertMany([
      { title: 'Welcome to Sri Shirdi Sai Institutions', content: 'We are excited to begin the new academic year!', targetProgram: 'All', priority: 'High' },
      { title: 'National Level Mock Test Series Registration', content: 'Registrations for the All India Sri Shirdi Sai Test Series open tomorrow at 15:00. First test starts on Sunday.', targetProgram: 'All', priority: 'High' },
      { title: 'Lakshya JEE Main Mock Test', content: 'The first grand mock test is scheduled for this weekend. Please check your assigned slots.', targetProgram: 'Lakshya', priority: 'High' },
      { title: 'Special Doubt Clearing Sessions – Mathematics & Physics', content: 'Weekly doubt clearing slots have been updated. Book your one-on-one session with your batch mentors in the slots panel.', targetProgram: 'Lakshya', priority: 'Medium' },
      { title: 'Deekshya Biology Workshop', content: 'Special guest lecture on Human Anatomy on Friday.', targetProgram: 'Deekshya', priority: 'Medium' },
      { title: 'NEET Grand Test-3 Key & Solutions Published', content: 'Answer key and video solutions for NEET Grand Test-3 are now uploaded in the study materials section.', targetProgram: 'Deekshya', priority: 'High' },
      { title: 'DAFNE Current Affairs Session', content: 'Monthly roundup session happening tomorrow evening.', targetProgram: 'DAFNE', priority: 'High' },
      { title: 'Civils Answer Writing Mentorship', content: 'Daily answer writing evaluation is scheduled from 16:00 to 18:00 with guest mentor Mr. R. V. Shastri (ex-IAS).', targetProgram: 'DAFNE', priority: 'High' },
      { title: 'Hostel Timings and Discipline Notice', content: 'Please note the revised library and hostel reporting timings. Active monitoring of late entries starts this week.', targetProgram: 'All', priority: 'Low' },
      { title: 'Scholarship & Awards Ceremony', content: 'The annual excellence scholarship awards ceremony is scheduled for next Friday. Shortlisted candidates will receive invitations.', targetProgram: 'All', priority: 'Medium' }
    ]);

    // 2. Materials
    await Material.insertMany([
      { title: 'Calculus Fundamentals', description: 'Basic differentiation and integration formulas.', type: 'PDF', program: 'Lakshya', stream: 'MPC', subject: 'Mathematics', url: '#' },
      { title: 'Mechanics Video Lecture', description: 'Newtonian mechanics deep dive.', type: 'Video', program: 'Lakshya', stream: 'MPC', subject: 'Physics', url: '#' },
      { title: 'Cell Biology Notes', description: 'Detailed notes on cell structure.', type: 'Note', program: 'Deekshya', stream: 'BiPC', subject: 'Botany', url: '#' },
      { title: 'Indian Polity Overview', description: 'Constitutional framework notes.', type: 'PDF', program: 'DAFNE', stream: 'MEC', subject: 'Civics', url: '#' },
      { title: 'Indian Polity Overview', description: 'Constitutional framework notes.', type: 'PDF', program: 'DAFNE', stream: 'CEC', subject: 'Civics', url: '#' },
    ]);

    // 3. Tests
    const t1 = await Test.create({ title: 'JEE Main Weekly Mock 1', program: 'Lakshya', stream: 'MPC', subject: 'Combined', totalMarks: 300, durationMinutes: 180 });
    const t2 = await Test.create({ title: 'NEET Grand Test 1', program: 'Deekshya', stream: 'BiPC', subject: 'Combined', totalMarks: 720, durationMinutes: 200 });
    const t3 = await Test.create({ title: 'UPSC Polity Quiz', program: 'DAFNE', stream: 'MEC', subject: 'Civics', totalMarks: 100, durationMinutes: 60 });
    const t4 = await Test.create({ title: 'UPSC Polity Quiz', program: 'DAFNE', stream: 'CEC', subject: 'Civics', totalMarks: 100, durationMinutes: 60 });

    // Ensure we have some users to assign results to
    const users = await User.find();
    
    if (users.length > 0) {
      console.log(`Found ${users.length} users, generating mock results and attendance.`);
      
      for (const user of users) {
        // Attendance
        for (let i = 0; i < 10; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          // 90% chance of present
          await Attendance.create({
            studentId: user._id,
            date: d,
            status: Math.random() > 0.1 ? 'Present' : 'Absent'
          });
        }

        // Test Results based on program
        if (user.programInfo.program === 'Lakshya') {
          await TestResult.create({ studentId: user._id, testId: t1._id, score: Math.floor(Math.random() * 200) + 50, rank: Math.floor(Math.random() * 100) + 1 });
        } else if (user.programInfo.program === 'Deekshya') {
          await TestResult.create({ studentId: user._id, testId: t2._id, score: Math.floor(Math.random() * 500) + 100, rank: Math.floor(Math.random() * 100) + 1 });
        } else if (user.programInfo.program === 'DAFNE') {
          await TestResult.create({ studentId: user._id, testId: t3._id, score: Math.floor(Math.random() * 60) + 20, rank: Math.floor(Math.random() * 50) + 1 });
        }
      }
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
