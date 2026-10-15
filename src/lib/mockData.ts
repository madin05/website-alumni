import {
  NewsItem,
  LegalBasis,
  JobVacancy,
  IjazahStatus,
  JurusanReportData,
} from "@/types/tracer";

export const INITIAL_STATS = {
  totalAlumni: 3520,
  bekerjaWirausahaPercent: 87.5,
  kuliahPercent: 12.5,
  mitraIndustri: 142,
  lokerAktif: 28,
  respondenTahunIni: 1840,
};

export const MOCK_JURUSAN_REPORTS: JurusanReportData[] = [
  {
    id: "all",
    tabLabel: "Semua Jurusan",
    name: "Total Seluruh Jurusan",
    fullName: "Statistik Akumulatif Lulusan Vokasi Teknik SMK Sasmita Jaya 2",
    totalResponden: 1840,
    bmw: {
      bekerja: {
        percent: 85.5,
        count: 1573,
        note: "Terserap di BUMN Manufaktur, Industri Otomotif, Energi, & IT",
      },
      kuliah: {
        percent: 9.5,
        count: 175,
        note: "Diterima di Politeknik Negeri, PTN, & Institut Teknologi",
      },
      wirausaha: {
        percent: 5.0,
        count: 92,
        note: "Mendirikan Bengkel Mandiri, Kontraktor Listrik, & Studio IT",
      },
    },
    linearityRate: 89.4,
    linearityDescription:
      "89.4% lulusan bekerja sesuai dengan bidang kompetensi keahlian teknik yang dipelajari selama di sekolah.",
    avgWaitingTime: "1.7 Bulan",
    avgStartingSalary: "Rp 4.800.000 - Rp 7.500.000",
    topPartners: [
      {
        name: "PT Astra Honda Motor (AHM)",
        sector: "Manufaktur Otomotif",
        badge: "Astra Group",
        description: "Teknisi Perakitan & Quality Control",
      },
      {
        name: "PT PLN (Persero) Distribusi",
        sector: "Ketenagalistrikan & Energi",
        badge: "BUMN",
        description: "Teknisi Jaringan & Pemeliharaan Gardu",
      },
      {
        name: "PT Komatsu Indonesia",
        sector: "Alat Berat & Pemesinan",
        badge: "Industri Presisi",
        description: "Operator CNC & Machining Specialist",
      },
      {
        name: "PT Telkom Indonesia (Persero) Tbk",
        sector: "Telekomunikasi & Jaringan",
        badge: "BUMN Telco",
        description: "Network Engineer & Fiber Optic Support",
      },
    ],
    keyCompetencies: [
      "Sertifikasi Resmi BNSP Level II",
      "Keselamatan & Kesehatan Kerja (K3) Industri",
      "Etos Kerja & Budaya 5R Manufaktur",
      "Troubleshooting & Analisis Teknis",
    ],
  },
  {
    id: "tpm",
    tabLabel: "Teknik Pemesinan",
    name: "Teknik Pemesinan (TPM)",
    fullName: "Program Keahlian Teknik Pemesinan & Manufaktur Presisi",
    totalResponden: 360,
    bmw: {
      bekerja: {
        percent: 86.5,
        count: 311,
        note: "Operator Mesin Bubut/Frais CNC, CAD/CAM Drafter, & QA Presisi",
      },
      kuliah: {
        percent: 8.5,
        count: 31,
        note: "Lanjut S1/D4 Teknik Mesin & Rekayasa Manufaktur",
      },
      wirausaha: {
        percent: 5.0,
        count: 18,
        note: "Bengkel Bubut, Fabrikasi Logam, & Las Konstruksi Mandiri",
      },
    },
    linearityRate: 90.5,
    linearityDescription:
      "90.5% alumni TPM bekerja langsung mengoperasikan mesin bubut, frais, CNC, perancangan gambar CAD/CAM, dan fabrikasi logam.",
    avgWaitingTime: "1.6 Bulan",
    avgStartingSalary: "Rp 4.900.000 - Rp 7.800.000",
    topPartners: [
      {
        name: "PT Komatsu Indonesia",
        sector: "Manufaktur Alat Berat",
        badge: "Global Machining",
        description: "Machining Operator & Precision Tooling",
      },
      {
        name: "PT Astra Otoparts Tbk",
        sector: "Komponen Mesin Otomotif",
        badge: "Astra Group",
        description: "CNC Milling & Turning Technician",
      },
      {
        name: "PT Pindad (Persero)",
        sector: "Alat Utama Sistem Senjata",
        badge: "BUMN Industri",
        description: "Teknisi Fabrikasi Logam & Machining",
      },
      {
        name: "PT United Tractors Pandu Engineering",
        sector: "Fabrikasi Rekayasa Alat Berat",
        badge: "Engineering Partner",
        description: "Juru Gambar CAD & Operator Mesin Produksi",
      },
    ],
    keyCompetencies: [
      "Pemrograman & Pengoperasian CNC Milling & Lathe",
      "Pengoperasian Mesin Bubut & Frais Konvensional",
      "Desain Gambar Teknik CAD/CAM (SolidWorks & AutoCAD)",
      "Pengelasan Presisi (SMAW, GMAW, TIG)",
    ],
  },
  {
    id: "titl",
    tabLabel: "Teknik Listrik",
    name: "Teknik Instalasi Tenaga Listrik (TITL)",
    fullName: "Program Keahlian Teknik Instalasi Tenaga Listrik",
    totalResponden: 340,
    bmw: {
      bekerja: {
        percent: 85.0,
        count: 289,
        note: "Teknisi Panel Listrik 3 Fasa, Instalasi Gedung, & Otomasi PLC",
      },
      kuliah: {
        percent: 10.0,
        count: 34,
        note: "Lanjut S1/D4 Teknik Elektro & Sistem Tenaga Listrik",
      },
      wirausaha: {
        percent: 5.0,
        count: 17,
        note: "Biro Jasa Instalasi Listrik, Genset, & Panel Listrik Mandiri",
      },
    },
    linearityRate: 89.0,
    linearityDescription:
      "89.0% alumni TITL bekerja menangani instalasi penerangan, tenaga listrik 3 phase, panel distribusi industri, dan pemeliharaan genset.",
    avgWaitingTime: "1.7 Bulan",
    avgStartingSalary: "Rp 4.700.000 - Rp 7.200.000",
    topPartners: [
      {
        name: "PT PLN (Persero) Unit Pelaksana Distribusi",
        sector: "Ketenagalistrikan Nasional",
        badge: "BUMN",
        description: "Teknisi Jaringan Tegangan Rendah & Menengah",
      },
      {
        name: "Schneider Electric Indonesia",
        sector: "Otomasi & Distribusi Listrik",
        badge: "Global Energy",
        description: "Panel Wiring Specialist & QC Tester",
      },
      {
        name: "PT Siemens Indonesia",
        sector: "Infrastruktur Elektrifikasi",
        badge: "Multinasional",
        description: "Teknisi Otomasi & Kontrol Daya",
      },
      {
        name: "PT Pembangunan Perumahan (PP) Gedung",
        sector: "Kontraktor Elektrikal Gedung",
        badge: "BUMN Konstruksi",
        description: "Building Electrical Maintenance & ME Staff",
      },
    ],
    keyCompetencies: [
      "Instalasi Penerangan & Tenaga Gedung Bertingkat",
      "Perakitan & Wiring Panel Distribusi 3 Phase",
      "Pemrograman Otomasi PLC & Kontrol Motor Listrik",
      "Penerapan K3 Listrik & Sertifikasi BNSP",
    ],
  },
  {
    id: "el",
    tabLabel: "Elektronika Industri",
    name: "Teknik Elektronika Industri (EL)",
    fullName: "Program Keahlian Teknik Elektronika Industri & Sistem Sensor",
    totalResponden: 310,
    bmw: {
      bekerja: {
        percent: 87.0,
        count: 270,
        note: "Teknisi Instrumentasi, Sensor Pabrik, Sistem IoT, & Maintenance PLC",
      },
      kuliah: {
        percent: 8.0,
        count: 25,
        note: "Lanjut S1/D4 Teknik Elektronika & Mekatronika",
      },
      wirausaha: {
        percent: 5.0,
        count: 15,
        note: "Jasa Perbaikan Modul Elektronik, Desain PCB, & IoT Solution",
      },
    },
    linearityRate: 91.0,
    linearityDescription:
      "91.0% alumni Elektronika Industri bekerja menangani sistem kontrol otomatis, instrumentasi pabrik, mikroprosesor, dan kalibrasi sensor.",
    avgWaitingTime: "1.5 Bulan",
    avgStartingSalary: "Rp 5.000.000 - Rp 8.000.000",
    topPartners: [
      {
        name: "PT Panasonic Manufacturing Indonesia",
        sector: "Elektronika Konsumen & Industri",
        badge: "Global Brand",
        description: "Electronic Quality Inspector & Line Technician",
      },
      {
        name: "PT Epson Indonesia",
        sector: "Manufaktur Presisi Elektronik",
        badge: "Jepang Tech",
        description: "Teknisi Perakitan SMT & Papan PCB",
      },
      {
        name: "PT Omron Manufacturing Indonesia",
        sector: "Sensor & Otomasi Pabrik",
        badge: "Automation Tech",
        description: "PLC Programming & Industrial Sensor Support",
      },
      {
        name: "PT Samsung Electronics Indonesia",
        sector: "Produksi Komponen Elektronika",
        badge: "Global Tech",
        description: "Maintenance Engineer & Circuit Troubleshooting",
      },
    ],
    keyCompetencies: [
      "Sistem Mikrokontroler & Rangkaian Sensor IoT Terapan",
      "Pemrograman Sistem Otomasi PLC & HMI",
      "Perancangan & Soldering Papan Rangkaian Tercetak (PCB)",
      "Perawatan & Kalibrasi Perangkat Instrumentasi Industri",
    ],
  },
  {
    id: "tkro",
    tabLabel: "Otomotif Mobil (TKRO)",
    name: "Teknik Kendaraan Ringan Otomotif (TKRO)",
    fullName: "Program Keahlian Teknik Kendaraan Ringan Otomotif",
    totalResponden: 390,
    bmw: {
      bekerja: {
        percent: 85.5,
        count: 333,
        note: "Teknisi Bengkel Resmi Roda Empat, Quality Inspector, & Service Advisor",
      },
      kuliah: {
        percent: 9.5,
        count: 37,
        note: "Lanjut S1/D4 Pendidikan Teknik Otomotif & Mesin",
      },
      wirausaha: {
        percent: 5.0,
        count: 20,
        note: "Owner Bengkel Mobil Mandiri, Tune-Up EFI, & Toko Sparepart",
      },
    },
    linearityRate: 88.5,
    linearityDescription:
      "88.5% alumni TKRO bekerja menangani overhaul mesin mobil injeksi, sistem transmisi matic/manual, chasis, dan kelistrikan body otomotif.",
    avgWaitingTime: "1.8 Bulan",
    avgStartingSalary: "Rp 4.700.000 - Rp 7.000.000",
    topPartners: [
      {
        name: "PT Toyota Astra Motor / Auto2000",
        sector: "Dealer Resmi & Service Center",
        badge: "Astra Group",
        description: "Junior Technician & Service Specialist",
      },
      {
        name: "PT Astra International Tbk (Daihatsu Sales)",
        sector: "Jaringan Bengkel Otomotif",
        badge: "Dealer Resmi",
        description: "Periodic Maintenance Service Technician",
      },
      {
        name: "PT Mitsubishi Motors Krama Yudha Indonesia",
        sector: "Manufaktur & Assembly Mobil",
        badge: "Pabrik Otomotif",
        description: "Assembly Line Inspector & Final Check",
      },
      {
        name: "PT Suzuki Indomobil Motor",
        sector: "Perakitan & Servis Kendaraan",
        badge: "Industri Otomotif",
        description: "Engine Overhaul & Chasis Diagnostic Tech",
      },
    ],
    keyCompetencies: [
      "Overhaul Mesin Mobil Bensin & Diesel Common Rail",
      "Diagnosa Kelistrikan Kendaraan dengan OBD-II Scanner",
      "Perbaikan Sistem Rem ABS, Kemudi, & Suspensi Roda Empat",
      "Perawatan Sistem AC Mobil & Transmisi Otomatis/CVT",
    ],
  },
  {
    id: "tbsm",
    tabLabel: "Sepeda Motor (TBSM)",
    name: "Teknik dan Bisnis Sepeda Motor (TBSM)",
    fullName: "Program Keahlian Teknik dan Bisnis Sepeda Motor",
    totalResponden: 410,
    bmw: {
      bekerja: {
        percent: 84.0,
        count: 344,
        note: "Mekanik Bengkel Resmi AHASS/Yamaha, Service Advisor, & Sparepart Staff",
      },
      kuliah: {
        percent: 10.5,
        count: 43,
        note: "Lanjut S1/D4 Teknik Otomotif & Manajemen Bisnis",
      },
      wirausaha: {
        percent: 5.5,
        count: 23,
        note: "Pemilik Bengkel Servis Motor Injeksi & Modifikasi Balap",
      },
    },
    linearityRate: 87.5,
    linearityDescription:
      "87.5% alumni TBSM bekerja menangani perawatan berkala mesin sepeda motor, sistem injeksi bahan bakar, transmisi matic CVT, dan kelistrikan.",
    avgWaitingTime: "1.7 Bulan",
    avgStartingSalary: "Rp 4.500.000 - Rp 6.800.000",
    topPartners: [
      {
        name: "PT Astra Honda Motor (Jaringan AHASS)",
        sector: "Jaringan Servis Resmi Honda",
        badge: "Dealer Resmi",
        description: "Senior Mechanic & Service Advisor",
      },
      {
        name: "PT Yamaha Indonesia Motor Manufacturing",
        sector: "Pabrikan & Servis Resmi Yamaha",
        badge: "APM Motor",
        description: "Teknisi Perakitan Mesin & Final Inspection",
      },
      {
        name: "PT Wahana Makmur Sejati (WMS Honda)",
        sector: "Main Dealer Motor Jakarta-Tangerang",
        badge: "Main Dealer",
        description: "Customer Service & PDI Specialist",
      },
      {
        name: "PT Suzuki Indomobil Sales (Roda Dua)",
        sector: "Jaringan Layanan Purna Jual",
        badge: "Dealer Resmi",
        description: "Mekanik Servis Berkala & Diagnosa Injeksi",
      },
    ],
    keyCompetencies: [
      "Tune-Up & Diagnosa Sistem Injeksi (PGM-FI & YMJET-FI)",
      "Perawatan & Perbaikan Transmisi Otomatis CVT Matic",
      "Kelistrikan Bodi, Pengapian, & Sistem Starter Motor",
      "Manajemen Operasional & Wirausaha Bengkel Motor",
    ],
  },
  {
    id: "tkj",
    tabLabel: "Teknik Komputer & Jaringan",
    name: "Teknik Komputer dan Jaringan (TKJ)",
    fullName: "Program Keahlian Teknik Komputer dan Jaringan",
    totalResponden: 520,
    bmw: {
      bekerja: {
        percent: 86.0,
        count: 447,
        note: "Terserap di ISP, Data Center, & Enterprise IT Support",
      },
      kuliah: {
        percent: 9.0,
        count: 47,
        note: "Lanjut S1/D4 Teknik Informatika & Sistem Komputer",
      },
      wirausaha: {
        percent: 5.0,
        count: 26,
        note: "Penyedia Jasa Jaringan, CCTV, & IT Support Mandiri",
      },
    },
    linearityRate: 91.5,
    linearityDescription:
      "91.5% alumni TKJ bekerja langsung menangani infrastruktur jaringan, server, fiber optik, dan perangkat keras.",
    avgWaitingTime: "1.6 Bulan",
    avgStartingSalary: "Rp 4.800.000 - Rp 7.500.000",
    topPartners: [
      {
        name: "PT Telkom Indonesia (Persero) Tbk",
        sector: "Infrastruktur Jaringan",
        badge: "BUMN",
        description: "Fiber Optic & NOC Operations",
      },
      {
        name: "Biznet Networks",
        sector: "Internet Service Provider",
        badge: "ISP Nasional",
        description: "Network Field Engineer",
      },
      {
        name: "PT Mora Telematika (Moratelindo)",
        sector: "Telekomunikasi",
        badge: "Telco",
        description: "Data Center Technical Support",
      },
      {
        name: "MyRepublic Indonesia",
        sector: "Broadband Provider",
        badge: "ISP",
        description: "Customer Premises Equipment Support",
      },
    ],
    keyCompetencies: [
      "MikroTik Certified Network Associate (MTCNA)",
      "Fiber Optic Splicing & OTDR Testing",
      "Cisco Routing & Switching Dasar",
      "Server Linux & Cloud Deployment",
    ],
  },
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title:
      "Pelantikan Pengurus BKK Baru: Siap Salurkan Ratusan Alumni ke Berbagai Sektor Industri",
    excerpt:
      "SMK Sasmita Jaya 2 memperkuat sinergi Bursa Kerja Khusus bersama puluhan mitra strategis industri nasional di Jabodetabek.",
    content: `SMK Sasmita Jaya 2 Pamulang resmi mengukuhkan jajaran pengurus Bursa Kerja Khusus (BKK) untuk periode 2026-2028. Langkah ini menjadi tonggak percepatan penyaluran lulusan langsung ke dunia usaha dan dunia industri (DUDI).
    
    Kepala Sekolah SMK Sasmita Jaya 2 menegaskan bahwa target penyerapan lulusan tahun ini dipatok menembus angka 90% dalam kurun waktu 3 bulan setelah kelulusan. BKK kini dilengkapi sistem digital terpadu untuk memudahkan verifikasi portofolio alumni dan matchmaking kompetensi industri.`,
    category: "BKK & Karir",
    date: "24 Sep 2026",
    readTime: "3 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
    author: "Tim Humas BKK",
  },
  {
    id: "news-2",
    title:
      "Tracer Study: Mengapa Sekolah Sangat Membutuhkan Partisipasi Data Anda?",
    excerpt:
      "Pengisian kuesioner pelacakan alumni bukan sekadar formalitas, namun menjadi kompas penyusunan kurikulum vokasi masa depan.",
    content: `Tracer Study adalah instrumen resmi Kementerian Pendidikan dan Kebudayaan serta instrumen internal yayasan untuk mengukur relevansi materi ajar di sekolah dengan dinamika teknologi terbaru di tempat kerja.
    
    Data yang terkumpul memberikan gambaran jelas: bidang keahlian mana yang paling banyak dicari, sertifikasi apa yang paling bernilai tinggi, serta soft skills apa yang perlu ditingkatkan di ruang kelas.`,
    category: "Tracer Study",
    date: "20 Sep 2026",
    readTime: "4 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    author: "Koordinator Tracer",
  },
  {
    id: "news-3",
    title:
      "Yayasan Sasmita Jaya Resmikan Fasilitas Workshop Otomotif & Lab Jaringan Terpadu",
    excerpt:
      "Investasi sarana prasarana modern guna menunjang standarisasi sertifikasi kompetensi BNSP siswa dan alumni.",
    content: `Dalam rangka mendukung pembelajaran berbasis Teaching Factory (Tefa), Yayasan Sasmita Jaya meresmikan fasilitas laboratorium mutakhir di kampus Pamulang. Fasilitas ini terbuka juga untuk program upskilling dan reskilling bagi para alumni SMK Sasmita Jaya 2.`,
    category: "Fasilitas",
    date: "18 Sep 2026",
    readTime: "2 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    author: "Redaksi Sekolah",
  },
  {
    id: "news-4",
    title: "Kerjasama Strategis dengan 25 Perusahaan IT & Otomotif Diteken",
    excerpt:
      "Peluang magang bersertifikat dan rekrutmen jalur prioritas bagi lulusan SMK Sasmita Jaya 2.",
    content: `Sebanyak 25 pimpinan korporasi menandatangani MoU keselarasan vokasi dengan SMK Sasmita Jaya 2. Melalui MoU ini, kurikulum industri akan langsung diselaraskan ke dalam silabus kejuruan TPM, TITL, EL, TKRO, TBSM, dan TKJ.`,
    category: "Kemitraan DUDI",
    date: "12 Sep 2026",
    readTime: "3 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    author: "Tim Kerjasama Industri",
  },
  {
    id: "news-5",
    title: "Tips Memilih Jalur Karir: Kerja, Kuliah, atau Berwirausaha?",
    excerpt:
      "Panduan praktis bagi alumni baru dalam memetakan potensi diri dan peluang masa depan yang berkelanjutan.",
    content: `Memasuki masa pasca-kelulusan SMK sering kali menghadirkan pilihan krusial. Artikel ini mengupas perbandingan fleksibilitas kuliah kelas karyawan, akselerasi karir korporat, hingga membangun usaha mandiri digital.`,
    category: "Panduan Karir",
    date: "08 Sep 2026",
    readTime: "5 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    author: "Guru BK & Konselor",
  },
  {
    id: "news-6",
    title:
      "Pentingnya Sertifikasi BNSP bagi Daya Saing Lulusan di Era Industri 4.0",
    excerpt:
      "Sertifikat kompetensi resmi menjadi pembeda utama saat bersaing di bursa tenaga kerja nasional dan regional.",
    content: `Lembaga Sertifikasi Profesi (LSP) SMK Sasmita Jaya 2 terus mendorong seluruh alumni untuk memanfaatkan fasilitas uji kompetensi berstandar BNSP guna memvalidasi kemampuan teknis di mata recruiter HRD.`,
    category: "Sertifikasi",
    date: "01 Sep 2026",
    readTime: "4 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    author: "LSP SMK Sasmita Jaya",
  },
];

