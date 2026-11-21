<div align="center">

  <br />

  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="68" height="68" rx="20" fill="#9A4D1A" />
    <rect x="7" y="7" width="54" height="54" rx="14" fill="#FAF6EE" />
    <path d="M22 24C22 22.8954 22.8954 22 24 22H44C45.1046 22 46 22.8954 46 24V28C46 29.1046 45.1046 30 44 30H37V44C37 45.1046 36.1046 46 35 46H33C31.8954 46 31 45.1046 31 44V30H24C22.8954 30 22 29.1046 22 28V24Z" fill="#9A4D1A" />
    <circle cx="45" cy="45" r="5" fill="#23603E" />
    <circle cx="45" cy="45" r="2.5" fill="#FAF6EE" />
  </svg>

  <h1 align="center">TempePass</h1>

  <p align="center">
    <strong>Bilingual Digital Batch Traceability & Product Passport Platform for Indonesian Artisanal Tempe MSMEs</strong>
  </p>

  <p align="center">
    Empowering traditional soybean fermenters to transition from fragile paper notes to audit-ready, QR-based digital passports aligned with CPPB-IRT and international export food safety benchmarks.
  </p>

  <p align="center">
    <a href="#-core-surfaces">Core Surfaces</a> •
    <a href="#-problem-grounding--field-research">Field Research</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-craft-standards--design-system">Design System</a> •
    <a href="#-local-development">Getting Started</a> •
    <a href="#-demo-producer-accounts">Demo Access</a> •
    <a href="#-standards--regulatory-alignment">Compliance</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-15.2.0%20(App%20Router)-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 15" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
    <img src="https://img.shields.io/badge/Framer_Motion-12.4-FF0055?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-23603E?style=flat-square" alt="WCAG AA" />
    <img src="https://img.shields.io/badge/License-MIT-9A4D1A?style=flat-square" alt="License MIT" />
  </p>

  <br />

</div>

---

## Executive Summary

**TempePass** is a web-native batch traceability ecosystem designed to bridge the trust and verification gap between Indonesian household tempe workshops (*Usaha Mikro, Kecil, dan Menengah / UMKM*) and high-value buyers—including modern domestic supermarkets and global plant-based protein importers.

By turning traditional fermentation batches into **verifiable Digital Product Passports (DPP)** accessible via mobile QR scans, TempePass enables producers to demonstrate hygiene protocol compliance (CPPB-IRT), raw soybean pedigree (local non-GMO vs. certified imports), starter culture vitality (*Rhizopus* strains), and cold-chain shelf life without installing proprietary hardware or complex enterprise ERPs.

---

## Problem Grounding & Field Research

The platform's architecture is rooted in field findings from household tempe clusters in **Desa Mlirip, Kabupaten Mojokerto, East Java** (Wulandari et al., 2024), synthesized with smallholder traceability patterns pioneered by *Aruna* (marine supply chains) and *Wholechain* (agricultural batch verification):

```
┌──────────────────────────────────────────────┐       ┌──────────────────────────────────────────────┐
│        TRADITIONAL WORKSHOP REALITY          │       │             THE EXPORT PARADOX               │
├──────────────────────────────────────────────┤       ├──────────────────────────────────────────────┤
│ • Paper ledgers destroyed by steam/humidity. │  VS   │ • International buyers demand lot audits.    │
│ • Unrecorded soaking water changes & pH.     │       │ • Retailers require verifiable shelf life.   │
│ • No lot-code connection to physical pack.   │       │ • Strict non-GMO & allergen certifications.  │
│ • Producer reputation trapped within village.│       │ • Zero buyer feedback channel to craftsmen.  │
└──────────────────────────────────────────────┘       └──────────────────────────────────────────────┘
                                       │
                                       ▼
                 ┌──────────────────────────────────────────────┐
                 │             TEMPEPASS RESOLUTION             │
                 │   Zero-friction, mobile-first traceability   │
                 │   from workshop bucket to overseas dining.   │
                 └──────────────────────────────────────────────┘
```

