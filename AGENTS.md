# Sudoku — AI Coding Agent Guide

## Project Overview

Free online sudoku site targeting the English-language SEO market. Next.js 16 App
Router, fully static (no backend, no database). v4 page-weight architecture:
P0 homepage = sudoku hints tool (98.9 est. volume), P1 column pages = /maker
(generate → play → print hub) + /mega (16x16) + /kids (4x4/6x6) +
/guides (tutorial guides) + /what-is-sudoku (beginner landing page), P2 = 13 blog posts.
Monetization: AdSense → later subscription.

## Tech Stack (house conventions apply — see global 站群统一约定, only project-specific items below)

- Brand color: blue `#2563eb` (Tailwind `blue-600`), text `#1f2937`, background `#ffffff`
- Brand name: "fastsudoku" (one word, lowercase) displayed in header/footer logo; domain `fastsudoku.com`
- Core engine: pure TypeScript, zero deps, in `src/sudoku/`. Size-agnostic — every function
  takes a `SudokuSpec` (default 9x9) so 4x4/6x6/16x16 grids share the same code.
- Content: MDX blog posts in `src/content/guides/*.mdx` (13 files), compiled at build via `evaluate` (SSG)
- Site URL: `https://fastsudoku.com` (`src/lib/site.ts`)

## Routes (all SSG, no `force-dynamic`)

| Route | Page | Component | Purpose |
|-------|------|-----------|---------|
| `/` | `page.tsx` | `HintsPage` + JSON-LD | P0: hints tool — play/enter grid, get step-by-step moves |
| `/maker` | `maker/page.tsx` | `MakerPage` | P1: batch generate → play inline → print (1/2/4 per page, answer key, watermark) |
| `/mega` | `mega/page.tsx` | `SudokuPage` → `SudokuGame` | P1: 16×16 mega sudoku with MEGA_16X16_SPEC |
| `/kids` | `kids/page.tsx` | `SudokuPage` → `SudokuGame` | P1: 4×4/6×6 kids sudoku with size selector + kidMode |
| `/what-is-sudoku` | `what-is-sudoku/page.tsx` | inline + JSON-LD | P1: beginner landing page, renders `what-is-sudoku.mdx` via `getPost()` |
| `/guides` | `guides/page.tsx` | inline | Blog index (all posts from `getAllPosts()`, sorted by date desc) |
| `/guides/[slug]` | `guides/[slug]/page.tsx` | `BlogLayout` + JSON-LD | Individual post; `what-is-sudoku` slug returns notFound (it has its own page) |
| `/guides/tags` | `guides/tags/page.tsx` | inline | Tag cloud with post counts |
| `/guides/tags/[tag]` | `guides/tags/[tag]/page.tsx` | inline | Posts filtered by tag |
| `/privacy` | `privacy/page.tsx` | inline | Privacy Policy (static prose, hardcoded "Last updated: August 2026") |
| `/terms` | `terms/page.tsx` | inline | Terms of Service (static prose, hardcoded "Last updated: August 2026") |

**Route handlers (non-page):**
- `robots.ts` — allows all user agents, sitemap at `SITE_URL/sitemap.xml`
- `sitemap.ts` — static routes (priority-weighted), all blog posts, all tags
- `llms.txt/route.ts` — 6-section llms.txt (dynamic from `getAllPosts()`)
- `llms-full.txt/route.ts` — same structure, richer descriptions

## Key Files

- `src/sudoku/spec.ts` — `SudokuSpec` {size, boxRows, boxCols} + presets (`KIDS_4X4_SPEC`,
  `KIDS_6X6_SPEC`, `MEGA_16X16_SPEC`) + `formatValue` (16x16 values render as A-F). Geometry
  helpers: `cellsOf`, `boxCount`, `boxesPerRow`.
- `src/sudoku/generator.ts` — unique-solution generation. `generateSudoku(difficulty, spec?)`
  and `generateSudokuSeeded(seed, difficulty, spec?)`. Deterministic PRNG (xmur3 + mulberry32).
  Single-pass hole digging; 16x16 uses node budget (1M nodes) + wider clue tolerance (±4).
  `Difficulty = 'easy' | 'medium' | 'hard' | 'evil'`.
