"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  SEED_BATCHES,
  SEED_FEEDBACK,
  SEED_PRODUCERS,
} from "@/data/seedData";
import {
  BatchStatus,
  BuyerFeedback,
  Locale,
  ProducerProfile,
  TempeBatch,
} from "@/types/traceability";

const STORAGE_KEYS = {
  batches: "tempepass_batches_v1",
  producers: "tempepass_producers_v1",
  feedback: "tempepass_feedback_v1",
  session: "tempepass_session_v1",
  locale: "tempepass_locale_v1",
} as const;

interface TraceabilityContextValue {
  batches: TempeBatch[];
  producers: ProducerProfile[];
  feedback: BuyerFeedback[];
  locale: Locale;
  setLocale: (locale: Locale) => void;
  activeProducerId: string | null;
  activeProducer: ProducerProfile | null;
  isHydrated: boolean;
  scannerOpen: boolean;
  setScannerOpen: (open: boolean) => void;
  loginAsProducer: (email: string, pin: string) => {
    ok: boolean;
    error?: string;
  };
  loginDemoProducer: (producerId: string) => void;
  logoutProducer: () => void;
  getBatchById: (batchId: string) => TempeBatch | undefined;
  getProducerById: (producerId: string) => ProducerProfile | undefined;
  addBatch: (batch: TempeBatch) => void;
  updateBatchStatus: (batchId: string, status: BatchStatus) => void;
  incrementBatchScan: (batchId: string) => void;
  addFeedback: (
    entry: Omit<BuyerFeedback, "id" | "createdAt">
  ) => BuyerFeedback;
  updateProducerProfile: (
    producerId: string,
    updates: Partial<
      Pick<
        ProducerProfile,
        | "name"
        | "ownerName"
        | "pirtNumber"
        | "halalNumber"
        | "storyId"
        | "storyEn"
        | "dailyCapacityKg"
      >
    >
  ) => void;
  resetDemoData: () => void;
}

const TraceabilityContext = createContext<TraceabilityContextValue | null>(
  null
);

