# PRODUCT.md — TempePass

## Overview
**TempePass** is a web-based batch traceability platform designed for Indonesian tempe micro, small, and medium enterprises (MSMEs) to digitize production logs, generate printable package QR stickers, and provide bilingual (Indonesian / English) digital product passports for domestic consumers and international buyers.

## Problem Grounding
Based on `First Draft.docx` and field observations of household tempe producers in Desa Mlirip, Mojokerto (Wulandari et al., 2024):
- Tempe MSMEs commonly log raw materials, fermentation timing, and packaging manually on paper notebooks, which are easily damaged or misplaced in humid production areas.
- Buyers (modern retail and international importers) lack verifiable batch records: soybean origin (local non-GMO vs imported), starter culture (*ragi*), fermentation duration, CPPB sanitation adherence, and shelf-life guidelines.
- Existing reference patterns: **Aruna** (Indonesian small-producer supply chain digitization) and **Wholechain** (Traceability-as-a-Service for small agricultural processors).

## Core Surfaces & Modes
1. **Landing & Live Verification Portal (`/`)** — Mode: **Persuade + Interactive Utility**
   - Active hero with instant Batch ID lookup, live browser camera QR scanner, and an interactive live passport preview switcher.
   - Interactive 5-stage fermentation traceability simulator (0h to 48h physical process model).
   - Dual-perspective product preview (Export Buyer Passport vs MSME Studio).
   - Export documentation manifest & live QR sticker playground.
2. **Public Digital Batch Passport (`/b/[batchId]`)** — Mode: **Read**
   - Direct destination of package QR codes with zero login friction.
   - Bilingual toggle (`ID` / `EN`), authenticity verification header, 5-stage timestamped production timeline, raw material lot provenance, CPPB hygiene log, storage & freshness instructions, printable buyer spec sheet, and direct customer/buyer feedback submission.
3. **Producer Login (`/login`) & Producer Studio (`/studio`)** — Mode: **Operate**
   - Purpose-built daily workspace for tempe craftsmen: active batch ledger, 2-minute new batch recorder using raw-material presets, CPPB daily hygiene checklist, incoming buyer feedback inbox, producer profile management, and printable QR label studio (`/studio/print/[batchId]`).

## Scope & Honesty Boundary
TempePass supports export readiness through structured documentation, batch transparency, and audit-ready records. It complements, and does not replace, official export clearance, BPOM food safety inspections, or Halal certification.