- `src/sudoku/solver.ts` — `solveWithSteps(grid, spec?)` step-by-step reasoning (naked single
  → hidden single → candidate elimination/pointing pairs → backtracking fallback). Also exports
  `hasUniqueSolution` (with node budget for 16x16), `getCandidates`, `findEmptyWithFewestCandidates`.
  Returns `{ solution: Grid; steps: Step[] }` with technique names and descriptions.
- `src/sudoku/validator.ts` — `isValidGrid`, `isCompleteGrid`, `getConflicts` (all spec-aware).
  Also geometry helpers: `rowOf`, `colOf`, `boxOf`, `indexOf`. `Grid = number[]` (flat row-major,
  0 = empty).
- `src/sudoku/index.ts` — barrel re-export of all engine public symbols.
- `src/components/SudokuBoard.tsx` — single generic board (any spec: box borders, notes grid,
  A-F digits). Client component. Props: `values`, `spec`, `given`, `faded`, `notes`, `selected`,
  `conflictSet`, `sameIndexes`, `peerIndexes`, `readOnly`, `onSelect`. Used by SudokuGame
  and HintsPage.
- `src/components/SudokuGame.tsx` — full playable game. Client component. Generates puzzle
  client-side after hydration. Props: `initialPuzzle`, `initialSolution`, `initialDifficulty`,
  `spec`, `sizeOptions` (size selector for kids), `showDailyTab` (daily as difficulty tab, used
  by MakerPage), `kidMode` (star overlay on win), `compact` (board-first layout), `onPuzzleChange`
  callback.
- `src/components/HintsPage.tsx` — rendered on homepage `/`. Client component. Two modes:
  "Play" (generate puzzle, reveal hints one move at a time via `solveWithSteps`) and
  "My grid" (enter your own grid, get step-by-step solving). Progress bar, technique
  explanations linking to guides.
- `src/components/MakerPage.tsx` — rendered on `/maker`. Client component. Difficulty + count
  selector, batch generation via `generateSudokuSeeded`, inline play (private `PlayableBoard`
  subcomponent), print view with 1/2/4 puzzles per page, optional answer key, free-tier
  watermark. URL query params: `?batch=&diff=&count=`.
- `src/components/PrintBoard.tsx` — stateless print grid renderer. Props: `puzzle`, `solution`,
  `answer` (show answer key), `label`, `watermark` (overlay watermark text). CSS-toggle
  between puzzle and answer views via `.pval`/`.aval`.
- `src/components/SudokuPage.tsx` — thin wrapper: title + subtitle + SudokuGame. Used by
  /mega and /kids pages.
- `src/components/site-header.tsx` — sticky header, brand logo, desktop nav (links prop,
  active highlight via `usePathname`), mobile hamburger menu. Client component.
- `src/components/site-footer.tsx` — footer with brand logo, link columns ("Puzzles" and
  "About"), copyright year, Privacy/Terms links. Client component.
- `src/components/BlogLayout.tsx` — blog post layout: title, date/readTime meta, MDX content,
  tag pills, "Try it yourself" CTA, related articles (up to 3 by shared tags). Server
  (async) component.
