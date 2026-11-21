"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowRight,
  ArrowUpRight,
  ChatCircleText,
  Check,
  CheckCircle,
  Clock,
  MagnifyingGlass,
  Plus,
  Printer,
  ShieldCheck,
  SignOut,
  Star,
  Storefront,
  UserCircle,
} from "@phosphor-icons/react";
import { useTraceability } from "@/context/TraceabilityContext";
import {
  buildPassportUrl,
  formatDate,
  getChannelLabel,
  getStatusLabel,
} from "@/lib/format";
import { BatchStatus, Locale, TempeBatch } from "@/types/traceability";
import { EASE_OUT_EXPO, SPRING_TACTILE } from "@/components/MotionProvider";
import { NewBatchModal } from "./NewBatchModal";

const NEXT_STATUS: Partial<Record<BatchStatus, BatchStatus>> = {
  fermenting: "quality_check",
  quality_check: "packaged",
  packaged: "dispatched",
};

const NEXT_STATUS_CTA: Partial<Record<BatchStatus, Record<Locale, string>>> = {
  fermenting: { en: "Pass Incubation", id: "Lolos Inkubasi" },
  quality_check: { en: "Seal & Activate QR", id: "Segel & Siap QR" },
  packaged: { en: "Mark Dispatched", id: "Tandai Terkirim" },
};

