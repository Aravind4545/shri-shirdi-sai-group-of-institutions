const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedSubjectAnalytics() {
  console.log('Seeding Subject Analytics...');
  const students = await prisma.user.findMany({ where: { role: 'Student' } });
  
  const subjectsMap = {
    'IIT': ['Physics', 'Chemistry', 'Mathematics'],
    'NEET': ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    'UPSC': ['History', 'Geography', 'Polity', 'Economics']
  };

  for (const student of students) {
    const prog = student.programInfo_program;
    const subjects = subjectsMap[prog] || ['General Studies'];
    
    for (const sub of subjects) {
      const existing = await prisma.subjectAnalytics.findFirst({
        where: { studentId: student.id, subject: sub }
      });
      
      if (!existing) {
        await prisma.subjectAnalytics.create({
          data: {
            studentId: student.id,
            program: prog,
            subject: sub,
            averageAccuracy: Math.floor(Math.random() * 40) + 50, // 50 to 90
            improvementTrend: []
          }
        });
      }
    }
  }
  console.log('Done!');
}

seedSubjectAnalytics()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
