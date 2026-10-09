import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get alumni without ijazah
  const alumni = await prisma.alumni.findMany({
    where: { role: 'ALUMNI' },
    select: { nisn: true, namaLengkap: true, jurusan: true, tahunLulus: true },
  });

  // Check existing ijazah NISNs
  const existing = await prisma.ijazah.findMany({ select: { nisn: true } });
  const existingNisns = new Set(existing.map(e => e.nisn));

  let created = 0;
  for (let i = 0; i < alumni.length; i++) {
    const a = alumni[i];
    if (existingNisns.has(a.nisn)) continue;

    const num = String(i + 3).padStart(4, '0');
    const statusOptions = ['SIAP_DIAMBIL', 'SUDAH_DIAMBIL', 'PROSES_LEGALISIR', 'DALAM_PENCETAKAN'] as const;
    const status = statusOptions[i % statusOptions.length];

    await prisma.ijazah.create({
      data: {
        nisn: a.nisn,
        nama: a.namaLengkap,
        jurusan: a.jurusan,
        tahunLulus: a.tahunLulus,
        statusPengambilan: status,
        nomorIjazah: `M-SMK/K13-3/24/004829${num}`,
        nomorSertifikatBnsp: `BNSP-${a.jurusan.substring(0,3).toUpperCase()}-2024-${num}000`,
        tanggalSiap: new Date('2024-07-15'),
        tanggalDiambil: status === 'SUDAH_DIAMBIL' ? new Date('2024-07-22') : null,
        lokasiPengambilan: 'Ruang Tata Usaha (TU) SMK Sasmita Jaya 2 Pamulang',
        persyaratan: JSON.stringify([
          'Bebas Pustaka Perpustakaan (Lengkap)',
          'Bebas Administrasi Keuangan (Lengkap)',
          'Sidik Jari 3 Jari Tengah ' + (status === 'SUDAH_DIAMBIL' ? '(Sudah)' : '(Belum - Datang Langsung)'),
          'Formulir Tracer Study (Sudah Mengisi)',
        ]),
        barcode: `IJZ-SMK-SASMITA-2024-004829${num}`,
      },
    });
    console.log(`✅ Created ijazah for ${a.namaLengkap} (${a.nisn})`);
    created++;
  }

  const count = await prisma.ijazah.count();
  console.log(`\nTotal ijazah records: ${count} (${created} baru)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
