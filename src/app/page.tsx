import React from "react";
import { ActiveHero } from "@/components/landing/ActiveHero";
import { FermentationSimulator } from "@/components/landing/FermentationSimulator";
import { PlatformShowcase } from "@/components/landing/PlatformShowcase";
import { ExportManifesto } from "@/components/landing/ExportManifesto";
import { LiveStickerPlayground } from "@/components/landing/LiveStickerPlayground";

export default function HomePage() {
  return (
    <main>
      <ActiveHero />
      <FermentationSimulator />
      <PlatformShowcase />
      <ExportManifesto />
      <LiveStickerPlayground />
    </main>
  );
}