1. **The Ledger Durability Problem**: Artisanal production involves boiling, de-hulling, and high-humidity incubation (85–95% RH). Paper notebooks rot or become illegible within months.
2. **The Verification Bottleneck**: Importers in Singapore, Japan, and the European Union require batch-specific proof of boiling temperatures, fermentation durations, and hygiene checks before signing supply agreements.
3. **The Language Barrier**: Overseas quality inspectors cannot parse handwritten Indonesian notes; domestic operators cannot navigate complex foreign compliance dashboards. TempePass defaults to **English** for export clarity while providing instant, reactive switching to **Bahasa Indonesia**.

---

## Core Surfaces

TempePass delivers four integrated surfaces designed for different stakeholders across the value chain:

```
                                    TEMPEPASS APPLICATION SURFACES
  ┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                                   │
  │   1. PUBLIC DISCOVERY & VERIFICATION      2. PUBLIC DIGITAL BATCH PASSPORT                        │
  │      Route: /                                Route: /b/[batchId]                                  │
  │      Target: General Public & Importers      Target: Consumers & Retail Inspectors                │
  │      • Instant Batch ID Lookup               • No-login instant QR destination                    │
  │      • Live In-Browser Camera Scanner        • 5-Stage verified fermentation timeline             │
  │      • 52h Biological Telemetry Simulator    • Raw material & starter lot provenance              │
  │      • Interactive Label Staging Studio      • CPPB-IRT sanitation checklist audit                │
  │                                                                                                   │
  │   3. MSME PRODUCER STUDIO                 4. PACKAGING QR PRINT STUDIO                            │
  │      Route: /studio                          Route: /studio/print/[batchId]                       │
  │      Target: Workshop Craftsmen & Ops        Target: Packaging & Warehouse Staff                  │
  │      • 2-Minute New Batch Generator          • A4 9-up layout (3x3 sheet format)                  │
  │      • Raw material & culture presets        • Single thermal sticker format (80x50mm)            │
  │      • Batch status progression pipeline     • Direct high-resolution SVG export                  │
  │      • Direct buyer feedback triage inbox    • Precision print CSS with page-break isolation      │
  │                                                                                                   │
  └───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1. Verification Landing Page (`/`)
* **Dual Search & Camera Scanner**: Enter any batch identifier (`TMP-MLR-2611-01`) or scan a physical package QR code in real-time via the integrated camera scanner powered by `jsqr`.
* **52-Hour Fermentation Physics Simulator**: Interactive telemetry scrubber demonstrating the 5 biological stages of *Rhizopus oligosporus* mycelium growth, mapping chamber temperature, relative humidity, and visual matrix solidification.
* **Live Packaging Sticker Playground**: Interactive label preview allowing users to toggle dimensions (50mm / 70mm / 90mm), customize headline copy, inspect scannability, and test direct redirection.
* **Dual Perspective Showcase**: Side-by-side presentation highlighting how the platform serves both the foreign buyer reviewing laboratory audits and the local producer recording batch lots on a mobile device.

### 2. Public Digital Batch Passport (`/b/[batchId]`)
* **Zero-Friction Consumer Access**: Scanned directly from grocery store shelves with no app download or authentication required.
* **Bilingual Switcher (`EN | ID`)**: Instant reactive switching across all verification badges, stage descriptions, safety guidelines, and legal permits.
* **Audit-Grade Timeline**: Chronological, timestamped records covering *Soybean Preparation*, *Inoculation*, *Aerated Incubation*, *Harvest Quality Gate*, and *Cold-Chain Distribution*.
* **Interactive Raw Material Provenance**: Expandable cards showing cultivar name, harvest cooperative, supplier lot code, moisture content, and starter culture strain (`R. oligosporus + R. oryzae`).
* **CPPB-IRT Sanitation Log**: Verified status tags for chlorine-free well water purification, stainless steel tool sanitization, worker glove/apron compliance, and pest exclusion.
* **Buyer Feedback Channel**: Direct ratings and issue reporting (packaging integrity, aroma, firmness, mycelium density) sent straight to the producer's private dashboard.
* **Printable Spec Sheet**: One-click generation of clean, monochrome audit certificates formatted for procurement dossiers.

### 3. MSME Producer Studio (`/studio`)
* **One-Click Demo Profiles**: Preloaded credentials for *Rumah Tempe Sumber Rejeki (Desa Mlirip)* and *Koperasi Tempe Maju Grobogan* for zero-barrier evaluation.
* **2-Minute Batch Creation Wizard**: Built-in raw material presets (Grobogan Non-GMO Local vs. Certified Canadian Imported) allow operators to register new production runs in under 120 seconds.
* **Zero Horizontal Scroll Table**: Strict tabular layout fitting 100% container width across both desktop monitors and rugged workshop tablets.
* **Status Progression Pipeline**: Single-click state transitions (`Inoculation` → `Incubating` → `Harvest Ready` → `Dispatched`).
* **Direct Buyer Feedback Inbox**: Real-time review of consumer feedback submitted via the public passport, complete with ratings and customer locations.

### 4. QR Label Print Studio (`/studio/print/[batchId]`)
* **Dual Production Formats**:
  * **A4 Multi-Up (3×3 Grid)**: 9 stickers per sheet with alignment tick marks for budget-conscious workshops utilizing standard laser or inkjet printers.
  * **Thermal Roll Format**: High-contrast 80×50mm single-label output optimized for direct-thermal packaging printers (Xprinter, Zebra, Phomemo).
* **Standalone Vector Export**: One-click SVG QR download for integration into commercial rotogravure or flexographic packaging plates.
* **Engineered Print CSS**: Includes `@media print` rules enforcing pure black inks, hiding UI navigation elements, and preventing undesirable page-break splits.

---

## Biological Fermentation Model

TempePass models the physical fermentation cycle of *Rhizopus oligosporus* based on tropical food science standards:

| Stage | Process Phase | Duration | Core Temp | Target RH | Key Quality Gate |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **01** | Soaking & Acidification | 0h – 14h | 28.0°C | 60% | Natural lactic acidification down to pH 4.5–5.0; prevents spoilage bacteria. |
| **02** | Boiling & Inoculation | 14h – 18h | 30.5°C | 70% | Thorough surface drying before *ragi* dusting; moisture excess causes contamination. |
| **03** | Mycelium Proliferation | 18h – 30h | 32.4°C | 88% | Exponential fungal respiration; heat buildup requires natural ventilation. |
| **04** | Matrix Solidification | 30h – 42h | 31.0°C | 85% | Complete white hyphae binding; temperature begins to decline naturally. |
| **05** | Harvest & Cold Storage | 42h – 52h | 4.0°C | 50% | Active chilling arrests fungal growth; seals cake integrity for dispatch. |

---

## System Architecture

TempePass is built with a client-centric reactive store architecture ensuring lightning-fast operation, offline resilience in low-connectivity workshops, and zero hydration discrepancies:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT BROWSER                                       │
│                                                                                        │
│   ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────┐   │
│   │   Next.js App Router   │ ───► │  TraceabilityContext   │ ───► │ LocalStorage   │   │
│   │   (React 19 Server/    │      │  (Bilingual Store &    │      │ (Offline State │   │
│   │    Client Components)  │      │   Reactive Mutations)  │      │  Persistence)  │   │
│   └────────────────────────┘      └────────────────────────┘      └────────────────┘   │
│               │                                │                                       │
│               ▼                                ▼                                       │
│   ┌────────────────────────┐      ┌────────────────────────┐                           │
│   │  Camera Video Stream   │      │   SVG / Canvas QR      │                           │
│   │  (jsQR Scanning Loop)  │      │   (qrcode.react Engine)│                           │
│   └────────────────────────┘      └────────────────────────┘                           │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Key Technical Choices
* **Next.js 15 (App Router)**: Hybrid Server and Client Components provide near-instant initial HTML delivery with interactive client-side sub-trees.
* **Tailwind CSS v4 Engine**: Modern cascade-layer styling featuring native CSS variable mapping without heavy preprocessors.
* **Framer Motion**: Purpose-built spring physics (`damping: 24`, `stiffness: 280`) configured with global `MotionConfig` to honor `prefers-reduced-motion`.
* **Zero-Network Self-Hosted Fonts**: Incorporates `@fontsource/fraunces`, `@fontsource/plus-jakarta-sans`, and `@fontsource/ibm-plex-mono` to prevent external Google Fonts network calls and ensure offline-first compliance.
* **SSR Hydration Guard**: Dynamic origin resolution (`window.location.origin`) is deferred until client mount, guaranteeing identical server/client render trees.

---

## Craft Standards & Design System

The visual identity is derived directly from the tactile materials of Indonesian tempe craftsmanship: snowy mycelium hyphae, roasted soybeans, unbleached kraft paper, and tabular laboratory records.

### WCAG 2.1 AA Verified Palette

```
  #FAF6EE            #F2EAD9            #9A4D1A            #1C130C            #23603E
