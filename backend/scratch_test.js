const prisma = require('./prisma/client');

async function test() {
  const email = 'teacher.neet@test.com';
  console.log("Testing with email:", email);
  
  try {
     const user = await prisma.user.findFirst({ where: { email } });
     console.log("User found:", user ? user.id : 'No user');
     
     if (!user) return;

     const allUsers = await prisma.user.findMany({ 
      where: { faceLoginEnabled: true, faceEmbedding: { isEmpty: false } },
      select: { fullName: true, programInfo: true }
     });
     console.log("All users:", allUsers.length);
  } catch (err) {
     console.error("Prisma error:", err);
  }
}

test();
