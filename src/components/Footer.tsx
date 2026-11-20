"use client";

import React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/TraceabilityContext";
import { BrandMark } from "./BrandMark";

export function Footer() {
  const { locale, setScannerOpen, activeProducer } = useTraceability();

  return (
    <footer className="no-print border-t border-[#E2D5BE] bg-[#F2EAD9]/65 text-[#24170E]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <BrandMark className="h-9 w-9" />
              <span className="font-serif text-xl font-bold tracking-tight text-[#24170E]">
                TempePass
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#634B3A]">
              {locale === "id"
                ? "Sistem traceability berbasis web untuk pencatatan batch UMKM tempe Indonesia. Membantu transparansi bahan baku, fermentasi, dan kesiapan dokumen menuju ritel modern serta pasar ekspor."
                : "Web-based batch traceability platform for Indonesian tempe MSMEs. Built to digitize soybean provenance, fermentation timing, and CPPB hygiene documentation for wider retail and export access."}
            </p>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-[#634B3A]">
              {locale === "id"
                ? "Catatan kepatuhan: TempePass mendukung dokumentasi rantai pasok dan tidak menggantikan inspeksi resmi BPOM, izin edar, maupun sertifikasi Halal."
                : "Compliance notice: TempePass supports traceability documentation and does not replace official food safety inspections, export clearance, or Halal certification."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-6 md:justify-items-end">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#634B3A]">
                {locale === "id" ? "Navigasi Sistem" : "Platform"}
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm font-medium">
                <li>
                  <button
                    type="button"
                    onClick={() => setScannerOpen(true)}
                    className="text-[#24170E] transition-colors hover:text-[#9A4D1A]"
                  >
                    {locale === "id" ? "Pindai QR Kemasan" : "Scan Package QR"}
                  </button>
                </li>
                <li>
                  <Link
                    href="/b/TMP-MLR-2611-01"
                    className="text-[#24170E] transition-colors hover:text-[#9A4D1A]"
                  >
                    {locale === "id"
                      ? "Paspor Batch Export"
                      : "Export Batch Passport"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/b/TMP-MLR-2611-02"
                    className="text-[#24170E] transition-colors hover:text-[#9A4D1A]"
                  >
                    {locale === "id"
                      ? "Paspor Daun Pisang"
                      : "Banana-Leaf Passport"}
                  </Link>
                </li>
                <li>
                  <Link
                    href={activeProducer ? "/studio" : "/login"}
                    className="text-[#24170E] transition-colors hover:text-[#9A4D1A]"
                  >
                    {activeProducer
                      ? locale === "id"
                        ? "Studio Pengrajin"
                        : "Producer Studio"
                      : locale === "id"
                        ? "Masuk Pengrajin"
                        : "Producer Login"}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#634B3A]">
                {locale === "id" ? "Studi Kasus & Acuan" : "Field Grounding"}
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm text-[#634B3A]">
                <li>Desa Mlirip, Mojokerto</li>
                <li>CPPB-IRT (Wulandari et al., 2024)</li>
                <li>Benchmark: Aruna &amp; Wholechain</li>
                <li className="font-mono text-xs text-[#24170E]">
                  hello@tempepass.example
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-[#E2D5BE] pt-6 text-xs text-[#634B3A] sm:flex-row sm:items-center">
          <p>
            TempePass Prototype, Indonesian Tempe MSME Digital Business Project.
          </p>
          <p className="font-mono">
            {locale === "id"
              ? "Data demo sintetik berdasarkan profil sentra Desa Mlirip & Grobogan."
              : "Synthetic pilot data modeled on Mlirip & Grobogan tempe clusters."}
          </p>
        </div>
      </div>
    </footer>
  );
}