Canvas Ivory       Soybean Tray       Tempe Amber        Incubation Dark    Verified Forest
```

| Token | Hex Code | Contrast vs Text | Purpose / Usage |
| :--- | :---: | :---: | :--- |
| `--bg-canvas` | `#FAF6EE` | 16.18 : 1 | Fresh mycelium background canvas; warm, non-glare reading surface. |
| `--bg-tray` | `#F2EAD9` | 14.80 : 1 | Outer tray container in double-bezel card architectures. |
| `--bg-surface` | `#FFFDF9` | 17.10 : 1 | Elevated inner core cards for crisp data presentation. |
| `--ink-primary` | `#24170E` | — | Dark roasted espresso soy ink for primary headings and values. |
| `--ink-secondary` | `#634B3A` | 4.85 : 1 | Warm cocoa husk ink for explanatory body copy and metadata. |
| `--brand-primary` | `#9A4D1A` | 6.09 : 1 | Caramelized tempe amber-brown for high-priority action buttons. |
| `--brand-gold` | `#D99429` | — | Steamed golden soybean accent for telemetry highlights and badges. |
| `--status-verified` | `#23603E` | 4.65 : 1 | Forest green strictly reserved for certified audits and CPPB passes. |
| `--bg-chamber` | `#1C130C` | — | Deep roasted crust background for the dark fermentation chamber. |