export const MOCK_LEGAL_BASES: LegalBasis[] = [
  {
    id: "sk-1",
    number: "Nomor 68 Tahun 2022",
    year: "PERPRES 2022",
    title: "Revitalisasi Pendidikan dan Pelatihan Vokasi",
    description:
      "Menetapkan arah kebijakan dan strategi revitalisasi pendidikan vokasi dan pelatihan vokasi guna mewujudkan sumber daya manusia yang unggul dan berdaya saing.",
    badge: "PERPRES 2022",
    pdfUrl: "/documents/Perpres-No-68-Tahun-2022.pdf",
  },
  {
    id: "sk-2",
    number: "Nomor 8 Tahun 2025",
    year: "PERMENDIKDASMEN 2025",
    title: "pemantauan kebekerjaan lulusan (tracer study)",
    description:
      "Peraturan Menteri Pendidikan Dasar dan Menengah mengenai Petunjuk Teknis Pengelolaan Dana BOSP yang memuat pembiayaan pemantauan kebekerjaan lulusan (tracer study) SMK.",
    badge: "PERMENDIKDASMEN 2025",
    pdfUrl: "/documents/Permendikdasmen-No-8-Tahun-2025.pdf",
  },
  {
    id: "sk-3",
    number: "Nomor 34 Tahun 2025",
    year: "PERDIRJEN 2025",
    title: "Pedoman Pelaksanaan Penelusuran Tamatan (Tracer Study) pada SMK",
    description:
      "Peraturan Direktur Jenderal Pendidikan Vokasi, Pendidikan Khusus, dan Pendidikan Layanan Khusus tentang Pedoman Pelaksanaan Penelusuran Tamatan (Tracer Study) pada SMK.",
    badge: "PERDIRJEN 2025",
    pdfUrl: "/documents/Perdirjen-Vokasi-No-34-Tahun-2025.pdf",
  },
  {
    id: "sk-4",
    number: "3159/B/D2/DV.06.03/2026",
    year: "SURAT EDARAN 2026",
    title: "Pemberitahuan Pelaksanaan Penelusuran Tamatan SMK Tahun 2026",
    description:
      "Surat resmi Direktorat SMK Kemendikdasmen perihal Pemberitahuan Pelaksanaan Penelusuran Tamatan SMK Tahun 2026 dan tata cara pengisian di aplikasi penelusuran tamatan SMK.",
    badge: "SURAT EDARAN 2026",
    pdfUrl: "/documents/Surat-Edaran-Dirjen-No-3159-Tahun-2026.pdf",
  },
];

