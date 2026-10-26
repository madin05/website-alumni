export interface DemoUser {
  id: string;
  username: string;
  password: string;
  nama: string;
  jurusan: string;
  jurusanShort: string;
  tahunLulus: number;
  nisn: string;
  nik: string;
  email: string;
  noWhatsapp: string;
  statusTracer: 'BELUM' | 'SUDAH';
  jenisKelamin: 'L' | 'P';
}

const JURUSAN_LIST = [
  { jurusan: 'Teknik Komputer dan Jaringan', jurusanShort: 'TKJ' },
  { jurusan: 'Teknik Pemesinan', jurusanShort: 'TPM' },
  { jurusan: 'Teknik Instalasi Tenaga Listrik', jurusanShort: 'TITL' },
  { jurusan: 'Teknik Kendaraan Ringan Otomotif', jurusanShort: 'TKRO' },
  { jurusan: 'Teknik dan Bisnis Sepeda Motor', jurusanShort: 'TBSM' },
  { jurusan: 'Teknik Elektronika Industri', jurusanShort: 'EL' },
];

export const DEMO_USERS: DemoUser[] = Array.from({ length: 30 }, (_, index) => {
  const num = index + 1;
  const numStr = String(num).padStart(2, '0');
  const pad3 = String(num).padStart(3, '0');
  const jInfo = JURUSAN_LIST[index % JURUSAN_LIST.length];

  return {
    id: `usr-demo-${numStr}`,
    username: `user${numStr}`,
    password: `alumni#${pad3}`,
    nama: `User ${numStr}`,
    jurusan: jInfo.jurusan,
    jurusanShort: jInfo.jurusanShort,
    tahunLulus: 2024,
    nisn: `30700100${numStr}`,
    nik: `36740120000000${numStr}`,
    email: `user${numStr}@demo.sasmitajaya2.sch.id`,
    noWhatsapp: `081234567${pad3}`,
    statusTracer: 'BELUM',
    jenisKelamin: index % 2 === 0 ? 'L' : 'P',
  };
});

export function findDemoUser(identifier: string): DemoUser | undefined {
  if (!identifier) return undefined;
  const clean = identifier.trim().toLowerCase();
  return DEMO_USERS.find(
    (u) =>
      u.username.toLowerCase() === clean ||
      u.nisn === clean ||
      u.email.toLowerCase() === clean
  );
}

export function getDemoMasterAlumniRecords() {
  return DEMO_USERS.map((u) => ({
    id: u.id,
    nisn: u.nisn,
    nik: u.nik,
    nama: u.nama,
    jurusan: u.jurusan as any,
    tahunLulus: u.tahunLulus,
    noWhatsapp: u.noWhatsapp,
    email: u.email,
    statusTracer: 'BELUM' as const,
    submissionId: undefined,
    submittedAt: undefined,
    jenisKelamin: u.jenisKelamin,
    createdAt: '2026-08-01T08:00:00Z',
  }));
}