### Structural Craft Rules
1. **Double-Bezel Container Architecture**: Cards utilize an outer soft-porcelain tray (`rounded-[1.75rem] ring-1 ring-[#E2D5BE] bg-[#F2EAD9]/70 p-2`) framing an elevated inner card (`rounded-[1.25rem] bg-[#FFFDF9] shadow-sm`).
2. **Button-in-Button Action CTAs**: Primary action buttons feature nested trailing sub-elements (`rounded-full bg-white/15 p-1`) providing tactile optical weight.
3. **Zero Horizontal Table Scroll**: Data tables fit 100% container width across all viewports using two-tier stacked typography instead of wide overflow tables.
4. **Typographic Discipline**:
   * *Display*: `Fraunces Variable` (soft-optical editorial serif for titles and producer names).
   * *Interface*: `Plus Jakarta Sans Variable` (clean, contemporary sans for UI controls).
   * *Telemetry*: `IBM Plex Mono` with `tabular-nums` for lot IDs, dates, and temperatures.

---

## Standards & Regulatory Alignment

TempePass directly supports documentation requirements under international and domestic food safety frameworks:

| Standard / Body | Scope | How TempePass Supports Compliance |
| :--- | :--- | :--- |
| **BPOM CPPB-IRT** | Good Household Manufacturing Practices | Timestamped daily logs for water cleanliness, equipment sanitization, and worker hygiene. |
| **SNI 3144:2015** | Indonesian National Standard for Tempe | Documents soybean variety, moisture controls, and visual mycelium compactness. |
| **Codex Alimentarius** | CXS 313R-2013 Regional Tempe Standard | Provides batch-verifiable records of fermentation temperature and raw material provenance. |
| **HACCP Pre-requisite** | Hazard Analysis Critical Control Points | Tracks Critical Control Point #1 (boiling pasteurization) and CCP #2 (incubation temp limit). |
| **EU / US FDA DPP** | Digital Product Passport Directives | QR-based instant retrieval of supplier lot codes, non-GMO status, and allergen declarations. |

