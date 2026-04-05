---
name: Truthful content for project detail pages
description: Replace the generic pool-based text on /projects/:id layouts with per-project content extracted from real READMEs, while keeping the existing 6 fabricated visual styles (FrameworkLayout, SplitLayout, TimelineLayout, GridLayout, ArchitectureLayout, DashboardLayout).
status: proposed
date: 2026-04-05
---

# Truthful content for project detail pages

## Problem

The detail page at `/projects/:id` renders one of six visual layouts
(`FrameworkLayout`, `SplitLayout`, `TimelineLayout`, `GridLayout`,
`ArchitectureLayout`, `DashboardLayout`). Each layout takes the project's
`name`, `summary`, `categories`, `state` — and then **fills the rest of the
page with text picked from hard-coded generic pools**, keyed only by a hash
seed derived from the project id.

Concretely, every detail page currently fabricates:

| Layout            | Fabricated sections                                              |
|-------------------|------------------------------------------------------------------|
| FrameworkLayout   | `scopes` (3 items), `principles` (4 items)                       |
| SplitLayout       | `pillars`, plus a "Quick Facts" block                            |
| TimelineLayout    | `phases` (7 generic phases Problem framing → Stabilize)          |
| GridLayout        | `modules` (9 generic modules Core API / Runtime / …)             |
| ArchitectureLayout| `layers` (4 of 8 generic), `decisions` (ADR-001…ADR-004)         |
| DashboardLayout   | `stats` (fake Modules count, fake Progress %), `modules`, `milestones` |

None of this text is grounded in the actual project. Two different projects
can show identical "Scope" cards simply because their id hashes pick the same
pool entries. The Dashboard even invents percentages like `Progress: 47%`.

Only these fields per project are currently truthful:
- `name` (from the repo folder / chevp.github.io projectData)
- `summary` (one-liner; mostly lifted from README headline, but ~50 still say
  literally `Organisation: projects`)
- `categories`, `state`
- `overview` — declared but **empty for all 202 entries**

## Goal

Each `/projects/:id` page should display text that matches the actual project,
pulled from the project's own `README.md`. **Visual styling stays exactly as
it is** — same six layouts, same palettes, same hero art, same glass cards,
same gradients. Only the *content strings* inside the layout slots become
per-project and truthful.

## Non-goals

- No new layouts, no changes to `projectTheme.js` palette/seed logic.
- No redesign of `ProjectHeroArt`, no change to state colors.
- No backend, no runtime fetch — keep static-data model.
- Do not expose full README bodies; we extract a small, curated subset.

## Scope

### In scope
1. Extend `src/data/projects.js` schema with per-project structured content
   that maps 1:1 to the slots each layout currently fabricates.
2. A one-time ingest script that walks `/Users/chevp/workspace` to locate each
   project's `README.md` and extracts:
   - **summary** — first meaningful paragraph after the H1 (overrides the
     current "Organisation: projects" placeholders).
   - **overview** — 2–4 sentence project description.
   - **bullets** — top-level bullet points (features / capabilities).
   - **sections** — H2 headings + their first paragraph (for Timeline /
     Architecture / Grid slots).
   - **techStack** — detected from fenced code blocks, `package.json`,
     `pom.xml`, `Cargo.toml`, etc. (Dashboard stats).
3. Update each of the 6 layout components to read from the new fields **with
   the current pool as fallback** when a field is missing, so unresolved
   projects still render.
4. Pre-compute a per-project `layout` preference in `projects.js` (optional
   override) so projects with richer READMEs get a layout whose slot-shape
   fits their content (e.g. projects with real phases → Timeline; projects
   with layered architecture → Architecture).

### Out of scope
- Rewriting READMEs.
- Private / internal notes not present in README.
- Live GitHub API calls.

## Proposed data schema (extended `projects.js`)

```js
{
  id: 'cryo-base',
  name: 'cryo-base',
  state: 'in-progress',
  org: 'projects',
  categories: ['Development'],
  summary: 'Vulkan-API based Cryo framework',

  // NEW — all optional, all derived from README
  overview: '2–4 sentence paragraph lifted from README intro.',
  bullets: [
    'Vulkan 1.3 core abstraction layer',
    'Cross-platform window + surface handling',
    'Validation-layer aware debug build'
  ],
  sections: [                      // used by Timeline / Architecture / Grid
    { h: 'Architecture', b: 'Layered around a thin Vulkan wrapper…' },
    { h: 'Build',        b: 'CMake presets for Debug / Release / ASAN.' }
  ],
  techStack: ['C++', 'Vulkan', 'CMake', 'GLFW'],
  repoPath: 'cryo/cryo-base',      // relative to workspace root, for audit
  layout: 'architecture'           // optional override
}
```

All new fields are **optional**. Layouts degrade gracefully to the old pool
fallback if a field is absent — so the migration is incremental.

## Layout binding (content → slots)

| Layout            | Slot          | Source field (fallback)                         |
|-------------------|---------------|-------------------------------------------------|
| FrameworkLayout   | `scopes`      | first 3 of `bullets` (→ pool)                   |
| FrameworkLayout   | `principles`  | `sections` h/b pairs (→ pool)                   |
| SplitLayout       | `pillars`     | `bullets` or `sections` (→ pool)                |
| SplitLayout       | quick facts   | `techStack` + `state` + `categories`            |
| TimelineLayout    | `phases`      | `sections` (h = phase title, b = phase body)    |
| GridLayout        | `modules`     | `sections` or `bullets` (→ pool)                |
| ArchitectureLayout| `layers`      | `sections` (if ≥4) (→ pool)                     |
| ArchitectureLayout| `decisions`   | `bullets` reframed as ADRs (→ pool)             |
| DashboardLayout   | `stats`       | `techStack.length`, `bullets.length`, real state|
| DashboardLayout   | `modules`     | `sections` (→ pool)                             |
| DashboardLayout   | `milestones`  | `sections` headings only (→ pool)               |