function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Failed to parse localStorage key "${key}", using seed.`, error);
    return fallback;
  }
}

export function TraceabilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [batches, setBatches] = useState<TempeBatch[]>(SEED_BATCHES);
  const [producers, setProducers] = useState<ProducerProfile[]>(SEED_PRODUCERS);
  const [feedback, setFeedback] = useState<BuyerFeedback[]>(SEED_FEEDBACK);
  const [activeProducerId, setActiveProducerId] = useState<string | null>(null);
  const [locale, setLocaleState] = useState<Locale>("id");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setBatches(safeReadJson<TempeBatch[]>(STORAGE_KEYS.batches, SEED_BATCHES));
    setProducers(
      safeReadJson<ProducerProfile[]>(STORAGE_KEYS.producers, SEED_PRODUCERS)
    );
    setFeedback(
      safeReadJson<BuyerFeedback[]>(STORAGE_KEYS.feedback, SEED_FEEDBACK)
    );
    setActiveProducerId(
      safeReadJson<string | null>(STORAGE_KEYS.session, null)
    );
    const savedLocale = safeReadJson<Locale>(STORAGE_KEYS.locale, "id");
    setLocaleState(savedLocale === "en" ? "en" : "id");
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEYS.batches, JSON.stringify(batches));
      window.localStorage.setItem(
        STORAGE_KEYS.producers,
        JSON.stringify(producers)
      );
      window.localStorage.setItem(
        STORAGE_KEYS.feedback,
        JSON.stringify(feedback)
      );
      window.localStorage.setItem(
        STORAGE_KEYS.session,
        JSON.stringify(activeProducerId)
      );
      window.localStorage.setItem(STORAGE_KEYS.locale, JSON.stringify(locale));
    } catch (error) {
      console.warn("Unable to persist TempePass state to localStorage.", error);
    }
  }, [batches, producers, feedback, activeProducerId, locale, isHydrated]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);

  const loginAsProducer = useCallback(
    (email: string, pin: string) => {
      const normalized = email.trim().toLowerCase();
      const found = producers.find(
        (p) => p.email.toLowerCase() === normalized && p.pin === pin.trim()
      );
      if (!found) {
        return {
          ok: false,
          error:
            "Email atau PIN tidak cocok. Gunakan akun demo di bawah untuk masuk instan.",
        };
      }
      setActiveProducerId(found.id);
      return { ok: true };
    },
    [producers]
  );

  const loginDemoProducer = useCallback((producerId: string) => {
    setActiveProducerId(producerId);
  }, []);

  const logoutProducer = useCallback(() => {
    setActiveProducerId(null);
  }, []);

  const getBatchById = useCallback(
    (batchId: string) => {
      const normalized = decodeURIComponent(batchId).trim().toUpperCase();
      return batches.find((b) => b.id.toUpperCase() === normalized);
    },
    [batches]
  );

  const getProducerById = useCallback(
    (producerId: string) => producers.find((p) => p.id === producerId),
    [producers]
  );

  const addBatch = useCallback((batch: TempeBatch) => {
    setBatches((prev) => [batch, ...prev]);
  }, []);

  const updateBatchStatus = useCallback(
    (batchId: string, status: BatchStatus) => {
      const nowIso = new Date().toISOString();
      setBatches((prev) =>
        prev.map((batch) => {
          if (batch.id !== batchId) return batch;
          const progressByStatus: Record<BatchStatus, number> = {
            fermenting: 72,
            quality_check: 95,
            packaged: 100,
            dispatched: 100,
          };
          const updatedStages = batch.stages.map((stage) => {
            if (status === "packaged" || status === "dispatched") {
              return {
                ...stage,
                completed: true,
                timestamp: stage.timestamp ?? nowIso,
              };
            }
            if (status === "quality_check" && stage.key === "fermentation") {
              return {
                ...stage,
                completed: true,
                timestamp: stage.timestamp ?? nowIso,
              };
            }
            return stage;
          });
          return {
            ...batch,
            status,
            fermentationProgressPct: progressByStatus[status],
            production: {
              ...batch.production,
              packagedAt:
                status === "packaged" || status === "dispatched"
                  ? batch.production.packagedAt ?? nowIso
                  : batch.production.packagedAt,
            },
            distribution: {
              ...batch.distribution,
              dispatchDate:
                status === "dispatched"
                  ? batch.distribution.dispatchDate ?? nowIso.slice(0, 10)
                  : batch.distribution.dispatchDate,
            },
            stages: updatedStages,
          };
        })
      );
    },
    []
  );

  const incrementBatchScan = useCallback((batchId: string) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId ? { ...b, scanCount: b.scanCount + 1 } : b
      )
    );
  }, []);

  const addFeedback = useCallback(
    (entry: Omit<BuyerFeedback, "id" | "createdAt">) => {
      const created: BuyerFeedback = {
        ...entry,
        id: `fb-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setFeedback((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const updateProducerProfile = useCallback(
    (
      producerId: string,
      updates: Partial<
        Pick<
          ProducerProfile,
          | "name"
          | "ownerName"
          | "pirtNumber"
          | "halalNumber"
          | "storyId"
          | "storyEn"
          | "dailyCapacityKg"
        >
      >
    ) => {
      setProducers((prev) =>
        prev.map((p) => (p.id === producerId ? { ...p, ...updates } : p))
      );
    },
    []
  );

  const resetDemoData = useCallback(() => {
    setBatches(SEED_BATCHES);
    setProducers(SEED_PRODUCERS);
    setFeedback(SEED_FEEDBACK);
  }, []);

  const activeProducer = useMemo(
    () => producers.find((p) => p.id === activeProducerId) ?? null,
    [producers, activeProducerId]
  );

  const value = useMemo<TraceabilityContextValue>(
    () => ({
      batches,
      producers,
      feedback,
      locale,
      setLocale,
      activeProducerId,
      activeProducer,
      isHydrated,
      scannerOpen,
      setScannerOpen,
      loginAsProducer,
      loginDemoProducer,
      logoutProducer,
      getBatchById,
      getProducerById,
      addBatch,
      updateBatchStatus,
      incrementBatchScan,
      addFeedback,
      updateProducerProfile,
      resetDemoData,
    }),
    [
      batches,
      producers,
      feedback,
      locale,
      setLocale,
      activeProducerId,
      activeProducer,
      isHydrated,
      scannerOpen,
      loginAsProducer,
      loginDemoProducer,
      logoutProducer,
      getBatchById,
      getProducerById,
      addBatch,
      updateBatchStatus,
      incrementBatchScan,
      addFeedback,
      updateProducerProfile,
      resetDemoData,
    ]
  );

  return (
    <TraceabilityContext.Provider value={value}>
      {children}
    </TraceabilityContext.Provider>
  );
}

export function useTraceability(): TraceabilityContextValue {
  const ctx = useContext(TraceabilityContext);
  if (!ctx) {
    throw new Error("useTraceability must be used within TraceabilityProvider");
  }
  return ctx;
}
