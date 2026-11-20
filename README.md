# TempePass

Web-based batch traceability platform for Indonesian tempe micro, small, and medium enterprises (MSMEs).

TempePass helps tempe workshops replace handwritten production notes with digital batch logs, printable packaging QR stickers, and bilingual (Indonesian / English) product passports that retail buyers and international importers can open directly in any mobile browser.

## Core Surfaces

- **Verification Landing Page (`/`)**: Direct batch ID lookup, live browser camera QR scanner, interactive 3-batch passport switcher, 5-stage fermentation timeline simulator (0 to 52 hours), and a live QR sticker customizer.
- **Public Digital Batch Passport (`/b/[batchId]`)**: Accessible without login by scanning a package QR code. Displays authenticity verification, bilingual ID/EN toggle, raw-material and starter culture lot codes, 5-stage production timeline, CPPB daily sanitation checks, storage guidelines, printable buyer spec sheet, and buyer feedback submission.
- **MSME Producer Login (`/login`) & Studio (`/studio`)**: Operational workspace for craftsmen with one-click demo access, 2-minute batch entry using saved material presets, CPPB daily checklist, batch status progression, incoming buyer feedback inbox, and legal certification profile management.
- **Printable QR Sticker Studio (`/studio/print/[batchId]`)**: Print-ready layouts for A4 9-up sticker sheets and single thermal labels, plus direct SVG QR download.

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion (with `prefers-reduced-motion` support)
- `qrcode.react` (QR generation) & `jsqr` (in-browser camera QR scanning)
- `@phosphor-icons/react` & self-hosted `@fontsource` fonts (`Fraunces Variable`, `Plus Jakarta Sans Variable`, `IBM Plex Mono`)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

For production build verification:

```bash
npm run build
npm run start
```

## Demo Producer Accounts

On `/login`, select a one-click demo profile or sign in manually:

| Workshop | Location | Email | PIN |
| :--- | :--- | :--- | :--- |
| Rumah Tempe Sumber Rejeki | Desa Mlirip, Mojokerto | `sumberrejeki@mlirip.example` | `2026` |
| Koperasi Tempe Maju Grobogan | Purwodadi, Grobogan | `koperasi@tempegrobogan.example` | `2026` |

Sample public batch URLs: `/b/TMP-MLR-2611-01`, `/b/TMP-MLR-2611-02`, `/b/TMP-MLR-2611-03`, `/b/TMP-GRB-2611-08`.

## Scope Notice

TempePass supports batch transparency, CPPB documentation, and export readiness. It complements, and does not replace, official BPOM inspections, export clearance, or Halal certification.
