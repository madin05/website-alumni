import React from "react";
import { Modal } from "@/components/ui/Modal";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kebijakan Privasi"
      maxWidth="2xl"
    >
      <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
        {/* Section 1: Dasar Hukum & Komitmen */}
        <section className="space-y-2">
          <h4 className="text-sm sm:text-base font-bold text-[#182a4a]">
            1. Dasar Hukum & Komitmen
          </h4>
          <p className="text-slate-600 leading-relaxed pl-4 border-l-2 border-[#182a4a]/20">
            Kami berkomitmen melindungi data pribadi alumni sesuai amanat
            Undang-Undang Republik Indonesia No. 27 Tahun 2022 tentang
            Pelindungan Data Pribadi (UU PDP) serta pedoman penjaminan mutu
            Direktorat Jenderal Pendidikan Vokasi Kemendikbudristek.
          </p>
        </section>

        {/* Section 2: Data yang Dikumpulkan */}
        <section className="space-y-2">
          <h4 className="text-sm sm:text-base font-bold text-[#182a4a]">
            2. Data yang Dikumpulkan
          </h4>
          <p className="text-slate-600 leading-relaxed pl-4 border-l-2 border-[#182a4a]/20">
            Data yang dihimpun meliputi identitas dasar kependudukan (NIK, NISN,
            Nama Lengkap), kontak aktif (No. WhatsApp, Email), dan riwayat
            aktivitas kelulusan (status kerja, institusi pendidikan lanjutan,
            atau usaha mandiri).
          </p>
        </section>

        {/* Section 3: Tujuan Penggunaan Data */}
        <section className="space-y-2">
          <h4 className="text-sm sm:text-base font-bold text-[#182a4a]">
            3. Tujuan Penggunaan Data
          </h4>
          <p className="text-slate-600 leading-relaxed pl-4 border-l-2 border-[#182a4a]/20">
            Seluruh informasi yang Anda berikan{" "}
            <strong className="font-semibold text-slate-900">HANYA</strong>{" "}
            digunakan untuk:
          </p>
          <ul className="list-disc list-outside pl-9 space-y-2 text-slate-600 leading-relaxed">
            <li>
              Pemetaan mutu kurikulum dan keterserapan lulusan SMK Sasmita Jaya
              2.
            </li>
            <li>
              Pelaporan resmi indikator kinerja dan akreditasi sekolah kepada
              Kemendikbudristek.
            </li>
            <li>
              Keperluan penyaluran informasi lowongan kerja atau kemitraan oleh
              tim Bursa Kerja Khusus (BKK).
            </li>
          </ul>
        </section>

        {/* Section 4: Kerahasiaan & Keamanan Data */}
        <section className="space-y-2">
          <h4 className="text-sm sm:text-base font-bold text-[#182a4a]">
            4. Kerahasiaan & Keamanan Data
          </h4>
          <p className="text-slate-600 leading-relaxed pl-4 border-l-2 border-[#182a4a]/20">
            Kami menjamin bahwa:
          </p>
          <ul className="list-disc list-outside pl-9 space-y-2 text-slate-600 leading-relaxed">
            <li>
              Data individu Anda tidak akan pernah diperjualbelikan atau
              dialihkan ke pihak ketiga komersial.
            </li>
            <li>
              Data statistik yang ditampilkan ke publik di halaman website hanya
              berupa data agregat (persentase/kumulatif) tanpa menampilkan
              identitas personal maupun rincian penghasilan alumni.
            </li>
            <li>
              Akses terhadap data mentah dibatasi secara ketat hanya untuk staf
              resmi BKK SMK Sasmita Jaya 2 yang terautentikasi.
            </li>
          </ul>
        </section>

        {/* Footer action */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#182a4a] text-white text-xs sm:text-sm font-semibold hover:bg-[#111c2c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#182a4a] focus:ring-offset-2 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const TermsOfServiceModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Syarat & Ketentuan"
      maxWidth="2xl"
    >
      <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
        {/* Section 1: Keabsahan Data */}
        <section className="space-y-2">
          <h4 className="text-sm sm:text-base font-bold text-[#182a4a]">
            1. Keabsahan Data
          </h4>
          <p className="text-slate-600 leading-relaxed pl-4 border-l-2 border-[#182a4a]/20">
            Responden menyatakan bahwa data yang diisikan dalam kuesioner ini
            adalah informasi yang benar, akurat, dan sesuai dengan kondisi
            terkini.
          </p>
        </section>

        {/* Section 2: Hak Kepemilikan Akun / Akses */}
        <section className="space-y-2">
          <h4 className="text-sm sm:text-base font-bold text-[#182a4a]">
            2. Hak Kepemilikan Akun / Akses
          </h4>
          <p className="text-slate-600 leading-relaxed pl-4 border-l-2 border-[#182a4a]/20">
            Pengisian kuesioner hanya berhak dilakukan oleh alumni terdaftar SMK
            Sasmita Jaya 2 menggunakan NIK dan NISN yang valid.
          </p>
        </section>

        {/* Section 3: Pemberian Persetujuan (Consent) */}
        <section className="space-y-2">
          <h4 className="text-sm sm:text-base font-bold text-[#182a4a]">
            3. Pemberian Persetujuan (Consent)
          </h4>
          <p className="text-slate-600 leading-relaxed pl-4 border-l-2 border-[#182a4a]/20">
            Dengan menekan tombol kirim form, alumni memberikan izin kepada
            pihak sekolah untuk menyimpan dan mengolah data tersebut untuk
            kepentingan akademik institusi.
          </p>
        </section>

        {/* Section 4: Pembaruan Data */}
        <section className="space-y-2">
          <h4 className="text-sm sm:text-base font-bold text-[#182a4a]">
            4. Pembaruan Data
          </h4>
          <p className="text-slate-600 leading-relaxed pl-4 border-l-2 border-[#182a4a]/20">
            Alumni berhak memperbarui status data apabila terjadi perubahan
            status pekerjaan atau kelanjutan studi dalam periode survei
            berjalan.
          </p>
        </section>

        {/* Footer action */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#182a4a] text-white text-xs sm:text-sm font-semibold hover:bg-[#111c2c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#182a4a] focus:ring-offset-2 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
};
