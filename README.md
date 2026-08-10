# Sudoku Site — Free Online Sudoku

A free online sudoku web app targeting the English-language SEO market. Play, solve step-by-step, print puzzles, and get a new daily puzzle every day.

## Status

v4 architecture complete (page-weight tier). The homepage is the sudoku hints tool (98.9
est. volume), /maker is the generate-play-print hub, /play/mega and /play/kids are the
variant play pages, and /guides houses the tutorial guides. 13 SEO blog posts live in
`src/content/guides/*.mdx`. Deploy via Cloudflare Pages is pending account/project setup
(update `SITE_URL` in `lib/site.ts` once the domain is assigned).

## Project positioning

- **Market**: English-language, international (US accounts for ~15-20% of sudoku keyword volume).
- **Strategy**: SEO-led traffic into free tools, monetized with AdSense and a later subscription on the hints tool.
- **Seasonal focus**: Fall (Sep–Nov) is the golden window — teaching and beginner keywords spike 3x at back-to-school. MVP intended to launch before fall.

## Features

| Page | What it does | Target keyword | Est. monthly volume |
|------|--------------|----------------|---------------------|
| `/` | Sudoku hints tool: enter your grid, get the next logical move explained or the full solution step by step | sudoku hints + assistant + helper | ~99K |
| `/maker` | Generate a sudoku → play it online with hints & timer → print as many copies as you need | sudoku maker | ~43K |
| `/play/mega` | 16x16 mega sudoku (Easy–Evil, A–F digits) | mega sudoku | ~63K |
| `/play/kids` | Kids difficulty tier: 4x4 / 6x6 big friendly grids | sudoku for children | ~32K |
| `/guides` | Sudoku guides: rules, logic, techniques and patterns (13 articles + tags) | sudoku guide + logic | ~76K |

All pages: desktop + mobile responsive, semantic HTML, SEO meta tags in layout. **Everything is static SSG** — the initial puzzle is generated client-side after hydration so every visitor gets a fresh puzzle without a dynamic server render. `app/sitemap.xml` and `app/robots.txt` are generated from `app/sitemap.ts` / `app/robots.ts`.

> **Positioning note** (see AGENTS.md + `sudoku-final-plan-2026-08-09.md`): v4 page-weight
> architecture — P0 homepage carries the biggest keyword (hints 66.4), P1 column pages
> (/maker /mega /kids /guides) carry mid-sized keywords, P2 articles carry long-tails.
> Fresh site fights only small, truly-low-competition long-tail keywords.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict).
- **UI**: Tailwind CSS v4 (`src/app/globals.css`), shadcn/ui tooling (`components.json`, `cn` util in `src/lib/utils.ts`), lucide-react icons, Inter via `next/font`. Matches the house stack used across the other projects.
- **No backend, no database** — fully static-hostable (browser-side logic only). Suited for Cloudflare Pages / Vercel.
- **Sudoku engine**: pure TypeScript, zero deps, in `src/sudoku/`. Size-agnostic — every
  function takes an optional `SudokuSpec` (default 9x9) so 4x4/6x6/16x16 grids share one codebase.
  - `spec.ts`: `SudokuSpec` + presets (`KIDS_4X4_SPEC`, `KIDS_6X6_SPEC`, `MEGA_16X16_SPEC`) and `formatValue` (16x16 renders 10–16 as A–F).
  - `generator.ts`: unique-solution generation by randomized backtracking + hole-digging (each removal re-validated for uniqueness). `generateSudoku(difficulty, spec?)` and seeded `generateSudokuSeeded(seed, difficulty, spec?)` (xmur3 hash + mulberry32 PRNG — same seed ⇒ same puzzle; powers the homepage daily-puzzle toggle). Large grids use a node budget so 16x16 generation stays fast (evil ~5s, rest <1s).
  - `solver.ts`: `solveWithSteps(grid, spec?)` → step-by-step reasoning with `technique` (naked single / hidden single / candidate elimination / backtracking) + human description. Teaching-friendly, not just answers.
  - `validator.ts`: `isValidGrid`, `isCompleteGrid`, `getConflicts` (all spec-aware).
