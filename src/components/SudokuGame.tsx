"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_SPEC,
  cellsOf,
  formatValue,
  generateSudoku,
  generateSudokuSeeded,
  getConflicts,
  isCompleteGrid,
  type Difficulty,
  type SudokuSpec,
} from "@/sudoku";
import { Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import SudokuBoard from "./SudokuBoard";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "evil"];

interface SudokuGameProps {
  initialPuzzle?: number[];
  initialSolution?: number[];
  initialDifficulty?: Difficulty;
  spec?: SudokuSpec;
  /** When provided, a size selector is shown instead of the difficulty bar. */
  sizeOptions?: { spec: SudokuSpec; label: string }[];
  generator?: (
    difficulty: Difficulty,
    spec: SudokuSpec,
  ) => { puzzle: number[]; solution: number[] };
  showDailyToggle?: boolean;
  /** Show the daily puzzle as a tab alongside the difficulty buttons. */
  showDailyTab?: boolean;
  /** Called whenever the puzzle changes (generation, difficulty switch, daily toggle). */
  onPuzzleChange?: (info: {
    puzzle: number[];
    solution: number[];
    difficulty: Difficulty;
    daily: boolean;
  }) => void;
  /** Kid-friendly mode: celebratory win overlay and larger touch targets. */
  kidMode?: boolean;
  /** Compact layout matching the homepage: board first, digit pad below. */
  compact?: boolean;
  /** Label shown below the board in compact mode (e.g. puzzle number). */
  puzzleLabel?: string;
}

