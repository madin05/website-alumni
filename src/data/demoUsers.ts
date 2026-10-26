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

const RAW_DEMO_NAMES: Array<{
  nama: string;
  jurusan: string;
  jurusanShort: string;
  gender: 'L' | 'P';
  tahun: number;
  status: 'BELUM' | 'SUDAH';
}> = [
  { nama: 'Ahmad Rizky Maulana', jurusan: 'Teknik Komputer dan Jaringan', jurusanShort: 'TKJ', gender: 'L', tahun: 2024, status: 'BELUM' },
  { nama: 'Siti Nurhaliza', jurusan: 'Teknik Pemesinan', jurusanShort: 'TPM', gender: 'P', tahun: 2024, status: 'BELUM' },
  { nama: 'Budi Santoso', jurusan: 'Teknik Instalasi Tenaga Listrik', jurusanShort: 'TITL', gender: 'L', tahun: 2023, status: 'BELUM' },
  { nama: 'Dewi Lestari', jurusan: 'Teknik Kendaraan Ringan Otomotif', jurusanShort: 'TKRO', gender: 'P', tahun: 2024, status: 'BELUM' },
  { nama: 'Eko Prasetyo', jurusan: 'Teknik dan Bisnis Sepeda Motor', jurusanShort: 'TBSM', gender: 'L', tahun: 2023, status: 'BELUM' },
  { nama: 'Fani Rahmawati', jurusan: 'Teknik Elektronika Industri', jurusanShort: 'EL', gender: 'P', tahun: 2024, status: 'BELUM' },
  { nama: 'Gilang Ramadhan', jurusan: 'Teknik Komputer dan Jaringan', jurusanShort: 'TKJ', gender: 'L', tahun: 2024, status: 'BELUM' },
  { nama: 'Hana Maulida', jurusan: 'Teknik Pemesinan', jurusanShort: 'TPM', gender: 'P', tahun: 2023, status: 'BELUM' },
  { nama: 'Ilham Firmansyah', jurusan: 'Teknik Instalasi Tenaga Listrik', jurusanShort: 'TITL', gender: 'L', tahun: 2024, status: 'BELUM' },
  { nama: 'Jessica Putri', jurusan: 'Teknik Kendaraan Ringan Otomotif', jurusanShort: 'TKRO', gender: 'P', tahun: 2023, status: 'BELUM' },
  { nama: 'Kevin Adriansyah', jurusan: 'Teknik dan Bisnis Sepeda Motor', jurusanShort: 'TBSM', gender: 'L', tahun: 2024, status: 'BELUM' },
  { nama: 'Laila Safitri', jurusan: 'Teknik Elektronika Industri', jurusanShort: 'EL', gender: 'P', tahun: 2023, status: 'BELUM' },
  { nama: 'Muhammad Fadhil', jurusan: 'Teknik Komputer dan Jaringan', jurusanShort: 'TKJ', gender: 'L', tahun: 2024, status: 'BELUM' },
  { nama: 'Nadia Pratiwi', jurusan: 'Teknik Pemesinan', jurusanShort: 'TPM', gender: 'P', tahun: 2024, status: 'BELUM' },
  { nama: 'Oki Kurniawan', jurusan: 'Teknik Instalasi Tenaga Listrik', jurusanShort: 'TITL', gender: 'L', tahun: 2023, status: 'BELUM' },
  { nama: 'Putri Maharani', jurusan: 'Teknik Kendaraan Ringan Otomotif', jurusanShort: 'TKRO', gender: 'P', tahun: 2024, status: 'BELUM' },
  { nama: 'Qori Alamsyah', jurusan: 'Teknik dan Bisnis Sepeda Motor', jurusanShort: 'TBSM', gender: 'L', tahun: 2023, status: 'BELUM' },
  { nama: 'Rina Anggraini', jurusan: 'Teknik Elektronika Industri', jurusanShort: 'EL', gender: 'P', tahun: 2024, status: 'BELUM' },
  { nama: 'Satria Wibowo', jurusan: 'Teknik Komputer dan Jaringan', jurusanShort: 'TKJ', gender: 'L', tahun: 2024, status: 'BELUM' },
  { nama: 'Tasya Kamila', jurusan: 'Teknik Pemesinan', jurusanShort: 'TPM', gender: 'P', tahun: 2023, status: 'BELUM' },
  { nama: 'Umar Syarif', jurusan: 'Teknik Instalasi Tenaga Listrik', jurusanShort: 'TITL', gender: 'L', tahun: 2024, status: 'BELUM' },
  { nama: 'Vina Aprilia', jurusan: 'Teknik Kendaraan Ringan Otomotif', jurusanShort: 'TKRO', gender: 'P', tahun: 2024, status: 'BELUM' },
  { nama: 'Wahyu Hidayat', jurusan: 'Teknik dan Bisnis Sepeda Motor', jurusanShort: 'TBSM', gender: 'L', tahun: 2023, status: 'BELUM' },
  { nama: 'Wulan Dari', jurusan: 'Teknik Elektronika Industri', jurusanShort: 'EL', gender: 'P', tahun: 2024, status: 'BELUM' },
  { nama: 'Yoga Pratama', jurusan: 'Teknik Komputer dan Jaringan', jurusanShort: 'TKJ', gender: 'L', tahun: 2023, status: 'BELUM' },
  { nama: 'Zahra Amalia', jurusan: 'Teknik Pemesinan', jurusanShort: 'TPM', gender: 'P', tahun: 2024, status: 'BELUM' },
  { nama: 'Dimas Saputra', jurusan: 'Teknik Instalasi Tenaga Listrik', jurusanShort: 'TITL', gender: 'L', tahun: 2024, status: 'BELUM' },
  { nama: 'Anisa Rahma', jurusan: 'Teknik Kendaraan Ringan Otomotif', jurusanShort: 'TKRO', gender: 'P', tahun: 2023, status: 'BELUM' },
  { nama: 'Rizky Fauzi', jurusan: 'Teknik dan Bisnis Sepeda Motor', jurusanShort: 'TBSM', gender: 'L', tahun: 2024, status: 'BELUM' },
  { nama: 'Tiara Shabila', jurusan: 'Teknik Elektronika Industri', jurusanShort: 'EL', gender: 'P', tahun: 2024, status: 'BELUM' },
];

export const DEMO_USERS: DemoUser[] = RAW_DEMO_NAMES.map((item, index) => {
  const numStr = String(index + 1).padStart(2, '0');
  const pad3 = String(index + 1).padStart(3, '0');
  return {
    id: `usr-demo-${numStr}`,
    username: `user${numStr}`,
    password: `alumni#${pad3}`,
    nama: item.nama,
    jurusan: item.jurusan,
    jurusanShort: item.jurusanShort,
    tahunLulus: item.tahun,
    nisn: `30700100${numStr}`,
    nik: `36740120000000${numStr}`,
    email: `user${numStr}@demo.sasmitajaya2.sch.id`,
    noWhatsapp: `081234567${pad3}`,
    statusTracer: item.status,
    jenisKelamin: item.gender,
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
