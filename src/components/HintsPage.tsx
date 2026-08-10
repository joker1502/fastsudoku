"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Eraser, Grid3x3, Lightbulb, Undo2 } from "lucide-react";
import {
  generateSudoku,
  getConflicts,
  isCompleteGrid,
  isValidGrid,
  solveWithSteps,
  type Difficulty,
  type Step,
} from "@/sudoku";
import { cn } from "@/lib/utils";
import { decodeGrid } from "@/lib/gridUrl";
import SudokuBoard from "./SudokuBoard";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "evil"];

const EXAMPLE = [
  5, 3, 0, 0, 7, 0, 0, 0, 0, //
  6, 0, 0, 1, 9, 5, 0, 0, 0, //
  0, 9, 8, 0, 0, 0, 0, 6, 0, //
  8, 0, 0, 0, 6, 0, 0, 0, 3, //
  4, 0, 0, 8, 0, 3, 0, 0, 1, //
  7, 0, 0, 0, 2, 0, 0, 0, 6, //
  0, 6, 0, 0, 0, 0, 2, 8, 0, //
  0, 0, 0, 4, 1, 9, 0, 0, 5, //
  0, 0, 0, 0, 8, 0, 0, 7, 9,
];

const TECHNIQUE_LABELS: Record<Step["technique"], string> = {
  "naked single": "Naked single",
  "hidden single": "Hidden single",
  "candidate elimination": "Candidate elimination",
  "backtracking": "Trial & backtrack",
};

const TECHNIQUE_LINKS: Record<Step["technique"], string> = {
  "naked single": "/guides/sudoku-techniques",
  "hidden single": "/guides/sudoku-techniques",
  "candidate elimination": "/guides/sudoku-techniques",
  "backtracking": "/guides/sudoku-logic-explained",
};

