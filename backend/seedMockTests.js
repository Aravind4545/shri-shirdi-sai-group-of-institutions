const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MockTest = require('./models/MockTest');
const User = require('./models/User');

dotenv.config();

const getAdminId = async () => {
  const admin = await User.findOne({ role: 'Admin' });
  return admin ? admin._id : null;
};

const subjects = {
  MSET: ['Mathematics', 'Physics', 'Chemistry'],
  JEE: ['Mathematics', 'Physics', 'Chemistry'],
  NEET: ['Physics', 'Chemistry', 'Botany', 'Zoology']
};

const topics = {
  Mathematics: ['Calculus', 'Algebra', 'Trigonometry', 'Coordinate Geometry', 'Vectors'],
  Physics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'],
  Chemistry: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Biomolecules'],
  Botany: ['Plant Physiology', 'Genetics', 'Ecology', 'Cell Biology'],
  Zoology: ['Human Physiology', 'Animal Kingdom', 'Evolution', 'Biotechnology']
};

const generateQuestions = (examType, totalQs) => {
  const questions = [];
  const examSubjects = subjects[examType];
  const qPerSubject = Math.floor(totalQs / examSubjects.length);

  let qNum = 1;
  for (let s of examSubjects) {
    const subjectTopics = topics[s];
    for (let i = 0; i < qPerSubject; i++) {
      const topic = subjectTopics[i % subjectTopics.length];
      
      let qText = `What is the correct concept or calculation for ${topic} problem #${i+1}?`;
      if (s === 'Mathematics') qText = `Solve the mathematical expression related to ${topic}: x^2 + ${i}x - 10 = 0`;
      if (s === 'Physics') qText = `Calculate the physical quantity in ${topic} when v = ${i+10} m/s and t = ${i+2} s.`;
      if (s === 'Chemistry') qText = `Determine the chemical property or reaction outcome in ${topic} for compound ${i}.`;
      if (s === 'Botany') qText = `Identify the plant characteristic or process related to ${topic} (Sample ${i}).`;
      if (s === 'Zoology') qText = `Describe the anatomical or physiological feature in ${topic} (Specimen ${i}).`;

      questions.push({
        questionNumber: qNum++,
        questionText: qText,
        options: ['A) Option 1', 'B) Option 2', 'C) Option 3', 'D) Option 4'],
        correctOption: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
        marks: 4,
        negativeMarks: 1,
        subject: s,
        topic: topic
      });
    }
  }

  // Handle remaining questions if not perfectly divisible
  while (qNum <= totalQs) {
    questions.push({
      questionNumber: qNum++,
      questionText: `Additional question for ${examType}`,
      options: ['A) Option 1', 'B) Option 2', 'C) Option 3', 'D) Option 4'],
      correctOption: 'A',
      marks: 4,
      negativeMarks: 1,
      subject: examSubjects[0],
      topic: topics[examSubjects[0]][0]
    });
  }

  return questions;
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shirdi_sai');
    console.log('MongoDB Connected');

    const adminId = await getAdminId();
    if (!adminId) {
      console.log('No Admin user found. Cannot assign teacherId.');
      process.exit();
    }

    const testConfigs = [
      { prefix: 'AP EAMCET / MSET Mock Test', exam: 'AP MSET', program: 'Lakshya', qCount: 160 },
      { prefix: 'JEE Mains Mock Test', exam: 'JEE Mains', program: 'Lakshya', qCount: 75 },
      { prefix: 'NEET Grand Mock Test', exam: 'NEET', program: 'Deekshya', qCount: 200 }
    ];

    let createdCount = 0;

    for (let config of testConfigs) {
      for (let i = 1; i <= 10; i++) {
        // Only insert if it doesn't already exist to avoid spamming
        const title = `${config.prefix} #${i}`;
        const exists = await MockTest.findOne({ title });
        if (!exists) {
          const qs = generateQuestions(config.exam === 'AP MSET' ? 'MSET' : config.exam === 'JEE Mains' ? 'JEE' : 'NEET', config.qCount);
          await MockTest.create({
            title,
            teacherId: adminId,
            targetProgram: config.program,
            targetExam: config.exam,
            totalMarks: qs.length * 4,
            durationMinutes: 180,
            questions: qs,
            status: 'Published'
          });
          createdCount++;
          console.log(`Created: ${title} with ${qs.length} questions.`);
        } else {
          console.log(`Skipped (Already exists): ${title}`);
        }
      }
    }

    console.log(`\nSuccessfully created ${createdCount} new Mock Tests.`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