export const MOCK_JOBS: JobVacancy[] = [
  {
    id: "job-1",
    title: "Junior Network Administrator",
    company: "PT Solusi Teknologi Nusantara",
    location: "BSD City, Tangerang Selatan",
    type: "Full-time",
    salary: "Rp 5.200.000 - Rp 6.800.000",
    targetMajors: ["Teknik Komputer dan Jaringan"],
    postedAt: "25 Sep 2026",
    deadline: "15 Okt 2026",
    description:
      "Bertanggung jawab atas instalasi, konfigurasi jaringan LAN/WAN, pemeliharaan router Mikrotik/Cisco, dan penanganan troubleshooting jaringan harian.",
    requirements: [
      "Lulusan SMK Sasmita Jaya 2 (TKJ)",
      "Memahami konfigurasi IP Address, Subnetting, Routing, & VLAN",
      "Memiliki sertifikat BNSP bidang Jaringan menjadi nilai tambah",
      "Mampu bekerja secara shift dan komunikatif",
    ],
    contactPerson: "bkk-it@smksasmitajaya2.sch.id",
    isBkkPartner: true,
  },
  {
    id: "job-2",
    title: "Service Advisor & Teknisi Roda Dua",
    company: "PT Astra Motor Sasmita Group",
    location: "Pamulang, Tangerang Selatan",
    type: "Full-time",
    salary: "Rp 4.900.000 - Rp 5.800.000 + Insentif",
    targetMajors: [
      "Teknik dan Bisnis Sepeda Motor",
      "Teknik Kendaraan Ringan Otomotif",
    ],
    postedAt: "24 Sep 2026",
    deadline: "20 Okt 2026",
    description:
      "Melakukan penerimaan servis pelanggan, diagnosa kerusakan mesin injeksi, tune up berkala, serta perbaikan komponen kelistrikan sepeda motor.",
    requirements: [
      "Lulusan TBSM atau TKRO",
      "Memiliki ketelitian tinggi dan kemampuan komunikasi pelanggan yang ramah",
      "Siap ditempatkan di cabang dealer resmi wilayah Tangsel / Jaksel",
    ],
    contactPerson: "recruitment@astramotor-partner.id",
    isBkkPartner: true,
  },
  {
    id: "job-3",
    title: "Operator CNC & Machining Technician",
    company: "PT Astra Otoparts Tbk",
    location: "Kawasan Industri Cikarang / Karawang",
    type: "Full-time",
    salary: "Rp 5.200.000 - Rp 6.900.000",
    targetMajors: ["Teknik Pemesinan"],
    postedAt: "22 Sep 2026",
    deadline: "18 Okt 2026",
    description:
      "Mengoperasikan mesin bubut/frais CNC, membaca gambar teknik CAD/CAM, dan melakukan pengukuran presisi komponen otomotif.",
    requirements: [
      "Lulusan SMK Jurusan Teknik Pemesinan (TPM)",
      "Mampu membaca alat ukur micrometer, caliper, dan gambar teknik",
      "Memahami dasar G-Code / pemrograman CNC",
    ],
    contactPerson: "hrd@astra-otoparts-career.id",
    isBkkPartner: true,
  },
  {
    id: "job-4",
    title: "Teknisi Panel & Instalasi Listrik Gedung",
    company: "PT PP Properti / Gedung Mitra BKK",
    location: "Jakarta Selatan & Tangerang",
    type: "Full-time",
    salary: "Rp 4.800.000 - Rp 6.200.000",
    targetMajors: [
      "Teknik Instalasi Tenaga Listrik",
      "Teknik Elektronika Industri",
    ],
    postedAt: "20 Sep 2026",
    deadline: "30 Okt 2026",
    description:
      "Melakukan pemeliharaan rutin panel listrik 3 fasa, genset cadangan, dan instalasi mekanikal elektrikal gedung perkantoran.",
    requirements: [
      "Lulusan SMK Jurusan TITL atau Elektronika Industri",
      "Paham diagram wiring satu garis dan standar K3 Listrik",
      "Disiplin, teliti, dan siap tanggap darurat",
    ],
    contactPerson: "bkk-kelistrikan@smksasmitajaya2.sch.id",
    isBkkPartner: true,
  },
  {
    id: "job-5",
    title: "Teknisi Elektronika & Maintenance Sensor PLC",
    company: "PT Panasonic Manufacturing Indonesia",
    location: "Kawasan Industri Jakarta Timur",
    type: "Full-time",
    salary: "Rp 5.100.000 - Rp 6.700.000",
    targetMajors: [
      "Teknik Elektronika Industri",
      "Teknik Instalasi Tenaga Listrik",
    ],
    postedAt: "19 Sep 2026",
    deadline: "28 Okt 2026",
    description:
      "Memelihara sensor industri, modul mikroprosesor, pengujian jalur PCB otomatis, dan monitoring sistem otomasi jalur produksi.",
    requirements: [
      "Lulusan Teknik Elektronika Industri (EL)",
      "Terbiasa menggunakan osiloskop, multimeter, dan solder presisi",
      "Memahami logika dasar PLC Omron / Siemens",
    ],
    contactPerson: "recruitment@panasonic-partner.id",
    isBkkPartner: true,
  },
];