The fabricated pools stay in each layout file as the **fallback branch**, so
nothing breaks for projects whose README has no usable structure yet.

## README ingest plan

Script: `scripts/ingest-readmes.mjs` (new, run-once, not shipped in bundle).

1. Read `src/data/projects.js`, iterate entries.
2. For each `id`, locate the repo folder. Build a lookup table from the
   `find` output already gathered:
   - `arctic/*`, `cryo/*`, `frost/*`, `synth/*`, `misc/*`, `apps/*`, `tools/*`,
     `frameworks/*`, `assets/*`, `pengra/*`, `lunara/*`, `playground/*`,
     `sites/*`, `scoe/*`, `axon/*`, `scape/*`, `veyra/*`, `imkaluk/*`,
     `elyrion/*`, `integrations/*`, `learning/*`.
3. Parse `README.md` with a minimal markdown tokenizer:
   - take text under the first H1 (skip title itself) until next H2 → `overview`.
   - collect top-level `- ` / `* ` bullets (max 8) → `bullets`.
   - collect H2 headings with the first paragraph → `sections` (max 6).
   - parse ` ```lang ` fences and common manifest files → `techStack` (unique).
4. Emit a **patch file** `src/data/projects.generated.js` alongside
   `projects.js`. Manual review: diff, then merge into `projects.js`.
5. Projects without a local folder get `repoPath: null` — they remain on the
   pool fallback until a README is added.

Expected coverage from the `find` output: **~150 of 202** projects have a
local `README.md`. The remaining ~50 keep current behavior.

## File plan

New:
- `scripts/ingest-readmes.mjs` — run-once extractor (not bundled).
- `src/data/projects.generated.js` — output of the extractor (reviewed, then
  folded into `projects.js`).

Modified:
- `src/data/projects.js` — extended schema with `overview`, `bullets`,
  `sections`, `techStack`, `repoPath`, optional `layout`.
- `src/components/project-layouts/FrameworkLayout.vue` — read `scopes`/
  `principles` from props, fallback to pool.
- `src/components/project-layouts/SplitLayout.vue` — read `pillars` + quick
  facts.
- `src/components/project-layouts/TimelineLayout.vue` — read `phases` from
  `sections`.
- `src/components/project-layouts/GridLayout.vue` — read `modules` from
  `sections`/`bullets`.
- `src/components/project-layouts/ArchitectureLayout.vue` — read `layers` +
  `decisions`.
- `src/components/project-layouts/DashboardLayout.vue` — real `stats`
  (replace fake Progress%), real `modules`/`milestones`.
- `src/data/projectTheme.js` — if `project.layout` is set, honor it over
  seeded selection.

Unchanged:
- `ProjectHeroArt.vue`, palettes, state-dot colors, hero gradients, glass
  utilities, router, `ProjectsHubPage.vue`, `ProjectDetailPage.vue` shell.

## Acceptance criteria

1. Opening `/projects/cryo-base`, `/projects/arctic-workspace`,
   `/projects/synth-core` (three representative cases with rich READMEs)
   shows bullets and section headings **lifted verbatim** from each project's
   README, not the generic "Boundaries / Composability / Observability"
   pool text.
2. Two distinct projects never show identical Scope/Principles/Layers/
   Decisions text unless their READMEs actually share phrasing.
3. Dashboard `stats` no longer contain fabricated percentages; values come
   from `bullets.length`, `techStack.length`, `state`, `categories.length`.
4. Projects without a README still render (fallback pool), with no console
   errors.
5. `npm run build` succeeds, no unused-import warnings from the layout files.
6. Visual regression: the page frame, palette, gradient, hero art, glass
   borders, and state pill look identical to current production for any
   project id — only the text inside slots differs.

## Phased rollout

- **Phase 1** — schema + ingest script + `projects.generated.js` produced,
  reviewed manually. No UI changes yet.
- **Phase 2** — wire one layout (FrameworkLayout) to read the new fields
  with pool fallback; test against 5 real projects.
- **Phase 3** — roll the same pattern through the other 5 layouts.
- **Phase 4** — replace fabricated Dashboard stats with real counts.
- **Phase 5** — audit: projects with empty `sections` are candidates for
  README improvement; list them for the user.

## Risks

1. **README quality varies wildly.** Some have one line, some have 2000.
   Mitigation: cap extracted text (max 8 bullets, 6 sections, max 240 chars
   per body). Fall back to pool for thin READMEs.
2. **Layout mismatch.** A timeline-style layout on a project whose README
   has no phased sections will look awkward. Mitigation: ingest script
   auto-suggests a `layout` per project based on detected section shape
   (phase-like headings → timeline, architectural headings → architecture,
   feature lists → grid, etc.).
3. **Slug ↔ folder drift.** `cryo-hub-io` in projects.js vs `cryo-hub.io`
   folder. Mitigation: ingest script normalizes by stripping dots and
   falling back to chevp.github.io projectData mapping.
4. **Duplicate content across layouts.** A project that fills all of
   `bullets` + `sections` will show similar text in Scope and Grid. Accept
   this — honest repetition beats fabricated variation.

## Open questions for user

1. Should extracted `overview`/`bullets` be translated to German where the
   README is German, or kept in the original language? (Current site text
   is mixed.)
2. Which five projects do you want used as the Phase 2 pilot set?
3. Are the ~50 projects still carrying `summary: 'Organisation: projects'`
   worth manually writing one-liners for now, or wait for the ingest to
   cover them?
