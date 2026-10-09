import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const alumni = await prisma.alumni.findMany({
    where: { nisn: { in: ['0051234567','0051234568','0051234569','0051234570','0051234571'] } }
  });
  for (const a of alumni) {
    console.log(a.nisn, a.passwordHash.substring(0, 30));
  }
  await prisma.$disconnect();
}
main().catch(console.error);
