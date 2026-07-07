const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const usersToCreate = [
    {
      email: 'student.neet@test.com',
      password: 'password123',
      fullName: 'NEET Student',
      role: 'Student',
      programInfo: { program: 'NEET', stream: 'BiPC' }
    },
    {
      email: 'teacher.neet@test.com',
      password: 'password123',
      fullName: 'NEET Teacher',
      role: 'Teacher',
      programInfo: { program: 'NEET', stream: 'BiPC' }
    },
    {
      email: 'hod.physics@test.com',
      password: 'password123',
      fullName: 'HOD Physics',
      role: 'Admin',
      programInfo: { program: 'All' }
    }
  ];

  for (const user of usersToCreate) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const existing = await prisma.user.findFirst({ where: { email: user.email } });
    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { 
          password: hashedPassword, 
          isApproved: true, 
          status: 'Active',
          role: user.role 
        }
      });
      console.log(`Updated existing user: ${user.email}`);
    } else {
      await prisma.user.create({
        data: {
          fullName: user.fullName,
          email: user.email,
          password: hashedPassword,
          mobileNumber: '1234567890',
          gender: 'Other',
          dateOfBirth: new Date('1990-01-01'),
          role: user.role,
          isApproved: true,
          status: 'Active',
          programInfo_program: user.programInfo.program,
          programInfo_stream: user.programInfo.stream
        }
      });
      console.log(`Created new user: ${user.email}`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
