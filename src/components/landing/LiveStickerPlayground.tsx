"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { ArrowRight, CheckCircle, Printer } from "@phosphor-icons/react";
import { useTraceability } from "@/context/TraceabilityContext";
import { buildPassportUrl } from "@/lib/format";

export function LiveStickerPlayground() {
  const { locale, appOrigin, activeProducer } = useTraceability();

  const [msmeName, setMsmeName] = useState("Rumah Tempe Sumber Rejeki");
  const [originCity, setOriginCity] = useState("Mlirip Village, Mojokerto");
  const [soybeanType, setSoybeanType] = useState("Grobogan Local Non-GMO Soybeans");
  const [packWeight, setPackWeight] = useState("250g Vacuum");

  const previewCode = useMemo(() => {
    const letters = msmeName
      .replace(/[^A-Za-z]/g, "")
      .toUpperCase()
      .slice(0, 3)
      .padEnd(3, "T");
    return `TMP-${letters}-2611-01`;
  }, [msmeName]);

  const packFormatLabels: Record<string, { en: string; id: string }> = {
    "250g Vacuum": { en: "250g Vacuum Export", id: "250g Vacuum Ekspor" },
    "200g Banana Leaf": { en: "200g Banana Leaf", id: "200g Daun Pisang" },
    "400g Frozen Block": { en: "400g Frozen Block", id: "400g Blok Beku" },
  };

  return (
    <section id="stiker" className="bg-[#FAF6EE] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-[#F2EAD9] p-2.5 ring-1 ring-[#E2D5BE]">
          <div className="grid items-center gap-8 rounded-[1.5rem] bg-[#FFFDF9] p-6 sm:p-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <h2 className="font-serif text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#24170E] sm:text-4xl">
                {locale === "id"
                  ? "Uji cetak stiker QR untuk kemasan tempe usahamu."
                  : "Preview a live QR sticker for your tempe packaging."}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#634B3A] sm:text-base">
                {locale === "id"
                  ? "Ketik nama rumah produksi dan asal kedelai di bawah. Label kemasan otomatis menyusun kode batch serta QR siap tempel."
                  : "Type a workshop name and soybean origin below. The packaging label updates live with a scannable batch QR sticker."}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="pg-msme"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                  >
                    {locale === "id" ? "Nama UMKM Tempe" : "MSME Workshop Name"}
                  </label>
                  <input
                    id="pg-msme"
                    type="text"
                    value={msmeName}
                    onChange={(e) => setMsmeName(e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 text-sm text-[#24170E] focus:border-[#9A4D1A]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pg-origin"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                  >
                    {locale === "id" ? "Lokasi Sentra" : "Origin Location"}
                  </label>
                  <input
                    id="pg-origin"
                    type="text"
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 text-sm text-[#24170E] focus:border-[#9A4D1A]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pg-pack"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                  >
                    {locale === "id" ? "Format Kemasan" : "Packaging Format"}
                  </label>
                  <select
                    id="pg-pack"
                    value={packWeight}
                    onChange={(e) => setPackWeight(e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 text-sm text-[#24170E] focus:border-[#9A4D1A]"
                  >
                    {Object.entries(packFormatLabels).map(([val, label]) => (
                      <option key={val} value={val}>
                        {label[locale]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="pg-soy"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                  >
                    {locale === "id" ? "Varietas Kedelai" : "Soybean Variety"}
                  </label>
                  <input
                    id="pg-soy"
                    type="text"
                    value={soybeanType}
                    onChange={(e) => setSoybeanType(e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 text-sm text-[#24170E] focus:border-[#9A4D1A]"
                  />
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href={activeProducer ? "/studio" : "/login"}
                  className="group inline-flex min-h-[50px] items-center gap-3 rounded-full bg-[#9A4D1A] pl-5 pr-2 text-sm font-semibold text-white transition-colors hover:bg-[#7D3C12] active:scale-[0.98]"
                >
                  <span>
                    {locale === "id"
                      ? "Buat & Simpan Batch Asli"
                      : "Create & Save Real Batch"}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5">
                    <ArrowRight size={15} weight="bold" />
                  </span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-[1.5rem] bg-[#1C130C] p-6 sm:p-8">
                <div className="flex items-center justify-between text-xs text-[#C9B9A6]">
                  <span className="font-mono uppercase tracking-wider">
                    {locale === "id"
                      ? "Pratinjau Stiker 65 x 90 mm"
                      : "65 x 90 mm Sticker Preview"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[#EBB44C]">
                    <Printer size={15} />
                    <span>Thermal / A4</span>
                  </span>
                </div>

                <div className="mx-auto mt-5 max-w-sm rounded-2xl border-2 border-dashed border-[#C7B396] bg-[#FAF6EE] p-5 text-[#24170E] shadow-xl">
                  <div className="flex items-start justify-between gap-3 border-b border-[#24170E]/15 pb-3">
                    <div className="min-w-0">
                      <p className="truncate font-serif text-lg font-bold leading-tight text-[#24170E]">
                        {msmeName || "Tempe MSME Workshop"}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[#634B3A]">
                        {originCity || "Indonesia"}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md bg-[#24170E] px-2 py-1 font-mono text-[10px] font-bold text-[#FAF6EE]">
                      TEMPEPASS
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="shrink-0 rounded-xl bg-white p-2 ring-1 ring-[#24170E]/15">
                      <QRCodeSVG
                        value={buildPassportUrl("TMP-MLR-2611-01", appOrigin)}
                        size={96}
                        bgColor="#FFFFFF"
                        fgColor="#24170E"
                        level="M"
                      />
                    </div>
                    <div className="min-w-0 space-y-1.5">
                      <p className="font-mono text-xs font-bold tracking-tight text-[#9A4D1A]">
                        {previewCode}
                      </p>
                      <p className="text-xs font-semibold leading-snug text-[#24170E]">
                        {soybeanType || "Non-GMO Soybeans"}
                      </p>
                      <p className="font-mono text-[11px] text-[#634B3A]">
                        {packWeight} ·{" "}
                        {locale === "id" ? "36h Inkubasi" : "36h Incubation"}
                      </p>
                      <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#23603E]">
                        <CheckCircle size={13} weight="fill" />
                        <span>CPPB Verified</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#24170E]/15 pt-2.5 font-mono text-[10px] text-[#634B3A]">
                    <span>SCAN FOR ORIGIN &amp; EXPIRY</span>
                    <span>EN / ID</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
