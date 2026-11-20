"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import jsQR from "jsqr";
import {
  ArrowRight,
  Camera,
  CameraSlash,
  MagnifyingGlass,
  QrCode,
  X,
} from "@phosphor-icons/react";
import { useTraceability } from "@/context/TraceabilityContext";
import { extractBatchIdFromScan } from "@/lib/format";
import { EASE_OUT_EXPO } from "./MotionProvider";

export function QrScannerModal() {
  const { scannerOpen, setScannerOpen, batches, locale } = useTraceability();
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const [cameraState, setCameraState] = useState<
    "idle" | "starting" | "active" | "denied" | "unsupported"
  >("idle");
  const [manualCode, setManualCode] = useState("");
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState("idle");
  }, []);

  const navigateToBatch = useCallback(
    (rawCode: string) => {
      const batchId = extractBatchIdFromScan(rawCode);
      if (!batchId) {
        setFeedbackError(
          locale === "id"
            ? "Masukkan kode batch seperti TMP-MLR-2611-01."
            : "Enter a batch ID such as TMP-MLR-2611-01."
        );
        return;
      }
      stopCamera();
      setScannerOpen(false);
      setManualCode("");
      setFeedbackError(null);
      router.push(`/b/${encodeURIComponent(batchId)}`);
    },
    [locale, router, setScannerOpen, stopCamera]
  );

  const startCamera = useCallback(async () => {
    setFeedbackError(null);
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setCameraState("unsupported");
      return;
    }

    setCameraState("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraState("active");

      const scanFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const decoded = jsQR(
              imageData.data,
              imageData.width,
              imageData.height,
              { inversionAttempts: "dontInvert" }
            );
            if (decoded && decoded.data) {
              navigateToBatch(decoded.data);
              return;
            }
          }
        }
        rafRef.current = requestAnimationFrame(scanFrame);
      };

      rafRef.current = requestAnimationFrame(scanFrame);
    } catch (error) {
      console.warn("Camera permission denied or unavailable:", error);
      setCameraState("denied");
    }
  }, [navigateToBatch]);

  useEffect(() => {
    if (!scannerOpen) {
      stopCamera();
      setFeedbackError(null);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setScannerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      stopCamera();
    };
  }, [scannerOpen, setScannerOpen, stopCamera]);

  const handleManualSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigateToBatch(manualCode);
  };

  return (
    <AnimatePresence>
      {scannerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-[#1C130C]/75 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-scanner-title"
          onClick={() => setScannerOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-[1.75rem] bg-[#F2EAD9] p-2 shadow-2xl ring-1 ring-[#E2D5BE]"
          >
            <div className="rounded-[1.25rem] bg-[#FFFDF9] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="qr-scanner-title"
                    className="font-serif text-2xl font-semibold tracking-tight text-[#24170E]"
                  >
                    {locale === "id"
                      ? "Pindai QR Kemasan Tempe"
                      : "Scan Tempe Package QR"}
                  </h2>
                  <p className="mt-1 text-sm text-[#634B3A]">
                    {locale === "id"
                      ? "Arahkan kamera ke stiker QR kemasan atau masukkan nomor batch secara manual."
                      : "Point your camera at the package QR sticker or type a batch ID below."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setScannerOpen(false)}
                  aria-label={locale === "id" ? "Tutup pemindai" : "Close scanner"}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F2EAD9] text-[#24170E] transition-colors hover:bg-[#E2D5BE]"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>

              <div className="relative mt-5 overflow-hidden rounded-2xl bg-[#1C130C] aspect-[4/3] ring-1 ring-[#3D2C1E]">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`h-full w-full object-cover ${
                    cameraState === "active" ? "opacity-100" : "opacity-0"
                  }`}
                />
                <canvas ref={canvasRef} className="hidden" />

                {cameraState === "active" ? (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8">
                    <div className="relative h-full w-full max-w-[230px] max-h-[230px] rounded-2xl border-2 border-[#EBB44C]/80">
                      <div className="scan-sweep-line absolute inset-x-2 top-0 h-0.5 rounded-full bg-[#EBB44C] shadow-[0_0_12px_#EBB44C]" />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-[#FAF6EE]">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#281C13] text-[#EBB44C] ring-1 ring-[#3D2C1E]">
                      {cameraState === "denied" ||
                      cameraState === "unsupported" ? (
                        <CameraSlash size={28} weight="duotone" />
                      ) : (
                        <QrCode size={28} weight="duotone" />
                      )}
                    </div>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#C9B9A6]">
                      {cameraState === "denied"
                        ? locale === "id"
                          ? "Akses kamera belum diizinkan. Kamu tetap bisa cek paspor lewat kode batch di bawah."
                          : "Camera permission was denied. You can still verify using a batch ID below."
                        : cameraState === "unsupported"
                          ? locale === "id"
                            ? "Browser ini tidak mendukung akses kamera langsung. Gunakan input kode batch di bawah."
                            : "Direct camera scanning is not available here. Enter a batch ID below."
                          : locale === "id"
                            ? "Aktifkan kamera untuk memindai QR langsung dari kemasan tanpa instal aplikasi."
                            : "Enable your camera to scan package QR stickers directly in the browser."}
                    </p>
                    <button
                      type="button"
                      onClick={startCamera}
                      disabled={cameraState === "starting"}
                      className="mt-5 inline-flex min-h-[44px] items-center gap-2.5 rounded-full bg-[#9A4D1A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7D3C12] active:scale-[0.98]"
                    >
                      <Camera size={18} weight="bold" />
                      {cameraState === "starting"
                        ? locale === "id"
                          ? "Membuka kamera..."
                          : "Opening camera..."
                        : locale === "id"
                          ? "Aktifkan Kamera"
                          : "Enable Camera"}
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleManualSubmit} className="mt-5">
                <label
                  htmlFor="modal-batch-code"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#634B3A]"
                >
                  {locale === "id"
                    ? "Atau Ketik Nomor Batch"
                    : "Or Enter Batch ID"}
                </label>
                <div className="mt-2 flex gap-2">
                  <div className="relative flex-1">
                    <MagnifyingGlass
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#634B3A]"
                    />
                    <input
                      id="modal-batch-code"
                      type="text"
                      value={manualCode}
                      onChange={(e) => {
                        setManualCode(e.target.value);
                        setFeedbackError(null);
                      }}
                      placeholder="TMP-MLR-2611-01"
                      className="min-h-[44px] w-full rounded-xl border border-[#E2D5BE] bg-[#FAF6EE] pl-10 pr-3 font-mono text-sm text-[#24170E] placeholder:text-[#634B3A]/70 focus:border-[#9A4D1A]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#24170E] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#9A4D1A] active:scale-[0.98]"
                  >
                    <span>{locale === "id" ? "Buka" : "Open"}</span>
                    <ArrowRight size={16} weight="bold" />
                  </button>
                </div>
                {feedbackError && (
                  <p className="mt-2 text-xs font-medium text-[#9A4D1A]">
                    {feedbackError}
                  </p>
                )}
              </form>

              <div className="mt-5 border-t border-[#E2D5BE] pt-4">
                <p className="text-xs font-medium text-[#634B3A]">
                  {locale === "id"
                    ? "Uji cepat dengan batch sampel:"
                    : "Quick-test with sample batches:"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {batches.slice(0, 3).map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => navigateToBatch(b.id)}
                      className="min-h-[36px] rounded-lg bg-[#F2EAD9] px-3 py-1.5 font-mono text-xs font-medium text-[#24170E] transition-colors hover:bg-[#9A4D1A] hover:text-white"
                    >
                      {b.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