export const MOCK_IJAZAH_DATABASE: Record<string, IjazahStatus> = {
  "0051234567": {
    nisn: "0051234567",
    nama: "Ahmad Dani",
    jurusan: "Teknik Komputer dan Jaringan",
    tahunLulus: 2024,
    statusPengambilan: "SUDAH_DIAMBIL",
    nomorIjazah: "M-SMK/K13-3/24/0048291",
    nomorSertifikatBnsp: "BNSP-TKJ-2024-99812",
    tanggalSiap: "15 Juli 2024",
    tanggalDiambil: "22 Juli 2024",
    lokasiPengambilan: "Ruang Tata Usaha (TU) SMK Sasmita Jaya 2 Pamulang",
    persyaratan: [
      "Bebas Pustaka Perpustakaan (Lengkap)",
      "Bebas Administrasi Keuangan (Lengkap)",
      "Sidik Jari 3 Jari Tengah (Sudah)",
      "Formulir Tracer Study (Sudah Mengisi)",
    ],
    barcode: "IJZ-SMK-SASMITA-2024-0048291",
  },
  "0067891234": {
    nisn: "0067891234",
    nama: "Bambang Sudiro",
    jurusan: "Teknik Pemesinan",
    tahunLulus: 2024,
    statusPengambilan: "SIAP_DIAMBIL",
    nomorIjazah: "M-SMK/K13-3/24/0048292",
    nomorSertifikatBnsp: "BNSP-TPM-2024-55410",
    tanggalSiap: "15 Juli 2024",
    lokasiPengambilan: "Loket 2 Pelayanan Alumni & Ijazah SMK Sasmita Jaya 2",
    persyaratan: [
      "Bebas Pustaka Perpustakaan (Lengkap)",
      "Bebas Administrasi Keuangan (Lengkap)",
      "Sidik Jari 3 Jari Tengah (Belum - Datang Langsung)",
      "Wajib menunjukkan Bukti Pengisian Tracer Study",
    ],
    barcode: "IJZ-SMK-SASMITA-2024-0048292",
  },
  "0071239999": {
    nisn: "0071239999",
    nama: "Rizky Pratama",
    jurusan: "Teknik dan Bisnis Sepeda Motor",
    tahunLulus: 2024,
    statusPengambilan: "PROSES_LEGALISIR",
    nomorIjazah: "M-SMK/K13-3/24/0048293",
    nomorSertifikatBnsp: "BNSP-TBSM-2024-11203",
    tanggalSiap: "28 September 2026",
    lokasiPengambilan: "Ruang BKK SMK Sasmita Jaya 2",
    persyaratan: [
      "Membawa KTP / Kartu Pelajar Asli",
      "Mengisi Tracer Study Online",
    ],
    barcode: "IJZ-SMK-SASMITA-2024-0048293",
  },
};

