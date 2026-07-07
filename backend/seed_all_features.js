const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedAllFeatures() {
  console.log('Seeding all student dashboard features with mock data...');
  
  const students = await prisma.user.findMany({ where: { role: 'Student' } });
  const teachers = await prisma.user.findMany({ where: { role: 'Teacher' } });
  
  if (students.length === 0) {
    console.log('No students found');
    return;
  }

  // 1. Announcements (Global/Program-wide)
  const announcementsCount = await prisma.announcement.count();
  if (announcementsCount === 0) {
    console.log('Seeding Announcements...');
    await prisma.announcement.createMany({
      data: [
        { title: 'Upcoming Term Exams', content: 'Term exams will begin next week. Check your schedules.', targetAudience: 'All', priority: 'High' },
        { title: 'Library Hours Extended', content: 'The library will remain open until 10 PM during exam season.', targetAudience: 'All', priority: 'Normal' }
      ]
    });
  }

  // 2. Study Materials (Program-wide)
  const materialsCount = await prisma.material.count();
  if (materialsCount === 0) {
    console.log('Seeding Study Materials...');
    const programs = ['IIT', 'NEET', 'UPSC'];
    for (const p of programs) {
      await prisma.material.create({
        data: {
          title: `${p} Physics Mastery Guide`,
          description: 'Complete notes for mechanics and electromagnetism.',
          program: p,
          stream: p === 'NEET' ? 'BiPC' : 'MPC',
          subject: 'Physics',
          type: 'PDF',
          url: 'https://example.com/physics.pdf'
        }
      });
      await prisma.material.create({
        data: {
          title: `${p} Chemistry Formula Bank`,
          description: 'Quick revision formulas for organic chemistry.',
          program: p,
          stream: p === 'NEET' ? 'BiPC' : 'MPC',
          subject: 'Chemistry',
          type: 'PDF',
          url: 'https://example.com/chem.pdf'
        }
      });
    }
  }

  // 3. Mock Tests (Program-wide)
  const mockTestsCount = await prisma.mockTest.count();
  if (mockTestsCount === 0) {
    console.log('Seeding Mock Tests...');
    const programs = ['IIT', 'NEET', 'UPSC'];
    for (const p of programs) {
      await prisma.mockTest.create({
        data: {
          title: `${p} Grand Test 1`,
          targetProgram: p,
          targetExam: `${p} Mains`,
          durationMinutes: 180,
          totalMarks: 300,
          questions: [
            "What is the capital of France?",
            "Solve: 2 + 2 = ?"
          ]
        }
      });
    }
  }

  let count = 0;
  // Iterate over each student for personal records
  for (const student of students) {
    count++;
    console.log(`Processing student ${count}/${students.length}: ${student.id}`);
    const sId = student.id;
    const prog = student.programInfo_program || 'IIT';

    // 4. Assignment Submissions
    const submissionsCount = await prisma.assignmentSubmission.count({ where: { studentId: sId } });
    if (submissionsCount === 0) {
      // Find an assignment to submit
      let assignment = await prisma.assignment.findFirst({ where: { program: prog } });
      if (!assignment) {
        assignment = await prisma.assignment.create({
          data: {
            program: prog,
            subject: 'Physics',
            title: 'Kinematics Worksheet',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            maxMarks: 100
          }
        });
      }
      
      await prisma.assignmentSubmission.create({
        data: {
          studentId: sId,
          assignmentId: assignment.id,
          status: 'Graded',
          marksAwarded: 85,
          feedback: 'Good effort, but review the SN2 mechanisms.',
          submissionDate: new Date()
        }
      });
    }

    // 5. Messages
    const msgsCount = await prisma.message.count({ where: { receiver: sId } });
    if (msgsCount === 0 && teachers.length > 0) {
      await prisma.message.create({
        data: {
          sender: teachers[0].id,
          receiver: sId,
          content: 'Welcome to the New Term! I am your mentor for this term. Please let me know if you need any help with the curriculum.',
          read: false
        }
      });
    }

    // 6. Complaints
    const complaintsCount = await prisma.complaint.count({ where: { user: sId } });
    if (complaintsCount === 0) {
      await prisma.complaint.create({
        data: {
          user: sId,
          type: 'Hostel',
          title: 'Internet Issue',
          description: 'Wi-Fi in block B is very slow during evening hours.',
          status: 'Pending'
        }
      });
    }

    // 7. Results (for Test Results & Competition)
    const resultsCount = await prisma.testResult.count({ where: { studentId: sId } });
    if (resultsCount === 0) {
      await prisma.testResult.create({
        data: {
          studentId: sId,
          testId: 'mock-test-id-123',
          score: 85,
          correctAnswers: 85,
          wrongAnswers: 15,
          unattempted: 0,
          accuracyPercentage: 85,
          percentile: 92,
          rank: 12
        }
      });
    }

    // 8. Topic Analytics
    const topicCount = await prisma.topicAnalytics.count({ where: { studentId: sId } });
    if (topicCount === 0) {
      await prisma.topicAnalytics.createMany({
        data: [
          { studentId: sId, program: prog, subject: 'Physics', chapter: 'Mechanics', topic: 'Newton Laws', accuracy: 85, status: 'Strong' },
          { studentId: sId, program: prog, subject: 'Chemistry', chapter: 'Organic', topic: 'Aldehydes', accuracy: 40, status: 'Weak' }
        ]
      });
    }
  }

  console.log('Successfully seeded all dashboard features!');
}

seedAllFeatures()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
