"use client";

import { cn } from "@/lib/utils";
import {
  DEFAULT_SPEC,
  formatValue,
  type SudokuSpec,
} from "@/sudoku";

interface SudokuBoardProps {
  values: number[];
  spec?: SudokuSpec;
  /** Cells that are givens (bold, not editable). */
  given?: boolean[];
  /** Cells rendered in gray (placeholder / example state). */
  faded?: boolean[];
  /** Pencil notes per cell (optional). */
  notes?: Set<number>[];
  selected?: number;
  highlightIndex?: number | null;
  peerIndexes?: number[];
  /** Flat cell indexes that are in a conflict. */
  conflictSet?: Set<number>;
  /** Flat cell indexes sharing the selected cell's value. */
  sameIndexes?: Set<number>;
  readOnly?: boolean;
  onSelect?: (index: number) => void;
}

const CELL_FONTS: Record<number, string> = {
  4: "clamp(24px, 9vw, 46px)",
  6: "clamp(20px, 7vw, 40px)",
  9: "clamp(18px, 5.2vw, 30px)",
  16: "clamp(8px, 2.2vw, 14px)",
};

const NOTE_FONTS: Record<number, string> = {
  4: "clamp(10px, 3.2vw, 18px)",
  6: "clamp(9px, 3vw, 16px)",
  9: "clamp(8px, 2.1vw, 12px)",
  16: "clamp(4px, 1vw, 7px)",
};

function cellClass(
  index: number,
  spec: SudokuSpec,
  selected: boolean,
  highlight: boolean,
  peer: boolean,
): string {
  const col = index % spec.size;
  const row = Math.floor(index / spec.size);
  return cn(
    "cell",
    (col + 1) % spec.boxCols === 0 && col !== spec.size - 1 && "br",
    (row + 1) % spec.boxRows === 0 && row !== spec.size - 1 && "bb",
    selected ? "cell-selected" : highlight ? "cell-step" : peer && "cell-peer",
  );
}

export default function SudokuBoard({
  values,
  spec = DEFAULT_SPEC,
  given = [],
  faded = [],
  notes,
  selected = -1,
  highlightIndex = null,
  peerIndexes = [],
  conflictSet,
  sameIndexes,
  readOnly = false,
  onSelect,
}: SudokuBoardProps) {
  const peerSet = new Set(peerIndexes);
  const conflict = conflictSet ?? new Set<number>();
  const same = sameIndexes ?? new Set<number>();
  const cellFont = CELL_FONTS[spec.size] ?? CELL_FONTS[9];
  const noteFont = NOTE_FONTS[spec.size] ?? NOTE_FONTS[9];

  return (
    <div
      className="board"
      aria-label={`${spec.size} by ${spec.size} sudoku board`}
      style={{
        gridTemplateColumns: `repeat(${spec.size}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${spec.size}, minmax(0, 1fr))`,
        "--cell-font": cellFont,
        "--note-font": noteFont,
      } as React.CSSProperties}
    >
      {values.map((value, index) => {
        const isGiven = given[index] === true;
        const cellNotes = notes?.[index];
        const hasNotes = cellNotes !== undefined && cellNotes.size > 0;
        return (
          <button
            key={index}
            className={cn(
              cellClass(
                index,
                spec,
                index === selected,
                index === highlightIndex,
                peerSet.has(index),
              ),
              conflict.has(index) && "cell-conflict",
            )}
            onClick={readOnly ? undefined : () => onSelect?.(index)}
            tabIndex={readOnly ? -1 : 0}
            aria-label={
              `Cell row ${Math.floor(index / spec.size) + 1} column ${(index % spec.size) + 1}` +
              (value !== 0 ? `, value ${formatValue(value)}` : "")
            }
          >
            {value !== 0 ? (
              <span
                className={cn(
                  "cell-digit",
                  isGiven ? "font-bold text-gray-900" : faded[index] ? "text-gray-400" : "text-blue-600",
                )}
              >
                {formatValue(value)}
              </span>
            ) : hasNotes ? (
              <span
                className={cn(
                  "notes-grid",
                  conflict.has(index) && "text-red-600",
                  same.has(index) && "bg-blue-50",
                  selected === index && "bg-blue-100",
                )}
                style={{
                  gridTemplateColumns: `repeat(${spec.boxCols}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${spec.boxRows}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: spec.size }, (_, d) => d + 1).map(
                  (digit) => (
                    <span
                      key={digit}
                      className={cn("note", !cellNotes.has(digit) && "note-off")}
                    >
                      {cellNotes.has(digit) ? formatValue(digit) : ""}
                    </span>
                  ),
                )}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
