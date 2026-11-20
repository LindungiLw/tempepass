# DESIGN.md — TempePass Visual & Motion System

## Visual World
Rooted directly in the physical materials of Indonesian artisanal tempe and export food inspection sheets: snowy-white *Rhizopus* mycelium, golden steamed soybeans, caramelized roasted tempe crust, unbleached kraft shipping paper, and crisp tabular laboratory timestamps.

## Verified Tempe Color Palette (WCAG AA Checked)
- **Canvas (`--bg-canvas`):** `#FAF6EE` (Fresh Mycelium Ivory)
- **Tray / Secondary Surface (`--bg-tray`):** `#F2EAD9` (Steamed Soybean Husk)
- **Elevated Surface (`--bg-surface`):** `#FFFDF9` (Pure Warm Cream)
- **Hairline Border (`--border-hairline`):** `#E2D5BE` (Toasted Soy Skin)
- **Primary Ink (`--ink-primary`):** `#24170E` (Dark Roasted Espresso Soy)
- **Secondary Ink (`--ink-secondary`):** `#634B3A` (Warm Cocoa Husk)
- **Primary Brand Accent (`--brand-primary`):** `#9A4D1A` (Caramelized Tempe Amber-Brown)
- **Primary Brand Hover (`--brand-hover`):** `#7D3C12` (Deep Fried Tempe Crust)
- **Soybean Gold Accent (`--brand-gold`):** `#D99429` / `#EBB44C` (Steamed Golden Soybean — used for dark-band highlights, fermentation telemetry, and subtle markers)
- **Dark Fermentation Chamber Band (`--bg-chamber`):** `#1C130C` (Deep Roasted Crust)
- **Functional Verified Status (`--status-verified`):** `#23603E` (Strictly reserved for Verified Batch / CPPB Passed badges, paired with icon + text)

## Typography
- **Display / Editorial Serif:** `Fraunces` (warm, soft-optical-size editorial serif for headlines, producer names, and product titles; tracking `-0.03em`)
- **UI & Body Sans:** `Plus Jakarta Sans` (clear, legible across Indonesian & English interfaces and mobile viewports)
- **Technical Data & Batch Codes:** `IBM Plex Mono` with `font-variant-numeric: tabular-nums` strictly for Batch IDs (`TMP-MLR-2611-01`), temperatures (`32.4°C`), durations (`36h`), lot numbers, and timestamps.

## Craft Floor & Structural Principles
- **Double-Bezel Primary Containers:** Outer soft porcelain/soy tray (`rounded-[1.75rem] ring-1 ring-[#E2D5BE] bg-[#F2EAD9]/70 p-2`) framing an elevated inner core card (`rounded-[1.25rem] bg-[#FFFDF9] shadow-sm`).
- **Button-in-Button Primary CTAs:** Primary solid `#9A4D1A` buttons with pure `#FFFFFF` text and a nested circular trailing action icon container (`rounded-full bg-white/15`).
- **Zero Slop Rules:** No eyebrow pills above H1, no generic 3-equal-card feature grids, no rainbow pastel badge soup, no fake hero metric counters, no horizontal table scroll on desktop or mobile, minimum `44x44px` touch targets, `cursor: pointer` on all interactive controls, custom themed text selection & focus rings (`#9A4D1A`).

## Motion Thesis (Startup Polish)
- **Focal Moment:** The live interactive Tempe Passport switcher in the hero (smooth QR scan laser sweep, shared-element `layoutId` active indicator, animated fermentation temperature/progress gauge) and the 5-stage fermentation timeline scrubber on the dark incubation chamber band.
- **Continuity:** Shared-element tab pills (`layoutId`), smooth modal/drawer springs, instant bilingual ID/EN crossfades.
- **Timing & Easing:** Confident exponential deceleration `[0.16, 1, 0.3, 1]` (150ms tactile presses, 300ms routine transitions, 550ms focal reveals).
- **Accessibility:** Full `prefers-reduced-motion` support via Framer Motion `<MotionConfig reducedMotion="user">` so spatial displacement reduces cleanly while preserving clear state transitions.
