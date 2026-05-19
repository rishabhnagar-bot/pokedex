# Prompt: Update Pokédex Presentation Slides

Paste the section between the two `---PROMPT START---` / `---PROMPT END---` markers into a fresh Claude conversation in this repo.

It contains **only verified facts** (read directly from the source files on 2026-05-13). Anything not in this prompt should be re-verified by the executing agent before being added to the slides.

---PROMPT START---

You are updating two slide files for a presentation about a React Pokédex app:

- `PRESENTATION.md` (long-form speaker script, 14 slides)
- `SLIDES_BRIEF.md` (slide-by-slide brief, also 14 slides, with timing)

**Goal:** Add three new dedicated slides — **API Layer**, **Theme System**, **Team Drawer** — and reinforce coverage of the Context API in the existing Architecture slide. Keep formatting, tone, and timing-block style consistent with what's already in those files. Read both files end-to-end before editing.

## Where the new slides should go

Insert them between the existing **Slide 5 — Architecture Overview** and the existing **Slide 9 — Standout Technical Decisions** block. Suggested order:

1. Slide 5 — Architecture Overview *(existing — small edit, see below)*
2. **NEW: API Layer**
3. **NEW: Theme System**
4. Slide 6 — Pokédex Core *(existing, renumbered)*
5. Slide 7 — Detail Modal *(existing, renumbered)*
6. **NEW: Team Drawer** *(replaces / absorbs the existing Slide 8 — Team Builder, since they overlap. Merge the useful parts of the old Slide 8 into this new slide rather than keeping both.)*

Renumber subsequent slides and update the **TIMING REFERENCE** table at the bottom of `SLIDES_BRIEF.md` and the **TRIMMING GUIDE** accordingly. Aim for ~1–1:30 min per new slide.

## Slide 5 (Architecture) — small edit

The current slide already lists "React Context (Team + Theme)" in the data layer column. Add one sentence under it (or in the speaker notes) making the Context API choice explicit:

> Two React Contexts (`ThemeProvider` + `TeamProvider`) wrap the app in `src/App.tsx`. No Redux / Zustand — these are the only two genuinely cross-cutting concerns and don't justify extra dependencies.

## NEW Slide — API Layer

**Title suggestion:** Talking to PokeAPI — One Module, Five Hooks

**Verified facts to include (do not embellish):**

- **All HTTP calls live in one file:** `src/api/pokemonApi.ts`. Components never call `fetch` directly.
- **Transport:** uses the **native `fetch` API**. `axios` is listed in `package.json` but is **not actually used anywhere in `src/`** — note this honestly if you want; or simply don't mention axios. **Do not claim axios is used.**
- **Caching library:** `@tanstack/react-query` is installed but **not wired in**. The custom hooks manage their own state with `useState` / `useEffect` / `useRef`. (The existing Slide 13 already acknowledges this as future work — stay consistent.)
- **Base URL** comes from the `POKEAPI_BASE` constant in `src/utils/constants.ts`.
- **Public functions exported from `pokemonApi.ts`:**
  - `fetchPokemonList(limit = 40, offset = 0)` — fetches the list endpoint, then **fans out a parallel `Promise.all`** to hydrate sprites + types per entry (the list endpoint omits those fields).
  - `fetchPokemonDetail(idOrName)` — fires `/pokemon/{id}` and `/pokemon-species/{id}` in parallel, then recursively walks the evolution chain.
  - `fetchPokemonTypes()` — returns the 18 official types; filters out the utility types `'unknown'` and `'shadow'`.
- **Errors** are thrown as `Error("Failed to fetch … (status)")` and converted to a string `error` in the consuming hook.
- **Five custom hooks** (in `src/hooks/`) wrap the API surface so components stay declarative:
  - `usePokemonList` — paginated list; tracks offset in a **`useRef`** (not state) so triggering "load more" doesn't cause an extra render cycle. `hasMore` is computed as `pokemon.length < total`.
  - `usePokemonDetail` — single Pokémon detail fetch.
  - `useSearch` — debounced search.
  - `useTypeFilter` — type-chip filtering (client-side).
  - `useTeam` — thin wrapper around `TeamContext`.

**Suggested visual:** a 3-row flow diagram → `Component → custom hook → pokemonApi.ts → PokeAPI`. Show the parallel-fetch fan-out for the list endpoint.

## NEW Slide — Theme System

**Title suggestion:** Two-Axis Theming — Light/Dark × 19 Color Palettes

**Verified facts (read from `src/context/ThemeContext.tsx`):**

