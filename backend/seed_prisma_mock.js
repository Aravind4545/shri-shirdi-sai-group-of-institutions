const prisma = require('./prisma/client');
const bcrypt = require('bcryptjs');

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Ananya', 'Diya', 'Avni', 'Aadya', 'Kiara', 'Navya', 'Myra', 'Prisha', 'Riya', 'Sara'];
const lastNames = ['Reddy', 'Sharma', 'Patel', 'Kumar', 'Singh', 'Rao', 'Verma', 'Gupta', 'Nair', 'Menon'];

function getRandomName() {
  const f = firstNames[Math.floor(Math.random() * firstNames.length)];
  const l = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${f} ${l}`;
}

const seedMockData = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create a NEET Teacher if not exists
    let neetTeacher = await prisma.user.findFirst({ where: { email: 'teacher.neet@test.com' } });
    if (!neetTeacher) {
      neetTeacher = await prisma.user.create({
        data: {
          fullName: 'Dr. Kavita Sharma',
          email: 'teacher.neet@test.com',
          password: hashedPassword,
          mobileNumber: '9876543211',
          role: 'Teacher',
          assignedProgram: 'NEET',
          isApproved: true
        }
      });
      console.log('Created NEET Teacher');
    }

    console.log('Generating 10 NEET Students...');
    let students = [];
    for (let i = 1; i <= 10; i++) {
      const email = `mockstudent_neet_${i}@test.com`;
      let student = await prisma.user.findFirst({ where: { email } });
      if (!student) {
        student = await prisma.user.create({
          data: {
            fullName: getRandomName(),
            email: email,
            password: hashedPassword,
            mobileNumber: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
            role: 'Student',
            programInfo_program: 'NEET',
            programInfo_stream: 'BiPC',
            programInfo_exams: ['NEET'],
            isApproved: true,
            status: 'Active'
          }
        });
      }
      students.push(student);
    }

    console.log('Generating Attendance for students...');
    for (const student of students) {
      for (let d = 0; d < 10; d++) {
        const date = new Date();
        date.setDate(date.getDate() - d);
        date.setHours(0, 0, 0, 0);

        const isPresent = Math.random() > 0.15; // 85% attendance
        
        await prisma.attendance.create({
          data: {
            studentId: student.id,
            date: date,
            status: isPresent ? 'Present' : 'Absent'
          }
        });
      }
    }

    console.log('Generating Mock Tests and Results...');
    let test = await prisma.test.findFirst({ where: { title: 'NEET Grand Mock Test 1' } });
    if (!test) {
      test = await prisma.test.create({
        data: {
          title: 'NEET Grand Mock Test 1',
          program: 'NEET',
          stream: 'BiPC',
          subject: 'Combined',
          totalMarks: 720,
          durationMinutes: 180,
          questions: [],
          startDate: new Date()
        }
      });
    }

    for (const student of students) {
      const score = Math.floor(720 * (0.4 + Math.random() * 0.5));
      await prisma.testResult.create({
        data: {
          studentId: student.id,
          testId: test.id,
          score: score,
          rank: Math.floor(Math.random() * 100) + 1,
          weakAreas: ['Organic Chemistry'],
          strongAreas: ['Genetics']
        }
      });
    }

    console.log('Generating Study Materials...');
    await prisma.material.create({
      data: {
        title: 'NEET Biology Master Notes',
        type: 'PDF',
        program: 'NEET',
        stream: 'BiPC',
        subject: 'Biology',
        url: 'https://example.com/biology-notes.pdf'
      }
    });
    
    await prisma.material.create({
      data: {
        title: 'NEET Physics Formulas',
        type: 'PDF',
        program: 'NEET',
        stream: 'BiPC',
        subject: 'Physics',
        url: 'https://example.com/physics.pdf'
      }
    });

    console.log('Generating Announcements...');
    await prisma.announcement.create({
      data: {
        title: 'NEET Crash Course Starting',
        content: 'Join the crash course to revise Biology and Physics.',
        targetProgram: 'NEET',
        priority: 'High',
        date: new Date()
      }
    });

    console.log('Mock Data Seeded Successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedMockData();