function timeLabel(seconds: number): string {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function prettyDate(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function emptyNotes(spec: SudokuSpec): Set<number>[] {
  return Array.from({ length: cellsOf(spec) }, () => new Set<number>());
}

export default function SudokuGame({
  initialPuzzle,
  initialSolution,
  initialDifficulty = "easy",
  spec: specProp = DEFAULT_SPEC,
  sizeOptions,
  generator = generateSudoku,
  showDailyToggle = false,
  showDailyTab = false,
  onPuzzleChange,
  kidMode = false,
  compact = false,
  puzzleLabel,
}: SudokuGameProps) {
  const initialSpec = sizeOptions?.[0]?.spec ?? specProp;
  const [spec, setSpec] = useState<SudokuSpec>(initialSpec);
  const [puzzle, setPuzzle] = useState<number[]>(initialPuzzle ?? []);
  const [solution, setSolution] = useState<number[]>(initialSolution ?? []);
  const [values, setValues] = useState<number[]>(
    initialPuzzle ? initialPuzzle.slice() : new Array<number>(cellsOf(spec)).fill(0),
  );
  const [notes, setNotes] = useState<Set<number>[]>(() => emptyNotes(spec));
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [daily, setDaily] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [pencil, setPencil] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [solved, setSolved] = useState(false);
  const [undoStack, setUndoStack] = useState<number[][]>([]);

  const size = spec.size;

  const given = useMemo(() => puzzle.map((value) => value !== 0), [puzzle]);

  const conflicts = useMemo(() => {
    const set = new Set<number>();
    for (const cell of getConflicts(values, spec)) {
      set.add(cell.row * size + cell.col);
    }
    return set;
  }, [values, spec, size]);

  const sameIndexes = useMemo(() => {
    const set = new Set<number>();
    if (selected >= 0 && values[selected] !== 0) {
      values.forEach((value, index) => {
        if (value !== 0 && value === values[selected]) {
          set.add(index);
        }
      });
    }
    return set;
  }, [values, selected]);

  const remaining = useMemo(() => {
    const counts = new Array(size + 1).fill(size);
    for (const v of values) {
      if (v > 0) counts[v]--;
    }
    return counts;
  }, [values, size]);

  function finishIfComplete(next: number[]): void {
    if (isCompleteGrid(next, spec)) {
      setSolved(true);
    }
  }

  function applyPuzzle(p: number[], s: number[]): void {
    setPuzzle(p);
    setSolution(s);
    setValues(p.slice());
    setNotes(emptyNotes(spec));
    setSelected(-1);
    setSeconds(0);
    setHintsLeft(3);
    setSolved(false);
    setUndoStack([]);
  }

  function undo(): void {
    if (undoStack.length === 0) return;
    setUndoStack((s) => {
      const next = s.slice();
      const prev = next.pop()!;
      setValues(prev);
      return next;
    });
  }

  function puzzleGenerator() {
    return daily
      ? (diff: Difficulty, s: SudokuSpec) =>
          generateSudokuSeeded(toDateKey(new Date()), diff, s)
      : generator;
  }

  function newGame(nextDifficulty: Difficulty): void {
    setDifficulty(nextDifficulty);
    const { puzzle: p, solution: s } = puzzleGenerator()(nextDifficulty, spec);
    applyPuzzle(p, s);
    onPuzzleChange?.({ puzzle: p, solution: s, difficulty: nextDifficulty, daily: false });
  }

  function toggleDaily(): void {
    const next = !daily;
    setDaily(next);
    const gen = next
      ? (diff: Difficulty, s: SudokuSpec) =>
          generateSudokuSeeded(toDateKey(new Date()), diff, s)
      : generator;
    const { puzzle: p, solution: s } = gen(difficulty, spec);
    applyPuzzle(p, s);
    onPuzzleChange?.({ puzzle: p, solution: s, difficulty, daily: next });
  }

  function changeSize(nextSpec: SudokuSpec): void {
    if (nextSpec.size === spec.size) {
      return;
    }
    setSpec(nextSpec);
    const { puzzle: p, solution: s } = puzzleGenerator()(difficulty, nextSpec);
    applyPuzzle(p, s);
    onPuzzleChange?.({ puzzle: p, solution: s, difficulty, daily: false });
  }

  useEffect(() => {
    if (initialPuzzle === undefined) {
      // Generate a fresh puzzle only after hydration: running the generator
      // during SSR and again on the client would produce different boards and
      // trigger a hydration mismatch, so the initial board stays empty.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      newGame(initialDifficulty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialPuzzle && initialSolution && onPuzzleChange) {
      onPuzzleChange({
        puzzle: initialPuzzle,
        solution: initialSolution,
        difficulty: initialDifficulty,
        daily: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function enterDigit(digit: number): void {
    if (solved || selected < 0 || given[selected] || digit < 1 || digit > size) {
      return;
    }
    if (pencil) {
      setNotes((prev) => {
        const next = prev.map((set) => new Set(set));
        const set = next[selected];
        if (set.has(digit)) {
          set.delete(digit);
        } else {
          set.add(digit);
        }
        return next;
      });
      return;
    }
    setUndoStack((s) => [...s, values]);
    const next = values.slice();
    next[selected] = digit;
    setValues(next);
    setNotes((prev) => prev.map((set, i) => (i === selected ? new Set() : set)));
    finishIfComplete(next);
  }

  function erase(): void {
    if (solved || selected < 0 || given[selected]) {
      return;
    }
    if (pencil && notes[selected].size > 0) {
      setNotes((prev) => prev.map((set, i) => (i === selected ? new Set() : set)));
      return;
    }
    setUndoStack((s) => [...s, values]);
    const next = values.slice();
    next[selected] = 0;
    setValues(next);
    setNotes((prev) => prev.map((set, i) => (i === selected ? new Set() : set)));
  }

  function useHint(): void {
    if (solved || hintsLeft <= 0 || selected < 0 || given[selected]) {
      return;
    }
    if (values[selected] !== 0) {
      return;
    }
    setUndoStack((s) => [...s, values]);
    const next = values.slice();
    next[selected] = solution[selected];
    setValues(next);
    setNotes((prev) => prev.map((set, i) => (i === selected ? new Set() : set)));
    setHintsLeft((count) => count - 1);
    finishIfComplete(next);
  }

  function moveSelection(delta: number): void {
    if (selected < 0) {
      setSelected(0);
      return;
    }
    setSelected((((selected + delta) % cellsOf(spec)) + cellsOf(spec)) % cellsOf(spec));
  }

  useEffect(() => {
    if (solved) {
      return;
    }
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [solved]);

  const onKeyDownRef = useRef<(e: KeyboardEvent) => void>(() => {});
  useEffect(() => {
    onKeyDownRef.current = (event: KeyboardEvent): void => {
      if (event.key >= "1" && event.key <= "9") {
        enterDigit(Number(event.key));
        return;
      }
      if (size > 9 && /^[a-fA-F]$/.test(event.key)) {
        enterDigit(10 + event.key.toLowerCase().charCodeAt(0) - "a".charCodeAt(0));
        return;
      }
      if (event.key === "Backspace" || event.key === "Delete" || event.key === "0") {
        event.preventDefault();
        erase();
        return;
      }
      if (event.key === "p" || event.key === "P") {
        setPencil((value) => !value);
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
        moveSelection(-size);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        moveSelection(size);
      }
    };
  });
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKeyDownRef.current(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);


  const padColumns = `repeat(${Math.min(size + 1, 9)}, minmax(0, 1fr))`;

  return (
    <div className="relative">
      {!compact && (
        <div className="flex items-center justify-between gap-2 pb-3">
          <div
            className="min-w-[68px] text-left text-xl font-semibold tabular-nums"
            role="timer"
          >
            {kidMode ? "" : timeLabel(seconds)}
          </div>
          <div className="flex items-center gap-2">
            {showDailyToggle && !showDailyTab && (
              <button className="btn text-sm" onClick={toggleDaily}>
                {daily ? "Random puzzle" : "Today's puzzle"}
              </button>
            )}
            <button
              className="btn text-sm"
              onClick={useHint}
              disabled={solved || hintsLeft <= 0}
            >
              Hint ({hintsLeft})
            </button>
            <button className="btn text-sm" onClick={() => newGame(difficulty)}>
              New Game
            </button>
          </div>
        </div>
      )}

      {!compact && daily && (
        <p className="pb-3 text-center text-sm text-gray-500">
          Today&apos;s puzzle — {prettyDate(toDateKey(new Date()))}
        </p>
      )}

      {!compact && (
        sizeOptions ? (
          <div className="flex gap-1.5 pb-3" role="group" aria-label="Grid size">
            {sizeOptions.map((option) => (
              <button
                key={option.spec.size}
                className={cn("btn flex-1 py-2 text-sm", spec.size === option.spec.size && "btn-primary")}
                onClick={() => changeSize(option.spec)}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-1.5 pb-3" role="group" aria-label="Difficulty">
            {DIFFICULTIES.map((level) => (
              <button
                key={level}
                className={cn(
                  "btn flex-1 py-2 text-sm",
                  difficulty === level && !daily && "btn-primary",
                )}
                onClick={() => { setDaily(false); newGame(level); }}
              >
                {level[0].toUpperCase() + level.slice(1)}
              </button>
            ))}
            {showDailyTab && (
              <button
                className={cn("btn flex-1 py-2 text-sm", daily && "btn-primary")}
                onClick={toggleDaily}
              >
                {daily ? `Today (${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })})` : "Daily"}
              </button>
            )}
          </div>
        )
      )}

      {daily && !showDailyTab && (
        <p className="pb-3 text-center text-sm text-gray-500">
          Today&apos;s puzzle — {prettyDate(toDateKey(new Date()))}
        </p>
      )}

      <SudokuBoard
        values={values}
        spec={spec}
        given={given}
        notes={notes}
        selected={selected}
        conflictSet={conflicts}
        sameIndexes={sameIndexes}
        onSelect={setSelected}
      />

      {compact ? (
        <>
          <div className="mx-auto my-3 max-w-[480px]">
            {puzzleLabel && (
              <p className="mb-1 text-xs font-semibold tabular-nums text-gray-400">
                {puzzleLabel}
              </p>
            )}
            <div className="flex justify-center gap-1.5">
            {Array.from({ length: size }, (_, d) => d + 1).map((digit) => (
              <button
                key={digit}
                className="relative flex size-11 items-center justify-center rounded border border-gray-300 bg-white leading-none text-gray-800 hover:bg-gray-100 disabled:cursor-default disabled:opacity-45"
                onClick={() => enterDigit(digit)}
                disabled={solved}
                aria-label={`Digit ${formatValue(digit)}, ${remaining[digit]} remaining`}
              >
                <span className="text-lg font-bold">{formatValue(digit)}</span>
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
          </div>
          <div className="mb-2 flex justify-center gap-1.5" role="group" aria-label="Difficulty">
            {DIFFICULTIES.map((level) => (
              <button
                key={level}
                className={cn("btn px-3 py-1.5 text-sm", difficulty === level && !daily && "btn-primary")}
                onClick={() => { setDaily(false); newGame(level); }}
              >
                {level[0].toUpperCase() + level.slice(1)}
              </button>
            ))}
            {showDailyTab && (
              <button
                className={cn("btn px-3 py-1.5 text-sm", daily && "btn-primary")}
                onClick={toggleDaily}
              >
                {daily ? `Today (${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })})` : "Daily"}
              </button>
            )}
          </div>
          <div className="mb-3 flex justify-center gap-1.5">
            <button className="btn px-3 py-1.5 text-sm" onClick={() => newGame(difficulty)}>
              New Game
            </button>
          </div>
        </>
      ) : (
        <div
          className="pad"
          role="group"
          aria-label="Enter digit"
          style={{ gridTemplateColumns: padColumns }}
        >
          {Array.from({ length: size }, (_, d) => d + 1).map((digit) => (
            <button key={digit} className="digit btn" onClick={() => enterDigit(digit)}>
              {formatValue(digit)}
            </button>
          ))}
          <button className="digit btn" onClick={erase} aria-label="Erase">
            ✕
          </button>
        </div>
      )}

      {!compact && (
        <div className="mt-2.5 flex justify-center">
          <button
            className={cn("btn text-sm", pencil && "btn-primary")}
            onClick={() => setPencil((value) => !value)}
          >
            Pencil {pencil ? "on" : "off"}
          </button>
        </div>
      )}

      {solved && (
        <div className="win-overlay">
          {kidMode ? (
            <>
              <p className="mb-1 text-5xl">⭐</p>
              <h2 className="text-2xl font-bold">Great job!</h2>
              <p className="text-sm text-gray-500">You finished the puzzle!</p>
              <button
                className="btn btn-primary mt-2 text-lg"
                onClick={() => newGame(difficulty)}
              >
                Play Again
              </button>
            </>
          ) : (
            <>
              <h2>Solved!</h2>
              <p>Completed in {timeLabel(seconds)}</p>
              <button className="btn" onClick={() => newGame(difficulty)}>
                Play Again
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
