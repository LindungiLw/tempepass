"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Drop,
  Pause,
  Play,
  Thermometer,
  Timer,
} from "@phosphor-icons/react";
import { FERMENTATION_MODEL_STAGES } from "@/data/seedData";
import { useTraceability } from "@/context/TraceabilityContext";
import { EASE_OUT_EXPO } from "@/components/MotionProvider";

const BEAN_POSITIONS = [
  { cx: 46, cy: 48, rx: 14, ry: 9, rot: -18 },
  { cx: 88, cy: 42, rx: 15, ry: 9, rot: 22 },
  { cx: 132, cy: 50, rx: 14, ry: 9, rot: -12 },
  { cx: 174, cy: 44, rx: 14, ry: 8.5, rot: 28 },
  { cx: 214, cy: 52, rx: 13, ry: 9, rot: -24 },
  { cx: 64, cy: 82, rx: 15, ry: 9.5, rot: 16 },
  { cx: 108, cy: 80, rx: 14, ry: 9, rot: -28 },
  { cx: 152, cy: 86, rx: 15, ry: 9, rot: 14 },
  { cx: 196, cy: 84, rx: 14, ry: 9, rot: -16 },
  { cx: 44, cy: 118, rx: 13, ry: 8.5, rot: 30 },
  { cx: 88, cy: 120, rx: 15, ry: 9, rot: -14 },
  { cx: 134, cy: 118, rx: 14, ry: 9.5, rot: 20 },
  { cx: 178, cy: 122, rx: 15, ry: 9, rot: -22 },
  { cx: 216, cy: 116, rx: 13, ry: 8.5, rot: 15 },
];

const HYPHAE_WEB_PATHS = [
  "M36 48 Q64 36 88 42 T132 50 T174 44 T222 52",
  "M46 48 Q56 68 64 82 T108 80 T152 86 T196 84",
  "M44 118 Q68 102 88 120 T134 118 T178 122 T216 116",
  "M64 82 Q76 102 88 120 M108 80 Q120 102 134 118 M152 86 Q165 104 178 122",
  "M88 42 Q98 60 108 80 M132 50 Q142 68 152 86 M174 44 Q186 64 196 84",
  "M46 48 Q45 84 44 118 M214 52 Q215 84 216 116",
];

function computeTelemetryAtHour(hour: number) {
  if (hour <= 12) {
    return {
      tempC: 27.2 + (hour / 12) * 0.6,
      humidityPct: 70,
      ph: 6.2 - (hour / 12) * 1.4,
      myceliumPct: 0,
    };
  }
  if (hour <= 15) {
    const t = (hour - 12) / 3;
    return {
      tempC: t < 0.7 ? 99.2 : 42.0,
      humidityPct: 82,
      ph: 5.0,
      myceliumPct: 0,
    };
  }
  if (hour <= 17) {
    return {
      tempC: 30.1,
      humidityPct: 73,
      ph: 5.1,
      myceliumPct: Math.round(((hour - 15) / 2) * 8),
    };
  }
  if (hour <= 48) {
    const progress = (hour - 17) / 31;
    // Metabolic peak heat rises near 28h-38h then stabilizes as cake firms up
    const metabolicCurve = Math.sin(progress * Math.PI) * 3.8;
    return {
      tempC: 30.2 + metabolicCurve,
      humidityPct: Math.round(74 + Math.sin(progress * Math.PI) * 4),
      ph: 5.1 + progress * 1.2,
      myceliumPct: Math.min(98, Math.round(8 + Math.pow(progress, 1.15) * 90)),
    };
  }
  return {
    tempC: 16.0,
    humidityPct: 60,
    ph: 6.5,
    myceliumPct: 100,
  };
}

