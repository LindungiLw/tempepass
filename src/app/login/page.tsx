"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Key,
  MapPin,
  ShieldCheck,
  Storefront,
} from "@phosphor-icons/react";
import { useTraceability } from "@/context/TraceabilityContext";
import { EASE_OUT_EXPO } from "@/components/MotionProvider";

export default function ProducerLoginPage() {
  const router = useRouter();
  const {
    producers,
    activeProducer,
    loginAsProducer,
    loginDemoProducer,
    locale,
  } = useTraceability();

  const [email, setEmail] = useState("sumberrejeki@mlirip.example");
  const [pin, setPin] = useState("2026");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeProducer) {
      router.replace("/studio");
    }
  }, [activeProducer, router]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const res = loginAsProducer(email, pin);
    if (!res.ok) {
      setError(
        res.error ?? (locale === "id" ? "Gagal masuk." : "Sign in failed.")
      );
      return;
    }
    router.push("/studio");
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="grid items-stretch gap-8 lg:grid-cols-12">
        {/* Left Editorial Context Panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="flex flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[#1C130C] p-6 text-[#FAF6EE] sm:p-8 lg:col-span-5"
        >
          <div>
            <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-[#FAF6EE] sm:text-4xl">
              {locale === "id"
                ? "Ruang pencatatan harian untuk pengrajin tempe."
                : "Daily batch workspace for tempe producers."}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[#C9B9A6]">
              {locale === "id"
                ? "Masuk untuk mencatat lot kedelai, memantau status fermentasi, menerima masukan buyer, dan mencetak stiker QR kemasan."
                : "Sign in to log soybean lots, track fermentation batches, read buyer inquiries, and print package QR stickers."}
            </p>
          </div>

          <div className="my-6 overflow-hidden rounded-2xl ring-1 ring-[#3D2C1E]">
            <img
              src="/images/tempe-fermentation.jpg"
              alt="Clean Indonesian tempe fermentation workshop"
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          <div className="flex items-center gap-2.5 text-xs text-[#C9B9A6]">
            <ShieldCheck
              size={18}
              weight="duotone"
              className="shrink-0 text-[#EBB44C]"
            />
            <span>
              {locale === "id"
                ? "Pembeli tidak perlu login untuk memindai QR. Halaman ini khusus pengelola UMKM."
                : "Buyers never need to log in to scan QR codes. This portal is for MSME operators only."}
            </span>
          </div>
        </motion.div>

        {/* Right Login Form + Instant 1-Click Demo Profiles */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.06, ease: EASE_OUT_EXPO }}
          className="rounded-[1.75rem] bg-[#F2EAD9] p-2 ring-1 ring-[#E2D5BE] lg:col-span-7"
        >
          <div className="h-full rounded-[1.25rem] bg-[#FFFDF9] p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-[#24170E]">
              {locale === "id" ? "Masuk ke Studio UMKM" : "Producer Sign In"}
            </h2>
            <p className="mt-1 text-sm text-[#634B3A]">
              {locale === "id"
                ? "Pilih salah satu rumah produksi percontohan di bawah untuk langsung mencoba tanpa registrasi, atau masuk memakai email dan PIN."
                : "Pick one of the pilot workshops below for instant access, or sign in with workshop email and PIN."}
            </p>

            {/* Instant 1-Click Demo Producer Cards */}
            <div className="mt-6 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#634B3A]">
                {locale === "id"
                  ? "Akses Instan Akun Demo"
                  : "One-Click Demo Access"}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {producers.map((producer) => (
                  <button
                    key={producer.id}
                    type="button"
                    onClick={() => {
                      loginDemoProducer(producer.id);
                      router.push("/studio");
                    }}
                    className="group flex flex-col justify-between rounded-2xl bg-[#FAF6EE] p-4 text-left ring-1 ring-[#E2D5BE] transition-colors hover:bg-[#F2EAD9] hover:ring-[#9A4D1A]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9A4D1A]/12 text-[#9A4D1A]">
                          <Storefront size={18} weight="duotone" />
                        </span>
                        <span className="font-mono text-[11px] font-bold text-[#9A4D1A]">
                          {producer.code}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[#24170E]">
                        {producer.name}
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#634B3A]">
                        <MapPin size={13} />
                        <span>
                          {producer.village}, {producer.regency}
                        </span>
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#E2D5BE] pt-2.5 text-xs font-semibold text-[#9A4D1A]">
                      <span>
                        {locale === "id" ? "Masuk Instan" : "Enter Studio"}
                      </span>
                      <ArrowRight
                        size={14}
                        weight="bold"
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E2D5BE]" />
              <span className="text-xs font-medium text-[#634B3A]">
                {locale === "id" ? "atau masuk manual" : "or sign in manually"}
              </span>
              <div className="h-px flex-1 bg-[#E2D5BE]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                >
                  {locale === "id" ? "Email UMKM" : "Workshop Email"}
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  className="mt-1.5 min-h-[46px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 text-sm text-[#24170E]"
                />
              </div>

              <div>
                <label
                  htmlFor="login-pin"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                >
                  {locale === "id"
                    ? "PIN Operasional (Demo: 2026)"
                    : "Operational PIN (Demo: 2026)"}
                </label>
                <div className="relative mt-1.5">
                  <Key
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#634B3A]"
                  />
                  <input
                    id="login-pin"
                    type="password"
                    required
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setError(null);
                    }}
                    className="min-h-[46px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] pl-10 pr-3.5 font-mono text-sm text-[#24170E]"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs font-medium text-[#9A4D1A]">{error}</p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  className="group inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-[#9A4D1A] pl-6 pr-2 text-sm font-semibold text-white transition-colors hover:bg-[#7D3C12] active:scale-[0.98]"
                >
                  <span>
                    {locale === "id" ? "Masuk ke Studio" : "Sign In"}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight size={15} weight="bold" />
                  </span>
                </button>

                <Link
                  href="/b/TMP-MLR-2611-01"
                  className="text-xs font-semibold text-[#634B3A] hover:text-[#24170E]"
                >
                  {locale === "id"
                    ? "Bukan pengrajin? Lihat paspor publik"
                    : "Not a producer? View public passport"}
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
