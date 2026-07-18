const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const generateRealisticStudentName = () => {
  const firsts = ['Aarav', 'Vihaan', 'Aditya', 'Riya', 'Ananya', 'Diya', 'Ishaan', 'Kabir', 'Sneha', 'Rahul', 'Karan', 'Priya'];
  const lasts = ['Sharma', 'Singh', 'Patel', 'Kumar', 'Gupta', 'Reddy', 'Das', 'Shah', 'Mehta', 'Bose'];
  return `${firsts[Math.floor(Math.random() * firsts.length)]} ${lasts[Math.floor(Math.random() * lasts.length)]}`;
};

const generateRealisticTeacherName = () => {
  const firsts = ['Sanjay', 'Rajesh', 'Vikas', 'Anita', 'Sunita', 'Amit', 'Suresh', 'Pooja', 'Ramesh', 'Ritu'];
  const lasts = ['Verma', 'Chopra', 'Yadav', 'Desai', 'Iyer', 'Menon', 'Joshi', 'Bhat', 'Rao', 'Nair'];
  return `${firsts[Math.floor(Math.random() * firsts.length)]} ${lasts[Math.floor(Math.random() * lasts.length)]}`;
};

async function main() {
  console.log('Starting Production Data Seed...');
  
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password123', salt);

  console.log('Generating Programs...');
  const programs = [
    { program: 'IIT JEE', stream: 'Engineering' },
    { program: 'NEET', stream: 'Medical' },
    { program: 'UPSC', stream: 'Civil Services' }
  ];

  console.log('Generating Teachers...');
  const teachers = [];
  for (let i = 0; i < 5; i++) {
    const fullName = generateRealisticTeacherName();
    const email = `teacher.prod${i}@test.com`;
    let user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          fullName,
          email,
          password,
          role: 'Teacher',
          programInfo_program: programs[i % programs.length].program,
          programInfo_stream: programs[i % programs.length].stream,
          mobileNumber: '9999999999'
        }
      });
    }
    teachers.push(user);
  }

  console.log('Generating Students...');
  const students = [];
  for (let i = 0; i < 20; i++) {
    const fullName = generateRealisticStudentName();
    const email = `student.prod${i}@test.com`;
    let user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          fullName,
          email,
          password,
          role: 'Student',
          programInfo_program: programs[i % programs.length].program,
          programInfo_stream: programs[i % programs.length].stream,
          mobileNumber: '9999999999'
        }
      });
    }
    students.push(user);
  }

  console.log('Generating Assignments and Submissions...');
  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'History', 'Geography'];
  const assignments = [];
  for (let i = 0; i < 15; i++) {
    const p = programs[i % programs.length];
    const t = teachers.find(teach => teach.programInfo_program === p.program);
    if (!t) continue;

    const assignment = await prisma.assignment.create({
      data: {
        title: `Comprehensive Assignment ${i + 1}`,
        description: 'Complete all questions thoroughly and submit before the deadline.',
        instructions: 'Show all steps. Avoid plagiarism.',
        program: p.program,
        stream: p.stream,
        subject: subjects[i % subjects.length],
        topic: 'Advanced Concepts',
        dueDate: new Date(Date.now() + (Math.random() * 14 - 7) * 24 * 60 * 60 * 1000), // Some overdue, some upcoming
        maxMarks: 100,
        teacherId: t.id,
        status: 'Active'
      }
    });
    assignments.push(assignment);
  }

  // Submissions
  for (const s of students) {
    const myAssignments = assignments.filter(a => a.program === s.programInfo_program);
    for (const a of myAssignments) {
      if (Math.random() > 0.3) {
        // 70% chance they submitted
        const isLate = new Date() > new Date(a.dueDate) && Math.random() > 0.5;
        await prisma.assignmentSubmission.create({
          data: {
            assignmentId: a.id,
            studentId: s.id,
            files: ['https://example.com/submission.pdf'],
            status: isLate ? 'Late' : 'Submitted',
            marksAwarded: Math.floor(Math.random() * 40) + 60, // 60-100
            feedback: 'Good work, but improve presentation.',
            submissionDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
          }
        });
      }
    }
  }

  console.log('Generating Academic Health and Intelligence...');
  for (const s of students) {
    const health = await prisma.academicHealth.findFirst({ where: { studentId: s.id } });
    if (!health) {
      await prisma.academicHealth.create({
        data: {
          studentId: s.id,
          healthScore: Math.floor(Math.random() * 30) + 70, // 70-100
          components_attendanceScore: Math.floor(Math.random() * 20) + 80,
          components_testScore: Math.floor(Math.random() * 30) + 70,
          components_assignmentScore: Math.floor(Math.random() * 20) + 80,
          components_studyActivityScore: Math.floor(Math.random() * 40) + 60,
          status: 'Good'
        }
      });
    }

    const insight = await prisma.performanceInsight.findFirst({ where: { studentId: s.id } });
    if (!insight) {
      await prisma.performanceInsight.create({
        data: {
          studentId: s.id,
          performanceScore: Math.floor(Math.random() * 30) + 70,
          growthScore: Math.floor(Math.random() * 20) + 5,
          predictedRank: Math.floor(Math.random() * 50000) + 100,
          predictedPercentile: (Math.random() * 10 + 90).toFixed(1) * 1, // 90.0 - 100.0
          successProbability: Math.floor(Math.random() * 20) + 80,
          readinessLevel: 'High',
          weeklyGrowth: (Math.random() * 5).toFixed(1) * 1,
          monthlyGrowth: (Math.random() * 10).toFixed(1) * 1,
          learningConsistencyScore: Math.floor(Math.random() * 30) + 70,
          improvementScore: Math.floor(Math.random() * 20) + 80,
          aiInsights: [
            'Maintain consistency in Mock Tests.',
            'Focus more on weak topics.',
            'Great job improving accuracy in the last week.'
          ]
        }
      });
    }
  }

  console.log('Generating Leaderboard Rankings...');
  for (const s of students) {
    const existing = await prisma.ranking.findFirst({ where: { studentId: s.id } });
    if (!existing) {
      await prisma.ranking.create({
        data: {
          studentId: s.id,
          program: s.programInfo_program,
          globalRank: Math.floor(Math.random() * 1000) + 1,
          programRank: Math.floor(Math.random() * 300) + 1,
          overallScore: Math.floor(Math.random() * 400) + 600,
          testScore: Math.floor(Math.random() * 30) + 70,
          attendanceScore: Math.floor(Math.random() * 20) + 80,
          assignmentScore: Math.floor(Math.random() * 20) + 80
        }
      });
    }
  }

  console.log('Generating Attendance...');
  for (const s of students) {
    const existing = await prisma.attendance.findFirst({ where: { studentId: s.id } });
    if (!existing) {
      for (let i = 0; i < 30; i++) {
        await prisma.attendance.create({
          data: {
            studentId: s.id,
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
            status: Math.random() > 0.15 ? 'Present' : 'Absent',
            type: 'Class'
          }
        });
      }
    }
  }

  console.log('Production Data Seed Complete!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