export const MOCK_ALUMNI_LIST = [
  {
    nama: "Ahmad Dani",
    jurusan: "Teknik Komputer dan Jaringan",
    tahunLulus: 2024,
    status: "KERJA_KULIAH",
    pekerjaan: "Technical Support di PT Solusi Teknologi Nusantara",
    kampus: "S1 Teknik Informatika di Universitas Pamulang",
    kota: "Tangerang Selatan",
    jenisKelamin: "L",
  },
  {
    nama: "Bambang Sudiro",
    jurusan: "Teknik Pemesinan",
    tahunLulus: 2024,
    status: "KERJA",
    pekerjaan: "CNC Machinist di PT Komatsu Indonesia",
    kampus: "-",
    kota: "Jakarta Timur",
    jenisKelamin: "L",
  },
  {
    nama: "Bagas Aditya",
    jurusan: "Teknik Kendaraan Ringan Otomotif",
    tahunLulus: 2023,
    status: "WIRAUSAHA",
    pekerjaan: "Owner Bengkel Modifikasi & Tune Up Bagas Motor",
    kampus: "-",
    kota: "Depok",
    jenisKelamin: "L",
  },
  {
    nama: "Hendro Gunawan",
    jurusan: "Teknik Instalasi Tenaga Listrik",
    tahunLulus: 2023,
    status: "KERJA",
    pekerjaan: "Teknisi Panel Listrik di PT Schneider Electric Indonesia",
    kampus: "-",
    kota: "Tangerang",
    jenisKelamin: "L",
  },
  {
    nama: "Fajar Hidayat",
    jurusan: "Teknik dan Bisnis Sepeda Motor",
    tahunLulus: 2024,
    status: "KERJA",
    pekerjaan: "Senior Mechanic di AHASS Astra Motor Pamulang",
    kampus: "-",
    kota: "Tangerang Selatan",
    jenisKelamin: "L",
  },
  {
    nama: "Dimas Prasetyo",
    jurusan: "Teknik Elektronika Industri",
    tahunLulus: 2024,
    status: "KERJA_KULIAH",
    pekerjaan: "Automation Line Operator di PT Omron Manufacturing",
    kampus: "D4 Teknik Mekatronika Politeknik",
    kota: "Bekasi",
    jenisKelamin: "L",
  },
];

