const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedMissing() {
  console.log('Seeding missing sections...');

  const students = await prisma.user.findMany({ where: { role: 'Student' } });
  const teachers = await prisma.user.findMany({ where: { role: 'Teacher' } });
  
  if (students.length === 0) {
    console.log('No students found.');
    return;
  }

  // 1. Announcements
  const announcementsCount = await prisma.announcement.count();
  if (announcementsCount === 0) {
    console.log('Seeding announcements...');
    await prisma.announcement.createMany({
      data: [
        {
          title: 'Welcome to the New Academic Year',
          content: 'We are excited to welcome you all back to campus!',
          targetAudience: 'All',
          priority: 'High'
        },
        {
          title: 'Upcoming Mock Exams',
          content: 'Please check your portal for the updated mock exam schedule.',
          targetAudience: 'Student',
          priority: 'Medium'
        }
      ]
    });
  }

  let count = 0;
  for (const student of students) {
    count++;
    console.log(`Processing student ${count}/${students.length}: ${student.id}`);
    const sId = student.id;
    const prog = student.programInfo_program || 'IIT';

    // Removed StudyPlan

    // 3. Attendance
    const attendanceCount = await prisma.attendance.count({ where: { studentId: sId } });
    if (attendanceCount === 0) {
      for (let i = 0; i < 10; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        await prisma.attendance.create({
          data: {
            studentId: sId,
            date: d,
            status: i === 2 ? 'Absent' : 'Present'
          }
        });
      }
    }

    // 4. Leaderboard Ranking
    const rankCount = await prisma.ranking.count({ where: { studentId: sId } });
    if (rankCount === 0) {
      await prisma.ranking.create({
        data: {
          studentId: sId,
          program: prog,
          globalRank: Math.floor(Math.random() * 50) + 1,
          programRank: Math.floor(Math.random() * 20) + 1,
          overallScore: Math.floor(Math.random() * 30) + 60,
          earnedAt: new Date()
        }
      });
    }
  }

  // Ensure Assignments are correctly configured as Active
  await prisma.assignment.updateMany({
    data: { status: 'Active' }
  });

  console.log('Successfully seeded missing features!');
}

seedMissing()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