export default function HintsPage() {
  const [mode, setMode] = useState<"play" | "grid">("grid");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [puzzle, setPuzzle] = useState<number[]>(new Array(81).fill(0));
  const [values, setValues] = useState<number[]>(new Array(81).fill(0));
  const [original, setOriginal] = useState<number[]>(new Array(81).fill(0));
  const [selected, setSelected] = useState(-1);
  const [solved, setSolved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hint, setHint] = useState<Step | null>(null);
  const [undoStack, setUndoStack] = useState<number[][]>([]);
  const [touched, setTouched] = useState(false);

  const given = mode === "play" ? puzzle.map((value) => value !== 0) : [];

  const filled = values.filter((value) => value !== 0).length;
  const progress =
    values.length > 0
      ? Math.round((filled / values.length) * 100)
      : 0;

  const conflictSet = useMemo(() => {
    const conflicts = getConflicts(values);
    return new Set(conflicts.map((c) => c.row * 9 + c.col));
  }, [values]);

  const remaining = useMemo(() => {
    const counts = [0, 9, 9, 9, 9, 9, 9, 9, 9, 9];
    for (const v of values) {
      if (v > 0) counts[v]--;
    }
    return counts;
  }, [values]);

  const hintIndex =
    hint !== null ? hint.row * 9 + hint.col : null;

  const faded = useMemo(() => {
    if (mode !== "grid" || touched) return [];
    return original.map((v, i) => v !== 0 && values[i] === v);
  }, [mode, touched, original, values]);

  function resetState(): void {
    setSelected(-1);
    setSolved(false);
    setMessage(null);
    setHint(null);
    setUndoStack([]);
  }

  function startPuzzle(diff: Difficulty): void {
    setMode("play");
    setDifficulty(diff);
    const { puzzle: p } = generateSudoku(diff);
    setPuzzle(p);
    setValues(p.slice());
    setOriginal(p.slice());
    resetState();
  }

  function switchToGrid(): void {
    setMode("grid");
    setTouched(false);
    const ex = EXAMPLE.slice();
    setPuzzle(new Array(81).fill(0));
    setValues(ex);
    setOriginal(ex);
    resetState();
  }

  useEffect(() => {
    const decoded = decodeGrid(window.location.hash);
    if (decoded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOriginal(decoded);
      setValues(decoded);
      resetState();
      return;
    }
    setOriginal(EXAMPLE.slice());
    setValues(EXAMPLE.slice());
  }, []);

  function clearGrid(): void {
    setTouched(false);
    setUndoStack((s) => [...s, values]);
    const ex = EXAMPLE.slice();
    setValues(ex);
    setOriginal(ex);
    resetState();
  }

  function snapshotOriginalIfNeeded(): void {
    if (
      mode === "grid" &&
      !original.some((v) => v !== 0) &&
      values.some((v) => v !== 0)
    ) {
      setOriginal(values.slice());
    }
  }

  function undo(): void {
    if (undoStack.length === 0) return;
    setUndoStack((s) => {
      const next = s.slice();
      const prev = next.pop()!;
      setValues(prev);
      setHint(null);
      return next;
    });
  }

  function solve(): void {
    if (solved) return;
    if (mode === "grid" && !values.some((value) => value !== 0)) {
      setMessage("The grid is empty — enter your puzzle or load the example to get started.");
      return;
    }
    if (!isValidGrid(values)) {
      setMessage("Invalid grid — a row, column or 3x3 box contains a duplicate digit.");
      setHint(null);
      return;
    }
    try {
      snapshotOriginalIfNeeded();
      const { steps } = solveWithSteps(values);
      if (steps.length === 0) {
        setSolved(true);
        setHint(null);
        return;
      }
      const step = steps[0];
      const index = step.row * 9 + step.col;
      setUndoStack((s) => [...s, values]);
      const next = values.slice();
      next[index] = step.value;
      setValues(next);
      setHint(step);
      setMessage(null);
      if (isCompleteGrid(next)) setSolved(true);
    } catch {
      setMessage("No solution found — check the digits you entered.");
      setHint(null);
    }
  }

  function enterDigit(digit: number): void {
    if (solved || selected < 0) return;
    if (mode === "play" && given[selected]) return;
    if (mode === "grid" && !touched) {
      setTouched(true);
      const next = new Array<number>(81).fill(0);
      next[selected] = digit;
      setValues(next);
      setOriginal(new Array(81).fill(0));
      return;
    }
    setUndoStack((s) => [...s, values]);
    const next = values.slice();
    next[selected] = digit;
    setValues(next);
    setHint(null);
    if (isCompleteGrid(next)) setSolved(true);
  }

  function erase(): void {
    if (solved || selected < 0) return;
    if (mode === "play" && given[selected]) return;
    if (mode === "grid" && !touched) {
      setTouched(true);
      setValues(new Array(81).fill(0));
      setOriginal(new Array(81).fill(0));
      return;
    }
    setUndoStack((s) => [...s, values]);
    const next = values.slice();
    next[selected] = 0;
    setValues(next);
    setHint(null);
  }

  function moveSelection(delta: number): void {
    if (selected < 0) {
      setSelected(0);
      return;
    }
    setSelected((((selected + delta) % 81) + 81) % 81);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (solved) return;
      if (event.key >= "1" && event.key <= "9") {
        enterDigit(Number(event.key));
        return;
      }
      if (event.key === "Backspace" || event.key === "Delete" || event.key === "0") {
        event.preventDefault();
        erase();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveSelection(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        moveSelection(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveSelection(-9);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        moveSelection(9);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="mx-auto max-w-[800px] px-4 py-6 pb-14 text-center">
      <h1 className="mb-1 text-[1.6rem] font-semibold tracking-tight">fastsudoku Hints</h1>
      <p className="mb-4 text-sm text-gray-500">
        Stuck on a puzzle? Enter it and get the next logical move explained —
        or try a random example and watch it solve step by step.
      </p>

      <div className="mb-3 flex justify-center gap-1.5" role="group" aria-label="Mode">
        <button
          className={cn("btn px-4 py-1.5 text-sm", mode === "grid" && "btn-primary")}
          onClick={switchToGrid}
        >
          Enter yours
        </button>
        <button
          className={cn("btn px-4 py-1.5 text-sm", mode === "play" && "btn-primary")}
          onClick={() => startPuzzle(difficulty)}
        >
          Try an example
        </button>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-[480px]">
          <SudokuBoard
            values={values}
            given={given}
            faded={faded}
            selected={selected}
            highlightIndex={hintIndex}
            conflictSet={conflictSet}
            onSelect={setSelected}
          />
        </div>
      </div>

      <div className="mx-auto my-3 flex max-w-[480px] justify-center gap-1.5">
        {Array.from({ length: 9 }, (_, d) => d + 1).map((digit) => (
          <button
            key={digit}
            className="relative flex size-11 items-center justify-center rounded border border-gray-300 bg-white leading-none text-gray-800 hover:bg-gray-100 disabled:cursor-default disabled:opacity-45"
            onClick={() => enterDigit(digit)}
            disabled={solved}
            aria-label={`Digit ${digit}, ${remaining[digit]} remaining`}
          >
            <span className="text-lg font-bold">{digit}</span>
            <span className="absolute right-0.5 top-0 text-[0.5rem] leading-none text-gray-400">
              {remaining[digit]}
            </span>
          </button>
        ))}
        <button
          className="flex size-11 items-center justify-center rounded border border-gray-300 bg-white leading-none text-gray-800 hover:bg-gray-100 disabled:cursor-default disabled:opacity-45"
          onClick={undo}
          disabled={undoStack.length === 0}
          aria-label="Undo"
        >
          <Undo2 className="size-4" />
        </button>
      </div>

      <div className="mb-3 flex justify-center gap-1.5">
        <button className="btn btn-primary h-9 w-9 p-0" onClick={solve} disabled={solved} title="Solve" aria-label="Solve">
          <Lightbulb className="size-4" />
        </button>
        {mode === "grid" && (
          <button className="btn h-9 w-9 p-0" onClick={clearGrid} title="Clear" aria-label="Clear">
            <Eraser className="size-4" />
          </button>
        )}
      </div>

      {mode === "play" && (
        <div className="mb-3 flex justify-center gap-1.5" role="group" aria-label="Difficulty">
          {DIFFICULTIES.map((level) => (
            <button
              key={level}
              className={cn("btn px-3 py-1.5 text-sm", difficulty === level && "btn-primary")}
              onClick={() => startPuzzle(level)}
            >
              {level[0].toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      )}

      {hint && (
        <div className="mx-auto max-w-[480px] rounded-lg border border-amber-300 bg-amber-50 p-2 text-left text-sm">
          <p className="mb-0.5 font-bold text-gray-800">
            <Link href={TECHNIQUE_LINKS[hint.technique]} className="text-blue-600 hover:underline">
              {TECHNIQUE_LABELS[hint.technique]}
            </Link>
          </p>
          <p className="mb-0.5 font-semibold text-blue-600">
            Row {hint.row + 1}, Col {hint.col + 1} → {hint.value}
          </p>
          <p className="text-xs leading-relaxed text-gray-700">{hint.description}</p>
        </div>
      )}

      <div
        className="mx-auto mt-3 h-2 max-w-[480px] overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto mt-3 max-w-[480px] space-y-3">
        {message && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {message}
          </p>
        )}
        {solved && (
          <div className="rounded-lg border border-green-300 bg-green-50 p-3 text-left">
            <h2 className="mb-1 text-green-700">Solved!</h2>
            <p className="text-sm text-gray-700">
              Every cell is filled.
              {mode === "play" && " Choose a difficulty for a new puzzle."}
            </p>
          </div>
        )}
      </div>

      <div className="mx-auto mt-12 max-w-[560px]">
        <h2 className="mb-5 text-sm font-semibold text-gray-700">How to use this sudoku assistant</h2>
        <div className="grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <Grid3x3 className="mb-2 size-5 text-blue-600" />
            <h3 className="mb-1 text-sm font-semibold text-gray-800">1. Enter your puzzle</h3>
            <p className="text-xs leading-relaxed text-gray-500">
              Type the numbers you already know into the grid above, or pick a random example to get started.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <Lightbulb className="mb-2 size-5 text-blue-600" />
            <h3 className="mb-1 text-sm font-semibold text-gray-800">2. Click the lightbulb</h3>
            <p className="text-xs leading-relaxed text-gray-500">
              Each click reveals one logical move — the technique, the cell, and a plain-English explanation of why it works.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <BookOpen className="mb-2 size-5 text-blue-600" />
            <h3 className="mb-1 text-sm font-semibold text-gray-800">3. Learn as you go</h3>
            <p className="text-xs leading-relaxed text-gray-500">
              Technique names link to in-depth guides. You solve your puzzle while building real sudoku skills — one step at a time.
            </p>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          Free fastsudoku hints · No sign-up · No download · Step-by-step logical reasoning
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-[560px] rounded-xl border border-blue-600/10 bg-blue-50 p-5 text-center">
        <h2 className="text-sm font-semibold text-gray-800">New to sudoku?</h2>
        <p className="mt-1 text-xs text-gray-500">
          Learn the one simple rule, how the grid works, and how to play your first puzzle — in plain English.
        </p>
        <Link href="/what-is-sudoku" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          What Is Sudoku? &rarr;
        </Link>
      </div>
    </div>
  );
}
