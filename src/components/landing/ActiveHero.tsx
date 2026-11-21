"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  Clock,
  MagnifyingGlass,
  MapPin,
  QrCode,
  ShieldCheck,
  Thermometer,
} from "@phosphor-icons/react";
import { useTraceability } from "@/context/TraceabilityContext";
import {
  buildPassportUrl,
  extractBatchIdFromScan,
  formatDate,
  getStatusLabel,
} from "@/lib/format";
import { EASE_OUT_EXPO, SPRING_TACTILE } from "@/components/MotionProvider";

const PREVIEW_PHOTO_BY_GRADE: Record<string, string> = {
  export_vacuum: "/images/tempe-export.jpg",
  artisan_leaf: "/images/tempe-macro.jpg",
  retail_fresh: "/images/tempe-fermentation.jpg",
};

export function ActiveHero() {
  const router = useRouter();
  const {
    batches,
    producers,
    locale,
    appOrigin,
    setScannerOpen,
    activeProducer,
  } = useTraceability();

  const heroBatches = batches.slice(0, 3);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [lookupInput, setLookupInput] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);

  const selectedBatch = heroBatches[selectedIdx] ?? heroBatches[0];
  const selectedProducer = producers.find(
    (p) => p.id === selectedBatch?.producerId
  );

  const handleLookup = (event: React.FormEvent) => {
    event.preventDefault();
    const cleaned = extractBatchIdFromScan(lookupInput);
    if (!cleaned) {
      setLookupError(
        locale === "id"
          ? "Ketik nomor batch atau pilih salah satu kode sampel di bawah."
          : "Enter a batch ID or tap one of the sample codes below."
      );
      return;
    }
    setLookupError(null);
    router.push(`/b/${encodeURIComponent(cleaned)}`);
  };

  return (
    <section className="relative overflow-x-clip border-b border-[#E2D5BE] bg-[#FAF6EE]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-14 lg:px-8 lg:pt-16">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
            className="lg:col-span-6 lg:pt-2"
          >
            <h1 className="font-serif text-[2.45rem] font-semibold leading-[1.06] tracking-[-0.03em] text-[#24170E] sm:text-5xl lg:text-[3.55rem]">
              {locale === "id"
                ? "Jejak setiap blok tempe, dari lot kedelai sampai kemasan ekspor."
                : "Every tempe batch traced, from soybean lot to export seal."}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#634B3A] sm:text-lg">
              {locale === "id"
                ? "Pengrajin UMKM mencatat asal kedelai, jam inokulasi ragi, dan sanitasi CPPB dalam dua menit. Pembeli ritel maupun importir cukup memindai QR di kemasan untuk memeriksa riwayat produksinya langsung dari browser."
                : "Indonesian tempe workshops log soybean lots, starter inoculation times, and CPPB hygiene in two minutes. Retail and international buyers scan the package QR in any mobile browser to inspect the batch record."}
            </p>

            {/* Active Instant Verification Console */}
            <div className="mt-8 rounded-[1.5rem] bg-[#F2EAD9]/85 p-2 ring-1 ring-[#E2D5BE]">
              <div className="rounded-[1.1rem] bg-[#FFFDF9] p-4 sm:p-5">
                <form onSubmit={handleLookup} className="space-y-3">
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <div className="relative flex-1">
                      <MagnifyingGlass
                        size={18}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#634B3A]"
                      />
                      <input
                        type="text"
                        value={lookupInput}
                        onChange={(e) => {
                          setLookupInput(e.target.value);
                          setLookupError(null);
                        }}
                        aria-label={
                          locale === "id"
                            ? "Masukkan kode batch tempe"
                            : "Enter tempe batch ID"
                        }
                        placeholder={
                          locale === "id"
                            ? "Cek kode batch (cth. TMP-MLR-2611-01)"
                            : "Verify batch ID (e.g. TMP-MLR-2611-01)"
                        }
                        className="min-h-[48px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] pl-10 pr-3 font-mono text-sm text-[#24170E] placeholder:text-[#634B3A]/75 focus:border-[#9A4D1A]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#24170E] px-5 text-sm font-semibold text-[#FAF6EE] transition-colors hover:bg-[#9A4D1A] active:scale-[0.98] sm:flex-initial"
                      >
                        <span>{locale === "id" ? "Lacak" : "Trace"}</span>
                        <ArrowRight size={16} weight="bold" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setScannerOpen(true)}
                        title={
                          locale === "id"
                            ? "Pindai QR dengan kamera"
                            : "Scan QR with camera"
                        }
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#F2EAD9] px-4 text-sm font-semibold text-[#24170E] ring-1 ring-[#E2D5BE] transition-colors hover:bg-[#E2D5BE] active:scale-[0.98]"
                      >
                        <QrCode
                          size={20}
                          weight="duotone"
                          className="text-[#9A4D1A]"
                        />
                        <span className="sm:hidden">
                          {locale === "id" ? "Kamera" : "Camera"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {lookupError && (
                    <p className="text-xs font-medium text-[#9A4D1A]">
                      {lookupError}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-medium text-[#634B3A]">
                      {locale === "id" ? "Coba langsung:" : "Try live batch:"}
                    </span>
                    {heroBatches.map((batch) => (
                      <Link
                        key={batch.id}
                        href={`/b/${encodeURIComponent(batch.id)}`}
                        className="inline-flex min-h-[32px] items-center gap-1 rounded-lg bg-[#FAF6EE] px-2.5 py-1 font-mono text-xs font-medium text-[#24170E] ring-1 ring-[#E2D5BE] transition-colors hover:bg-[#9A4D1A] hover:text-white hover:ring-[#9A4D1A]"
                      >
                        <span>{batch.id}</span>
                        <ArrowUpRight size={12} weight="bold" />
                      </Link>
                    ))}
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href={activeProducer ? "/studio" : "/login"}
                className="group inline-flex min-h-[52px] items-center gap-3 rounded-full bg-[#9A4D1A] pl-6 pr-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#7D3C12] active:scale-[0.98]"
              >
                <span>
                  {activeProducer
                    ? locale === "id"
                      ? "Buka Studio Pengrajin"
                      : "Open Producer Studio"
                    : locale === "id"
                      ? "Coba Dashboard Pengrajin"
                      : "Try Producer Studio"}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowRight size={16} weight="bold" />
                </span>
              </Link>

              <a
                href="#simulasi"
                className="inline-flex min-h-[52px] items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#24170E] transition-colors hover:bg-[#F2EAD9]"
              >
                <span>
                  {locale === "id"
                    ? "Simulasi 5 Tahap Fermentasi"
                    : "Explore 5-Stage Fermentation"}
                </span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Live Interactive Tempe Batch Passport Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE_OUT_EXPO }}
            className="lg:col-span-6"
          >
            <div className="rounded-[1.85rem] bg-[#F2EAD9] p-2.5 shadow-[0_24px_60px_-24px_rgba(36,23,14,0.22)] ring-1 ring-[#E2D5BE]">
              {/* Interactive Batch Switcher Bar */}
              <div
                role="tablist"
                aria-label={
                  locale === "id"
                    ? "Pilih contoh batch tempe"
                    : "Select sample tempe batch"
                }
                className="mb-2.5 grid grid-cols-3 gap-1.5 rounded-2xl bg-[#FAF6EE] p-1.5 ring-1 ring-[#E2D5BE]/80"
              >
                {heroBatches.map((batch, idx) => {
                  const active = idx === selectedIdx;
                  const shortLabels: Record<string, { id: string; en: string }> =
                    {
                      export_vacuum: { id: "Vacuum Ekspor", en: "Export Vacuum" },
                      artisan_leaf: { id: "Daun Pisang", en: "Banana Leaf" },
                      retail_fresh: { id: "Inkubasi 26h", en: "Incubating 26h" },
                    };
                  const tabLabel =
                    shortLabels[batch.grade]?.[locale] ?? batch.id;

                  return (
                    <button
                      key={batch.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedIdx(idx)}
                      className={`relative min-h-[40px] rounded-xl px-2 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                        active
                          ? "text-[#FAF6EE]"
                          : "text-[#634B3A] hover:text-[#24170E]"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="hero-batch-pill"
                          transition={SPRING_TACTILE}
                          className="absolute inset-0 rounded-xl bg-[#24170E]"
                        />
                      )}
                      <span className="relative z-10">{tabLabel}</span>
                    </button>
                  );
                })}
              </div>

              {selectedBatch && (
                <div className="overflow-hidden rounded-[1.35rem] bg-[#FFFDF9] ring-1 ring-[#E2D5BE]/70">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedBatch.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
                    >
                      {/* Clean photograph frame with verified overlay header */}
                      <div className="group relative aspect-[16/9] w-full overflow-hidden bg-[#E2D5BE]">
                        <img
                          src={
                            PREVIEW_PHOTO_BY_GRADE[selectedBatch.grade] ??
                            "/images/tempe-macro.jpg"
                          }
                          alt={
                            locale === "id"
                              ? selectedBatch.productName
                              : selectedBatch.productNameEn
                          }
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1C130C]/85 via-[#1C130C]/20 to-transparent" />

                        <div className="absolute inset-x-4 bottom-3.5 flex items-end justify-between gap-3">
                          <div className="min-w-0">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#23603E] px-2.5 py-1 text-[11px] font-semibold text-white">
                              {selectedBatch.status === "fermenting" ? (
                                <Clock size={13} weight="bold" />
                              ) : (
                                <CheckCircle size={13} weight="bold" />
                              )}
                              <span>
                                {getStatusLabel(selectedBatch.status, locale)}
                              </span>
                            </div>
                            <h2 className="mt-1.5 truncate font-serif text-xl font-semibold text-[#FAF6EE] sm:text-2xl">
                              {locale === "id"
                                ? selectedBatch.productName
                                : selectedBatch.productNameEn}
                            </h2>
                          </div>
                          <span className="shrink-0 rounded-lg bg-[#1C130C]/80 px-2.5 py-1 font-mono text-xs font-medium text-[#EBB44C] ring-1 ring-[#EBB44C]/30 backdrop-blur-xs">
                            {selectedBatch.id}
                          </span>
                        </div>
                      </div>

                      {/* Passport Live Telemetry + Scannable QR */}
                      <div className="p-4 sm:p-5">
                        <div className="grid items-center gap-4 sm:grid-cols-12">
                          <div className="space-y-3 sm:col-span-8">
                            <div className="flex items-start gap-2 text-sm text-[#24170E]">
                              <MapPin
                                size={18}
                                weight="duotone"
                                className="mt-0.5 shrink-0 text-[#9A4D1A]"
                              />
                              <div>
                                <p className="font-semibold leading-snug">
                                  {selectedProducer?.name}
                                </p>
                                <p className="text-xs text-[#634B3A]">
                                  {selectedProducer?.village},{" "}
                                  {selectedProducer?.regency}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-[#FAF6EE] p-3 ring-1 ring-[#E2D5BE]/80">
                              <div>
                                <p className="text-[11px] font-medium text-[#634B3A]">
                                  {locale === "id"
                                    ? "Suhu & Durasi"
                                    : "Temp & Incubation"}
                                </p>
                                <p className="mt-0.5 inline-flex items-center gap-1 font-mono text-sm font-semibold tabular-nums text-[#24170E]">
                                  <Thermometer
                                    size={14}
                                    className="text-[#9A4D1A]"
                                  />
                                  {selectedBatch.production.fermentationTempC}
                                  °C · {selectedBatch.production.fermentationHours}
                                  h
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] font-medium text-[#634B3A]">
                                  {locale === "id"
                                    ? "Baik Sebelum (Chiller)"
                                    : "Best Before (Chilled)"}
                                </p>
                                <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-[#24170E]">
                                  {formatDate(
                                    selectedBatch.production.bestBeforeChilled,
                                    locale
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Live Fermentation Maturity Bar */}
                            <div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-medium text-[#634B3A]">
                                  {locale === "id"
                                    ? "Kematangan Miselium"
                                    : "Mycelium Maturity"}
                                </span>
                                <span className="font-mono font-semibold tabular-nums text-[#24170E]">
                                  {selectedBatch.fermentationProgressPct}%
                                </span>
                              </div>
                              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#F2EAD9]">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${selectedBatch.fermentationProgressPct}%`,
                                  }}
                                  transition={{
                                    duration: 0.65,
                                    ease: EASE_OUT_EXPO,
                                  }}
                                  className={`h-full rounded-full ${
                                    selectedBatch.status === "fermenting"
                                      ? "bg-[#D99429]"
                                      : "bg-[#23603E]"
                                  }`}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Real Scannable QR with Animated Sweep */}
                          <div className="flex flex-row items-center justify-between gap-4 rounded-2xl bg-[#FAF6EE] p-3 ring-1 ring-[#E2D5BE] sm:col-span-4 sm:flex-col sm:justify-center">
                            <div className="relative overflow-hidden rounded-xl bg-white p-2.5 ring-1 ring-[#E2D5BE]">
                              <QRCodeSVG
                                value={buildPassportUrl(
                                  selectedBatch.id,
                                  appOrigin
                                )}
                                size={92}
                                bgColor="#FFFFFF"
                                fgColor="#24170E"
                                level="M"
                              />
                              <div className="scan-sweep-line pointer-events-none absolute inset-x-1 top-1 h-0.5 rounded-full bg-[#D99429]" />
                            </div>
                            <div className="text-left sm:text-center">
                              <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#23603E]">
                                <ShieldCheck size={14} weight="fill" />
                                <span>CPPB 5/5</span>
                              </p>
                              <p className="mt-0.5 font-mono text-[10px] text-[#634B3A]">
                                {locale === "id"
                                  ? "Scan pakai kamera HP"
                                  : "Scan with phone"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#E2D5BE]/80 pt-3.5">
                          <span className="truncate font-mono text-xs text-[#634B3A]">
                            Lot: {selectedBatch.rawMaterials.soybeanLotNumber}
                          </span>
                          <Link
                            href={`/b/${encodeURIComponent(selectedBatch.id)}`}
                            className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-full bg-[#24170E] px-4 text-xs font-semibold text-[#FAF6EE] transition-colors hover:bg-[#9A4D1A]"
                          >
                            <span>
                              {locale === "id"
                                ? "Buka Paspor Lengkap"
                                : "Open Full Passport"}
                            </span>
                            <ArrowUpRight size={14} weight="bold" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
