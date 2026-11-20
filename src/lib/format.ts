import { BatchStatus, DistributionChannel, Locale } from "@/types/traceability";

export function formatDate(iso: string | null, locale: Locale): string {
  if (!iso) return locale === "id" ? "Belum tercatat" : "Pending";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export function formatDateTime(iso: string | null, locale: Locale): string {
  if (!iso) return locale === "id" ? "Menunggu proses" : "In progress";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export function getStatusLabel(status: BatchStatus, locale: Locale): string {
  const labels: Record<BatchStatus, { id: string; en: string }> = {
    fermenting: { id: "Sedang Fermentasi", en: "Fermenting" },
    quality_check: { id: "Inspeksi Mutu", en: "Quality Check" },
    packaged: { id: "Siap Distribusi", en: "Packaged & Verified" },
    dispatched: { id: "Terkirim", en: "Dispatched" },
  };
  return labels[status][locale];
}

export function getChannelLabel(
  channel: DistributionChannel,
  locale: Locale
): string {
  const labels: Record<DistributionChannel, { id: string; en: string }> = {
    local_market: { id: "Pasar Lokal", en: "Local Market" },
    modern_retail: { id: "Ritel Modern", en: "Modern Retail" },
    export_consignment: { id: "Konsinyasi Ekspor", en: "Export Consignment" },
  };
  return labels[channel][locale];
}

export function generateBatchId(
  producerCode: string,
  productionDate: string,
  existingIds: string[]
): string {
  const dateObj = new Date(productionDate || Date.now());
  const yy = String(dateObj.getFullYear()).slice(-2);
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const prefix = `TMP-${producerCode.toUpperCase()}-${yy}${mm}-`;

  let seq = 1;
  while (
    existingIds.includes(`${prefix}${String(seq).padStart(2, "0")}`) &&
    seq < 999
  ) {
    seq += 1;
  }

  return `${prefix}${String(seq).padStart(2, "0")}`;
}

export function buildPassportUrl(batchId: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/b/${encodeURIComponent(batchId)}`;
  }
  return `https://tempepass.example/b/${encodeURIComponent(batchId)}`;
}

export function extractBatchIdFromScan(rawValue: string): string {
  const trimmed = rawValue.trim();
  const pathMatch = trimmed.match(/\/b\/([A-Za-z0-9_-]+)/i);
  if (pathMatch && pathMatch[1]) {
    return decodeURIComponent(pathMatch[1]).toUpperCase();
  }
  return trimmed.toUpperCase();
}
