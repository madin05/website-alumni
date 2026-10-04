import React, { useState } from "react";
import { MOCK_FAQS } from "@/lib/mockData";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Send, HelpCircle, ChevronDown } from "lucide-react";

export const HelpdeskTab: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [submittedTicket, setSubmittedTicket] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    setSubmittedTicket(true);
    setTimeout(() => {
      setSubmittedTicket(false);
      setTicketSubject("");
      setTicketMessage("");
      setShowSuccessModal(true);
    }, 800);
  };

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-base sm:text-xl font-bold text-slate-900">
          Pusat Bantuan & Layanan BKK
        </h2>
      </div>

      {/* Main Grid: Responsive Reordering for Desktop vs Mobile/Tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Direct Contact Cards (Desktop: Top Row 12 cols, Mobile/Tablet: Middle order-2 below Form) */}
        <div className="order-2 lg:order-1 lg:col-span-12">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            <div className="p-4 sm:p-5 flex items-start gap-3.5">
              <svg
                className="w-6 h-6 text-slate-900 shrink-0 mt-0.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.251.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900">
                  WhatsApp BKK Hotline
                </h3>
                <p className="text-xs text-slate-700">
                  Pelayanan Senin - Jumat (08.00 - 16.00)
                </p>
                <a
                  href="https://wa.me/6281298765432"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block pt-1 text-xs font-bold text-slate-800 hover:underline"
                >
                  +62 812-9876-5432
                </a>
              </div>
            </div>

            <div className="p-4 sm:p-5 flex items-start gap-3.5">
              <svg
                className="w-6 h-6 text-slate-900 shrink-0 mt-0.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908z" />
              </svg>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900">
                  Email Resmi BKK
                </h3>
                <p className="text-xs text-slate-700">
                  Untuk kemitraan DUDI & sertifikasi
                </p>
                <a
                  href="mailto:bkk@smksasmitajaya2.sch.id"
                  className="inline-block pt-1 text-xs font-bold text-slate-800 hover:underline"
                >
                  bkk@smksasmitajaya2.sch.id
                </a>
              </div>
            </div>

            <div className="p-4 sm:p-5 flex items-start gap-3.5">
              <svg
                className="w-6 h-6 text-slate-900 shrink-0 mt-0.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742zM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900">
                  Loket Fisik Tata Usaha
                </h3>
                <p className="text-xs text-slate-600">
                  Gedung SMK Sasmita Jaya 2 Pamulang Barat
                </p>
                <span className="inline-block pt-1 text-xs font-bold text-slate-700">
                  Loket Pelayanan Ijazah
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Form (Desktop: Left 6 cols, Mobile/Tablet: Top order-1) */}
        <div className="order-1 lg:order-2 lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <span>Kirim Pengaduan / Tiket Bantuan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tim admin akan merespons pertanyaan Anda via WhatsApp atau Email
            </p>
          </div>

          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <Input
              label="Judul Permasalahan"
              placeholder="Contoh: Kendala Koreksi Data Ijazah / Pertanyaan Loker"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold tracking-wider text-slate-700">
                Isi Pesan / Pertanyaan
              </label>
              <textarea
                rows={4}
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Jelaskan detail kendala Anda..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
              isLoading={submittedTicket}
            >
              <Send className="w-3.5 h-3.5 mr-2" />
              <span>Kirim Tiket ke BKK</span>
            </Button>
          </form>
        </div>

        {/* Right Column (Desktop: Right 6 cols, Mobile/Tablet: Bottom order-3): FAQs */}
        <div className="order-3 lg:order-3 lg:col-span-6 space-y-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-slate-900" />
            <span>Pertanyaan Umum Alumni (FAQ)</span>
          </h3>

          {MOCK_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer group"
                >
                  <span className="leading-snug">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 transition-transform duration-300 ease-out ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                {/* Smooth Grid Accordion Animation */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Friendly Success Modal */}
      <ConfirmModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Tiket Bantuan Terkirim!"
        message="Tiket pengaduan Anda telah berhasil dikirim ke Tim BKK SMK Sasmita Jaya 2. Tim kami akan segera menindaklanjuti dan menghubungi Anda via WhatsApp atau Email."
        confirmText="Selesai"
        type="success"
      />
    </div>
  );
};
