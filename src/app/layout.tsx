import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/ibm-plex-mono/700.css";
import "./globals.css";
import { TraceabilityProvider } from "@/context/TraceabilityContext";
import { MotionProvider } from "@/components/MotionProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QrScannerModal } from "@/components/QrScannerModal";

export const metadata: Metadata = {
  title: {
    default: "TempePass | Web Traceability UMKM Tempe Indonesia",
    template: "%s | TempePass",
  },
  description:
    "Sistem traceability berbasis web dan QR code untuk membantu UMKM tempe Indonesia mencatat asal kedelai, fermentasi, sanitasi CPPB, dan kesiapan akses pasar internasional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-dvh bg-[#FAF6EE] text-[#24170E] antialiased selection:bg-[#9A4D1A] selection:text-[#FFFDF9]">
        <TraceabilityProvider>
          <MotionProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#24170E] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
            >
              Skip to main content
            </a>
            <div className="flex min-h-dvh flex-col">
              <Navbar />
              <div id="main-content" className="flex-1">
                {children}
              </div>
              <Footer />
            </div>
            <QrScannerModal />
          </MotionProvider>
        </TraceabilityProvider>
      </body>
    </html>
  );
}
