"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lightning, X } from "@phosphor-icons/react";
import { useTraceability } from "@/context/TraceabilityContext";
import { generateBatchId } from "@/lib/format";
import {
  BatchGrade,
  DistributionChannel,
  ProducerPreset,
  ProducerProfile,
  TempeBatch,
} from "@/types/traceability";
import { EASE_OUT_EXPO } from "@/components/MotionProvider";

interface NewBatchModalProps {
  open: boolean;
  onClose: () => void;
  producer: ProducerProfile;
  onCreated: (batch: TempeBatch) => void;
}

export function NewBatchModal({
  open,
  onClose,
  producer,
  onCreated,
}: NewBatchModalProps) {
  const { batches, addBatch } = useTraceability();
  const defaultPreset = producer.presets[0];

  const today = new Date().toISOString().slice(0, 10);

  const [productName, setProductName] = useState(
    defaultPreset
      ? `Tempe ${defaultPreset.label.split("(")[0].trim()}`
      : "Tempe Kedelai Murni Vacuum"
  );
  const [netWeightGrams, setNetWeightGrams] = useState(
    defaultPreset?.defaultWeightGrams ?? 250
  );
  const [quantityPacks, setQuantityPacks] = useState(150);
  const [grade, setGrade] = useState<BatchGrade>("export_vacuum");
  const [soybeanOrigin, setSoybeanOrigin] = useState(
    defaultPreset?.soybeanOrigin ?? "Kedelai Lokal Grobogan Non-GMO"
  );
  const [soybeanVariety, setSoybeanVariety] = useState(
    defaultPreset?.soybeanVariety ?? "Varietas Grobogan Grade 1"
  );
  const [soybeanLotNumber, setSoybeanLotNumber] = useState("SOY-GRB-2611-09A");
  const [ragiBrandAndStrain, setRagiBrandAndStrain] = useState(
    defaultPreset?.ragiBrandAndStrain ?? "Raprima (Rhizopus oligosporus)"
  );
  const [ragiLotNumber, setRagiLotNumber] = useState("RPR-26-098");
  const [waterSource, setWaterSource] = useState(
    defaultPreset?.waterSource ?? "Air Filtrasi RO + Rebus 100°C"
  );
  const [packagingType, setPackagingType] = useState(
    defaultPreset?.packagingType ?? "Plastik Vacuum Food-Grade PA/PE 85 Micron"
  );
  const [productionDate, setProductionDate] = useState(today);
  const [fermentationHours, setFermentationHours] = useState(
    defaultPreset?.defaultFermentationHours ?? 36
  );
  const [fermentationTempC, setFermentationTempC] = useState(31.5);
  const [channel, setChannel] =
    useState<DistributionChannel>("export_consignment");
  const [destination, setDestination] = useState(
    "Ritel Modern & Sampel Ekspor Surabaya"
  );
  const [initialStatus, setInitialStatus] = useState<"fermenting" | "packaged">(
    "packaged"
  );

  const [cppbWater, setCppbWater] = useState(true);
  const [cppbUtensils, setCppbUtensils] = useState(true);
  const [cppbRack, setCppbRack] = useState(true);
  const [cppbGear, setCppbGear] = useState(true);
  const [cppbPest, setCppbPest] = useState(true);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const applyPreset = (preset: ProducerPreset) => {
    setProductName(`Tempe ${preset.label.split("(")[0].trim()}`);
    setNetWeightGrams(preset.defaultWeightGrams);
    setSoybeanOrigin(preset.soybeanOrigin);
    setSoybeanVariety(preset.soybeanVariety);
    setRagiBrandAndStrain(preset.ragiBrandAndStrain);
    setWaterSource(preset.waterSource);
    setPackagingType(preset.packagingType);
    setFermentationHours(preset.defaultFermentationHours);
    setGrade(
      preset.label.toLowerCase().includes("daun")
        ? "artisan_leaf"
        : "export_vacuum"
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newId = generateBatchId(
      producer.code,
      productionDate,
      batches.map((b) => b.id)
    );

    const prodDateObj = new Date(`${productionDate}T06:00:00+07:00`);
    const roomExpiry = new Date(prodDateObj);
    roomExpiry.setDate(roomExpiry.getDate() + 4);
    const chilledExpiry = new Date(prodDateObj);
    chilledExpiry.setDate(
      chilledExpiry.getDate() + (grade === "export_vacuum" ? 16 : 9)
    );
    const nowIso = new Date().toISOString();

    const isDone = initialStatus === "packaged";

    const created: TempeBatch = {
      id: newId,
      producerId: producer.id,
      productName: productName.trim() || "Tempe Kedelai Murni",
      productNameEn: `${productName.trim() || "Pure Soybean Tempe"} (${netWeightGrams}g)`,
      netWeightGrams,
      quantityPacks,
      status: initialStatus,
      grade,
      fermentationProgressPct: isDone ? 100 : 45,
      rawMaterials: {
        soybeanOrigin,
        soybeanOriginEn: soybeanOrigin,
        soybeanVariety,
        nonGmoVerified: true,
        soybeanLotNumber: soybeanLotNumber.trim() || "SOY-LOT-NEW",
        ragiBrandAndStrain,
        ragiLotNumber: ragiLotNumber.trim() || "RPR-LOT-NEW",
        waterSource,
        waterSourceEn: waterSource,
      },
      production: {
        productionDate,
        inoculationTime: `${productionDate}T16:00:00+07:00`,
        fermentationHours,
        fermentationTempC,
        fermentationHumidityPct: 76,
        packagingType,
        packagingTypeEn: packagingType,
        packagedAt: isDone ? nowIso : null,
        bestBeforeRoom: roomExpiry.toISOString().slice(0, 10),
        bestBeforeChilled: chilledExpiry.toISOString().slice(0, 10),
      },
      cppbChecklist: {
        waterBoiledAndFiltered: cppbWater,
        utensilsSanitized: cppbUtensils,
        fermentationRackClean: cppbRack,
        handlerHygieneGear: cppbGear,
        pestFreeStorage: cppbPest,
        inspectorName: producer.ownerName,
        checkedAt: nowIso,
      },
      distribution: {
        channel,
        destination: destination.trim() || "Mitra Distribusi Lokal",
        destinationEn: destination.trim() || "Distribution Partner",
        coldChainRequired: channel === "export_consignment",
        dispatchDate: null,
      },
      stages: [
        {
          key: "soaking",
          titleId: "Perendaman & Pengupasan Kulit Ari",
          titleEn: "Soaking & Dehulling",
          hourMark: "00h - 12h",
          timestamp: `${productionDate}T05:00:00+07:00`,
          temperatureC: 27.4,
          humidityPct: 71,
          completed: true,
          noteId: `Perendaman 12 jam memakai ${soybeanVariety} (Lot ${soybeanLotNumber}).`,
          noteEn: `12-hour soak using ${soybeanVariety} (Lot ${soybeanLotNumber}).`,
        },
        {
          key: "boiling",
          titleId: "Perebusan & Penirisan Higienis",
          titleEn: "Boiling & Hygienic Draining",
          hourMark: "12h - 15h",
          timestamp: `${productionDate}T14:00:00+07:00`,
          temperatureC: 99.2,
          humidityPct: 81,
          completed: true,
          noteId: "Perebusan tuntas dan penirisan permukaan biji hingga kering.",
          noteEn: "Complete boiling followed by clean rack air-draining.",
        },
        {
          key: "inoculation",
          titleId: "Inokulasi Ragi Rhizopus",
          titleEn: "Rhizopus Culture Inoculation",
          hourMark: "15h - 16h",
          timestamp: `${productionDate}T16:00:00+07:00`,
          temperatureC: 30.1,
          humidityPct: 73,
          completed: true,
          noteId: `Pencampuran ${ragiBrandAndStrain} Lot ${ragiLotNumber}.`,
          noteEn: `Blended ${ragiBrandAndStrain} Lot ${ragiLotNumber}.`,
        },
        {
          key: "fermentation",
          titleId: isDone
            ? `Inkubasi Selesai (${fermentationHours} Jam)`
            : `Inkubasi Berjalan (Target ${fermentationHours} Jam)`,
          titleEn: isDone
            ? `Incubation Complete (${fermentationHours}h)`
            : `Incubation Active (Target ${fermentationHours}h)`,
          hourMark: `16h - ${16 + fermentationHours}h`,
          timestamp: isDone ? nowIso : null,
          temperatureC: fermentationTempC,
          humidityPct: 76,
          completed: isDone,
          noteId: isDone
            ? "Miselium putih padat merata dan siap dikemas."
            : "Batch berada di rak fermentasi berventilasi.",
          noteEn: isDone
            ? "Firm white mycelium formed evenly, ready for sealing."
            : "Batch currently maturing on ventilated incubation racks.",
        },
        {
          key: "packaging",
          titleId: "Pengemasan & Pelabelan QR",
          titleEn: "Sealing & Batch QR Labeling",
          hourMark: `${16 + fermentationHours}h`,
          timestamp: isDone ? nowIso : null,
          temperatureC: isDone ? 18.0 : null,
          humidityPct: isDone ? 62 : null,
          completed: isDone,
          noteId: isDone
            ? `Dikemas dengan ${packagingType} dan diberi stiker QR ${newId}.`
            : "Menunggu penyelesaian tahap inkubasi.",
          noteEn: isDone
            ? `Sealed in ${packagingType} with Batch QR ${newId}.`
            : "Pending completion of fermentation stage.",
        },
      ],
      scanCount: 0,
      createdAt: nowIso,
    };

    addBatch(created);
    onCreated(created);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C130C]/70 p-3 backdrop-blur-xs sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-batch-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] bg-[#F2EAD9] p-2 shadow-2xl ring-1 ring-[#E2D5BE]"
          >
            <div className="rounded-[1.25rem] bg-[#FFFDF9] p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4 border-b border-[#E2D5BE] pb-4">
                <div>
                  <h2
                    id="new-batch-title"
                    className="font-serif text-2xl font-semibold text-[#24170E]"
                  >
                    Catat Batch Produksi Baru
                  </h2>
                  <p className="mt-1 text-xs text-[#634B3A]">
                    Gunakan preset bahan baku agar input batch pagi selesai
                    dalam dua menit.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup form batch"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2EAD9] text-[#24170E] hover:bg-[#E2D5BE]"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* 1-Click Raw Material Presets */}
              {producer.presets.length > 0 && (
                <div className="mt-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#634B3A]">
                    <Lightning
                      size={14}
                      weight="fill"
                      className="text-[#9A4D1A]"
                    />
                    Isi Cepat dari Preset Bahan Baku
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {producer.presets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className="min-h-[38px] rounded-xl bg-[#FAF6EE] px-3.5 text-xs font-semibold text-[#24170E] ring-1 ring-[#E2D5BE] transition-colors hover:bg-[#9A4D1A] hover:text-white"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="nb-name"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                    >
                      Nama Produk Tempe
                    </label>
                    <input
                      id="nb-name"
                      type="text"
                      required
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 text-sm text-[#24170E]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="nb-date"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                    >
                      Tanggal Produksi
                    </label>
                    <input
                      id="nb-date"
                      type="date"
                      required
                      value={productionDate}
                      onChange={(e) => setProductionDate(e.target.value)}
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 font-mono text-sm text-[#24170E]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="nb-status"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                    >
                      Status Awal Batch
                    </label>
                    <select
                      id="nb-status"
                      value={initialStatus}
                      onChange={(e) =>
                        setInitialStatus(
                          e.target.value as "fermenting" | "packaged"
                        )
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 text-sm text-[#24170E]"
                    >
                      <option value="packaged">
                        Siap Distribusi (QR Siap Tempel)
                      </option>
                      <option value="fermenting">
                        Sedang Inkubasi di Rak Fermentasi
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="nb-qty"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                    >
                      Jumlah Kemasan (Pack)
                    </label>
                    <input
                      id="nb-qty"
                      type="number"
                      min={1}
                      max={10000}
                      required
                      value={quantityPacks}
                      onChange={(e) => setQuantityPacks(Number(e.target.value))}
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 font-mono text-sm text-[#24170E]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="nb-weight"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                    >
                      Berat Bersih (Gram)
                    </label>
                    <input
                      id="nb-weight"
                      type="number"
                      min={50}
                      max={5000}
                      required
                      value={netWeightGrams}
                      onChange={(e) =>
                        setNetWeightGrams(Number(e.target.value))
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 font-mono text-sm text-[#24170E]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="nb-soy-lot"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                    >
                      Nomor Lot Kedelai
                    </label>
                    <input
                      id="nb-soy-lot"
                      type="text"
                      required
                      value={soybeanLotNumber}
                      onChange={(e) => setSoybeanLotNumber(e.target.value)}
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 font-mono text-sm text-[#24170E]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="nb-ragi-lot"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                    >
                      Nomor Lot Ragi
                    </label>
                    <input
                      id="nb-ragi-lot"
                      type="text"
                      required
                      value={ragiLotNumber}
                      onChange={(e) => setRagiLotNumber(e.target.value)}
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 font-mono text-sm text-[#24170E]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="nb-hours"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                    >
                      Durasi Fermentasi (Jam)
                    </label>
                    <input
                      id="nb-hours"
                      type="number"
                      min={20}
                      max={60}
                      value={fermentationHours}
                      onChange={(e) =>
                        setFermentationHours(Number(e.target.value))
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 font-mono text-sm text-[#24170E]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="nb-temp"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                    >
                      Suhu Ruang Inkubasi (°C)
                    </label>
                    <input
                      id="nb-temp"
                      type="number"
                      step="0.1"
                      min={24}
                      max={38}
                      value={fermentationTempC}
                      onChange={(e) =>
                        setFermentationTempC(Number(e.target.value))
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 font-mono text-sm text-[#24170E]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="nb-channel"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                    >
                      Target Distribusi
                    </label>
                    <select
                      id="nb-channel"
                      value={channel}
                      onChange={(e) =>
                        setChannel(e.target.value as DistributionChannel)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 text-sm text-[#24170E]"
                    >
                      <option value="export_consignment">
                        Konsinyasi Ekspor / Sampel
                      </option>
                      <option value="modern_retail">
                        Ritel Modern / Kafe Organik
                      </option>
                      <option value="local_market">
                        Pasar Lokal &amp; Reseller
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="nb-dest"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                    >
                      Tujuan Pengiriman
                    </label>
                    <input
                      id="nb-dest"
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] px-3.5 text-sm text-[#24170E]"
                    />
                  </div>
                </div>

                {/* CPPB Daily Hygiene Checklist */}
                <div className="rounded-2xl bg-[#FAF6EE] p-4 ring-1 ring-[#E2D5BE]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#23603E]">
                    Ceklis Sanitasi CPPB Hari Ini
                  </p>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {[
                      {
                        label: "Air filtrasi & direbus 100°C",
                        checked: cppbWater,
                        toggle: setCppbWater,
                      },
                      {
                        label: "Panci & alat stainless higienis",
                        checked: cppbUtensils,
                        toggle: setCppbUtensils,
                      },
                      {
                        label: "Rak inkubasi bersih & kering",
                        checked: cppbRack,
                        toggle: setCppbRack,
                      },
                      {
                        label: "Pekerja pakai celemek & penutup kepala",
                        checked: cppbGear,
                        toggle: setCppbGear,
                      },
                      {
                        label: "Ruang simpan bebas hama",
                        checked: cppbPest,
                        toggle: setCppbPest,
                      },
                    ].map((check) => (
                      <label
                        key={check.label}
                        className="flex items-center gap-2.5 text-xs font-medium text-[#24170E]"
                      >
                        <input
                          type="checkbox"
                          checked={check.checked}
                          onChange={(e) => check.toggle(e.target.checked)}
                          className="h-4 w-4 rounded accent-[#23603E]"
                        />
                        <span>{check.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#E2D5BE] pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="min-h-[46px] rounded-full bg-[#F2EAD9] px-5 text-sm font-semibold text-[#24170E] hover:bg-[#E2D5BE]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#9A4D1A] pl-5 pr-2 text-sm font-semibold text-white transition-colors hover:bg-[#7D3C12] active:scale-[0.98]"
                  >
                    <span>Simpan &amp; Buat QR Batch</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                      <Check size={15} weight="bold" />
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
