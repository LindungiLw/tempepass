"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  ArrowUpRight,
  Certificate,
  Check,
  CheckCircle,
  Clock,
  Copy,
  Drop,
  Leaf,
  MapPin,
  Package,
  PaperPlaneRight,
  Printer,
  QrCode,
  ShieldCheck,
  Snowflake,
  Star,
  Thermometer,
  Truck,
  WarningCircle,
} from "@phosphor-icons/react";
import { useTraceability } from "@/context/TraceabilityContext";
import {
  buildPassportUrl,
  formatDate,
  formatDateTime,
  getChannelLabel,
  getStatusLabel,
} from "@/lib/format";
import { EASE_OUT_EXPO } from "@/components/MotionProvider";

const PHOTO_BY_GRADE: Record<string, string> = {
  export_vacuum: "/images/tempe-export.jpg",
  artisan_leaf: "/images/tempe-macro.jpg",
  retail_fresh: "/images/tempe-fermentation.jpg",
};

interface BatchPassportViewProps {
  batchId: string;
}

export function BatchPassportView({ batchId }: BatchPassportViewProps) {
  const {
    getBatchById,
    getProducerById,
    incrementBatchScan,
    addFeedback,
    feedback,
    batches,
    locale,
    setLocale,
    setScannerOpen,
  } = useTraceability();

  const batch = getBatchById(batchId);
  const producer = batch ? getProducerById(batch.producerId) : undefined;
  const countedRef = useRef<string | null>(null);

  const [copied, setCopied] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [organization, setOrganization] = useState("");
  const [senderRole, setSenderRole] = useState<
    "consumer" | "retail_buyer" | "export_importer"
  >("consumer");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (batch && countedRef.current !== batch.id) {
      countedRef.current = batch.id;
      incrementBatchScan(batch.id);
    }
  }, [batch, incrementBatchScan]);

  const batchFeedback = feedback.filter((item) => item.batchId === batch?.id);

  const handleCopyUrl = async () => {
    if (!batch) return;
    try {
      await navigator.clipboard.writeText(buildPassportUrl(batch.id));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch (error) {
      console.warn("Clipboard write unavailable:", error);
    }
  };

  const handleFeedbackSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!batch || !producer) return;
    if (!senderName.trim() || !message.trim()) {
      setFormError(
        locale === "id"
          ? "Nama dan pesan wajib diisi sebelum mengirim ulasan."
          : "Please enter both your name and message before submitting."
      );
      return;
    }

    addFeedback({
      batchId: batch.id,
      producerId: producer.id,
      senderName: senderName.trim(),
      senderRole,
      organization: organization.trim() || (locale === "id" ? "Konsumen" : "Individual Buyer"),
      rating,
      message: message.trim(),
    });
    setSenderName("");
    setOrganization("");
    setMessage("");
    setFormError(null);
    setSubmittedFeedback(true);
  };

  if (!batch || !producer) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="rounded-[1.75rem] bg-[#F2EAD9] p-2 ring-1 ring-[#E2D5BE]">
          <div className="rounded-[1.25rem] bg-[#FFFDF9] p-6 text-center sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EADC] text-[#9A4D1A]">
              <WarningCircle size={30} weight="duotone" />
            </div>
            <h1 className="mt-5 font-serif text-3xl font-semibold text-[#24170E]">
              {locale === "id"
                ? "Kode batch tidak ditemukan"
                : "Batch ID not found"}
            </h1>
            <p className="mt-2 font-mono text-sm font-medium text-[#9A4D1A]">
              {decodeURIComponent(batchId)}
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#634B3A]">
              {locale === "id"
                ? "Pastikan kode yang dipindai sesuai dengan stiker kemasan, atau pilih salah satu batch terverifikasi di bawah untuk melihat contoh paspor."
                : "Check that the scanned ID matches the package sticker, or choose one of the verified sample batches below."}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {batches.slice(0, 4).map((sample) => (
                <Link
                  key={sample.id}
                  href={`/b/${encodeURIComponent(sample.id)}`}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#F2EAD9] px-3.5 font-mono text-xs font-semibold text-[#24170E] transition-colors hover:bg-[#9A4D1A] hover:text-white"
                >
                  <span>{sample.id}</span>
                  <ArrowUpRight size={13} weight="bold" />
                </Link>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setScannerOpen(true)}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#9A4D1A] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#7D3C12]"
              >
                <QrCode size={18} weight="bold" />
                <span>
                  {locale === "id" ? "Pindai Ulang QR" : "Scan QR Again"}
                </span>
              </button>
              <Link
                href="/"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#F2EAD9] px-5 text-sm font-semibold text-[#24170E] hover:bg-[#E2D5BE]"
              >
                <ArrowLeft size={16} weight="bold" />
                <span>
                  {locale === "id" ? "Kembali ke Beranda" : "Back to Home"}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const cppbItems = [
    {
      passed: batch.cppbChecklist.waterBoiledAndFiltered,
      id: "Air filtrasi & direbus hingga 100°C",
      en: "Filtered water boiled to 100°C",
    },
    {
      passed: batch.cppbChecklist.utensilsSanitized,
      id: "Panci & alat stainless disanitasi",
      en: "Stainless vats & tools sanitized",
    },
    {
      passed: batch.cppbChecklist.fermentationRackClean,
      id: "Rak inkubasi bersih & berventilasi",
      en: "Clean ventilated incubation racks",
    },
    {
      passed: batch.cppbChecklist.handlerHygieneGear,
      id: "Pekerja memakai penutup kepala & celemek",
      en: "Handlers wore hygienic aprons & hairnets",
    },
    {
      passed: batch.cppbChecklist.pestFreeStorage,
      id: "Ruang simpan kering & bebas hama",
      en: "Dry, pest-controlled storage area",
    },
  ];

  const cppbPassedCount = cppbItems.filter((item) => item.passed).length;

  return (
    <main className="mx-auto max-w-5xl px-4 pb-20 pt-6 sm:px-6 sm:pt-10">
      {/* Top Action & Language Switcher Strip */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#F2EAD9] px-4 text-sm font-semibold text-[#24170E] ring-1 ring-[#E2D5BE] transition-colors hover:bg-[#E2D5BE]"
        >
          <ArrowLeft size={16} weight="bold" />
          <span>{locale === "id" ? "Beranda" : "Home"}</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Passport Language"
            className="inline-flex rounded-full bg-[#F2EAD9] p-1 ring-1 ring-[#E2D5BE]"
          >
            {(["id", "en"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLocale(lang)}
                className={`min-h-[34px] rounded-full px-3 text-xs font-semibold uppercase ${
                  locale === lang
                    ? "bg-[#24170E] text-[#FAF6EE]"
                    : "text-[#634B3A]"
                }`}
              >
                {lang === "id" ? "ID" : "EN"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopyUrl}
            className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full bg-[#FFFDF9] px-4 text-xs font-semibold text-[#24170E] ring-1 ring-[#E2D5BE] transition-colors hover:bg-[#F2EAD9]"
          >
            {copied ? (
              <Check size={15} weight="bold" className="text-[#23603E]" />
            ) : (
              <Copy size={15} />
            )}
            <span>
              {copied
                ? locale === "id"
                  ? "Tautan Disalin"
                  : "Link Copied"
                : locale === "id"
                  ? "Salin Tautan"
                  : "Copy Link"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full bg-[#24170E] px-4 text-xs font-semibold text-[#FAF6EE] transition-colors hover:bg-[#9A4D1A]"
          >
            <Printer size={15} weight="bold" />
            <span>
              {locale === "id" ? "Cetak Spec Sheet" : "Print Spec Sheet"}
            </span>
          </button>
        </div>
      </div>

      {/* Verification Header Card (Double-Bezel) */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        className="rounded-[1.75rem] bg-[#F2EAD9] p-2 ring-1 ring-[#E2D5BE]"
      >
        <div className="overflow-hidden rounded-[1.25rem] bg-[#FFFDF9]">
          <div className="grid lg:grid-cols-12">
            <div className="relative aspect-[16/10] bg-[#E2D5BE] lg:col-span-5 lg:aspect-auto">
              <img
                src={
                  PHOTO_BY_GRADE[batch.grade] ?? "/images/tempe-macro.jpg"
                }
                alt={locale === "id" ? batch.productName : batch.productNameEn}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-5 sm:p-7 lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#23603E] px-3 py-1 text-xs font-semibold text-white">
                  {batch.status === "fermenting" ? (
                    <Clock size={14} weight="bold" />
                  ) : (
                    <CheckCircle size={14} weight="bold" />
                  )}
                  <span>
                    {locale === "id"
                      ? `Terverifikasi · ${getStatusLabel(batch.status, locale)}`
                      : `Verified Batch · ${getStatusLabel(batch.status, locale)}`}
                  </span>
                </div>

                <span className="font-mono text-xs font-bold tracking-tight text-[#9A4D1A]">
                  {batch.id}
                </span>
              </div>

              <h1 className="mt-3.5 font-serif text-2xl font-semibold leading-tight tracking-tight text-[#24170E] sm:text-4xl">
                {locale === "id" ? batch.productName : batch.productNameEn}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-[#634B3A]">
                <span className="inline-flex items-center gap-1.5 font-medium text-[#24170E]">
                  <MapPin
                    size={16}
                    weight="duotone"
                    className="text-[#9A4D1A]"
                  />
                  {producer.name} ({producer.village}, {producer.regency})
                </span>
                <span className="font-mono text-xs">
                  {batch.netWeightGrams}g / pack · {batch.quantityPacks} packs
                </span>
              </div>

              {/* Key Date & Provenance Strip */}
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#E2D5BE] pt-5 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#634B3A]">
                    {locale === "id" ? "Tanggal Produksi" : "Production Date"}
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-[#24170E]">
                    {formatDate(batch.production.productionDate, locale)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#634B3A]">
                    {locale === "id" ? "Suhu Ruang" : "Room Temp Expiry"}
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-[#24170E]">
                    {formatDate(batch.production.bestBeforeRoom, locale)}
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#634B3A]">
                    {locale === "id"
                      ? "Simpan Dingin (4°C)"
                      : "Chilled Best Before"}
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-[#23603E]">
                    {formatDate(batch.production.bestBeforeChilled, locale)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main Two-Column Details */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left: 5-Stage Production Timeline + Raw Materials */}
        <div className="space-y-8 lg:col-span-7">
          {/* Raw Materials Ledger */}
          <section className="print-break-avoid rounded-[1.5rem] bg-[#FFFDF9] p-5 ring-1 ring-[#E2D5BE] sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-[#E2D5BE] pb-4">
              <div className="flex items-center gap-2.5">
                <Leaf size={22} weight="duotone" className="text-[#9A4D1A]" />
                <h2 className="font-serif text-xl font-semibold text-[#24170E]">
                  {locale === "id"
                    ? "Asal Bahan Baku & Kultur Ragi"
                    : "Raw Materials & Starter Culture"}
                </h2>
              </div>
              {batch.rawMaterials.nonGmoVerified && (
                <span className="rounded-md bg-[#E7F2EC] px-2.5 py-1 font-mono text-[11px] font-bold text-[#23603E]">
                  NON-GMO
                </span>
              )}
            </div>

            <dl className="mt-4 divide-y divide-[#E2D5BE]/70 text-sm">
              <div className="grid gap-1 py-3 sm:grid-cols-12">
                <dt className="font-medium text-[#634B3A] sm:col-span-4">
                  {locale === "id" ? "Asal Kedelai" : "Soybean Origin"}
                </dt>
                <dd className="font-medium text-[#24170E] sm:col-span-8">
                  {locale === "id"
                    ? batch.rawMaterials.soybeanOrigin
                    : batch.rawMaterials.soybeanOriginEn}
                  <span className="mt-0.5 block font-mono text-xs text-[#634B3A]">
                    {batch.rawMaterials.soybeanVariety} · Lot{" "}
                    {batch.rawMaterials.soybeanLotNumber}
                  </span>
                </dd>
              </div>

              <div className="grid gap-1 py-3 sm:grid-cols-12">
                <dt className="font-medium text-[#634B3A] sm:col-span-4">
                  {locale === "id" ? "Ragi / Inokulum" : "Starter Culture"}
                </dt>
                <dd className="font-medium text-[#24170E] sm:col-span-8">
                  {batch.rawMaterials.ragiBrandAndStrain}
                  <span className="mt-0.5 block font-mono text-xs text-[#634B3A]">
                    Lot {batch.rawMaterials.ragiLotNumber}
                  </span>
                </dd>
              </div>

              <div className="grid gap-1 py-3 sm:grid-cols-12">
                <dt className="font-medium text-[#634B3A] sm:col-span-4">
                  {locale === "id" ? "Sumber Air" : "Water Treatment"}
                </dt>
                <dd className="text-[#24170E] sm:col-span-8">
                  {locale === "id"
                    ? batch.rawMaterials.waterSource
                    : batch.rawMaterials.waterSourceEn}
                </dd>
              </div>

              <div className="grid gap-1 py-3 sm:grid-cols-12">
                <dt className="font-medium text-[#634B3A] sm:col-span-4">
                  {locale === "id" ? "Kemasan" : "Packaging"}
                </dt>
                <dd className="text-[#24170E] sm:col-span-8">
                  {locale === "id"
                    ? batch.production.packagingType
                    : batch.production.packagingTypeEn}
                </dd>
              </div>

              <div className="grid gap-1 pt-3 sm:grid-cols-12">
                <dt className="font-medium text-[#634B3A] sm:col-span-4">
                  {locale === "id" ? "Jalur Distribusi" : "Distribution"}
                </dt>
                <dd className="text-[#24170E] sm:col-span-8">
                  <span className="font-semibold text-[#9A4D1A]">
                    {getChannelLabel(batch.distribution.channel, locale)}
                  </span>
                  <span className="mt-0.5 block text-xs text-[#634B3A]">
                    {locale === "id"
                      ? batch.distribution.destination
                      : batch.distribution.destinationEn}
                  </span>
                </dd>
              </div>
            </dl>
          </section>

          {/* 5-Stage Production Timeline */}
          <section className="print-break-avoid rounded-[1.5rem] bg-[#FFFDF9] p-5 ring-1 ring-[#E2D5BE] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2D5BE] pb-4">
              <h2 className="font-serif text-xl font-semibold text-[#24170E]">
                {locale === "id"
                  ? "Riwayat 5 Tahap Produksi"
                  : "5-Stage Production Timeline"}
              </h2>
              <span className="font-mono text-xs text-[#634B3A]">
                {batch.production.fermentationHours}h ·{" "}
                {batch.production.fermentationTempC}°C ·{" "}
                {batch.production.fermentationHumidityPct}% RH
              </span>
            </div>

            <ol className="mt-5 space-y-5">
              {batch.stages.map((stage, idx) => (
                <li key={stage.key} className="relative flex gap-4">
                  {idx < batch.stages.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={`absolute left-[15px] top-9 h-[calc(100%-16px)] w-0.5 ${
                        stage.completed ? "bg-[#23603E]/35" : "bg-[#E2D5BE]"
                      }`}
                    />
                  )}

                  <div
                    className={`relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                      stage.completed
                        ? "bg-[#23603E] text-white"
                        : "bg-[#F7EADC] text-[#9A4D1A] ring-1 ring-[#9A4D1A]/40"
                    }`}
                  >
                    {stage.completed ? (
                      <Check size={14} weight="bold" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pb-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[#24170E]">
                        {locale === "id" ? stage.titleId : stage.titleEn}
                      </h3>
                      <span className="font-mono text-xs tabular-nums text-[#634B3A]">
                        {formatDateTime(stage.timestamp, locale)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm leading-relaxed text-[#634B3A]">
                      {locale === "id" ? stage.noteId : stage.noteEn}
                    </p>

                    {(stage.temperatureC !== null ||
                      stage.humidityPct !== null) && (
                      <div className="mt-2 flex flex-wrap gap-3 font-mono text-xs text-[#24170E]">
                        {stage.temperatureC !== null && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF6EE] px-2 py-0.5 ring-1 ring-[#E2D5BE]">
                            <Thermometer size={13} className="text-[#9A4D1A]" />
                            {stage.temperatureC}°C
                          </span>
                        )}
                        {stage.humidityPct !== null && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF6EE] px-2 py-0.5 ring-1 ring-[#E2D5BE]">
                            <Drop size={13} className="text-[#9A4D1A]" />
                            {stage.humidityPct}% RH
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Right: CPPB Hygiene, Producer Identity, Handling Guide & QR */}
        <div className="space-y-6 lg:col-span-5">
          {/* CPPB Food Safety Checklist */}
          <section className="print-break-avoid rounded-[1.5rem] bg-[#FFFDF9] p-5 ring-1 ring-[#E2D5BE] sm:p-6">
            <div className="flex items-center justify-between gap-2 border-b border-[#E2D5BE] pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={22}
                  weight="duotone"
                  className="text-[#23603E]"
                />
                <h2 className="font-serif text-xl font-semibold text-[#24170E]">
                  {locale === "id"
                    ? "Ceklis Sanitasi CPPB"
                    : "CPPB Hygiene Record"}
                </h2>
              </div>
              <span className="font-mono text-xs font-bold text-[#23603E]">
                {cppbPassedCount}/{cppbItems.length}
              </span>
            </div>

            <ul className="mt-4 space-y-2.5">
              {cppbItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-2.5 text-sm text-[#24170E]"
                >
                  <CheckCircle
                    size={18}
                    weight="fill"
                    className={`mt-0.5 shrink-0 ${
                      item.passed ? "text-[#23603E]" : "text-[#E2D5BE]"
                    }`}
                  />
                  <span>{locale === "id" ? item.id : item.en}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-[#E2D5BE] pt-3.5 text-xs text-[#634B3A]">
              <p>
                {locale === "id" ? "Pemeriksa:" : "Checked by:"}{" "}
                <span className="font-semibold text-[#24170E]">
                  {batch.cppbChecklist.inspectorName}
                </span>{" "}
                ·{" "}
                <span className="font-mono">
                  {formatDateTime(batch.cppbChecklist.checkedAt, locale)}
                </span>
              </p>
            </div>
          </section>

          {/* Producer & Legal Registration */}
          <section className="print-break-avoid rounded-[1.5rem] bg-[#F2EAD9]/75 p-5 ring-1 ring-[#E2D5BE] sm:p-6">
            <div className="flex items-center gap-2">
              <Certificate
                size={22}
                weight="duotone"
                className="text-[#9A4D1A]"
              />
              <h2 className="font-serif text-xl font-semibold text-[#24170E]">
                {producer.name}
              </h2>
            </div>
            <p className="mt-1 text-xs font-medium text-[#634B3A]">
              {producer.village}, {producer.district}, {producer.regency},{" "}
              {producer.province} ·{" "}
              {locale === "id"
                ? `Berdiri ${producer.foundedYear}`
                : `Est. ${producer.foundedYear}`}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#24170E]">
              {locale === "id" ? producer.storyId : producer.storyEn}
            </p>

            <div className="mt-4 space-y-2 rounded-xl bg-[#FFFDF9] p-3.5 font-mono text-xs ring-1 ring-[#E2D5BE]">
              <div className="flex justify-between gap-2">
                <span className="text-[#634B3A]">P-IRT</span>
                <span className="font-semibold text-[#24170E]">
                  {producer.pirtNumber}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#634B3A]">Halal ID</span>
                <span className="font-semibold text-[#24170E]">
                  {producer.halalNumber}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#634B3A]">CPPB</span>
                <span className="font-semibold text-[#23603E]">
                  {locale === "id"
                    ? producer.cppbStatus
                    : producer.cppbStatusEn}
                </span>
              </div>
            </div>
          </section>

          {/* Storage & Handling Guide */}
          <section className="print-break-avoid rounded-[1.5rem] bg-[#1C130C] p-5 text-[#FAF6EE] sm:p-6">
            <h2 className="font-serif text-xl font-semibold text-[#FAF6EE]">
              {locale === "id"
                ? "Panduan Penyimpanan & Kesegaran"
                : "Storage & Freshness Guide"}
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Package
                  size={18}
                  className="mt-0.5 shrink-0 text-[#EBB44C]"
                />
                <p className="text-[#C9B9A6]">
                  <strong className="text-[#FAF6EE]">
                    {locale === "id" ? "Suhu Ruang (24-28°C):" : "Room Temp:"}
                  </strong>{" "}
                  {locale === "id"
                    ? "Konsumsi maksimal 2-3 hari sejak tanggal produksi agar fermentasi tidak berlebih."
                    : "Consume within 2-3 days of production before over-fermentation occurs."}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Snowflake
                  size={18}
                  className="mt-0.5 shrink-0 text-[#EBB44C]"
                />
                <p className="text-[#C9B9A6]">
                  <strong className="text-[#FAF6EE]">
                    {locale === "id"
                      ? "Chiller (4°C) / Freezer (-18°C):"
                      : "Chilled (4°C) / Frozen (-18°C):"}
                  </strong>{" "}
                  {locale === "id"
                    ? "Tahan 10-14 hari di chiller vacuum atau hingga 6 bulan bila dibekukan rapat."
                    : "Stays fresh 10-14 days vacuum-chilled, or up to 6 months stored frozen."}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Truck
                  size={18}
                  className="mt-0.5 shrink-0 text-[#EBB44C]"
                />
                <p className="text-[#C9B9A6]">
                  <strong className="text-[#FAF6EE]">
                    {locale === "id" ? "Ciri Mutu Prima:" : "Quality Sign:"}
                  </strong>{" "}
                  {locale === "id"
                    ? "Miselium putih bersih dan padat mengikat kedelai, aroma kacang segar, tidak berlendir."
                    : "Dense white mycelium binding soybeans firmly, clean nutty aroma, no slimy texture."}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#3D2C1E] pt-4">
              <div className="text-xs text-[#C9B9A6]">
                <p className="font-mono text-[#EBB44C]">{batch.id}</p>
                <p className="mt-0.5">
                  {locale === "id"
                    ? `Dipindai ${batch.scanCount} kali`
                    : `Scanned ${batch.scanCount} times`}
                </p>
              </div>
              <div className="rounded-xl bg-white p-1.5">
                <QRCodeSVG
                  value={buildPassportUrl(batch.id)}
                  size={68}
                  bgColor="#FFFFFF"
                  fgColor="#24170E"
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Buyer Feedback & Export Inquiry Section (Hidden on print) */}
      <section className="no-print mt-10 rounded-[1.75rem] bg-[#F2EAD9] p-2 ring-1 ring-[#E2D5BE]">
        <div className="grid gap-8 rounded-[1.25rem] bg-[#FFFDF9] p-6 sm:p-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-2xl font-semibold text-[#24170E]">
              {locale === "id"
                ? "Kirim Masukan atau Permintaan Sampel"
                : "Send Quality Feedback or Buyer Inquiry"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#634B3A]">
              {locale === "id"
                ? "Pesan yang dikirim di sini langsung masuk ke kotak masuk Studio UMKM agar pengrajin dapat meningkatkan mutu batch berikutnya."
                : "Messages submitted here route directly to the producer's studio inbox to support continuous quality control and wholesale orders."}
            </p>

            {batchFeedback.length > 0 && (
              <div className="mt-6 space-y-3 border-t border-[#E2D5BE] pt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#634B3A]">
                  {locale === "id"
                    ? `Catatan Pembeli (${batchFeedback.length})`
                    : `Recent Buyer Notes (${batchFeedback.length})`}
                </p>
                {batchFeedback.slice(0, 2).map((fb) => (
                  <div
                    key={fb.id}
                    className="rounded-xl bg-[#FAF6EE] p-3.5 ring-1 ring-[#E2D5BE]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[#24170E]">
                        {fb.senderName}{" "}
                        <span className="font-normal text-[#634B3A]">
                          ({fb.organization})
                        </span>
                      </p>
                      <span className="inline-flex items-center gap-0.5 font-mono text-xs font-bold text-[#9A4D1A]">
                        <Star size={12} weight="fill" />
                        {fb.rating}/5
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#634B3A]">
                      {fb.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            {submittedFeedback ? (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-[#E7F2EC] p-6 text-center ring-1 ring-[#23603E]/25">
                <CheckCircle
                  size={36}
                  weight="fill"
                  className="text-[#23603E]"
                />
                <h3 className="mt-3 font-serif text-xl font-semibold text-[#24170E]">
                  {locale === "id"
                    ? "Pesan terkirim ke rumah produksi"
                    : "Message sent to the workshop"}
                </h3>
                <p className="mt-1.5 max-w-sm text-sm text-[#634B3A]">
                  {locale === "id"
                    ? "Catatanmu kini tercatat di kotak masuk Studio UMKM untuk batch ini."
                    : "Your note is now logged in the MSME Studio inbox for this batch."}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedFeedback(false)}
                  className="mt-5 min-h-[42px] rounded-full bg-[#24170E] px-5 text-xs font-semibold text-[#FAF6EE]"
                >
                  {locale === "id" ? "Kirim Pesan Lain" : "Send Another Note"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="fb-name"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                    >
                      {locale === "id" ? "Nama Anda" : "Your Name"}
                    </label>
                    <input
                      id="fb-name"
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder={
                        locale === "id" ? "Rina Pratama" : "Alex Tanaka"
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 text-sm text-[#24170E]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="fb-org"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                    >
                      {locale === "id"
                        ? "Perusahaan / Toko (Opsional)"
                        : "Company / Store (Optional)"}
                    </label>
                    <input
                      id="fb-org"
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder={
                        locale === "id"
                          ? "Toko Pangan / Pembeli Rumah"
                          : "Import QA / Grocer"
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 text-sm text-[#24170E]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="fb-role"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                    >
                      {locale === "id" ? "Peran Pembeli" : "Buyer Role"}
                    </label>
                    <select
                      id="fb-role"
                      value={senderRole}
                      onChange={(e) =>
                        setSenderRole(
                          e.target.value as
                            | "consumer"
                            | "retail_buyer"
                            | "export_importer"
                        )
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 text-sm text-[#24170E]"
                    >
                      <option value="consumer">
                        {locale === "id" ? "Konsumen Akhir" : "Consumer"}
                      </option>
                      <option value="retail_buyer">
                        {locale === "id"
                          ? "Buyer Ritel / Restoran"
                          : "Retail / Restaurant Buyer"}
                      </option>
                      <option value="export_importer">
                        {locale === "id"
                          ? "Importir / Buyer Ekspor"
                          : "International Importer"}
                      </option>
                    </select>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]">
                      {locale === "id" ? "Penilaian Mutu" : "Quality Rating"}
                    </span>
                    <div className="mt-1.5 flex min-h-[44px] items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          aria-label={`${star} stars`}
                          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                            star <= rating
                              ? "bg-[#9A4D1A] text-white"
                              : "bg-[#FAF6EE] text-[#634B3A] ring-1 ring-[#E2D5BE]"
                          }`}
                        >
                          <Star size={16} weight="fill" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="fb-msg"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                  >
                    {locale === "id"
                      ? "Catatan Mutu / Permintaan Sampel"
                      : "Quality Note / Wholesale Inquiry"}
                  </label>
                  <textarea
                    id="fb-msg"
                    rows={3}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setFormError(null);
                    }}
                    placeholder={
                      locale === "id"
                        ? "Tulis kondisi tempe saat diterima atau permintaan sampel rutin..."
                        : "Share tempe condition on arrival or wholesale sample inquiries..."
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] p-3.5 text-sm text-[#24170E]"
                  />
                </div>

                {formError && (
                  <p className="text-xs font-medium text-[#9A4D1A]">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-[#9A4D1A] pl-5 pr-2 text-sm font-semibold text-white transition-colors hover:bg-[#7D3C12] active:scale-[0.98]"
                >
                  <span>
                    {locale === "id" ? "Kirim ke Pengrajin" : "Send to Producer"}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                    <PaperPlaneRight size={15} weight="bold" />
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