export function StudioWorkspace() {
  const router = useRouter();
  const {
    activeProducer,
    isHydrated,
    batches,
    feedback,
    locale,
    appOrigin,
    logoutProducer,
    updateBatchStatus,
    updateProducerProfile,
  } = useTraceability();

  const [activeTab, setActiveTab] = useState<"batches" | "inbox" | "profile">(
    "batches"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BatchStatus | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [justCreated, setJustCreated] = useState<TempeBatch | null>(null);

  const [profileName, setProfileName] = useState("");
  const [profileOwner, setProfileOwner] = useState("");
  const [profilePirt, setProfilePirt] = useState("");
  const [profileHalal, setProfileHalal] = useState("");
  const [profileStoryEn, setProfileStoryEn] = useState("");
  const [profileStoryId, setProfileStoryId] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (isHydrated && !activeProducer) {
      router.replace("/login");
    }
  }, [activeProducer, isHydrated, router]);

  useEffect(() => {
    if (!activeProducer) return;
    setProfileName(activeProducer.name);
    setProfileOwner(activeProducer.ownerName);
    setProfilePirt(activeProducer.pirtNumber);
    setProfileHalal(activeProducer.halalNumber);
    setProfileStoryEn(activeProducer.storyEn);
    setProfileStoryId(activeProducer.storyId);
  }, [activeProducer]);

  const myBatches = useMemo(() => {
    if (!activeProducer) return [];
    return batches.filter((b) => b.producerId === activeProducer.id);
  }, [activeProducer, batches]);

  const filteredBatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return myBatches.filter((b) => {
      const matchesStatus =
        statusFilter === "all" || b.status === statusFilter;
      const matchesQuery =
        !q ||
        b.id.toLowerCase().includes(q) ||
        b.productName.toLowerCase().includes(q) ||
        b.productNameEn.toLowerCase().includes(q) ||
        b.rawMaterials.soybeanLotNumber.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [myBatches, searchQuery, statusFilter]);

  const myFeedback = useMemo(() => {
    if (!activeProducer) return [];
    return feedback.filter((f) => f.producerId === activeProducer.id);
  }, [activeProducer, feedback]);

  if (!isHydrated || !activeProducer) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="h-40 animate-pulse rounded-3xl bg-[#F2EAD9]" />
      </main>
    );
  }

  const handleProfileSave = (event: React.FormEvent) => {
    event.preventDefault();
    updateProducerProfile(activeProducer.id, {
      name: profileName.trim() || activeProducer.name,
      ownerName: profileOwner.trim() || activeProducer.ownerName,
      pirtNumber: profilePirt.trim(),
      halalNumber: profileHalal.trim(),
      storyEn: profileStoryEn.trim(),
      storyId: profileStoryId.trim(),
    });
    setProfileSaved(true);
    window.setTimeout(() => setProfileSaved(false), 2400);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <section className="rounded-[1.75rem] bg-[#F2EAD9] p-2 ring-1 ring-[#E2D5BE]">
        <div className="flex flex-col justify-between gap-5 rounded-[1.25rem] bg-[#FFFDF9] p-5 sm:p-6 lg:flex-row lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7F2EC] px-2.5 py-1 text-xs font-semibold text-[#23603E]">
                <ShieldCheck size={14} weight="fill" />
                {locale === "id"
                  ? activeProducer.cppbStatus
                  : activeProducer.cppbStatusEn}
              </span>
              <span className="font-mono text-xs text-[#634B3A]">
                {locale === "id" ? "Kode Sentra:" : "Workshop Code:"}{" "}
                {activeProducer.code}
              </span>
            </div>
            <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[#24170E] sm:text-3xl">
              {activeProducer.name}
            </h1>
            <p className="mt-1 text-sm text-[#634B3A]">
              {activeProducer.village}, {activeProducer.district},{" "}
              {activeProducer.regency} ·{" "}
              {locale === "id" ? "Penanggung jawab:" : "Lead operator:"}{" "}
              <span className="font-medium text-[#24170E]">
                {activeProducer.ownerName}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="group inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-[#9A4D1A] pl-5 pr-2 text-sm font-semibold text-white transition-colors hover:bg-[#7D3C12] active:scale-[0.98]"
            >
              <span>
                {locale === "id" ? "Catat Batch Baru" : "Log New Batch"}
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                <Plus size={16} weight="bold" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                logoutProducer();
                router.push("/login");
              }}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#F2EAD9] px-4 text-sm font-semibold text-[#24170E] ring-1 ring-[#E2D5BE] transition-colors hover:bg-[#E2D5BE]"
            >
              <SignOut size={17} />
              <span>{locale === "id" ? "Keluar" : "Sign Out"}</span>
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {justCreated && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
            className="mt-6 rounded-2xl bg-[#1C130C] p-5 text-[#FAF6EE]"
          >
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-white p-2">
                  <QRCodeSVG
                    value={buildPassportUrl(justCreated.id, appOrigin)}
                    size={64}
                    fgColor="#24170E"
                  />
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-[#EBB44C]">
                    {locale === "id"
                      ? `BATCH BARU TERDAFTAR · ${justCreated.id}`
                      : `NEW BATCH REGISTERED · ${justCreated.id}`}
                  </p>
                  <p className="mt-0.5 font-serif text-lg font-semibold">
                    {locale === "id"
                      ? justCreated.productName
                      : justCreated.productNameEn}{" "}
                    ({justCreated.quantityPacks}{" "}
                    {locale === "id" ? "pack" : "packs"})
                  </p>
                  <p className="text-xs text-[#C9B9A6]">
                    {locale === "id"
                      ? "Paspor publik dan lembar stiker QR sudah aktif dan siap dicetak."
                      : "The public passport and printable QR sticker sheet are now live."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/studio/print/${encodeURIComponent(justCreated.id)}`}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#EBB44C] px-4 text-xs font-bold text-[#1C130C]"
                >
                  <Printer size={15} weight="bold" />
                  <span>
                    {locale === "id" ? "Cetak Stiker QR" : "Print QR Stickers"}
                  </span>
                </Link>
                <Link
                  href={`/b/${encodeURIComponent(justCreated.id)}`}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full bg-[#281C13] px-4 text-xs font-semibold text-[#FAF6EE] ring-1 ring-[#3D2C1E]"
                >
                  <span>
                    {locale === "id" ? "Buka Paspor" : "Open Passport"}
                  </span>
                  <ArrowUpRight size={14} weight="bold" />
                </Link>
                <button
                  type="button"
                  onClick={() => setJustCreated(null)}
                  className="min-h-[42px] px-2 text-xs text-[#C9B9A6] hover:text-white"
                >
                  {locale === "id" ? "Tutup" : "Dismiss"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#E2D5BE] pb-4">
        <div
          role="tablist"
          className="inline-flex flex-wrap rounded-2xl bg-[#F2EAD9] p-1 ring-1 ring-[#E2D5BE]"
        >
          {(
            [
              {
                id: "batches",
                label:
                  locale === "id"
                    ? `Batch Produksi (${myBatches.length})`
                    : `Production Batches (${myBatches.length})`,
                icon: Storefront,
              },
              {
                id: "inbox",
                label:
                  locale === "id"
                    ? `Pesan Buyer (${myFeedback.length})`
                    : `Buyer Inbox (${myFeedback.length})`,
                icon: ChatCircleText,
              },
              {
                id: "profile",
                label:
                  locale === "id"
                    ? "Profil & Legalitas"
                    : "Profile & Permits",
                icon: UserCircle,
              },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`relative inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 text-xs font-semibold transition-colors sm:text-sm ${
                  active
                    ? "text-[#FAF6EE]"
                    : "text-[#634B3A] hover:text-[#24170E]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="studio-tab-pill"
                    transition={SPRING_TACTILE}
                    className="absolute inset-0 rounded-xl bg-[#24170E]"
                  />
                )}
                <Icon size={17} weight="duotone" className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "batches" && (
          <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto">
            <div className="relative flex-1 sm:w-64 sm:flex-initial">
              <MagnifyingGlass
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#634B3A]"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  locale === "id"
                    ? "Cari kode batch atau lot..."
                    : "Search batch ID or lot..."
                }
                className="min-h-[42px] w-full rounded-xl border border-[#E2D5BE] bg-[#FFFDF9] pl-9 pr-3 text-sm text-[#24170E]"
              />
            </div>
            <select
              aria-label={
                locale === "id" ? "Filter status batch" : "Filter batch status"
              }
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as BatchStatus | "all")
              }
              className="min-h-[42px] rounded-xl border border-[#E2D5BE] bg-[#FFFDF9] px-3 text-sm text-[#24170E]"
            >
              <option value="all">
                {locale === "id" ? "Semua Status" : "All Statuses"}
              </option>
              <option value="fermenting">
                {getStatusLabel("fermenting", locale)}
              </option>
              <option value="quality_check">
                {getStatusLabel("quality_check", locale)}
              </option>
              <option value="packaged">
                {getStatusLabel("packaged", locale)}
              </option>
              <option value="dispatched">
                {getStatusLabel("dispatched", locale)}
              </option>
            </select>
          </div>
        )}
      </div>

      {activeTab === "batches" && (
        <section className="mt-6">
          {filteredBatches.length === 0 ? (
            <div className="rounded-3xl bg-[#FFFDF9] p-10 text-center ring-1 ring-[#E2D5BE]">
              <p className="font-serif text-xl font-semibold text-[#24170E]">
                {locale === "id"
                  ? "Belum ada batch yang cocok dengan pencarian"
                  : "No batches match the current filter"}
              </p>
              <p className="mt-1 text-sm text-[#634B3A]">
                {locale === "id"
                  ? "Ubah filter atau catat batch produksi baru untuk membuat kode QR kemasan."
                  : "Adjust your search or log a new batch to generate package QR codes."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="mt-4 min-h-[42px] rounded-full bg-[#F2EAD9] px-5 text-xs font-semibold text-[#24170E]"
              >
                {locale === "id" ? "Tampilkan Semua Batch" : "Show All Batches"}
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[1.5rem] bg-[#FFFDF9] ring-1 ring-[#E2D5BE]">
              <div className="hidden grid-cols-12 border-b border-[#E2D5BE] bg-[#FAF6EE] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#634B3A] lg:grid">
                <div className="col-span-4">
                  {locale === "id" ? "Batch & Produk" : "Batch & Product"}
                </div>
                <div className="col-span-3">
                  {locale === "id"
                    ? "Kedelai & Inkubasi"
                    : "Soybean & Incubation"}
                </div>
                <div className="col-span-2">
                  {locale === "id" ? "Status & Scan" : "Status & Scans"}
                </div>
                <div className="col-span-3 text-right">
                  {locale === "id" ? "Aksi Operasional" : "Actions"}
                </div>
              </div>

              <div className="divide-y divide-[#E2D5BE]/80">
                {filteredBatches.map((batch) => {
                  const nextStatus = NEXT_STATUS[batch.status];
                  const nextLabel = NEXT_STATUS_CTA[batch.status]?.[locale];

                  return (
                    <div
                      key={batch.id}
                      className="grid items-center gap-4 px-5 py-4 transition-colors hover:bg-[#FAF6EE]/70 lg:grid-cols-12 lg:px-6"
                    >
                      <div className="min-w-0 lg:col-span-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#9A4D1A]">
                            {batch.id}
                          </span>
                          <span className="font-mono text-[11px] text-[#634B3A]">
                            ·{" "}
                            {formatDate(batch.production.productionDate, locale)}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm font-semibold text-[#24170E]">
                          {locale === "id"
                            ? batch.productName
                            : batch.productNameEn}
                        </p>
                        <p className="mt-0.5 text-xs text-[#634B3A]">
                          {batch.quantityPacks}{" "}
                          {locale === "id" ? "pack" : "packs"} (
                          {batch.netWeightGrams}g) ·{" "}
                          {getChannelLabel(batch.distribution.channel, locale)}
                        </p>
                      </div>

                      <div className="min-w-0 lg:col-span-3">
                        <p className="truncate text-xs font-medium text-[#24170E]">
                          {batch.rawMaterials.soybeanVariety}
                        </p>
                        <p className="mt-0.5 font-mono text-xs tabular-nums text-[#634B3A]">
                          Lot {batch.rawMaterials.soybeanLotNumber} ·{" "}
                          {batch.production.fermentationTempC}°C /{" "}
                          {batch.production.fermentationHours}h
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 lg:col-span-2 lg:flex-col lg:items-start">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                            batch.status === "fermenting"
                              ? "text-[#9A4D1A]"
                              : "text-[#23603E]"
                          }`}
                        >
                          {batch.status === "fermenting" ? (
                            <Clock size={14} weight="bold" />
                          ) : (
                            <CheckCircle size={14} weight="fill" />
                          )}
                          <span>{getStatusLabel(batch.status, locale)}</span>
                        </span>
                        <span className="font-mono text-xs tabular-nums text-[#634B3A]">
                          {batch.scanCount}{" "}
                          {locale === "id" ? "pindai QR" : "QR scans"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 lg:col-span-3 lg:justify-end">
                        {nextStatus && nextLabel && (
                          <button
                            type="button"
                            onClick={() =>
                              updateBatchStatus(batch.id, nextStatus)
                            }
                            className="inline-flex min-h-[38px] items-center gap-1 rounded-xl bg-[#F7EADC] px-3 text-xs font-semibold text-[#9A4D1A] transition-colors hover:bg-[#9A4D1A] hover:text-white"
                          >
                            <span>{nextLabel}</span>
                            <ArrowRight size={13} weight="bold" />
                          </button>
                        )}
                        <Link
                          href={`/studio/print/${encodeURIComponent(batch.id)}`}
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#F2EAD9] px-3 text-xs font-semibold text-[#24170E] hover:bg-[#E2D5BE]"
                        >
                          <Printer size={14} />
                          <span>QR</span>
                        </Link>
                        <Link
                          href={`/b/${encodeURIComponent(batch.id)}`}
                          className="inline-flex min-h-[38px] items-center gap-1 rounded-xl bg-[#24170E] px-3 text-xs font-semibold text-[#FAF6EE] hover:bg-[#9A4D1A]"
                        >
                          <span>
                            {locale === "id" ? "Paspor" : "Passport"}
                          </span>
                          <ArrowUpRight size={13} weight="bold" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === "inbox" && (
        <section className="mt-6 space-y-4">
          {myFeedback.length === 0 ? (
            <div className="rounded-3xl bg-[#FFFDF9] p-10 text-center ring-1 ring-[#E2D5BE]">
              <p className="font-serif text-xl font-semibold text-[#24170E]">
                {locale === "id"
                  ? "Belum ada pesan pembeli masuk"
                  : "No buyer messages yet"}
              </p>
              <p className="mt-1 text-sm text-[#634B3A]">
                {locale === "id"
                  ? "Setiap masukan atau permintaan sampel yang dikirim dari halaman paspor QR akan tampil di sini."
                  : "Quality notes and wholesale inquiries submitted from public QR passports will appear here."}
              </p>
            </div>
          ) : (
            myFeedback.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-[#FFFDF9] p-5 ring-1 ring-[#E2D5BE]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-[#24170E]">
                        {item.senderName}
                      </span>
                      <span className="text-xs text-[#634B3A]">
                        · {item.organization}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 font-mono text-xs text-[#634B3A]">
                      <Link
                        href={`/b/${encodeURIComponent(item.batchId)}`}
                        className="font-semibold text-[#9A4D1A] hover:underline"
                      >
                        {item.batchId}
                      </Link>
                      <span>· {formatDate(item.createdAt, locale)}</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F7EADC] px-3 py-1 font-mono text-xs font-bold text-[#9A4D1A]">
                    <Star size={13} weight="fill" />
                    {item.rating}/5
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#24170E]">
                  {item.message}
                </p>
              </div>
            ))
          )}
        </section>
      )}

      {activeTab === "profile" && (
        <section className="mt-6 max-w-2xl rounded-[1.5rem] bg-[#FFFDF9] p-6 ring-1 ring-[#E2D5BE]">
          <h2 className="font-serif text-2xl font-semibold text-[#24170E]">
            {locale === "id"
              ? "Identitas Rumah Produksi & Izin Edar"
              : "Workshop Identity & Permits"}
          </h2>
          <p className="mt-1 text-sm text-[#634B3A]">
            {locale === "id"
              ? "Perubahan di sini otomatis memperbarui data profil pada seluruh halaman paspor QR milik usahamu."
              : "Updates saved here immediately reflect on every public batch passport issued by your workshop."}
          </p>

          <form onSubmit={handleProfileSave} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="prof-name"
                className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
              >
                {locale === "id" ? "Nama Rumah Produksi" : "Workshop Name"}
              </label>
              <input
                id="prof-name"
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 text-sm text-[#24170E]"
              />
            </div>

            <div>
              <label
                htmlFor="prof-owner"
                className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
              >
                {locale === "id"
                  ? "Nama Pemilik / Penanggung Jawab CPPB"
                  : "Owner / CPPB Responsible Person"}
              </label>
              <input
                id="prof-owner"
                type="text"
                value={profileOwner}
                onChange={(e) => setProfileOwner(e.target.value)}
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 text-sm text-[#24170E]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="prof-pirt"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                >
                  {locale === "id" ? "Nomor P-IRT" : "P-IRT Registration"}
                </label>
                <input
                  id="prof-pirt"
                  type="text"
                  value={profilePirt}
                  onChange={(e) => setProfilePirt(e.target.value)}
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 font-mono text-sm text-[#24170E]"
                />
              </div>

              <div>
                <label
                  htmlFor="prof-halal"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                >
                  {locale === "id"
                    ? "Nomor Sertifikat Halal"
                    : "Halal Certificate ID"}
                </label>
                <input
                  id="prof-halal"
                  type="text"
                  value={profileHalal}
                  onChange={(e) => setProfileHalal(e.target.value)}
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 font-mono text-sm text-[#24170E]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="prof-story-en"
                className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
              >
                {locale === "id"
                  ? "Cerita Rumah Produksi (Versi Inggris / Ekspor)"
                  : "Workshop Story (English / Export Buyers)"}
              </label>
              <textarea
                id="prof-story-en"
                rows={3}
                value={profileStoryEn}
                onChange={(e) => setProfileStoryEn(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] p-3.5 text-sm leading-relaxed text-[#24170E]"
              />
            </div>

            <div>
              <label
                htmlFor="prof-story-id"
                className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
              >
                {locale === "id"
                  ? "Cerita Rumah Produksi (Versi Bahasa Indonesia)"
                  : "Workshop Story (Indonesian)"}
              </label>
              <textarea
                id="prof-story-id"
                rows={3}
                value={profileStoryId}
                onChange={(e) => setProfileStoryId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] p-3.5 text-sm leading-relaxed text-[#24170E]"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#9A4D1A] px-6 text-sm font-semibold text-white hover:bg-[#7D3C12]"
              >
                <span>
                  {locale === "id" ? "Simpan Perubahan" : "Save Changes"}
                </span>
              </button>
              {profileSaved && (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#23603E]">
                  <Check size={16} weight="bold" />
                  {locale === "id" ? "Tersimpan" : "Saved"}
                </span>
              )}
            </div>
          </form>
        </section>
      )}

      <NewBatchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        producer={activeProducer}
        onCreated={(created) => setJustCreated(created)}
      />
    </main>
  );
}
