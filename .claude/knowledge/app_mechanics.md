# App Mechanics — Intubation Checklist

_How the app flows, what triggers what, and architectural decisions._

---

## Navigation Flow

```
App open
  ↓
WeightModal (mandatory — blocks until weight entered)
  ↓
Section 0: הכנה (13 items)
  → Auto-advances to ציוד when ALL 13 items are non-pending
  → SectionWarningModal if user tries to skip with pending items
  ↓
Section 1: ציוד (10 items)
  → IntubationStartBanner appears as fixed overlay when ALL 10 items filled
  → LMAWarningModal on banner tap → confirms fail-safe rule
  → startIntubation() → sets intubationStarted=true, currentSection=2
  ↓
Section 2: אחרי (4 items)
  → "סיום אינטובציה" button appears at bottom
  → endSession() → sets sessionEndTime, opens SessionLog
  ↓
SessionLog (סיכום)
  → TeamPanel (logo, clock, department, staff)
  → Timing summary
  → Per-section completion %
  → Print / Email actions
  → "סשן חדש" → resetSession()
```

---

## Accordion Behavior (SectionList + HardAirwayOverlay)

- One item expanded at a time (`expandedId` state)
- On section change: auto-expand first pending item (or first item if all done)
- On status button click:
  1. `setStatus(id, status)` → store update
  2. `setExpandedId(next item)` — auto-advance
  3. If section 0 + no next item + all items non-pending → `setSection(1)` after 400ms
- `scrollIntoView({ block: 'start', behavior: 'smooth' })` on expand (80ms delay for animation)

---

## Section Lock Rules

| Section | Unlocked when |
|---------|--------------|
| 0 - הכנה | Always |
| 1 - ציוד | Always (but warned if הכנה has pending items) |
| 2 - אחרי | Only after `intubationStarted === true` |

---

## Persistent State (localStorage key: `intubation-checklist-v1`)

Persisted via Zustand `partialize`:
- `weight`, `isAdult`
- `itemStatuses` (all section + hard airway items)
- `currentSection`, `currentItemIndex`
- `intubationStarted`, `sessionStartTime`, `intubationStartTime`, `sessionEndTime`
- `isDark`
- `department`, `staffList`

On rehydrate: transient UI (drawers, modals) reset to closed. `weightModalOpen` = `weight === null`.

---

## Version Check Mechanism

1. `vite.config.ts`: `__APP_BUILD__ = process.env.VITE_APP_VERSION ?? 'dev'`
2. CI bakes `VITE_APP_VERSION: ${{ github.sha }}` → same SHA written to `dist/version.json`
3. `useVersionCheck`: polls `version.json?t=${Date.now()}` every 90s (first at 15s)
4. If `v !== __APP_BUILD__` → `setUpdateAvailable(true)` → shows `UpdateBanner`
5. Local dev: `__APP_BUILD__ === 'dev'` → check skipped entirely

---

## Medication Calculator

- `MedRow`: `formatDose(dosageStr, weight, unit)` handles range (`"1-2"`) and single (`"1.2"`) dosages
- Formula: `value × weight`, displayed with `dir="ltr"` for correct number reading
- Inline calculator: iOS-style 4×4 grid, operators in DOM first (→ rightmost in RTL)
- State: `display`, `pending`, `op`, `justEvaled` — standard calculator state machine

---

## Sound System (`utils/sound.ts`)

Web Audio API, no external files. Click sounds on status button press:
- `done` → success tone
- `skipped` → low tone
- `not_relevant` → neutral tone
- `nav` → navigation click

---

## Image Asset Handling

All images in `public/assets/` with Hebrew filenames.
Access via: `assetUrl(filename)` = `${import.meta.env.BASE_URL}assets/${encodeURIComponent(filename)}`
- `BASE_URL` = `/intubation-/` on GitHub Pages, `/` in dev
- `encodeURIComponent` required — Hebrew characters break raw URLs
- `onError` → graceful fallback (gray placeholder with 📋 icon)

---

## TeamPanel (shown in SessionLog only)

- Logo: `${import.meta.env.BASE_URL}logo.jpg` (not in `/assets/`, at root)
- Clock: live `setInterval` 1s tick, shows `intubationStartTime` if set (else current time)
- Department: text input → `department` store field
- Staff: dynamic list, 3 default rows, each row: name + role inputs + × remove button, + add button
