import type { Metadata } from "next";
import { StudioWorkspace } from "@/components/studio/StudioWorkspace";

export const metadata: Metadata = {
  title: "Studio Pengrajin UMKM",
  description:
    "Kelola batch produksi tempe, ceklis sanitasi CPPB, pesan buyer, dan cetak stiker QR kemasan.",
};

export default function StudioPage() {
  return <StudioWorkspace />;
}
