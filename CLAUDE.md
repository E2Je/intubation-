# CLAUDE.md - Intubation Checklist App

## Project Identity
Medical intubation checklist app for Hadassah Medical Center.
Guides clinical teams through elective intubation protocol step-by-step.
Target: tablet + phone (glove-friendly UI, RTL Hebrew).
Live at: https://e2je.github.io/intubation-/

## Stack
- React 19 + Vite + TypeScript
- Tailwind v4 (`@tailwindcss/vite` plugin, `@custom-variant dark` for class-based dark mode)
- Zustand (`persist` middleware → `localStorage` key: `intubation-checklist-v1`)
- GitHub Pages via Actions (`/.github/workflows/deploy.yml`)

## File Map
```
src/
  data/protocol.ts          # All clinical data (sections, meds, hard airway) as typed TS
  store/checklistStore.ts   # Zustand store — all state + actions
  hooks/useVersionCheck.ts  # Polls version.json every 90s, shows update banner
  utils/
    assetPath.ts            # assetUrl(filename) — handles BASE_URL + encodeURIComponent
    sound.ts                # Web Audio API click sounds
  components/
    WeightModal.tsx          # Entry screen — weight + adult/pediatric
    SectionNav.tsx           # 3 tabs (הכנה / ציוד / אחרי) with done/total counts
    SectionList.tsx          # Accordion checklist — auto-advances section after last item
    HardAirwayOverlay.tsx    # Same accordion, dedicated to hard airway items
    IntubationStartBanner.tsx # Fixed overlay — shows only when ALL ציוד items filled
    LMAWarningModal.tsx      # Confirm modal before starting intubation
    MedicationDrawer.tsx     # Bottom sheet — drug calculator + inline iOS calculator
    MedicationFAB.tsx        # Header button → opens MedicationDrawer
    HardAirwayFAB.tsx        # Header button → opens HardAirwayOverlay
    SessionLog.tsx           # Full-screen סיכום: TeamPanel + timestamps + per-section %
    TeamPanel.tsx            # Logo, live clock, department field, staff list
    SectionWarningModal.tsx  # Warning when navigating הכנה→ציוד with pending items
    UpdateBanner.tsx         # Banner when version.json differs from baked __APP_BUILD__
  App.tsx                   # Layout: header (רענון top-right) + section title + progress bar
public/
  assets/                   # ~27 images, named per protocol img fields (Hebrew filenames)
  logo.jpg
  version.json              # Written by CI: {"v": "<github.sha>"}
```

## Key Rules
- **RTL**: first DOM child = rightmost visually. Confirm buttons always come BEFORE cancel in DOM.
- **Images**: `assetUrl()` mandatory. `object-contain` (no crop). Hebrew filenames need `encodeURIComponent`.
- **Dark mode**: `isDark ? 'dark' : ''` on root div. All components use `dark:` variants.
- **Sections**: 0=הכנה, 1=ציוד, 2=אחרי. Section 2 locked until `intubationStarted`.
- **Version check**: `__APP_BUILD__` baked at build time from `VITE_APP_VERSION=github.sha`. Local dev = `'dev'` → skips check.
- **No hardcoded API keys, no .env secrets.**

## Constraints
- Glove-friendly: minimum touch target 56px height on action buttons.
- No patient names stored anywhere.
- Tailwind v4 syntax: use `@custom-variant`, not `darkMode: 'class'` in config.
- Never `npm install` a new dep without flagging it first.
