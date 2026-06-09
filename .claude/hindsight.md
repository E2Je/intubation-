# hindsight.md - Behavioral Patterns
_Extracted from multiple sessions — 2026-06-08_

## RTL Layout Patterns
- **Always confirm → cancel order**: In every modal/dialog, the primary action button must come FIRST in DOM (renders rightmost in RTL flex). This has been fixed 3+ times across different modals. Check every new modal immediately.
- **Calculator operators**: In RTL grid, put operators in DOM position 1 of each row so they render on the right. Digits go in reverse DOM order (9,8,7) so they display left-to-right visually.

## Image Handling
- **Hebrew filenames require `assetUrl()`** — never use raw `/assets/` paths. `encodeURIComponent` is mandatory for GitHub Pages.
- **`object-contain` always** — medical images must never be cropped. User explicitly rejected cropped images.
- **Max height matters**: 38vh was too tall and pushed buttons below the fold. 26vh is the current sweet spot.
- **scrollIntoView `block: 'start'`** — when accordion opens, scroll title to top so user sees title → image → buttons in sequence.

## Accordion Pattern
- `SectionList` and `HardAirwayOverlay` share the same accordion behavior. Changes to one should be mirrored to the other.
- `expandedId` resets on section change via `useEffect([currentSection])`.
- `handleStatus` auto-advances to next item's id, then triggers section advance if on section 0 and all items filled.

## State Management
- **Zustand persist**: every new persistent field MUST be added to `partialize`. Easy to forget — causes data loss on refresh.
- **`itemStatuses` in App.tsx**: needed for progress bar reactivity. Subscribe early.
- Transient UI state (drawers, modals) must be reset in `onRehydrateStorage` AND `resetSession`.

## Component Placement
- User is precise about which screen things belong to. Always confirm placement before building.
- TeamPanel belongs to SessionLog (סיכום), NOT to section 2 (אחרי). The checklist screens are for tasks only.
- IntubationStartBanner belongs at the END of ציוד (section 1), not at the beginning.

## Version Check
- False positives: if `__APP_BUILD__` and `version.json` use different sources (e.g. `Date.now()` vs `github.sha`), they'll always differ. Both must use `github.sha` from the same CI run.
- The banner only shows on OLD pages when a NEW deploy lands. User needs to keep page open to see it.
- Dev mode (`__APP_BUILD__ === 'dev'`) must skip the check entirely.

## CI/Deploy
- `VITE_APP_VERSION: ${{ github.sha }}` must be in the `env:` block of the Build step, not the Deploy step.
- `version.json` written as `echo "{\"v\":\"${{ github.sha }}\"}" > dist/version.json` after build.
- GitHub Pages serves from `dist/` via `upload-pages-artifact`.

## User Preferences
- Glove-friendly: never reduce button height below 56px on action buttons.
- No patient data — time-only session logs.
- Dark mode is the default (`isDark: true` in initial state).
- Clean, modern UI — Apple/clinical aesthetic.
- Prefers incremental changes and clear explanations of what was changed and why.