export const MOCK_FAQS = [
  {
    question: "Apa itu Tracer Study SMK Sasmita Jaya 2?",
    answer:
      "Tracer Study adalah survei penelusuran lulusan yang diselenggarakan untuk merekam rekam jejak alumni setelah lulus (bekerja, kuliah, maupun wirausaha). Hasil survei digunakan untuk akreditasi sekolah dan penyelarasan kurikulum dengan industri.",
  },
  {
    question: "Apakah data pribadi saya aman dan dirahasiakan?",
    answer:
      "Ya, seluruh data alumni dilindungi secara ketat sesuai standar privasi data dan hanya digunakan untuk kepentingan evaluasi pendidikan SMK Sasmita Jaya 2 & pelaporan resmi Kemendikbudristek.",
  },
  {
    question: "Bagaimana jika saya belum bekerja saat mengisi kuesioner?",
    answer:
      'Anda dapat memilih status "Belum Bekerja / Sedang Mencari Kerja". BKK SMK Sasmita Jaya 2 akan membantu memfasilitasi informasi lowongan kerja, pemagangan, dan pelatihan yang sesuai dengan kompetensi Anda.',
  },
  {
    question:
      "Bagaimana cara mendaftar lowongan kerja di BKK SMK Sasmita Jaya 2?",
    answer:
      'Alumni dapat login ke dashboard, mengakses menu "Info Loker/Magang", dan memilih lowongan yang tersedia untuk melamar langsung atau menghubungi kontak BKK sekolah.',
  },
];