> **Disclaimer**: TempePass provides digital record-keeping and audit transparency. It complements, and does not replace, mandatory statutory audits conducted by BPOM, the Ministry of Health, or accredited Halal certification agencies (BPJPH).

---

## Local Development

### Prerequisites
* **Node.js**: v18.18.0 or higher (v20.x recommended)
* **Package Manager**: `npm`, `pnpm`, or `yarn`

### Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/LindungiLw/tempepass.git
cd tempepass

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Quality Verification

```bash
# Type check TypeScript without emitting files
npx tsc --noEmit

# Execute Next.js production build
npm run build

# Start local production build
npm run start
```

---

## Demo Producer Accounts

You can test the full MSME studio workflow using the one-click demo selectors on the `/login` screen or with these credentials:

| Workshop Profile | Location | Demo Email | Access PIN | Specialization |
| :--- | :--- | :--- | :---: | :--- |
| **Rumah Tempe Sumber Rejeki** | Desa Mlirip, Mojokerto | `sumberrejeki@mlirip.example` | `2026` | Artisanal non-GMO banana leaf wrap & export vacuum blocks. |
| **Koperasi Tempe Maju Grobogan** | Purwodadi, Grobogan | `koperasi@tempegrobogan.example` | `2026` | High-volume single-origin Grobogan certified local beans. |

### Sample Public Batch Passports
Test public QR scans directly using these pre-seeded batch routes:
* `/b/TMP-MLR-2611-01` — Export Vacuum Pack (Desa Mlirip) • Status: *Dispatched / Export Transit*
* `/b/TMP-MLR-2611-02` — Traditional Banana Leaf Wrap (Desa Mlirip) • Status: *Harvest Ready*
* `/b/TMP-MLR-2611-03` — Retail Perforated Film Pack (Desa Mlirip) • Status: *Incubating (36h)*
* `/b/TMP-GRB-2611-08` — Single-Origin Grobogan Organic Block • Status: *Dispatched*

---

## Project Structure

```
digitalbusiness/
├── public/
│   └── images/                     # Curated editorial photography
│       ├── tempe-macro.jpg         # Microscopic hyphae & soybean detail
│       ├── tempe-fermentation.jpg  # Traditional wooden incubation racks
│       └── tempe-export.jpg        # Cleanroom export packaging
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with self-hosted fonts & metadata
│   │   ├── globals.css             # Tailwind v4 theme variables & print rules
│   │   ├── page.tsx                # Public verification & discovery landing page
│   │   ├── not-found.tsx           # Themed 404 recovery route
│   │   ├── b/
│   │   │   └── [batchId]/          # Public Digital Batch Passport
│   │   │       ├── page.tsx
│   │   │       └── BatchPassportView.tsx
│   │   ├── login/                  # MSME operator authentication
│   │   │   └── page.tsx
│   │   └── studio/                 # MSME workshop operational workspace
│   │       ├── page.tsx
│   │       ├── StudioWorkspace.tsx
│   │       ├── NewBatchModal.tsx
│   │       └── print/[batchId]/    # Packaging QR print studio
│   ├── components/
│   │   ├── common/                 # AppShell, Navigation, Footer, BrandMark
│   │   ├── landing/                # FermentationSimulator, PlatformShowcase, etc.
│   │   ├── passport/               # Timeline, ProvenanceCard, FeedbackForm
│   │   └── qr/                     # QrCodeCard, QrScannerModal
│   ├── context/
│   │   └── TraceabilityContext.tsx # Central bilingual store & state management
│   ├── data/
│   │   └── seedData.ts             # Realistic workshop batches & CPPB logs
│   ├── lib/
│   │   └── format.ts               # Date, currency, and locale formatters
│   └── types/
│       └── traceability.ts         # Complete domain TypeScript definitions
├── DESIGN.md                       # Design system, tokens, and motion guidelines
├── PRODUCT.md                      # Problem grounding and surface specifications
└── README.md                       # Project documentation
```

---

<div align="center">

  <p>
    Built with craft and respect for Indonesian culinary heritage.
  </p>

  <p>
    <sub>TempePass is an open-source demonstration project for smallholder supply chain digitization.</sub>
  </p>

</div>