- The theme has **two independent axes**:
  - `theme: 'light' | 'dark'` (applied to `<html>` as `data-theme="…"`)
  - `colorTheme: ColorTheme` — **19 values total**: `'default'` + the 18 Pokémon types (`fire`, `water`, `electric`, `grass`, `ice`, `fighting`, `poison`, `ground`, `flying`, `psychic`, `bug`, `rock`, `ghost`, `dragon`, `dark`, `steel`, `fairy`, `normal`). Applied to `<html>` as `data-color-theme="…"`.
- **Switching a theme = changing one DOM attribute.** All visual changes flow from **CSS custom properties scoped to those `[data-theme=…]` and `[data-color-theme=…]` selectors**. No JavaScript toggling of classes per component, no Tailwind class swapping for theme colors.
- **No persistence.** Theme is **not** stored in `localStorage` — it resets to `light` / `default` on every reload. (Be honest; do not claim it persists. The existing Slide 13 says persistent team is future work; theme persistence is in the same bucket if you want to mention it.)
- **No system preference detection.** The provider does **not** read `prefers-color-scheme`. Default is hardcoded to `'light'`.
- API surface exposed via `useTheme()`: `{ theme, toggleTheme, colorTheme, setColorTheme }`. `useTheme` throws if used outside `<ThemeProvider>`.
- Provider is mounted at the root in `src/App.tsx`, wrapping `<TeamProvider>` and the route view.

**Suggested visual:** matrix of `theme × colorTheme` showing how 2 × 19 = 38 distinct visual states exist, all driven by one attribute change apiece. Or a single code snippet of the two `useEffect`s that set the DOM attributes — they're tiny and they tell the whole story.

The existing Slide 9 has a "🎨 19 Color Themes" card that already covers some of this. **Trim that card down to a one-liner** ("see Theme slide") so the two slides don't duplicate.

## NEW Slide — Team Drawer

**Title suggestion:** The Team Drawer — Three Tabs Driven by One Context

**Verified facts (from `src/components/TeamDrawer/TeamDrawer.tsx` and its tab files, plus `src/context/TeamContext.tsx`):**

- **Slide-in side panel** (`<aside role="complementary">`) with a click-to-dismiss backdrop. The panel itself uses an `isOpen` class to animate in/out.
- **Locks body scroll** while open via `document.body.style.overflow = 'hidden'`, restored on unmount.
- **Three tabs** rendered inside a segmented control (`role="tablist"`, each button has `role="tab"` + `aria-selected`):
  - **Team tab** (`tabs/TeamTab.tsx`) — 6-slot roster, per-slot remove, clear-all button.
  - **Stats tab** (`tabs/StatsTab.tsx`) — aggregated base stats across all members.
  - **Coverage tab** (`tabs/CoverageTab.tsx`) — the heaviest logic; defensive/offensive type analysis across the team.
- **State source:** the drawer itself is a **presentational** component. It receives `team`, `onRemove`, `onClear` via props from the parent (HomePage), which reads from `TeamContext`. The drawer does **not** call `useTeam()` directly.
- **Team Context guarantees** (worth calling out as a single bullet on the slide — these are *enforced in the reducer*, not just convention):
  - **Max team size:** 6 (`MAX_TEAM_SIZE` constant). Adding past 6 is a no-op.
  - **No duplicates by Pokémon id.** Adding the same Pokémon twice is a no-op.
  - **No persistence.** Team resets on page reload. (Slide 13 already lists this as future work — keep consistent.)
- **Context API:** `team`, `addMember`, `removeMember`, `clearTeam`, `updateMemberStats`.
- **Accessibility:** keyboard-navigable tabs, `aria-label="Battle Team"` on the drawer, `aria-label="Close drawer"` on the close button.

**Suggested visual:** a composite mock showing the drawer with the tab bar highlighted, an arrow from each tab to its tab component file, and a side note "team state flows: TeamContext → HomePage → TeamDrawer (props)".

## Final checklist before you finish

- [ ] Both `PRESENTATION.md` and `SLIDES_BRIEF.md` updated.
- [ ] All slides renumbered consistently in both files.
- [ ] `SLIDES_BRIEF.md`'s TIMING REFERENCE table and TRIMMING GUIDE updated.
- [ ] No claim that the app uses `axios` (it doesn't).
- [ ] No claim that the app uses `@tanstack/react-query` at runtime (installed, not wired).
- [ ] No claim that theme/team persist across reloads (they don't).
- [ ] No claim that theme reads `prefers-color-scheme` (it doesn't).
- [ ] The "19 Color Themes" card on the (renumbered) Standout Decisions slide is trimmed to avoid duplicating the new Theme slide.
- [ ] The old "Team Builder" slide content has been merged into the new Team Drawer slide, not left behind as a duplicate.

When done, reply with a one-line summary per added/changed slide stating its new number and where it landed (e.g., "Slide 6 — API Layer, inserted after Architecture").

---PROMPT END---
