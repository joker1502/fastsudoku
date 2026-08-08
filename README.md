# Sudoku Site — Free Online Sudoku

A free online sudoku web app targeting the English-language SEO market. Play, solve step-by-step, print puzzles, and get a new daily puzzle every day.

## Status

MVP complete and ready to deploy. All page logic is written and verified; the SEO blog posts are placeholder content pending final writing by the content-ops AI (小K). Deploy via Cloudflare Pages is pending account/project setup.

## Project positioning

- **Market**: English-language, international (US accounts for ~15-20% of sudoku keyword volume).
- **Strategy**: SEO-led traffic into free tools, monetized with AdSense and a later subscription on the solver.
- **Seasonal focus**: Fall (Sep–Nov) is the golden window — teaching, printable, and beginner keywords spike 3x at back-to-school. MVP intended to launch before fall.

## Features

| Page | What it does | Target keyword | Est. monthly volume |
|------|--------------|----------------|---------------------|
| `/` | Play a sudoku game (home = play, Easy–Evil) | sudoku online | ~2M |
| `/solver` | Input a grid → step-by-step solving with the technique and reasoning explained (teaching-friendly) | sudoku solver | ~170K |
| `/printable` | Generate print-ready puzzles, download as PDF (browser print-to-PDF) | printable sudoku | ~170K |
| `/daily` | One fixed daily puzzle for everyone, date-navigable | daily sudoku | ~170K |
| `/blog` | 6 SEO teaching articles (all static SSG) | tips/techniques/strategy/how-to-solve/beginners/x-wing | 20–140K each |

All pages: desktop + mobile responsive, semantic HTML, SEO meta tags in layout.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict).
- **No backend, no database** — fully static-hostable (browser-side logic only). Suited for Cloudflare Pages / Vercel.
- **Sudoku engine**: pure TypeScript, zero deps, in `src/sudoku/`.
  - `generator.ts`: unique-solution generation by randomized backtracking + hole-digging (each removal re-validated for uniqueness). `generateSudoku(difficulty)` and seeded `generateSudokuSeeded(seed, difficulty)` (xmur3 hash + mulberry32 PRNG — same seed ⇒ same puzzle; used by `/daily`).
  - `solver.ts`: `solveWithSteps(grid)` → step-by-step reasoning with `technique` (naked single / hidden single / candidate elimination / backtracking) + human description. Teaching-friendly, not just answers.
  - `validator.ts`: `isValidGrid`, `isCompleteGrid`, `getConflicts`.
- **Content**: MDX via `@mdx-js/mdx` (runtime `evaluate` at build, no next.config changes). Posts in `content/blog/*.mdx`, rendered as static SSG via `generateStaticParams`. Adding/replacing a `.mdx` file auto-rebuilds the page.

## Project structure

```
app/
  layout.tsx          Root layout — global nav + SEO metadata
  globals.css         All styles (blue #2563eb primary, clean white)
  page.tsx            Home / play (SudokuGame)
  play/page.tsx       Play route (alias)
  solver/page.tsx     Step-by-step solver
  printable/page.tsx  Print generator
  daily/page.tsx      Daily puzzle (seeded)
  blog/page.tsx + blog/[slug]/page.tsx   Blog index + posts
components/           SudokuGame, SolverPage/SolverBoard, PrintablePage/PrintBoard, DailyPage, BlogLayout
content/blog/*.mdx    Blog posts (frontmatter: title/description/date)
src/sudoku/*          Engine (generator/solver/validator/index)
lib/posts.ts          MDX loader (frontmatter + evaluate)
tsconfig.engine.json  Separate config to build+test the engine standalone
```

## Commands

```bash
npm run dev          # dev server at http://localhost:3000
npm run build        # production build (verifies static pre-render)
npm run typecheck    # tsc --noEmit
npm run test:engine  # engine unit tests (currently 72 pass)
```

## Engine tests

```bash
tsc -p tsconfig.engine.json && node dist/test-engine.js
```

## SEO notes

- Root layout `metadata` sets title/description for `/` and below; individual pages override where needed.
- Blog posts target A-tier low-competition keywords and link internally to `/play /solver /printable` (weight funnel to tools).
- Everything is static SSG — fully crawlable.

## Deploy

Next.js static + dynamic routes. Deploy to **Cloudflare Pages** or **Vercel** (set build command `npm run build`, output dir default). Prefer Cloudflare Pages for zero-dependency static hosting and PoP CDN. DNS/domain not yet assigned; will use a temporary `*.pages.dev` subdomain initially.

## Notes / conventions

- Colors: blue `#2563eb` primary, `#1f2937` text, `#ffffff` bg.
- Project owned by Joker (乔克). Built collaboratively by 小沃 (planning/verification/writing), 大K (OpenCode, engine + page skeletons), 小K (keyword research, pending final blog copy).
- When modifying the engine, add functions without breaking existing exports; run `npm run test:engine` before finishing.
