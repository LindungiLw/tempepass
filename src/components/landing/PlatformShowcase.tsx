"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  DeviceMobile,
  Printer,
  Storefront,
} from "@phosphor-icons/react";
import { useTraceability } from "@/context/TraceabilityContext";
import { EASE_OUT_EXPO, SPRING_TACTILE } from "@/components/MotionProvider";

export function PlatformShowcase() {
  const { locale, activeProducer } = useTraceability();
  const [perspective, setPerspective] = useState<"buyer" | "producer">("buyer");

  const content = {
    buyer: {
      headingId: "Satu pindai kamera, seluruh riwayat batch langsung terbuka.",
      headingEn: "One phone scan opens the complete bilingual batch record.",
      bodyId:
        "Tanpa perlu mengunduh aplikasi, konsumen di pasar ritel maupun tim QA importir langsung melihat asal kedelai non-GMO, nomor lot ragi, lama fermentasi, izin P-IRT/Halal, dan panduan suhu penyimpanan.",
      bodyEn:
        "With zero app installs, retail shoppers and overseas QA reviewers inspect non-GMO soybean origin, starter culture lot, incubation hours, Halal and P-IRT numbers, plus cold-chain handling instructions.",
      bulletsId: [
        "Tersedia langsung dalam Bahasa Indonesia dan Inggris (ID / EN)",
        "Lembar spesifikasi siap cetak untuk dokumen inspeksi buyer",
        "Saluran umpan balik langsung dari pembeli ke rumah produksi",
      ],
      bulletsEn: [
        "Instant Indonesian and English switching for export reviews",
        "Printable batch specification sheet for QA documentation",
        "Direct buyer inquiry and quality feedback to the workshop",
      ],
      photo: "/images/tempe-macro.jpg",
      photoAlt: "Fresh artisanal Indonesian tempe block sliced diagonally",
      ctaHref: "/b/TMP-MLR-2611-01",
      ctaId: "Lihat Paspor Batch Export",
      ctaEn: "Inspect Export Passport",
    },
    producer: {
      headingId: "Pengrajin mencatat batch pagi dalam dua menit dari HP.",
      headingEn: "Craftsmen log morning batches in two minutes from a phone.",
      bodyId:
        "Dirancang khusus untuk ruang produksi yang lembab dan ritme kerja subuh. Preset bahan baku menyimpan pemasok kedelai dan ragi harian, sehingga pengrajin tinggal mengisi kuantitas, centang sanitasi CPPB, lalu cetak stiker QR.",
      bodyEn:
        "Built for humid production floors and early-morning schedules. Saved material presets pre-fill daily soybean and starter sources so operators enter pack count, confirm CPPB sanitation, and print QR labels.",
      bulletsId: [
        "Preset bahan baku: tidak perlu mengetik ulang data kedelai setiap hari",
        "Stiker QR otomatis siap cetak di printer termal 5x5cm atau kertas A4",
        "Riwayat batch tersimpan rapi menggantikan catatan kertas yang mudah hilang",
      ],
      bulletsEn: [
        "Raw-material presets eliminate repetitive morning typing",
        "Automatic 5x5cm thermal or A4 12-up printable QR sticker layouts",
        "Searchable batch archive replacing damp handwritten notebooks",
      ],
      photo: "/images/tempe-fermentation.jpg",
      photoAlt: "Clean Indonesian tempe fermentation workshop shelves",
      ctaHref: activeProducer ? "/studio" : "/login",
      ctaId: "Masuk ke Studio UMKM",
      ctaEn: "Open MSME Studio",
    },
  }[perspective];

  return (
    <section className="border-b border-[#E2D5BE] bg-[#FAF6EE] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#24170E] sm:text-4xl">
              {locale === "id"
                ? "Dua sisi yang terhubung dalam satu kode unik."
                : "Two surfaces linked by a single batch code."}
            </h2>
          </div>

          <div
            role="tablist"
            aria-label={
              locale === "id" ? "Pilih sudut pandang" : "Select perspective"
            }
            className="inline-flex rounded-full bg-[#F2EAD9] p-1.5 ring-1 ring-[#E2D5BE]"
          >
            {(
              [
                {
                  id: "buyer",
                  icon: DeviceMobile,
                  labelId: "Sisi Pembeli & Buyer",
                  labelEn: "Buyer & Importer",
                },
                {
                  id: "producer",
                  icon: Storefront,
                  labelId: "Sisi Pengrajin UMKM",
                  labelEn: "MSME Producer",
                },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const active = perspective === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setPerspective(tab.id)}
                  className={`relative inline-flex min-h-[42px] items-center gap-2 rounded-full px-4 text-xs font-semibold transition-colors sm:px-5 sm:text-sm ${
                    active
                      ? "text-[#FAF6EE]"
                      : "text-[#634B3A] hover:text-[#24170E]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="perspective-pill"
                      transition={SPRING_TACTILE}
                      className="absolute inset-0 rounded-full bg-[#24170E]"
                    />
                  )}
                  <Icon size={17} weight="duotone" className="relative z-10" />
                  <span className="relative z-10">
                    {locale === "id" ? tab.labelId : tab.labelEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={perspective}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.34, ease: EASE_OUT_EXPO }}
            className="mt-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
          >
            <div className="lg:col-span-7">
              <div className="group overflow-hidden rounded-[1.75rem] bg-[#F2EAD9] p-2 ring-1 ring-[#E2D5BE]">
                <div className="overflow-hidden rounded-[1.25rem]">
                  <img
                    src={content.photo}
                    alt={content.photoAlt}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <h3 className="font-serif text-2xl font-semibold leading-snug tracking-tight text-[#24170E] sm:text-3xl">
                {locale === "id" ? content.headingId : content.headingEn}
              </h3>

              <p className="mt-4 text-base leading-relaxed text-[#634B3A]">
                {locale === "id" ? content.bodyId : content.bodyEn}
              </p>

              <ul className="mt-6 space-y-3 border-t border-[#E2D5BE] pt-6">
                {(locale === "id" ? content.bulletsId : content.bulletsEn).map(
                  (bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 text-sm leading-relaxed text-[#24170E]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9A4D1A]/15 text-[#9A4D1A]">
                        <Check size={12} weight="bold" />
                      </span>
                      <span>{bullet}</span>
                    </li>
                  )
                )}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={content.ctaHref}
                  className="group inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-[#9A4D1A] pl-5 pr-2 text-sm font-semibold text-white transition-colors hover:bg-[#7D3C12] active:scale-[0.98]"
                >
                  <span>
                    {locale === "id" ? content.ctaId : content.ctaEn}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5">
                    <ArrowRight size={15} weight="bold" />
                  </span>
                </Link>

                {perspective === "producer" && (
                  <Link
                    href="/studio/print/TMP-MLR-2611-01"
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#F2EAD9] px-4 text-sm font-semibold text-[#24170E] ring-1 ring-[#E2D5BE] transition-colors hover:bg-[#E2D5BE]"
                  >
                    <Printer size={17} weight="duotone" />
                    <span>
                      {locale === "id"
                        ? "Pratinjau Cetak Stiker"
                        : "Preview Sticker Sheet"}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
