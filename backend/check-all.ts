import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const alumni = await prisma.alumni.findMany({
    select: { nisn: true, namaLengkap: true, passwordHash: true }
  });
  for (const a of alumni) {
    console.log(a.nisn, a.namaLengkap, a.passwordHash.substring(0, 30));
  }
  await prisma.$disconnect();
}
main().catch(console.error);
