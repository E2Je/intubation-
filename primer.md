# primer.md - Intubation Checklist App
_Last updated: 2026-06-08_

## Active Sprint
App is feature-complete and live on GitHub Pages. Ongoing polish & bug fixes.

## Completed This Session (2026-06-08)
- Fixed version check: uses `github.sha` in both bundle and `version.json` — no more false positives
- TeamPanel component: logo, live clock, department field, staff list (3 default rows, +/× buttons)
- TeamPanel moved to SessionLog (סיכום) only — section 2 (אחרי) stays as plain checklist
- Auto-advance הכנה → ציוד when all prep items are filled (400ms delay)
- iOS-style inline calculator in MedicationDrawer (🧮 toggle), operators RTL-positioned (right side)
- Button order fixed RTL in all modals: מסכים/ה right, ביטול left
- Renamed: לוג → סיכום, added רענון text to reset button
- Progress bar added to all 3 sections (title row + animated fill bar, turns emerald at 100%)
- רענון button moved to dedicated top bar above branding row
- Image max-height reduced 38vh → 26vh so action buttons are visible without scrolling
- version check: first poll 15s (was 60s), interval 90s (was 3min)
- `department` + `staffList` persisted to localStorage via Zustand partialize

## Next Step
Monitor live usage feedback — no known open bugs as of today.

## Open Blockers
- Version check: user must have OLD page open when new deploy lands to see banner.
  Works correctly — just needs user education on the flow.

## Key Decisions Made
- `github.sha` as version token: stable, shared between bundle and `version.json` in same CI run.
- `assetUrl()` with `encodeURIComponent`: Hebrew filenames break raw URLs on GitHub Pages.
- `object-contain` on images: medical images must not be cropped (clinical accuracy).
- RTL button order: confirm button first in DOM = rightmost visually = Hebrew convention.
- TeamPanel in SessionLog only: the post-intubation checklist screen should stay focused on tasks.
- Auto-advance: only fires when ALL items filled (not just last item clicked), 400ms to feel natural.
