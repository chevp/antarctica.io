---
name: Projects Hub for antarctica.io
description: Plan to add a "Projects" subfolder to antarctica.io with an index + per-project explanation pages, colored by state (red/green/blue), and cross-link from chevp.github.io.
status: proposed
date: 2026-04-04
---

# Projects Hub for antarctica.io

## Goal

Turn `antarctica.io` into the canonical landing for all **important projects**. Each project gets:
- a card on the hub index (colored by its current state), and
- a dedicated explanation page with description, links, status, and notes.

The design must match the existing arctic/glass aesthetic already shared between
`antarctica.io` (Vue app), `chevp-ai-framework/docs/index.html`, and `chevp.github.io`.

## Scope

### In scope
1. New Vue route tree inside the existing `antarctica.io` SPA:
   - `/projects` — hub index (grid of `ProjectStateCard`s, state-filterable)
   - `/projects/:id` — detail / explanation page driven by shared data
2. A single source of truth data file: `src/data/projects.js`
3. Reusable component: `ProjectStateCard.vue` (adds state tint on top of existing `OrganizationCard` design language)
4. Reusable layout: `ProjectDetailLayout.vue` for per-project pages
5. Router entries for the new routes
6. Link from existing `OverviewPage` to `/projects`
7. Update `sites/chevp.github.io/index.html` — add a "Hub" entry in the `Projects` category pointing at `https://chevp.github.io/antarctica.io/#/projects`, and link individual top-tier projects to their explanation pages on antarctica.io

### Out of scope
- No backend. All data lives in `src/data/projects.js`.
- No SSR / static generation beyond Vite build.
- No content migration from repo READMEs; explanation text is authored inline per project.

## State model

Three states, aligned with the `chevp-ai-framework` visual language
(`red`/`green`/`blue` accents on cards):

| State        | Color  | Meaning                                    |
|--------------|--------|--------------------------------------------|
| `active`     | green  | Published, maintained, usable today        |
| `in-progress`| blue   | Documentation, experimental, WIP           |
| `archived`   | red    | Deprecated, blocked, or paused             |

`ProjectStateCard` applies the color to: left border, icon gradient, status pill.
(Reuses existing `gradient-to-br from-{color}-500 to-{color}-600` conventions already
in `OrganizationCard.vue`.)

## Projects to include

**Source:** `sites/chevp.github.io/index.html` → `projectData`.

**Filter:** every entry **without** a `url` field — those are the "private" projects
that currently render as non-clickable cards on chevp.github.io. Entries with
a `url` already have a public site and are out of scope.

**Deduplication:** projects appearing in multiple categories (e.g. `nexus-data`,
`mapping-hub`) are merged into a single detail page with all categories listed as tags.

**Default state:** `in-progress` (blue) for every extracted project. The user
can override per-project in `src/data/projects.js` after generation.

> No repo contents are exposed. Each detail page is a UX/explanation page only:
> name, categories, state pill, short description, placeholder long-form body
> ("Coming soon" sections for Overview / Goals / Status), and **no** external
> GitHub/source links.

## File plan

New:
- `src/data/projects.js`
- `src/pages/ProjectsHubPage.vue`
- `src/pages/ProjectDetailPage.vue`
- `src/components/ProjectStateCard.vue`
- `src/components/ProjectDetailLayout.vue`

Modified:
- `src/router/index.js` — add `/projects` and `/projects/:id`
- `src/pages/OverviewPage.vue` — add a "Projects" card linking to `/projects`
- `../chevp.github.io/index.html` — insert hub link + per-project links in the `Projects` category

## Routing

```js
{ path: '/projects',       name: 'Projects',       component: ProjectsHubPage },
{ path: '/projects/:id',   name: 'ProjectDetail',  component: ProjectDetailPage, props: true },
```

GitHub Pages hash-mode works; antarctica.io already has the SPA redirect handler in `index.html`.

## Cross-linking chevp.github.io

In `sites/chevp.github.io/index.html`:

1. Inside `projectData.Projects`, prepend a hub entry:
   ```js
   { name: "Projects Hub (antarctica.io)", desc: "Explanation pages for private projects.", url: "https://chevp.github.io/antarctica.io/#/projects", org: "projects" }
   ```
2. For every entry in all other categories that currently has **no** `url`, set
   `url: "https://chevp.github.io/antarctica.io/#/projects/<slug>"` where `<slug>`
   is a kebab-cased form of the project name. This turns the previously
   non-clickable cards into links to the new explanation pages.

Public `Projects`-category entries keep their existing URLs unchanged.

## Acceptance criteria

- Visiting `/projects` shows all projects as cards, color-coded by state, with state filter chips.
- Each card links to `/projects/:id` and opens a detail page with: title, state pill, description, long explanation, external links (repo, live site, docs).
- OverviewPage has a visible entry that routes to `/projects`.
- `chevp.github.io` has at least one clear entry point linking to the antarctica.io projects hub.
- No new build/runtime errors (`npm run build` succeeds).
- Visual language is consistent with existing `glass`, `card`, and `grid-bg` utilities.

## Risks / open questions

1. **Which projects count as "important"?** Default list above — user confirms/edits.
2. **State assignment** — defaults above are guesses; user confirms.
3. **chevp-design location** — referenced in prompt but path not yet verified; will resolve during implementation.
