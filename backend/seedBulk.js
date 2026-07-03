require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Test = require('./models/Test');
const TestResult = require('./models/TestResult');
const AcademicHealth = require('./models/AcademicHealth');
const Ranking = require('./models/Ranking');
const PerformanceInsight = require('./models/PerformanceInsight');
const RankHistory = require('./models/RankHistory');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shirdisai')
  .then(() => console.log('MongoDB Connected for Bulk Seeding'))
  .catch(err => console.error(err));

const programs = [
  { name: 'IIT', stream: 'MPC', exams: ['JEE'] },
  { name: 'NEET', stream: 'BiPC', exams: ['NEET'] },
  { name: 'UPSC', stream: 'MEC', exams: ['UPSC'] }
];

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Ananya', 'Diya', 'Avni', 'Aadya', 'Kiara', 'Navya', 'Myra', 'Prisha', 'Riya', 'Sara'];
const lastNames = ['Reddy', 'Sharma', 'Patel', 'Kumar', 'Singh', 'Rao', 'Verma', 'Gupta', 'Nair', 'Menon'];

function getRandomName() {
  const f = firstNames[Math.floor(Math.random() * firstNames.length)];
  const l = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${f} ${l}`;
}

const seedBulk = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Clear old data safely (Optional: could just add, but let's clear generated students)
    // We will delete users matching the pattern userX_program@test.com
    await User.deleteMany({ email: { $regex: /user\d+_/ } });
    await AcademicHealth.deleteMany();
    await Ranking.deleteMany();
    await PerformanceInsight.deleteMany();
    await RankHistory.deleteMany();

    // 1. Tests
    const testIds = {};
    for (const p of programs) {
      let t = await Test.findOne({ program: p.name });
      if (!t) {
        t = await Test.create({ 
          title: `${p.name} Grand Mock Test`, 
          program: p.name, 
          stream: p.stream, 
          subject: 'Combined', 
          totalMarks: p.name === 'IIT' ? 300 : (p.name === 'NEET' ? 720 : 100), 
          durationMinutes: 180 
        });
      }
      testIds[p.name] = t;
    }

    let allStudents = [];

    // Generate 10 students per program
    for (const p of programs) {
      console.log(`Generating 10 students for ${p.name}...`);
      for (let i = 1; i <= 10; i++) {
        const student = await User.create({
          fullName: getRandomName(),
          mobileNumber: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
          email: `user${i}_${p.name.toLowerCase()}@test.com`,
          password: hashedPassword,
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          role: 'Student',
          programInfo: { program: p.name, stream: p.stream, exams: p.exams },
          academicInfo: { intermediateYear: '1st Year', collegeName: 'Academic Companion', state: 'AP' }
        });
        allStudents.push(student);

        // Generate Attendance (Last 10 days)
        let presentCount = 0;
        for (let d = 0; d < 10; d++) {
          const date = new Date();
          date.setDate(date.getDate() - d);
          const isPresent = Math.random() > 0.15; // 85% attendance
          if(isPresent) presentCount++;
          await Attendance.create({
            studentId: student._id,
            date: date,
            status: isPresent ? 'Present' : 'Absent'
          });
        }
        const attendanceScore = (presentCount / 10) * 100;

        // Generate Test Result
        const test = testIds[p.name];
        let maxMarks = test.totalMarks;
        let score = Math.floor(maxMarks * (0.4 + Math.random() * 0.5)); // 40-90%
        await TestResult.create({
          studentId: student._id,
          testId: test._id,
          score: score,
          rank: Math.floor(Math.random() * 100) + 1
        });
        const testScoreNormalized = (score / maxMarks) * 100;

        // Generate Academic Health
        const assignmentScore = Math.floor(60 + Math.random() * 40);
        const studyScore = Math.floor(50 + Math.random() * 50);
        const healthScore = Math.floor((attendanceScore * 0.2) + (testScoreNormalized * 0.5) + (assignmentScore * 0.2) + (studyScore * 0.1));

        let status = 'Average';
        if (healthScore > 85) status = 'Excellent';
        else if (healthScore > 70) status = 'Good';
        else if (healthScore < 50) status = 'Critical';
        else if (healthScore < 65) status = 'Needs Improvement';

        await AcademicHealth.create({
          studentId: student._id,
          healthScore,
          components: {
            attendanceScore,
            testScore: testScoreNormalized,
            assignmentScore,
            studyActivityScore: studyScore
          },
          status
        });

        // Generate Performance Insight
        await PerformanceInsight.create({
          studentId: student._id,
          subjectScores: [
            { subject: p.name==='IIT'?'Physics':p.name==='NEET'?'Biology':'History', score: testScoreNormalized + (Math.random()*10 - 5), accuracy: 80, timeSpent: 120 }
          ],
          weakTopics: ['Thermodynamics', 'Organic Chemistry', 'Polity'],
          strongTopics: ['Mechanics', 'Cell Biology', 'Geography']
        });

        // Generate Ranking Entry
        const overallScore = healthScore;
        await Ranking.create({
          studentId: student._id,
          program: p.name,
          globalRank: 0, // Will be calculated later if needed, or mock it
          programRank: 0,
          overallScore,
          attendanceScore,
          assignmentScore,
          testScore: testScoreNormalized,
          healthScore
        });

        // Generate Rank History (Last 5 weeks)
        for (let w = 4; w >= 0; w--) {
          const wd = new Date();
          wd.setDate(wd.getDate() - (w * 7));
          await RankHistory.create({
            studentId: student._id,
            program: p.name,
            rank: Math.floor(Math.random() * 50) + 1,
            score: overallScore - (Math.random() * 10),
            recordedAt: wd
          });
        }
      }
    }

    // Now update ranks based on overallScore
    const allRanks = await Ranking.find().sort({ overallScore: -1 });
    let gr = 1;
    for (let r of allRanks) {
      r.globalRank = gr++;
      await r.save();
    }
    
    for (const p of programs) {
      const progRanks = await Ranking.find({ program: p.name }).sort({ overallScore: -1 });
      let pr = 1;
      for (let r of progRanks) {
        r.programRank = pr++;
        await r.save();
      }
    }

    console.log('Successfully generated 30 total students with tests, attendance, health scores, and rankings!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedBulk();