- **Content**: MDX via `@mdx-js/mdx` (runtime `evaluate` at build, no next.config changes). Posts in `src/content/blog/*.mdx`, rendered as static SSG via `generateStaticParams`. Adding/replacing a `.mdx` file auto-rebuilds the page.

## Project structure

```
src/app/
  layout.tsx          Root layout — header + footer + Inter font + SEO metadata
  globals.css         Tailwind v4 entry + component classes (blue #2563eb primary)
  page.tsx            Home / sudoku hints tool (HintsPage)
  play/kids/page.tsx  Kids tier (4x4 / 6x6 grids, size selector)
  play/mega/page.tsx  16x16 mega sudoku
  maker/page.tsx      Generate → play → print hub (SudokuGame + batch print)
  learn/page.tsx + learn/[slug]/page.tsx          Guide index + posts
  learn/tag/page.tsx + learn/tag/[tag]/page.tsx   Tag index + posts per tag
  privacy/page.tsx    Privacy policy
  terms/page.tsx      Terms of service
  sitemap.ts / robots.ts                 Generated sitemap.xml / robots.txt
src/components/       SudokuBoard (generic board), SudokuGame/SudokuPage, HintsPage, MakerPage, PrintBoard, BlogLayout, site-header, site-footer
src/content/guides/*.mdx   Blog posts (frontmatter: title/description/date/tags)
src/sudoku/*          Engine (spec/generator/solver/validator/index)
src/lib/posts.ts      MDX loader (frontmatter + evaluate)
src/lib/site.ts       Canonical site URL (update at deploy)
src/lib/utils.ts      cn() (clsx + tailwind-merge)
tsconfig.engine.json  Separate config to build+test the engine standalone
```

## Commands

```bash
npm run dev          # dev server at http://localhost:3000
npm run build        # production build (verifies static pre-render)
npm run typecheck    # tsc --noEmit
npm run lint         # eslint (eslint-config-next, flat config)
npm run test:engine  # engine unit tests (230 pass, covers 4x4/6x6/9x9/16x16)
```

## Engine tests

```bash
tsc -p tsconfig.engine.json && node dist/test-engine.js
```

## SEO notes

- Root layout `metadata` sets title/description and `metadataBase` for `/` and below; individual pages override where needed.
- Blog posts target A-tier low-competition keywords and link internally to `/play /hints` (weight funnel to tools).
- `sitemap.xml` lists all tool pages + posts; `robots.txt` allows all and points to the sitemap. Set `SITE_URL` in `src/lib/site.ts` to the real domain before launch.
- GEO baseline (site-group convention §4): `llms.txt` + `llms-full.txt` (dynamic, 6-section), homepage WebApplication + blog Article JSON-LD, GA4 behind `NEXT_PUBLIC_GA_ID`.
- Everything is static SSG — fully crawlable.

## Deploy checklist (GEO)

- Set `SITE_URL` (`src/lib/site.ts`) and `NEXT_PUBLIC_GA_ID` (env) to real values.
- Cloudflare: disable **Managed Robots.txt** (`is_robots_txt_managed: false`) so the repo `robots.txt` stays in effect and AI crawlers are not blocked.
- Submit `sitemap.xml` in Google Search Console; run a geocheckr AI-visibility audit after launch.

## Deploy

Next.js static + dynamic routes. Deploy to **Cloudflare Pages** or **Vercel** (set build command `npm run build`, output dir default). Prefer Cloudflare Pages for zero-dependency static hosting and PoP CDN. DNS/domain not yet assigned; will use a temporary `*.pages.dev` subdomain initially.

## Notes / conventions

- UI stack matches the house style: Tailwind v4 + `cn()` + lucide, blue `#2563eb` primary, `#1f2937` text, `#ffffff` bg. Header/footer follow the same pattern as the other projects.
- Project owned by Joker (乔克). Built collaboratively by 小沃 (planning/verification/writing), 大K (OpenCode, engine + page skeletons), 小K (keyword research + v3.1 plan).
- When modifying the engine, add functions without breaking existing exports; run `npm run test:engine` before finishing.