export function FermentationSimulator() {
  const { locale } = useTraceability();
  const [hour, setHour] = useState(36);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = window.setInterval(() => {
      setHour((prev) => (prev >= 52 ? 0 : prev + 1));
    }, 240);
    return () => window.clearInterval(interval);
  }, [isPlaying]);

  const activeStage = useMemo(() => {
    return (
      FERMENTATION_MODEL_STAGES.find(
        (stage) => hour >= stage.hourStart && hour <= stage.hourEnd
      ) ?? FERMENTATION_MODEL_STAGES[FERMENTATION_MODEL_STAGES.length - 1]
    );
  }, [hour]);

  const telemetry = useMemo(() => computeTelemetryAtHour(hour), [hour]);
  const myceliumOpacity = telemetry.myceliumPct / 100;

  return (
    <section
      id="simulasi"
      className="relative bg-[#1C130C] py-16 text-[#FAF6EE] sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#FAF6EE] sm:text-4xl lg:text-[2.75rem]">
              {locale === "id"
                ? "Lima tahap fermentasi yang menentukan mutu ekspor."
                : "Five fermentation checkpoints that decide export quality."}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#C9B9A6]">
              {locale === "id"
                ? "Geser waktu inkubasi di bawah untuk melihat bagaimana suhu metabolik dan pertumbuhan miselium Rhizopus direkam otomatis ke paspor batch."
                : "Scrub the fermentation timeline below to inspect how metabolic temperature, bean pH, and Rhizopus mycelium growth map directly into each batch passport."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying((v) => !v)}
            className="inline-flex min-h-[46px] shrink-0 items-center gap-2.5 self-start rounded-full bg-[#281C13] px-5 text-sm font-semibold text-[#EBB44C] ring-1 ring-[#3D2C1E] transition-colors hover:bg-[#352518] active:scale-[0.98] lg:self-auto"
          >
            {isPlaying ? (
              <Pause size={18} weight="fill" />
            ) : (
              <Play size={18} weight="fill" />
            )}
            <span>
              {isPlaying
                ? locale === "id"
                  ? "Jeda Simulasi"
                  : "Pause Simulation"
                : locale === "id"
                  ? "Putar Siklus 52 Jam"
                  : "Play 52h Cycle"}
            </span>
          </button>
        </div>

        {/* Interactive Scrubber + Stage Selector */}
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="space-y-2.5 lg:col-span-5">
            {FERMENTATION_MODEL_STAGES.map((stage) => {
              const isCurrent = stage.id === activeStage.id;
              const isPassed = hour > stage.hourEnd;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setHour(stage.hourDefault);
                  }}
                  className={`group flex w-full items-start gap-3.5 rounded-2xl p-4 text-left transition-colors ${
                    isCurrent
                      ? "bg-[#281C13] ring-1 ring-[#EBB44C]/60"
                      : "bg-transparent ring-1 ring-[#3D2C1E]/70 hover:bg-[#281C13]/60"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                      isCurrent
                        ? "bg-[#EBB44C] text-[#1C130C]"
                        : isPassed
                          ? "bg-[#23603E] text-white"
                          : "bg-[#281C13] text-[#C9B9A6] ring-1 ring-[#3D2C1E]"
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle size={16} weight="bold" />
                    ) : (
                      `0${stage.stepNumber}`
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          isCurrent ? "text-[#FAF6EE]" : "text-[#C9B9A6]"
                        }`}
                      >
                        {locale === "id" ? stage.titleId : stage.titleEn}
                      </span>
                      <span className="shrink-0 font-mono text-xs tabular-nums text-[#EBB44C]">
                        {stage.hourStart}h-{stage.hourEnd}h
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[#C9B9A6]">
                      {locale === "id" ? stage.checkpointId : stage.checkpointEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Live Incubation Telemetry Chamber */}
          <div className="lg:col-span-7">
            <div className="rounded-[1.75rem] bg-[#281C13] p-5 ring-1 ring-[#3D2C1E] sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3D2C1E] pb-5">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-[#EBB44C]">
                    {locale === "id"
                      ? `Tahap 0${activeStage.stepNumber} dari 05`
                      : `Stage 0${activeStage.stepNumber} of 05`}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-semibold text-[#FAF6EE]">
                    {locale === "id" ? activeStage.titleId : activeStage.titleEn}
                  </h3>
                </div>
                <div className="rounded-xl bg-[#1C130C] px-4 py-2.5 text-right ring-1 ring-[#3D2C1E]">
                  <p className="text-[11px] text-[#C9B9A6]">
                    {locale === "id" ? "Jam Berjalan" : "Elapsed Time"}
                  </p>
                  <p className="font-mono text-2xl font-bold tabular-nums text-[#EBB44C]">
                    {String(hour).padStart(2, "0")}:00
                    <span className="ml-1 text-xs font-normal text-[#C9B9A6]">
                      / 52h
                    </span>
                  </p>
                </div>
              </div>

              {/* Interactive Range Slider */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-[#C9B9A6]">
                  <span>
                    {locale === "id"
                      ? "Geser timeline produksi:"
                      : "Scrub production hour:"}
                  </span>
                  <span className="font-mono tabular-nums text-[#FAF6EE]">
                    {hour}h
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={52}
                  step={1}
                  value={hour}
                  aria-label={
                    locale === "id"
                      ? "Jam proses produksi tempe"
                      : "Tempe production hour"
                  }
                  onChange={(e) => {
                    setIsPlaying(false);
                    setHour(Number(e.target.value));
                  }}
                  className="mt-2.5 h-2 w-full appearance-none rounded-full bg-[#1C130C] accent-[#EBB44C]"
                />
                <div className="mt-1.5 flex justify-between font-mono text-[11px] text-[#C9B9A6]">
                  <span>00h</span>
                  <span>12h</span>
                  <span>16h</span>
                  <span>36h</span>
                  <span>52h</span>
                </div>
              </div>

              {/* Live Cross-Section Visualization of Tempe Mycelium Growth */}
              <div className="mt-6 grid items-center gap-5 sm:grid-cols-12">
                <div className="rounded-2xl bg-[#1C130C] p-4 ring-1 ring-[#3D2C1E] sm:col-span-6">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-[#C9B9A6]">
                      {locale === "id"
                        ? "Penampang Blok Tempe"
                        : "Tempe Matrix Cross-Section"}
                    </span>
                    <span className="font-mono font-semibold tabular-nums text-[#EBB44C]">
                      {telemetry.myceliumPct}%
                    </span>
                  </div>
                  <svg
                    viewBox="0 0 260 162"
                    className="h-auto w-full rounded-xl bg-[#241810]"
                    role="img"
                    aria-label={
                      locale === "id"
                        ? `Visual pertumbuhan miselium ${telemetry.myceliumPct} persen`
                        : `Mycelium growth visual at ${telemetry.myceliumPct} percent`
                    }
                  >
                    {/* Snowy white mycelium backdrop binding soybeans as fermentation matures */}
                    <motion.rect
                      x="18"
                      y="18"
                      width="224"
                      height="126"
                      rx="18"
                      fill="#FAF6EE"
                      animate={{ opacity: myceliumOpacity * 0.88 }}
                      transition={{ duration: 0.35 }}
                    />

                    {/* Steamed golden soybeans */}
                    {BEAN_POSITIONS.map((bean, i) => (
                      <g
                        key={i}
                        transform={`rotate(${bean.rot} ${bean.cx} ${bean.cy})`}
                      >
                        <ellipse
                          cx={bean.cx}
                          cy={bean.cy}
                          rx={bean.rx}
                          ry={bean.ry}
                          fill={hour >= 12 ? "#D99429" : "#C48422"}
                          stroke="#7D4A13"
                          strokeWidth="1.2"
                        />
                        <line
                          x1={bean.cx - bean.rx * 0.55}
                          y1={bean.cy}
                          x2={bean.cx + bean.rx * 0.55}
                          y2={bean.cy}
                          stroke="#9A5B1A"
                          strokeWidth="0.9"
                          opacity="0.65"
                        />
                      </g>
                    ))}

                    {/* White Rhizopus hyphae filaments weaving across beans */}
                    {HYPHAE_WEB_PATHS.map((d, idx) => (
                      <motion.path
                        key={idx}
                        d={d}
                        fill="none"
                        stroke="#FFFDF9"
                        strokeWidth={1.6 + myceliumOpacity * 2.2}
                        strokeLinecap="round"
                        initial={false}
                        animate={{
                          pathLength: Math.min(1, myceliumOpacity * 1.15),
                          opacity: myceliumOpacity > 0.04 ? 0.92 : 0,
                        }}
                        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                      />
                    ))}

                    {/* Vacuum export seal outline at stage 5 */}
                    <motion.rect
                      x="12"
                      y="12"
                      width="236"
                      height="138"
                      rx="22"
                      fill="none"
                      stroke="#EBB44C"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                      animate={{ opacity: hour >= 48 ? 0.9 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </svg>
                </div>

                {/* Live Telemetry Gauges */}
                <div className="grid grid-cols-2 gap-3 sm:col-span-6">
                  <div className="rounded-xl bg-[#1C130C] p-3.5 ring-1 ring-[#3D2C1E]">
                    <div className="flex items-center gap-1.5 text-xs text-[#C9B9A6]">
                      <Thermometer size={15} className="text-[#EBB44C]" />
                      <span>{locale === "id" ? "Suhu Inti" : "Core Temp"}</span>
                    </div>
                    <p className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-[#FAF6EE]">
                      {telemetry.tempC.toFixed(1)}°C
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#1C130C] p-3.5 ring-1 ring-[#3D2C1E]">
                    <div className="flex items-center gap-1.5 text-xs text-[#C9B9A6]">
                      <Drop size={15} className="text-[#EBB44C]" />
                      <span>{locale === "id" ? "Kelembaban" : "Humidity"}</span>
                    </div>
                    <p className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-[#FAF6EE]">
                      {telemetry.humidityPct}%
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#1C130C] p-3.5 ring-1 ring-[#3D2C1E]">
                    <div className="flex items-center gap-1.5 text-xs text-[#C9B9A6]">
                      <Timer size={15} className="text-[#EBB44C]" />
                      <span>{locale === "id" ? "Keasaman" : "Bean pH"}</span>
                    </div>
                    <p className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-[#FAF6EE]">
                      {telemetry.ph.toFixed(1)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#1C130C] p-3.5 ring-1 ring-[#3D2C1E]">
                    <div className="flex items-center gap-1.5 text-xs text-[#C9B9A6]">
                      <CheckCircle size={15} className="text-[#EBB44C]" />
                      <span>{locale === "id" ? "Miselium" : "Mycelium"}</span>
                    </div>
                    <p className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-[#EBB44C]">
                      {telemetry.myceliumPct}%
                    </p>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="mt-6 rounded-2xl bg-[#1C130C] p-4 ring-1 ring-[#3D2C1E]"
                >
                  <p className="text-sm leading-relaxed text-[#FAF6EE]">
                    {locale === "id"
                      ? activeStage.descriptionId
                      : activeStage.descriptionEn}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#3D2C1E] pt-3">
                    <span className="text-xs font-semibold text-[#EBB44C]">
                      {locale === "id"
                        ? "Data tercatat ke log batch:"
                        : "Recorded to batch log:"}
                    </span>
                    <span className="font-mono text-xs text-[#C9B9A6]">
                      {locale === "id"
                        ? activeStage.loggedFieldId
                        : activeStage.loggedFieldEn}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
