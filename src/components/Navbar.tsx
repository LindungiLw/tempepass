"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  List,
  QrCode,
  Storefront,
  X,
} from "@phosphor-icons/react";
import { useTraceability } from "@/context/TraceabilityContext";
import { BrandMark } from "./BrandMark";
import { EASE_OUT_EXPO } from "./MotionProvider";

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale, setScannerOpen, activeProducer } =
    useTraceability();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    {
      href: "/#simulasi",
      label: locale === "id" ? "Alur Fermentasi" : "Fermentation Log",
    },
    {
      href: "/b/TMP-MLR-2611-01",
      label: locale === "id" ? "Contoh Paspor" : "Sample Passport",
    },
    {
      href: "/#stiker",
      label: locale === "id" ? "Generator QR" : "QR Builder",
    },
  ];

  return (
    <header className="no-print sticky top-0 z-40 border-b border-[#E2D5BE]/80 bg-[#FAF6EE]/92 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group inline-flex min-h-[44px] items-center gap-2.5"
        >
          <BrandMark className="h-9 w-9 transition-transform duration-200 group-hover:scale-[1.04]" />
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold leading-none tracking-tight text-[#24170E]">
              TempePass
            </span>
            <span className="mt-0.5 text-[11px] font-medium tracking-wide text-[#634B3A]">
              {locale === "id" ? "Traceability UMKM" : "MSME Traceability"}
            </span>
          </div>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 md:flex"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === pathname ||
              (item.href.startsWith("/b/") && pathname.startsWith("/b/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#9A4D1A]"
                    : "text-[#634B3A] hover:text-[#24170E]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <div
            role="group"
            aria-label="Language"
            className="inline-flex rounded-full bg-[#F2EAD9] p-1 ring-1 ring-[#E2D5BE]"
          >
            {(["id", "en"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLocale(lang)}
                className={`relative min-h-[32px] rounded-full px-3 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  locale === lang
                    ? "bg-[#24170E] text-[#FAF6EE]"
                    : "text-[#634B3A] hover:text-[#24170E]"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setScannerOpen(true)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#F2EAD9] px-4 text-sm font-semibold text-[#24170E] ring-1 ring-[#E2D5BE] transition-colors hover:bg-[#E2D5BE] active:scale-[0.98]"
          >
            <QrCode size={18} weight="duotone" className="text-[#9A4D1A]" />
            <span>{locale === "id" ? "Scan QR" : "Scan QR"}</span>
          </button>

          <Link
            href={activeProducer ? "/studio" : "/login"}
            className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full bg-[#9A4D1A] pl-4 pr-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#7D3C12] active:scale-[0.98]"
          >
            <span>
              {activeProducer
                ? locale === "id"
                  ? "Studio UMKM"
                  : "MSME Studio"
                : locale === "id"
                  ? "Masuk Pengrajin"
                  : "Producer Login"}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5">
              {activeProducer ? (
                <Storefront size={16} weight="bold" />
              ) : (
                <ArrowRight size={15} weight="bold" />
              )}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setScannerOpen(true)}
            aria-label={locale === "id" ? "Pindai QR" : "Scan QR"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#9A4D1A] text-white"
          >
            <QrCode size={20} weight="bold" />
          </button>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#F2EAD9] px-3.5 text-sm font-semibold text-[#24170E] ring-1 ring-[#E2D5BE]"
          >
            {mobileMenuOpen ? (
              <X size={18} weight="bold" />
            ) : (
              <List size={18} weight="bold" />
            )}
            <span>Menu</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            className="overflow-hidden border-t border-[#E2D5BE] bg-[#FAF6EE] md:hidden"
          >
            <div className="space-y-3 px-4 py-5">
              <div className="flex items-center justify-between rounded-2xl bg-[#F2EAD9] px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#634B3A]">
                  {locale === "id" ? "Bahasa" : "Language"}
                </span>
                <div className="inline-flex rounded-full bg-[#FAF6EE] p-1 ring-1 ring-[#E2D5BE]">
                  {(["id", "en"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLocale(lang)}
                      className={`min-h-[34px] rounded-full px-3.5 text-xs font-semibold uppercase ${
                        locale === lang
                          ? "bg-[#24170E] text-[#FAF6EE]"
                          : "text-[#634B3A]"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex min-h-[46px] items-center rounded-xl px-3 text-base font-medium text-[#24170E] hover:bg-[#F2EAD9]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <Link
                href={activeProducer ? "/studio" : "/login"}
                className="flex min-h-[48px] w-full items-center justify-between rounded-full bg-[#9A4D1A] pl-5 pr-2 text-sm font-semibold text-white"
              >
                <span>
                  {activeProducer
                    ? locale === "id"
                      ? "Buka Studio UMKM"
                      : "Open MSME Studio"
                    : locale === "id"
                      ? "Masuk Ruang Pengrajin"
                      : "Producer Login"}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <ArrowRight size={16} weight="bold" />
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
