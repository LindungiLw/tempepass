import type { Metadata } from "next";
import { StudioWorkspace } from "@/components/studio/StudioWorkspace";

export const metadata: Metadata = {
  title: "MSME Producer Studio",
  description:
    "Manage tempe production batches, daily CPPB hygiene checks, buyer inquiries, and printable package QR stickers.",
};

export default function StudioPage() {
  return <StudioWorkspace />;
}
