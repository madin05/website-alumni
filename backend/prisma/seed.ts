import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/core/utils/password.js';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

function generateDefaultPassword(nisn: string): string {
  const lastThree = nisn.slice(-3);
  return `alumni${lastThree}`;
}

function generateSubmissionCode(): string {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000).toString();
  return `${year}${month}${random}`;
}

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create default admin
  const adminPassword = await hashPassword('Admin#12345');
  
  // Delete existing admin with same email first
  await prisma.alumni.deleteMany({ where: { email: 'admin@smksasmitajaya2.sch.id' } });
  
  const admin = await prisma.alumni.create({
    data: {
      nisn: '0000000000',
      nik: '0000000000000000',
      namaLengkap: 'Admin BKK Sasmita',
      email: 'admin@smksasmitajaya2.sch.id',
      passwordHash: adminPassword,
      jurusan: 'Pengelola BKK & Tracer Study',
      tahunMasuk: 2020,
      tahunLulus: 2020,
      noWhatsApp: '081288897762',
      role: 'ADMIN_BKK',
      tracerStatus: 'SUDAH',
      jenisKelamin: 'L',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // 2. Create sample alumni
  const jurusanList = [
    'Teknik Komputer dan Jaringan',
    'Teknik Pemesinan',
    'Teknik Instalasi Tenaga Listrik',
    'Teknik Elektronika Industri',
    'Teknik Kendaraan Ringan Otomotif',
    'Teknik dan Bisnis Sepeda Motor',
  ];

  for (let i = 0; i < 6; i++) {
    const nisn = `005${String(123456 + i).padStart(7, '0')}`;
    const nik = `367401234567${String(1000 + i).padStart(4, '0')}`;
    const jurusan = jurusanList[i];
    const defaultPassword = generateDefaultPassword(nisn);
    const alumniPassword = await hashPassword(defaultPassword);

    await prisma.alumni.upsert({
      where: { nisn },
      update: {},
      create: {
        nisn,
        nik,
        namaLengkap: `Alumni ${jurusan} ${i + 1}`,
        email: `alumni${i + 1}@example.com`,
        passwordHash: alumniPassword,
        jurusan,
        tahunMasuk: 2021,
        tahunLulus: 2024,
        noWhatsApp: `08129876543${i}`,
        role: 'ALUMNI',
        tracerStatus: i < 2 ? 'SUDAH' : 'BELUM',
        jenisKelamin: i % 2 === 0 ? 'L' : 'P',
      },
    });
  }
  console.log('✅ Sample alumni created (6 records)');

  // 3. Create sample tracer submissions
  const alumniWithSubmission = await prisma.alumni.findMany({
    where: { tracerStatus: 'SUDAH', role: 'ALUMNI' },
    take: 2,
  });

  for (let i = 0; i < alumniWithSubmission.length; i++) {
    const a = alumniWithSubmission[i];
    const submissionCode = generateSubmissionCode();

    await prisma.tracerSubmission.upsert({
      where: { submissionId: submissionCode },
      update: {},
      create: {
        alumniId: a.id,
        statusKegiatan: i === 0 ? 'KERJA_KULIAH' : 'KERJA',
        masaTunggu: '< 3 bulan',
        detailKerja: {
          nama_perusahaan: i === 0 ? 'PT Solusi Teknologi Nusantara' : 'PT Komatsu Indonesia',
          jabatan: i === 0 ? 'Technical Support' : 'CNC Machinist',
          bidang_pekerjaan: 'Teknologi Informasi & Jaringan',
          kota_kabupaten: 'Tangerang Selatan',
          status_pekerjaan: 'Tetap',
          kesesuaian_jurusan: 'Sangat sesuai',
          kisaran_penghasilan: 'Rp 4.000.000 – Rp 7.000.000',
        },
        detailKuliah: i === 0 ? {
          nama_kampus: 'Universitas Pamulang',
          program_studi: 'Teknik Informatika',
          jenjang: 'S1',
          status_kuliah: 'Aktif',
        } : Prisma.JsonNull,
        detailUsaha: Prisma.JsonNull,
        evaluasi: {
          skor_relevansi: 5,
          kompetensi_bermanfaat: ['Kompetensi teknis', 'Komunikasi', 'Kerja sama'],
          kompetensi_ditingkatkan: 'Bahasa Inggris dan praktik cloud computing',
          bantu_dunia_kerja: 'Sangat membantu',
          saran_pembelajaran: 'Perbanyak jam praktik industri dan sertifikasi kejuruan.',
          saran_bkk: 'Perluas kemitraan rekrutmen kampus dan industri Jabodetabek.',
          saran_industri: 'Tingkatkan program guru tamu dari praktisi industri.',
          kesediaan_dihubungi: true,
        },
        submissionId: submissionCode,
      },
    });
  }
  console.log('✅ Sample tracer submissions created (2 records)');

  // 4. Create sample job vacancies
  const jobs = [
    {
      title: 'Teknisi Mesin CNC',
      company: 'PT Komatsu Indonesia',
      location: 'Jakarta Timur',
      type: 'Full-time',
      salary: 'Rp 5.000.000 – Rp 8.000.000',
      targetMajors: ['Teknik Pemesinan'],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      description: 'Mengoperasikan mesin CNC bubut/frais, membaca gambar teknis, dan melakukan pengukuran presisi.',
      requirements: ['SMK Teknik Pemesinan', 'Mampu membaca gambar teknis', 'Menguasai G-code/M-code'],
      contactPerson: 'HRD PT Komatsu',
      isBkkPartner: true,
    },
    {
      title: 'Network Engineer Junior',
      company: 'PT Telkom Indonesia',
      location: 'Bandung',
      type: 'Full-time',
      salary: 'Rp 6.000.000 – Rp 9.000.000',
      targetMajors: ['Teknik Komputer dan Jaringan'],
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      description: 'Mengelola jaringan enterprise, troubleshooting, dan monitoring performa jaringan.',
      requirements: ['SMK TKJ', 'CCNA (diutamakan)', 'Menguasai routing & switching'],
      contactPerson: 'HRD Telkom',
      isBkkPartner: true,
    },
    {
      title: 'Magang Teknisi Listrik',
      company: 'PT PLN (Persero)',
      location: 'Tangerang Selatan',
      type: 'Internship / Magang',
      salary: 'Rp 2.500.000 – Rp 3.500.000',
      targetMajors: ['Teknik Instalasi Tenaga Listrik'],
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      description: 'Magang di gardu distribusi, maintenance peralatan listrik, dan safety inspection.',
      requirements: ['SMK TITL', 'Memahami K3 listrik', 'Bersedia shift'],
      contactPerson: 'HRD PLN Distribusi',
      isBkkPartner: true,
    },
  ];

  for (const job of jobs) {
    await prisma.jobVacancy.create({
      data: {
        ...job,
        targetMajors: JSON.stringify(job.targetMajors),
        requirements: JSON.stringify(job.requirements),
      },
    });
  }
  console.log('✅ Sample job vacancies created (3 records)');

  // 5. Create sample news
  const news = [
    {
      title: 'SMK Sasmita Jaya 2 Gelar Job Fair 2026',
      excerpt: 'Lebih dari 30 perusahaan DUDI mitra ikut serta dalam job fair tahunan untuk menyerap lulusan terbaik.',
      content: 'SMK Sasmita Jaya 2 Pamulang kembali menggelar Job Fair 2026 pada tanggal 15-17 Oktober 2026. Acara ini dihadiri oleh 30+ perusahaan mitra DUDI dari berbagai sektor industri...',
      category: 'Kemitraan DUDI',
      date: new Date('2026-10-15'),
      readTime: '3 min read',
      imageUrl: 'https://example.com/jobfair.jpg',
      author: 'Tim Humas BKK',
      isPublished: true,
    },
    {
      title: 'Workshop Persiapan Karir: Tips Wawancara & CV',
      excerpt: 'BKK menggelar workshop gratis untuk alumni angkatan 2024-2025 guna mempersiapkan masuk dunia kerja.',
      content: 'Workshop ini membahas teknik wawancara behavioral, penulisan CV yang menarik perhatian HRD, dan simulasi wawancara langsung dengan praktisi industri...',
      category: 'Panduan Karir',
      date: new Date('2026-09-20'),
      readTime: '4 min read',
      imageUrl: 'https://example.com/workshop.jpg',
      author: 'Tim Humas BKK',
      isPublished: true,
    },
    {
      title: 'Sertifikasi BNSP Level II Gelombang 2 Dibuka',
      excerpt: 'Pendaftaran sertifikasi kompetensi BNSP untuk jurusan TPM, TITL, dan TKRO dibuka hingga 30 November 2026.',
      content: 'SMK Sasmita Jaya 2 sebagai TUK (Tempat Uji Kompetensi) BNSP membuka pendaftaran sertifikasi Level II...',
      category: 'Sertifikasi',
      date: new Date('2026-10-01'),
      readTime: '2 min read',
      imageUrl: 'https://example.com/bnsp.jpg',
      author: 'Tim Humas BKK',
      isPublished: true,
    },
  ];

  for (const n of news) {
    await prisma.newsItem.create({ data: n });
  }
  console.log('✅ Sample news created (3 records)');

  // 6. Create sample ijazah
  const ijazahData = [
    {
      nisn: '0051234567',
      nama: 'Ahmad Dani',
      jurusan: 'Teknik Komputer dan Jaringan',
      tahunLulus: 2024,
      statusPengambilan: 'SUDAH_DIAMBIL',
      nomorIjazah: 'M-SMK/K13-3/24/0048291',
      nomorSertifikatBnsp: 'BNSP-TKJ-2024-99812',
      tanggalSiap: new Date('2024-07-15'),
      tanggalDiambil: new Date('2024-07-22'),
      lokasiPengambilan: 'Ruang Tata Usaha (TU) SMK Sasmita Jaya 2 Pamulang',
      persyaratan: ['Bebas Pustaka Perpustakaan (Lengkap)', 'Bebas Administrasi Keuangan (Lengkap)', 'Sidik Jari 3 Jari Tengah (Sudah)', 'Formulir Tracer Study (Sudah Mengisi)'],
      barcode: 'IJZ-SMK-SASMITA-2024-0048291',
    },
    {
      nisn: '0067891234',
      nama: 'Bambang Sudiro',
      jurusan: 'Teknik Pemesinan',
      tahunLulus: 2024,
      statusPengambilan: 'SIAP_DIAMBIL',
      nomorIjazah: 'M-SMK/K13-3/24/0048292',
      nomorSertifikatBnsp: 'BNSP-TPM-2024-55410',
      tanggalSiap: new Date('2024-07-15'),
      lokasiPengambilan: 'Loket 2 Pelayanan Alumni & Ijazah SMK Sasmita Jaya 2',
      persyaratan: ['Bebas Pustaka Perpustakaan (Lengkap)', 'Bebas Administrasi Keuangan (Lengkap)', 'Sidik Jari 3 Jari Tengah (Belum - Datang Langsung)', 'Wajib menunjukkan Bukti Pengisian Tracer Study'],
      barcode: 'IJZ-SMK-SASMITA-2024-0048292',
    },
  ];

  for (const i of ijazahData) {
    await prisma.ijazah.upsert({
      where: { nisn: i.nisn },
      update: {},
      create: { ...i, persyaratan: JSON.stringify(i.persyaratan) },
    });
  }
  console.log('✅ Sample ijazah created (2 records)');

  // 7. Admin settings (singleton)
  await prisma.adminSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      targetQuota: 450,
      targetYear: 2024,
      periodStart: new Date('2026-08-01'),
      periodEnd: new Date('2026-11-30'),
      kepalaSekolah: 'Siti Zubaidah, S.E., S.Pd., M.Pd.I',
      nipKepalaSekolah: '19680514 199303 1 004',
      ketuaBkk: 'Ahmad Fauzi, S.Pd., M.Kom.',
      nipKetuaBkk: '19840219 200902 1 002',
      namaSekolah: 'SMK Sasmita Jaya 2 Pamulang',
      npsn: '20614758',
      alamatSekolah: 'Jl. Surya Kencana No. 1, Pamulang Barat, Kec. Pamulang, Kota Tangerang Selatan, Banten 15417',
      kontakBkk: '0812-8889-7762',
    },
  });
  console.log('✅ Admin settings created');

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });