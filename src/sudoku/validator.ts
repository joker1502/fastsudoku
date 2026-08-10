/**
 * Validation and structural helpers for sudoku grids of any size.
 *
 * A grid is represented as a flat array of size*size cells in row-major
 * order, where 0 means "empty" and 1..size are filled digits. Every function
 * takes a SudokuSpec (defaulting to standard 9x9) so the same helpers serve
 * kids 4x4/6x6 grids and 16x16 mega grids.
 */

import {
  type SudokuSpec,
  DEFAULT_SPEC,
  cellsOf,
  boxCount,
  boxesPerRow,
} from './spec';

/**
 * Sudoku grid type: a flat array of size*size cells, row-major order.
 * 0 represents an empty cell; digits 1..size are the filled values.
 */
export type Grid = number[];

/** Returns the flat cell index (0..size*size-1) for the given row and column. */
export function rowOf(index: number, spec: SudokuSpec = DEFAULT_SPEC): number {
  return Math.floor(index / spec.size);
}

/** Returns the column (0..size-1) that a flat cell index belongs to. */
export function colOf(index: number, spec: SudokuSpec = DEFAULT_SPEC): number {
  return index % spec.size;
}

/** Returns the box (0..boxCount-1) that a flat cell index belongs to. */
export function boxOf(index: number, spec: SudokuSpec = DEFAULT_SPEC): number {
  const boxesAcross = boxesPerRow(spec);
  return (
    Math.floor(rowOf(index, spec) / spec.boxRows) * boxesAcross +
    Math.floor(colOf(index, spec) / spec.boxCols)
  );
}

/** Returns the flat cell index (0..size*size-1) for the given row and column. */
export function indexOf(
  row: number,
  col: number,
  spec: SudokuSpec = DEFAULT_SPEC,
): number {
  return row * spec.size + col;
}

/**
 * Returns true when the grid has the correct shape, every cell is an
 * integer in [0, size], and no sudoku rule (duplicate digit in a row,
 * column, or box) is violated. Empty cells (0) never count as conflicts.
 */
export function isValidGrid(grid: Grid, spec: SudokuSpec = DEFAULT_SPEC): boolean {
  if (!Array.isArray(grid) || grid.length !== cellsOf(spec)) {
    return false;
  }
  for (const cell of grid) {
    if (!Number.isInteger(cell) || cell < 0 || cell > spec.size) {
      return false;
    }
  }
  return getConflicts(grid, spec).length === 0;
}

/**
 * Returns true when the grid is a fully solved sudoku: every cell holds a
 * digit 1..size and no rule is violated.
 */
export function isCompleteGrid(grid: Grid, spec: SudokuSpec = DEFAULT_SPEC): boolean {
  if (!Array.isArray(grid) || grid.length !== cellsOf(spec)) {
    return false;
  }
  for (const cell of grid) {
    if (cell === 0) {
      return false;
    }
  }
  return isValidGrid(grid, spec);
}

/**
 * Returns every cell (as { row, col }) that is part of a duplicate-digit
 * conflict in its row, column, or box. Empty cells are never reported.
 * Returns an empty array for structurally invalid grids.
 */
export function getConflicts(
  grid: Grid,
  spec: SudokuSpec = DEFAULT_SPEC,
): { row: number; col: number }[] {
  if (!Array.isArray(grid) || grid.length !== cellsOf(spec)) {
    return [];
  }
  const conflicts: { row: number; col: number }[] = [];
  const flagged = new Set<number>();
  const flag = (index: number): void => {
    if (!flagged.has(index)) {
      flagged.add(index);
      conflicts.push({ row: rowOf(index, spec), col: colOf(index, spec) });
    }
  };
  const checkUnit = (unit: number[]): void => {
    const seen = new Map<number, number>();
    for (const index of unit) {
      const value = grid[index];
      if (value === 0) {
        continue;
      }
      const previous = seen.get(value);
      if (previous !== undefined) {
        flag(previous);
        flag(index);
      } else {
        seen.set(value, index);
      }
    }
  };
  for (let r = 0; r < spec.size; r++) {
    checkUnit(
      Array.from({ length: spec.size }, (_, c) => indexOf(r, c, spec)),
    );
  }
  for (let c = 0; c < spec.size; c++) {
    checkUnit(
      Array.from({ length: spec.size }, (_, r) => indexOf(r, c, spec)),
    );
  }
  const boxesAcross = boxesPerRow(spec);
  for (let b = 0; b < boxCount(spec); b++) {
    const startRow = Math.floor(b / boxesAcross) * spec.boxRows;
    const startCol = (b % boxesAcross) * spec.boxCols;
    const box: number[] = [];
    for (let r = startRow; r < startRow + spec.boxRows; r++) {
      for (let c = startCol; c < startCol + spec.boxCols; c++) {
        box.push(indexOf(r, c, spec));
      }
    }
    checkUnit(box);
  }
  return conflicts;
}
