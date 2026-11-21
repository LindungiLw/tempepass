"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle,
  DownloadSimple,
  Printer,
} from "@phosphor-icons/react";
import { useTraceability } from "@/context/TraceabilityContext";
import { buildPassportUrl, formatDate } from "@/lib/format";

interface PrintLabelViewProps {
  batchId: string;
}

export function PrintLabelView({ batchId }: PrintLabelViewProps) {
  const { getBatchById, getProducerById, locale, appOrigin } =
    useTraceability();
  const [layoutMode, setLayoutMode] = useState<"thermal" | "a4">("a4");
  const svgContainerRef = useRef<HTMLDivElement | null>(null);

  const batch = getBatchById(batchId);
  const producer = batch ? getProducerById(batch.producerId) : undefined;

  if (!batch || !producer) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-serif text-2xl font-semibold text-[#24170E]">
          {locale === "id"
            ? "Batch tidak ditemukan untuk dicetak"
            : "Batch not found for printing"}
        </h1>
        <Link
          href="/studio"
          className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#24170E] px-5 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} />
          <span>
            {locale === "id" ? "Kembali ke Studio" : "Back to Studio"}
          </span>
        </Link>
      </main>
    );
  }

  const passportUrl = buildPassportUrl(batch.id, appOrigin);
  const productLabel =
    locale === "id" ? batch.productName : batch.productNameEn;

  const handleDownloadSvg = () => {
    const svg = svgContainerRef.current?.querySelector("svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${batch.id}-qr.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStickerCard = (key: number) => (
    <div
      key={key}
      className="print-break-avoid rounded-xl border border-dashed border-[#634B3A]/50 bg-white p-3.5 text-[#24170E]"
    >
      <div className="flex items-start justify-between gap-2 border-b border-[#24170E]/15 pb-2">
        <div className="min-w-0">
          <p className="truncate font-serif text-sm font-bold leading-tight">
            {producer.name}
          </p>
          <p className="truncate text-[10px] text-[#634B3A]">
            {producer.village}, {producer.regency}
          </p>
        </div>
        <span className="shrink-0 rounded bg-[#24170E] px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
          TEMPEPASS
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-3">
        <div className="shrink-0 rounded-lg border border-[#E2D5BE] bg-white p-1">
          <QRCodeSVG
            value={passportUrl}
            size={74}
            bgColor="#FFFFFF"
            fgColor="#24170E"
            level="M"
          />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="font-mono text-[11px] font-bold text-[#9A4D1A]">
            {batch.id}
          </p>
          <p className="line-clamp-2 text-[11px] font-semibold leading-snug">
            {productLabel}
          </p>
          <p className="font-mono text-[10px] text-[#634B3A]">
            Prod: {formatDate(batch.production.productionDate, locale)}
          </p>
          <p className="font-mono text-[10px] font-semibold text-[#23603E]">
            Chilled: {formatDate(batch.production.bestBeforeChilled, locale)}
          </p>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-[#24170E]/15 pt-1.5 font-mono text-[9px] text-[#634B3A]">
        <span className="inline-flex items-center gap-1 font-semibold text-[#23603E]">
          <CheckCircle size={11} weight="fill" />
          CPPB Verified
        </span>
        <span>SCAN FOR ORIGIN · EN/ID</span>
      </div>
    </div>
  );

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
      <div ref={svgContainerRef} className="hidden" aria-hidden="true">
        <QRCodeSVG
          value={passportUrl}
          size={512}
          bgColor="#FFFFFF"
          fgColor="#24170E"
          level="H"
        />
      </div>

      <div className="no-print mb-8 flex flex-col justify-between gap-4 rounded-[1.5rem] bg-[#F2EAD9] p-5 ring-1 ring-[#E2D5BE] sm:flex-row sm:items-center">
        <div>
          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#634B3A] hover:text-[#24170E]"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>
              {locale === "id"
                ? "Kembali ke Studio UMKM"
                : "Back to MSME Studio"}
            </span>
          </Link>
          <h1 className="mt-1 font-serif text-2xl font-semibold text-[#24170E]">
            {locale === "id" ? "Cetak Stiker QR" : "Print QR Stickers"} ·{" "}
            <span className="font-mono">{batch.id}</span>
          </h1>
          <p className="text-xs text-[#634B3A]">
            {productLabel} ({batch.quantityPacks}{" "}
            {locale === "id" ? "pack" : "packs"}) ·{" "}
            {locale === "id" ? "Tujuan QR:" : "QR Destination:"}{" "}
            <span className="font-mono">{passportUrl}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-xl bg-[#FAF6EE] p-1 ring-1 ring-[#E2D5BE]">
            <button
              type="button"
              onClick={() => setLayoutMode("a4")}
              className={`min-h-[38px] rounded-lg px-3 text-xs font-semibold ${
                layoutMode === "a4"
                  ? "bg-[#24170E] text-white"
                  : "text-[#634B3A]"
              }`}
            >
              {locale === "id" ? "Lembar A4 (9 Stiker)" : "A4 Sheet (9 Labels)"}
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("thermal")}
              className={`min-h-[38px] rounded-lg px-3 text-xs font-semibold ${
                layoutMode === "thermal"
                  ? "bg-[#24170E] text-white"
                  : "text-[#634B3A]"
              }`}
            >
              {locale === "id" ? "Thermal 1 Stiker" : "Single Thermal"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadSvg}
            className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full bg-[#FFFDF9] px-4 text-xs font-semibold text-[#24170E] ring-1 ring-[#E2D5BE] hover:bg-[#FAF6EE]"
          >
            <DownloadSimple size={16} weight="bold" />
            <span>{locale === "id" ? "Unduh SVG" : "Download SVG"}</span>
          </button>

          <Link
            href={`/b/${encodeURIComponent(batch.id)}`}
            className="inline-flex min-h-[42px] items-center gap-1 rounded-full bg-[#FFFDF9] px-4 text-xs font-semibold text-[#24170E] ring-1 ring-[#E2D5BE]"
          >
            <span>{locale === "id" ? "Tes Paspor" : "Test Passport"}</span>
            <ArrowUpRight size={14} weight="bold" />
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#9A4D1A] px-5 text-xs font-semibold text-white hover:bg-[#7D3C12]"
          >
            <Printer size={16} weight="bold" />
            <span>{locale === "id" ? "Cetak Sekarang" : "Print Now"}</span>
          </button>
        </div>
      </div>

      {layoutMode === "thermal" ? (
        <div className="mx-auto max-w-xs">{renderStickerCard(0)}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, idx) => renderStickerCard(idx))}
        </div>
      )}
    </main>
  );
}
