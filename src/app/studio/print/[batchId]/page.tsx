import type { Metadata } from "next";
import { PrintLabelView } from "@/components/studio/PrintLabelView";

export const metadata: Metadata = {
  title: "Cetak Stiker QR Kemasan",
  description: "Lembar cetak stiker QR batch tempe untuk printer termal dan A4.",
};

interface PrintPageProps {
  params: Promise<{ batchId: string }>;
}

export default async function StudioPrintPage({ params }: PrintPageProps) {
  const { batchId } = await params;
  return <PrintLabelView batchId={batchId} />;
}
