"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import PrintBoard from "./PrintBoard";
import SudokuBoard from "./SudokuBoard";
import { generateSudokuSeeded, getConflicts, isCompleteGrid, type Difficulty } from "@/sudoku";
import { cn } from "@/lib/utils";
import { Hash, Play, Printer, Search, Undo2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const PER_PAGE_OPTIONS = [1, 2, 4] as const;

interface PuzzleData {
  puzzle: number[];
  solution: number[];
  difficulty: Difficulty;
}

function getParamNum(): number {
  if (typeof window === "undefined") return 0;
  const v = parseInt(new URLSearchParams(window.location.search).get("batch") || "", 10);
  return v > 0 ? v : 0;
}

function getParamStr(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return new URLSearchParams(window.location.search).get(key) || fallback;
}

export default function MakerPage() {
  const [showPrint, setShowPrint] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(
    getParamStr("diff", "easy") as Difficulty,
  );
  const [count, setCount] = useState(parseInt(getParamStr("count", "1"), 10) || 1);
  const [puzzles, setPuzzles] = useState<PuzzleData[]>([]);
  const [batchId, setBatchId] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [perPage, setPerPage] = useState<1 | 2 | 4>(1);
  const [includeAnswers, setIncludeAnswers] = useState(true);
  const [lookupInput, setLookupInput] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setPremiumLoading(false);
        return;
      }
      const res = await fetch("/api/subscription");
      let prem = false;
      if (res.ok) {
        const body = await res.json();
        prem = body.isPremium;
        setIsPremium(prem);
      }
      if (!prem && count > 3) setCount(3);
      setPremiumLoading(false);

      const params = new URLSearchParams(window.location.search);
      if (params.get("payment") === "success") {
        setIsPremium(true);
        params.delete("payment");
        const url = new URL(window.location.href);
        url.search = params.toString();
        window.history.replaceState(null, "", url.toString());
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doGenerate = useCallback((bid: number) => {
    setBatchId(bid);
    const list: PuzzleData[] = [];
    for (let i = 0; i < count; i++) {
      const { puzzle, solution } = generateSudokuSeeded(`${bid}-${i + 1}`, difficulty);
      list.push({ puzzle, solution, difficulty });
    }
    setPuzzles(list);
    setActiveIdx(0);
    const url = new URL(window.location.href);
    url.searchParams.set("batch", String(bid));
    url.searchParams.set("diff", difficulty);
    url.searchParams.set("count", String(count));
    window.history.replaceState(null, "", url.toString());
  }, [difficulty, count]);

  useEffect(() => {
    const n = getParamNum();
    if (!n) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    doGenerate(n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const makeNew = () => doGenerate(Math.floor(Math.random() * 99999) + 1);

  const lookup = () => {
    const n = parseInt(lookupInput, 10);
    if (n > 0) doGenerate(n);
  };

  const active = puzzles[activeIdx] ?? null;

  const copies = useMemo(() => {
    if (puzzles.length === 0) return [];
    return puzzles.map((p) => ({ puzzle: p.puzzle, solution: p.solution }));
  }, [puzzles]);

  const sheets = useMemo(() => {
    const pages: { puzzle: number[]; solution: number[] }[][] = [];
    for (let i = 0; i < copies.length; i += perPage) pages.push(copies.slice(i, i + perPage));
    return pages;
  }, [copies, perPage]);

  return (
    <div className="mx-auto max-w-[800px] px-4 py-6 pb-14 text-center print:px-0 print:py-0">
      <h1 className="no-print mb-1 text-[1.6rem] font-semibold tracking-tight">fastsudoku Puzzle Maker</h1>
      <p className="no-print mb-4 text-sm text-gray-500">
        Choose a difficulty and how many puzzles — then make, play, and print.
      </p>

      <div className="no-print mb-3 flex items-center justify-center gap-1.5">
        <span className="text-xs text-gray-400">Look up</span>
        <input
          className="w-20 rounded border border-gray-300 px-2 py-1 text-center text-sm tabular-nums"
          value={lookupInput}
          onChange={(e) => setLookupInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") lookup(); }}
          placeholder="#"
        />
        <button className="btn h-8 w-8 p-0" onClick={lookup} title="Look up batch" aria-label="Look up batch">
          <Search className="size-3.5" />
        </button>
      </div>

      <div className="no-print mb-3 flex flex-wrap items-center justify-center gap-1.5">
        <div className="flex gap-1.5" role="group" aria-label="Difficulty">
          {(["easy", "medium", "hard", "evil"] as Difficulty[]).map((lvl) => (
            <button
              key={lvl}
              className={cn("btn px-3 py-1.5 text-sm", difficulty === lvl && "btn-primary")}
              onClick={() => setDifficulty(lvl)}
            >
              {lvl[0].toUpperCase() + lvl.slice(1)}
            </button>
          ))}
        </div>
        <span className="mx-1 text-xs text-gray-400">×</span>
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm"
        >
          {(isPremium ? [1, 2, 3, 4, 5, 8, 10] : [1, 2, 3]).map((n) => (<option key={n} value={n}>{n}</option>))}
        </select>
        {!isPremium && (
          <Link href="/pricing" className="text-xs text-blue-600 hover:underline">
            up to 10
          </Link>
        )}
        <button className={cn("btn px-4 py-1.5 text-sm", !showPrint && "btn-primary")} onClick={() => { if (showPrint) setShowPrint(false); else makeNew(); }}>
            Make
          </button>
        {puzzles.length > 0 && (
          <button
            className={cn("btn px-3 py-1.5 text-sm", showPrint && "btn-primary")}
            onClick={() => setShowPrint((v) => !v)}
          >
            Print
          </button>
        )}
      </div>

      {showPrint && puzzles.length > 0 && (
        <div className="no-print mx-auto mb-3 max-w-[480px] rounded-xl border border-gray-300 bg-gray-50 p-4 text-center">
          <div className="flex flex-wrap items-end justify-center gap-x-5 gap-y-3">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-gray-500">Per page</span>
              <div className="flex gap-1.5" role="group" aria-label="Puzzles per page">
                {PER_PAGE_OPTIONS.map((n) => (
                  <button key={n} className={cn("btn px-3 py-2 text-sm", perPage === n && "btn-primary")} onClick={() => setPerPage(n)}>{n}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-gray-500">Answer key</span>
              <button className={cn("btn px-3 py-2 text-sm", includeAnswers && "btn-primary")} onClick={() => setIncludeAnswers((v) => !v)}>
                {includeAnswers ? "On" : "Off"}
              </button>
            </div>
            <div className="flex flex-col items-center gap-1">
              <button className="btn btn-primary px-5" onClick={() => window.print()}>Print now</button>
            </div>
          </div>
        </div>
      )}

      {showPrint && puzzles.length > 0 && !premiumLoading && !isPremium && (
        <div className="no-print mx-auto mb-4 max-w-[480px] rounded-xl border border-blue-600/10 bg-blue-50 p-4 text-center">
          <p className="text-sm font-semibold text-gray-800">Watermark-free printing</p>
          <p className="mt-1 text-xs text-gray-500">
            Print watermark-free with larger batches — one payment, forever. Just $9.99.
          </p>
          <Link
            href="/pricing"
            className="mt-3 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            See pricing &rarr;
          </Link>
        </div>
      )}

      {showPrint && puzzles.length > 0 && isPremium && (
        <div className="no-print mx-auto mb-4 max-w-[480px] text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            &#9733; Premium — watermark-free
          </span>
        </div>
      )}

      {puzzles.length > 0 && (
        <div className="no-print">
          {puzzles.length > 1 && (
            <div className="mb-2 flex justify-center gap-1.5">
              {puzzles.map((_, i) => (
                <button
                  key={i}
                  className={cn("btn h-8 w-8 p-0 text-xs", i === activeIdx && "btn-primary")}
                  onClick={() => setActiveIdx(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          {batchId && (
            <p className="mb-2 text-xs tabular-nums text-gray-400">
              Batch #{batchId} — bookmark this page to come back
            </p>
          )}

          <div className="flex justify-center">
            <div className="w-full max-w-[480px]">
              <PlayableBoard key={`${batchId}-${activeIdx}`} puzzle={active?.puzzle ?? []} readOnly={showPrint} />
            </div>
          </div>
        </div>
      )}

      {puzzles.length > 0 && (
        <div className="hidden print:block text-left">
          {sheets.map((page, pageIndex) => (
            <section className="sheet" key={`copy-${pageIndex}`}>
              <header className="sheet-header">
                <span>Batch #{batchId} — {puzzles[0].difficulty[0].toUpperCase() + puzzles[0].difficulty.slice(1)} · {puzzles.length} puzzle{puzzles.length > 1 ? "s" : ""}</span>
                <span className="muted">Sheet {pageIndex + 1} / {sheets.length}</span>
              </header>
              <div className={`grid justify-items-center gap-x-5 gap-y-6 pp-${perPage} ${perPage <= 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                {page.map((set, i) => (
                  <PrintBoard key={i} puzzle={set.puzzle} solution={set.solution} label={`#${(pageIndex * perPage) + i + 1}`} watermark={!isPremium} />
                ))}
              </div>
            </section>
          ))}
          {includeAnswers && sheets.map((page, pageIndex) => (
            <section className="sheet" key={`answer-${pageIndex}`}>
              <header className="sheet-header">
                <span>Answer Key — Batch #{batchId}</span>
                <span className="muted">Sheet {pageIndex + 1} / {sheets.length}</span>
              </header>
              <div className={`grid justify-items-center gap-x-5 gap-y-6 pp-${perPage} ${perPage <= 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                {page.map((set, i) => (
                  <PrintBoard key={i} puzzle={set.solution} solution={set.solution} answer label={`Answer #${(pageIndex * perPage) + i + 1}`} watermark={!isPremium} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="no-print mx-auto mt-12 max-w-[560px]">
        <h2 className="mb-5 text-sm font-semibold text-gray-700">How to use the fastsudoku puzzle maker</h2>
        <div className="grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <Hash className="mb-2 size-5 text-blue-600" />
            <h3 className="mb-1 text-sm font-semibold text-gray-800">1. Choose & make</h3>
            <p className="text-xs leading-relaxed text-gray-500">
              Pick a difficulty and how many puzzles, then click Make. Each batch gets a unique ID — print it, share it, come back anytime.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <Play className="mb-2 size-5 text-blue-600" />
            <h3 className="mb-1 text-sm font-semibold text-gray-800">2. Play online</h3>
            <p className="text-xs leading-relaxed text-gray-500">
              Each puzzle is playable right in your browser. Fill cells, use undo, and track remaining digits as you solve — no sign-up needed.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <Printer className="mb-2 size-5 text-blue-600" />
            <h3 className="mb-1 text-sm font-semibold text-gray-800">3. Print & share</h3>
            <p className="text-xs leading-relaxed text-gray-500">
              Print 1, 2, or 4 puzzles per page with optional answer keys. Every sheet shows the batch ID so answers are always traceable.
            </p>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          Free fastsudoku puzzle maker · Generate, play, and print · No sign-up
        </p>
      </div>
    </div>
  );
}

function PlayableBoard({ puzzle, readOnly }: { puzzle: number[]; readOnly?: boolean }) {
  const [values, setValues] = useState<number[]>(puzzle.slice());
  const [selected, setSelected] = useState(-1);
  const [solved, setSolved] = useState(false);
  const [undoStack, setUndoStack] = useState<number[][]>([]);

  const given = useMemo(() => puzzle.map((v) => v !== 0), [puzzle]);
  const conflicts = useMemo(() => {
    if (readOnly) return new Set<number>();
    const set = new Set<number>();
    for (const c of getConflicts(values)) set.add(c.row * 9 + c.col);
    return set;
  }, [values, readOnly]);

  const remaining = useMemo(() => {
    const counts = [0, 9, 9, 9, 9, 9, 9, 9, 9, 9];
    for (const v of values) if (v > 0) counts[v]--;
    return counts;
  }, [values]);

  function enterDigit(digit: number): void {
    if (readOnly || solved || selected < 0 || given[selected]) return;
    setUndoStack((s) => [...s, values]);
    const next = values.slice();
    next[selected] = digit;
    setValues(next);
    if (isCompleteGrid(next)) setSolved(true);
  }

  function erase(): void {
    if (readOnly || solved || selected < 0 || given[selected]) return;
    setUndoStack((s) => [...s, values]);
    const next = values.slice();
    next[selected] = 0;
    setValues(next);
  }

  function undo(): void {
    if (undoStack.length === 0) return;
    setUndoStack((s) => { const n = s.slice(); const p = n.pop()!; setValues(p); return n; });
  }

  function moveSelection(delta: number): void {
    if (selected < 0) { setSelected(0); return; }
    setSelected((((selected + delta) % 81) + 81) % 81);
  }

  const onKeyDownRef = useRef<(e: KeyboardEvent) => void>(() => {});
  useEffect(() => {
    onKeyDownRef.current = (event: KeyboardEvent): void => {
      if (readOnly || solved) return;
      if (event.key >= "1" && event.key <= "9") { enterDigit(Number(event.key)); return; }
      if (event.key === "Backspace" || event.key === "Delete" || event.key === "0") { event.preventDefault(); erase(); return; }
      if (event.key === "ArrowLeft") { event.preventDefault(); moveSelection(-1); }
      else if (event.key === "ArrowRight") { event.preventDefault(); moveSelection(1); }
      else if (event.key === "ArrowUp") { event.preventDefault(); moveSelection(-9); }
      else if (event.key === "ArrowDown") { event.preventDefault(); moveSelection(9); }
    };
  });
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKeyDownRef.current(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);


  return (
    <>
      <SudokuBoard values={values} given={given} selected={readOnly ? -1 : selected} conflictSet={conflicts} onSelect={readOnly ? undefined : setSelected} />
      <div className="mx-auto my-3 flex max-w-[480px] justify-center gap-1.5">
        {Array.from({ length: 9 }, (_, d) => d + 1).map((digit) => (
          <button
            key={digit}
            className="relative flex size-11 items-center justify-center rounded border border-gray-300 bg-white leading-none text-gray-800 hover:bg-gray-100 disabled:cursor-default disabled:opacity-45"
            onClick={() => enterDigit(digit)}
            disabled={solved || readOnly}
            aria-label={`Digit ${digit}, ${remaining[digit]} remaining`}
          >
            <span className="text-lg font-bold">{digit}</span>
            <span className="absolute right-0.5 top-0 text-[0.5rem] leading-none text-gray-400">{remaining[digit]}</span>
          </button>
        ))}
        <button className="flex size-11 items-center justify-center rounded border border-gray-300 bg-white leading-none text-gray-800 hover:bg-gray-100 disabled:cursor-default disabled:opacity-45" onClick={undo} disabled={readOnly || undoStack.length === 0} aria-label="Undo"><Undo2 className="size-4" /></button>
      </div>
    </>
  );
}
