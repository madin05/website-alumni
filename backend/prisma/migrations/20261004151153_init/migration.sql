-- CreateTable
CREATE TABLE `Alumni` (
    `id` VARCHAR(191) NOT NULL,
    `nisn` VARCHAR(10) NOT NULL,
    `nik` VARCHAR(16) NOT NULL,
    `namaLengkap` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `jurusan` VARCHAR(50) NOT NULL,
    `tahunMasuk` INTEGER NOT NULL,
    `tahunLulus` INTEGER NOT NULL,
    `noWhatsApp` VARCHAR(20) NOT NULL,
    `role` ENUM('ALUMNI', 'ADMIN_BKK') NOT NULL DEFAULT 'ALUMNI',
    `tracerStatus` ENUM('BELUM', 'DRAFT', 'SUDAH') NOT NULL DEFAULT 'BELUM',
    `submissionId` VARCHAR(20) NULL,
    `submittedAt` DATETIME(3) NULL,
    `jenisKelamin` VARCHAR(1) NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `pekerjaan` VARCHAR(100) NULL,
    `kota` VARCHAR(100) NULL,
    `kampus` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Alumni_nisn_key`(`nisn`),
    UNIQUE INDEX `Alumni_nik_key`(`nik`),
    UNIQUE INDEX `Alumni_email_key`(`email`),
    UNIQUE INDEX `Alumni_submissionId_key`(`submissionId`),
    INDEX `Alumni_tahunLulus_idx`(`tahunLulus`),
    INDEX `Alumni_jurusan_idx`(`jurusan`),
    INDEX `Alumni_tracerStatus_idx`(`tracerStatus`),
    INDEX `Alumni_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TracerSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `alumniId` VARCHAR(191) NOT NULL,
    `statusKegiatan` ENUM('KERJA', 'KULIAH', 'WIRAUSAHA', 'KERJA_KULIAH', 'WIRAUSAHA_KULIAH', 'BELUM_KERJA') NOT NULL,
    `masaTunggu` VARCHAR(30) NULL,
    `detailKerja` JSON NULL,
    `detailKuliah` JSON NULL,
    `detailUsaha` JSON NULL,
    `evaluasi` JSON NOT NULL,
    `submissionId` VARCHAR(20) NOT NULL,
    `verificationStatus` ENUM('PENDING', 'VALID', 'REVISI') NOT NULL DEFAULT 'PENDING',
    `verificationNote` TEXT NULL,
    `verifiedAt` DATETIME(3) NULL,
    `verifiedBy` VARCHAR(100) NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TracerSubmission_submissionId_key`(`submissionId`),
    INDEX `TracerSubmission_alumniId_idx`(`alumniId`),
    INDEX `TracerSubmission_submissionId_idx`(`submissionId`),
    INDEX `TracerSubmission_statusKegiatan_idx`(`statusKegiatan`),
    INDEX `TracerSubmission_submittedAt_idx`(`submittedAt`),
    INDEX `TracerSubmission_verificationStatus_idx`(`verificationStatus`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobVacancy` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `company` VARCHAR(100) NOT NULL,
    `companyLogo` VARCHAR(191) NULL,
    `location` VARCHAR(100) NOT NULL,
    `type` VARCHAR(30) NOT NULL,
    `salary` VARCHAR(50) NOT NULL,
    `targetMajors` TEXT NOT NULL,
    `postedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deadline` DATETIME(3) NOT NULL,
    `description` TEXT NOT NULL,
    `requirements` TEXT NOT NULL,
    `contactPerson` VARCHAR(100) NOT NULL,
    `isBkkPartner` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `JobVacancy_isActive_deadline_idx`(`isActive`, `deadline`),
    INDEX `JobVacancy_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobApplication` (
    `id` VARCHAR(191) NOT NULL,
    `alumniId` VARCHAR(191) NOT NULL,
    `jobId` VARCHAR(191) NOT NULL,
    `portfolioUrl` VARCHAR(191) NULL,
    `cvFileUrl` VARCHAR(191) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    `appliedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reviewedAt` DATETIME(3) NULL,
    `reviewedBy` VARCHAR(191) NULL,

    INDEX `JobApplication_jobId_idx`(`jobId`),
    INDEX `JobApplication_status_idx`(`status`),
    UNIQUE INDEX `JobApplication_alumniId_jobId_key`(`alumniId`, `jobId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ijazah` (
    `id` VARCHAR(191) NOT NULL,
    `nisn` VARCHAR(10) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `jurusan` VARCHAR(50) NOT NULL,
    `tahunLulus` INTEGER NOT NULL,
    `statusPengambilan` VARCHAR(30) NOT NULL,
    `nomorIjazah` VARCHAR(50) NOT NULL,
    `nomorSertifikatBnsp` VARCHAR(191) NULL,
    `tanggalSiap` DATETIME(3) NULL,
    `tanggalDiambil` DATETIME(3) NULL,
    `lokasiPengambilan` VARCHAR(100) NOT NULL,
    `persyaratan` TEXT NOT NULL,
    `barcode` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Ijazah_nisn_key`(`nisn`),
    UNIQUE INDEX `Ijazah_nomorIjazah_key`(`nomorIjazah`),
    UNIQUE INDEX `Ijazah_barcode_key`(`barcode`),
    INDEX `Ijazah_statusPengambilan_idx`(`statusPengambilan`),
    INDEX `Ijazah_tahunLulus_idx`(`tahunLulus`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsItem` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `readTime` VARCHAR(20) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `author` VARCHAR(100) NOT NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `NewsItem_isPublished_date_idx`(`isPublished`, `date`),
    INDEX `NewsItem_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupportTicket` (
    `id` VARCHAR(191) NOT NULL,
    `alumniId` VARCHAR(191) NULL,
    `nama` VARCHAR(120) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `noWhatsApp` VARCHAR(20) NULL,
    `subject` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'UNREAD',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `resolvedAt` DATETIME(3) NULL,
    `resolvedBy` VARCHAR(191) NULL,

    INDEX `SupportTicket_alumniId_idx`(`alumniId`),
    INDEX `SupportTicket_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LegalBasis` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(50) NOT NULL,
    `year` VARCHAR(4) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NOT NULL,
    `badge` VARCHAR(30) NOT NULL,
    `pdfUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminSettings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `targetQuota` INTEGER NOT NULL DEFAULT 450,
    `targetYear` INTEGER NOT NULL DEFAULT 2024,
    `periodStart` DATETIME(3) NOT NULL,
    `periodEnd` DATETIME(3) NOT NULL,
    `kepalaSekolah` VARCHAR(120) NOT NULL,
    `nipKepalaSekolah` VARCHAR(50) NOT NULL,
    `ketuaBkk` VARCHAR(120) NOT NULL,
    `nipKetuaBkk` VARCHAR(50) NOT NULL,
    `namaSekolah` VARCHAR(150) NOT NULL,
    `npsn` VARCHAR(20) NOT NULL,
    `alamatSekolah` TEXT NOT NULL,
    `kontakBkk` VARCHAR(50) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TracerSubmission` ADD CONSTRAINT `TracerSubmission_alumniId_fkey` FOREIGN KEY (`alumniId`) REFERENCES `Alumni`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobApplication` ADD CONSTRAINT `JobApplication_alumniId_fkey` FOREIGN KEY (`alumniId`) REFERENCES `Alumni`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobApplication` ADD CONSTRAINT `JobApplication_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `JobVacancy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportTicket` ADD CONSTRAINT `SupportTicket_alumniId_fkey` FOREIGN KEY (`alumniId`) REFERENCES `Alumni`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