- `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge), standard shadcn/ui convention.
- `src/lib/site.ts` — `SITE_URL`, `PRINT_WATERMARK` (free-tier flag), `WATERMARK_TEXT`.
- `src/lib/posts.ts` — MDX loader: `getAllPosts` (excludes `what-is-sudoku`), `getPost`,
  `getAllTags`, `getPostsByTag`, `formatTag`. Frontmatter: title, description, date, tags
  (kebab-case → Title Case via `formatTag`). `readTime` computed (200 WPM, floor 1 min).
- `src/lib/gridUrl.ts` — `encodeGrid`/`decodeGrid` for shareable puzzle URLs. Hardcoded 9×9.
- `src/app/globals.css` — Tailwind v4. Custom component layer: `.board`/`.cell` (interactive
  grid with selection/conflict/step/peer states), `.pboard`/`.pcell`/`.pval`/`.aval` (print
  grid with CSS toggle), `.print-grid`/`.size-1`/`.size-2`/`.size-4` (multi-puzzle layouts),
  `.prose` (blog content), `.print-watermark` (free-tier watermark), `@media print` section
  (A4, hide `.no-print`).

## Nav Links (from `src/app/layout.tsx`)

```
Home (/) · Maker (/maker) · Mega (/mega) · Kids (/kids) · What Is Sudoku (/what-is-sudoku) · Guides (/guides)
```

All in main header nav; Mega/Kids are NOT footer-only.

## Commands

```bash
npm run dev          # dev server at http://localhost:3000
npm run build        # production build
npm run lint         # eslint (flat config)
npm run typecheck    # tsc --noEmit
npm run test:engine  # engine tests: tsc -p tsconfig.engine.json && node dist/test-engine.js (230 pass, covers 4x4/6x6/9x9/16x16)
```

## Rules

- Engine changes: keep existing exports intact; run `npm run test:engine` before finishing.
- Static-first: all routes are static SSG with client-generated initial puzzles; never add
  `force-dynamic`.
- Blog posts are in `src/content/guides/*.mdx`; adding/replacing rebuilds automatically.
  Articles currently have all internal links stripped (will be rewritten later); do NOT add
  links to deleted pages (/play, /play/expert, /play/hard, /hints, /solver, /printable).
- `what-is-sudoku` slug is excluded from `getAllPosts()` (blog listing) and returns `notFound()`
  in `/guides/[slug]` — it has its own standalone page at `/what-is-sudoku`.

## Keyword / page positioning (v4 page-weight, do NOT violate)

> **v4 positioning (`sudoku-final-plan-2026-08-09.md`)**: P0 homepage = hints tool (hints
> 66.4 + assistant 20.6 + helper 11.9 = 98.9, 🟢). P1 column pages = /maker (maker 42.9 🟢,
> generate → play → print hub with daily puzzle as a difficulty tab), /mega (mega 63.3 🟢),
> /kids (children 32.0 🟡-A), /what-is-sudoku (beginner landing page), /guides (guide 42.4 +
> logic 34.3 🟢). **Excluded — do NOT build**: education/teacher-print, brain-health,
> competitive, other variant engines.

- Fresh site fights ONLY small, truly-low-competition long-tail keywords. Head terms get no
  dedicated pages or content — internal-link weight only.
- The blog is the ongoing content engine; cross-link posts, funnel to live pages only.
- **Deleted pages** (no keyword support in v4): /play, /play/expert, /play/hard, /hints,
  /solver, /printable. Do NOT recreate any of them.

## Pending / handoff

- ✅ v4 architecture migrated (homepage=hints, maker=play+print+hub, blog→learn, dead pages deleted)
- ✅ Engine generalized to 4x4/6x6/9x9/16x16; one generic SudokuBoard + SudokuGame component
- ✅ Daily puzzle moved to maker as a difficulty tab (`showDailyTab`)
- ✅ Free-tier print watermark implemented (`PRINT_WATERMARK` flag, future paid toggle)
- ✅ Mega/Kids routes simplified (/mega, /kids — no /play prefix)
- ✅ /what-is-sudoku standalone landing page
- ✅ Privacy & Terms pages
- ⏳ Blog articles to be rewritten (internal links stripped, ready for fresh content)
- ⏳ Deploy-time (ops): set `NEXT_PUBLIC_GA_ID` + real `SITE_URL`, disable CF Managed Robots.txt,
  submit sitemap in GSC, run geocheckr baseline.

## GEO (see global 站群统一约定 §4 for the 8-item baseline)

Done: sitemap.xml + robots.txt (allows AI crawlers), llms.txt + llms-full.txt (dynamic,
6-section structure), homepage WebApplication + blog Article JSON-LD, GA4 gtag behind
`NEXT_PUBLIC_GA_ID`.

Pending (deploy-time, ops):
- Set `NEXT_PUBLIC_GA_ID` env + real `SITE_URL` in `src/lib/site.ts`.
- Cloudflare: disable Managed Robots.txt (`is_robots_txt_managed: false`) so the repo
  robots.txt stays in effect and AI crawlers are NOT blocked. Re-check monthly.
- Submit sitemap.xml in Google Search Console; run geocheckr once after launch to record the AI-visibility baseline.
