import { PrismaClient } from '@prisma/client';
import { hashPassword } from './src/core/utils/password.js';

const prisma = new PrismaClient();

async function main() {
  const hash = await hashPassword('alumni123');
  console.log('New hash:', hash);

  const alumni = await prisma.alumni.findMany({
    where: {
      nisn: { in: ['0051234567','0051234568','0051234569','0051234569','0051234570','0051234571'] }
    }
  });

  for (const a of alumni) {
    await prisma.alumni.update({
      where: { id: a.id },
      data: { passwordHash: hash }
    });
    console.log(`Updated ${a.nisn} (${a.namaLengkap})`);
  }

  console.log('All passwords updated!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
