import type { Metadata } from "next";
import { PrintLabelView } from "@/components/studio/PrintLabelView";

export const metadata: Metadata = {
  title: "Print Package QR Stickers",
  description:
    "Print-ready tempe batch QR packaging stickers for thermal roll printers and A4 sticker sheets.",
};

interface PrintPageProps {
  params: Promise<{ batchId: string }>;
}

export default async function StudioPrintPage({ params }: PrintPageProps) {
  const { batchId } = await params;
  return <PrintLabelView batchId={batchId} />;
}
