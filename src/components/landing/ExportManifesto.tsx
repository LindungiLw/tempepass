"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "@phosphor-icons/react";
import { useTraceability } from "@/context/TraceabilityContext";
import { EASE_OUT_EXPO } from "@/components/MotionProvider";

const LEDGER_ROWS = [
  {
    fieldId: "Pencatatan Bahan Baku",
    fieldEn: "Raw Material Provenance",
    paperId: "Ditulis tangan di buku nota, sering tercecer atau basah",
    paperEn: "Handwritten in paper notebooks, prone to loss or damp damage",
    digitalId: "Lot kedelai non-GMO, varietas, dan nomor lot ragi tersimpan per batch",
    digitalEn: "Non-GMO soybean lot, variety, and starter code stored per batch",
  },
  {
    fieldId: "Waktu & Suhu Fermentasi",
    fieldEn: "Fermentation Timing & Temp",
    paperId: "Mengandalkan ingatan pengrajin tanpa stempel jam resmi",
    paperEn: "Relies on operator memory with no verifiable timestamp",
    digitalId: "Tercatat dari jam inokulasi, suhu puncak rak, hingga segel kemasan",
    digitalEn: "Logged from inoculation timestamp and peak heat through sealing",
  },
  {
    fieldId: "Kepatuhan Sanitasi (CPPB)",
    fieldEn: "Food Safety Hygiene (CPPB)",
    paperId: "Sulit dibuktikan ke buyer ritel atau auditor inspeksi",
    paperEn: "Difficult to prove during retail buyer or QA audits",
    digitalId: "Ceklis 5 poin CPPB-IRT harian terikat langsung ke ID batch",
    digitalEn: "Daily 5-point CPPB-IRT hygiene sign-off bound to the batch ID",
  },
  {
    fieldId: "Akses Informasi Pembeli",
    fieldEn: "Buyer Transparency",
    paperId: "Pembeli harus bertanya langsung ke penjual soal kesegaran",
    paperEn: "Buyers must ask sellers directly for origin and shelf life",
    digitalId: "Pindai QR membuka paspor dwibahasa (ID / EN) di browser HP",
    digitalEn: "Package QR opens an instant bilingual (ID / EN) batch passport",
  },
];

export function ExportManifesto() {
  const { locale } = useTraceability();

  return (
    <section className="border-b border-[#E2D5BE] bg-[#F2EAD9]/60 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-serif text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#24170E] sm:text-4xl">
              {locale === "id"
                ? "Mengganti catatan kertas dengan bukti mutu siap audit."
                : "Replacing scattered paper notes with audit-ready records."}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#634B3A] sm:text-base">
              {locale === "id"
                ? "Studi pada tujuh industri rumah tangga tempe di Desa Mlirip, Mojokerto (Wulandari dkk., 2024) menemukan bahwa dokumentasi dan pelabelan masih menjadi hambatan utama naik kelas. TempePass mengadaptasi model rantai pasok Aruna dan layanan traceability Wholechain agar bisa dipakai langsung oleh UMKM pangan skala kecil."
                : "A field study across seven household tempe producers in Mlirip Village, Mojokerto (Wulandari et al., 2024) identified labeling and record-keeping as core barriers to wider markets. TempePass adapts Aruna's small-producer tracking and Wholechain's platform model for Indonesian tempe MSMEs."}
            </p>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#FFFDF9] p-4 ring-1 ring-[#E2D5BE]">
              <ShieldCheck
                size={22}
                weight="duotone"
                className="mt-0.5 shrink-0 text-[#23603E]"
              />
              <p className="text-xs leading-relaxed text-[#634B3A]">
                {locale === "id"
                  ? "Sistem ini mendukung kesiapan dokumentasi ekspor dan transparansi batch. Inspeksi keamanan pangan, izin BPOM, dan sertifikasi Halal resmi tetap diproses melalui otoritas terkait."
                  : "TempePass strengthens export documentation and batch transparency. It complements, and does not replace, official food safety inspections, export clearance, or Halal certification."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-[1.5rem] bg-[#FFFDF9] ring-1 ring-[#E2D5BE]">
              <div className="hidden grid-cols-12 border-b border-[#E2D5BE] bg-[#FAF6EE] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#634B3A] sm:grid">
                <div className="col-span-3">
                  {locale === "id" ? "Aspek" : "Dimension"}
                </div>
                <div className="col-span-4">
                  {locale === "id" ? "Catatan Manual" : "Paper Notes"}
                </div>
                <div className="col-span-5 text-[#9A4D1A]">
                  TempePass Digital Log
                </div>
              </div>

              <div className="divide-y divide-[#E2D5BE]/80">
                {LEDGER_ROWS.map((row, index) => (
                  <motion.div
                    key={row.fieldId}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{
                      duration: 0.38,
                      delay: index * 0.05,
                      ease: EASE_OUT_EXPO,
                    }}
                    className="grid gap-3 px-5 py-4 sm:grid-cols-12 sm:gap-4 sm:px-6 sm:py-5"
                  >
                    <div className="text-sm font-semibold text-[#24170E] sm:col-span-3">
                      {locale === "id" ? row.fieldId : row.fieldEn}
                    </div>
                    <div className="text-sm leading-relaxed text-[#634B3A] sm:col-span-4">
                      <span className="mr-1.5 font-mono text-[11px] uppercase text-[#634B3A] sm:hidden">
                        {locale === "id" ? "Manual:" : "Paper:"}
                      </span>
                      {locale === "id" ? row.paperId : row.paperEn}
                    </div>
                    <div className="text-sm font-medium leading-relaxed text-[#24170E] sm:col-span-5">
                      <span className="mr-1.5 font-mono text-[11px] uppercase text-[#9A4D1A] sm:hidden">
                        TempePass:
                      </span>
                      {locale === "id" ? row.digitalId : row.digitalEn}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
