const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admins = await prisma.user.findMany({
    where: { role: 'Admin' },
    select: { email: true, fullName: true }
  });
  console.log('Admins:', admins);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
