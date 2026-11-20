import type { Metadata } from "next";
import { SEED_BATCHES, SEED_PRODUCERS } from "@/data/seedData";
import { BatchPassportView } from "@/components/passport/BatchPassportView";

interface PageProps {
  params: Promise<{ batchId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { batchId } = await params;
  const decoded = decodeURIComponent(batchId).toUpperCase();
  const batch = SEED_BATCHES.find((b) => b.id.toUpperCase() === decoded);
  const producer = batch
    ? SEED_PRODUCERS.find((p) => p.id === batch.producerId)
    : null;

  if (!batch || !producer) {
    return {
      title: `Batch ${decoded}`,
      description:
        "Digital Batch Passport verification for Indonesian Tempe MSME.",
    };
  }

  return {
    title: `${batch.id} · ${batch.productName}`,
    description: `${producer.name} (${producer.village}, ${producer.regency}) · ${batch.rawMaterials.soybeanVariety} · ${batch.production.fermentationHours}h fermentation · CPPB Verified.`,
  };
}

export default async function BatchPassportPage({ params }: PageProps) {
  const { batchId } = await params;
  return <BatchPassportView batchId={batchId} />;
}
