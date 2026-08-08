/**
 * Validation and structural helpers for 9x9 Sudoku grids.
 *
 * A grid is represented as a flat array of 81 cells in row-major order,
 * where 0 means "empty" and 1-9 are filled digits.
 */

/**
 * Sudoku grid type: a flat array of 81 cells, row-major order.
 * 0 represents an empty cell; digits 1-9 are the filled values.
 */
export type Grid = number[];

/** Number of rows, columns, and boxes in a standard 9x9 Sudoku. */
export const SIZE = 9;

/** Total number of cells in a 9x9 grid (81). */
export const CELLS = 81;

/** Returns the row (0-8) that a flat cell index belongs to. */
export function rowOf(index: number): number {
  return Math.floor(index / SIZE);
}

/** Returns the column (0-8) that a flat cell index belongs to. */
export function colOf(index: number): number {
  return index % SIZE;
}

/** Returns the box (0-8) that a flat cell index belongs to. */
export function boxOf(index: number): number {
  return Math.floor(rowOf(index) / 3) * 3 + Math.floor(colOf(index) / 3);
}

/** Returns the flat cell index (0-80) for the given row and column. */
export function indexOf(row: number, col: number): number {
  return row * SIZE + col;
}

/**
 * Returns true when the grid has the correct shape, every cell is an
 * integer in [0, 9], and no Sudoku rule (duplicate digit in a row,
 * column, or box) is violated. Empty cells (0) never count as conflicts.
 */
export function isValidGrid(grid: Grid): boolean {
  if (!Array.isArray(grid) || grid.length !== CELLS) {
    return false;
  }
  for (const cell of grid) {
    if (!Number.isInteger(cell) || cell < 0 || cell > 9) {
      return false;
    }
  }
  return getConflicts(grid).length === 0;
}

/**
 * Returns true when the grid is a fully solved Sudoku: every cell holds a
 * digit 1-9 and no rule is violated.
 */
export function isCompleteGrid(grid: Grid): boolean {
  if (!Array.isArray(grid) || grid.length !== CELLS) {
    return false;
  }
  for (const cell of grid) {
    if (cell === 0) {
      return false;
    }
  }
  return isValidGrid(grid);
}

/**
 * Returns every cell (as { row, col }) that is part of a duplicate-digit
 * conflict in its row, column, or box. Empty cells are never reported.
 * Returns an empty array for structurally invalid grids.
 */
export function getConflicts(grid: Grid): { row: number; col: number }[] {
  if (!Array.isArray(grid) || grid.length !== CELLS) {
    return [];
  }
  const conflicts: { row: number; col: number }[] = [];
  const flagged = new Set<number>();
  const flag = (index: number): void => {
    if (!flagged.has(index)) {
      flagged.add(index);
      conflicts.push({ row: rowOf(index), col: colOf(index) });
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
  for (let r = 0; r < SIZE; r++) {
    checkUnit(Array.from({ length: SIZE }, (_, c) => indexOf(r, c)));
  }
  for (let c = 0; c < SIZE; c++) {
    checkUnit(Array.from({ length: SIZE }, (_, r) => indexOf(r, c)));
  }
  for (let b = 0; b < SIZE; b++) {
    const startRow = Math.floor(b / 3) * 3;
    const startCol = (b % 3) * 3;
    const box: number[] = [];
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        box.push(indexOf(r, c));
      }
    }
    checkUnit(box);
  }
  return conflicts;
}
