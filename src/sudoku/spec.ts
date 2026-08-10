/**
 * Sudoku grid specifications.
 *
 * The engine is size-agnostic: a specification (grid size + box dimensions)
 * drives every validator, solver, and generator call. Standard 9x9 uses 3x3
 * boxes; kids puzzles use 4x4 (2x2) and 6x6 (2x3); mega sudoku uses 16x16
 * (4x4). All public engine functions accept a spec and default to 9x9, so
 * existing callers keep working unchanged.
 */

export interface SudokuSpec {
  /** Number of rows and columns in the grid (4, 6, 9 or 16). */
  size: number;
  /** Height of a box in cells. */
  boxRows: number;
  /** Width of a box in cells. */
  boxCols: number;
}

/** Standard 9x9 sudoku (3x3 boxes). */
export const DEFAULT_SPEC: SudokuSpec = { size: 9, boxRows: 3, boxCols: 3 };

/** Kids 4x4 sudoku (2x2 boxes). */
export const KIDS_4X4_SPEC: SudokuSpec = { size: 4, boxRows: 2, boxCols: 2 };

/** Kids 6x6 sudoku (2x3 boxes). */
export const KIDS_6X6_SPEC: SudokuSpec = { size: 6, boxRows: 2, boxCols: 3 };

/** Mega 16x16 sudoku (4x4 boxes). */
export const MEGA_16X16_SPEC: SudokuSpec = { size: 16, boxRows: 4, boxCols: 4 };

/** Total number of cells in a grid of the given spec. */
export function cellsOf(spec: SudokuSpec): number {
  return spec.size * spec.size;
}

/** Number of boxes in a grid of the given spec. */
export function boxCount(spec: SudokuSpec): number {
  return (spec.size * spec.size) / (spec.boxRows * spec.boxCols);
}

/** Number of boxes per row in a grid of the given spec. */
export function boxesPerRow(spec: SudokuSpec): number {
  return spec.size / spec.boxCols;
}

/**
 * Formats a cell value for display. Values above 9 are shown as letters
 * (A-F) so a 16x16 mega grid stays readable: 10->A, 11->B, ... 16->F.
 */
export function formatValue(value: number): string {
  if (value <= 9) {
    return String(value);
  }
  return String.fromCharCode('A'.charCodeAt(0) + value - 10);
}
