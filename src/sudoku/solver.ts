/**
 * Sudoku solver with step-by-step reasoning.
 *
 * The solver first applies the three MVP techniques — naked single,
 * hidden single, and candidate elimination (pointing pairs) — and records
 * every placement as a human-readable step. If the logical techniques stall
 * before the grid is complete, the remainder is finished with backtracking
 * search. Advanced techniques such as X-Wing can be added as further passes
 * in the main solving loop (see the extension point marked below).
 */

import {
  type Grid,
  SIZE,
  CELLS,
  rowOf,
  colOf,
  boxOf,
  indexOf,
  isValidGrid,
} from './validator';

/**
 * A single solving step: the value placed in a cell, the technique that
 * justified it, and a human-readable explanation.
 */
export interface Step {
  /** Row of the placed cell (0-8). */
  row: number;
  /** Column of the placed cell (0-8). */
  col: number;
  /** Digit placed (1-9). */
  value: number;
  /**
   * Reasoning technique used. 'backtracking' is the search fallback used
   * only when the three MVP techniques cannot make progress; it is the
   * extension point where X-Wing and friends would be added instead.
   */
  technique:
    | 'naked single'
    | 'hidden single'
    | 'candidate elimination'
    | 'backtracking';
  /** Human-readable explanation of why the digit was placed. */
  description: string;
}

/**
 * Returns the candidate digits (1-9) that may still be placed in the given
 * cell, i.e. the digits not yet used by its row, column, or box. Returns an
 * empty array when the cell is already filled.
 */
export function getCandidates(grid: Grid, row: number, col: number): number[] {
  const index = indexOf(row, col);
  if (grid[index] !== 0) {
    return [];
  }
  const used = new Set<number>();
  for (let c = 0; c < SIZE; c++) {
    used.add(grid[indexOf(row, c)]);
  }
  for (let r = 0; r < SIZE; r++) {
    used.add(grid[indexOf(r, col)]);
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      used.add(grid[indexOf(r, c)]);
    }
  }
  const result: number[] = [];
  for (let digit = 1; digit <= 9; digit++) {
    if (!used.has(digit)) {
      result.push(digit);
    }
  }
  return result;
}

/**
 * Finds the empty cell with the fewest candidates (most constrained first).
 * Returns -1 when no empty cell remains (the grid is solved) or -2 when some
 * empty cell has zero candidates (a contradiction in the partial grid).
 */
export function findEmptyWithFewestCandidates(grid: Grid): number {
  let best = -1;
  let bestCount = SIZE + 1;
  for (let i = 0; i < CELLS; i++) {
    if (grid[i] !== 0) {
      continue;
    }
    const candidates = getCandidates(grid, rowOf(i), colOf(i));
    if (candidates.length === 0) {
      return -2;
    }
    if (candidates.length < bestCount) {
      bestCount = candidates.length;
      best = i;
      if (bestCount === 1) {
        break;
      }
    }
  }
  return best;
}

/**
 * Recursively solves the grid with backtracking search, recording each
 * placement as a 'backtracking' step. Returns true on success and only
 * leaves steps that are consistent with the final solution (steps are
 * popped again when a branch is abandoned).
 */
function searchAndRecord(work: Grid, steps: Step[]): boolean {
  const index = findEmptyWithFewestCandidates(work);
  if (index === -2) {
    return false;
  }
  if (index === -1) {
    return true;
  }
  const row = rowOf(index);
  const col = colOf(index);
  for (const digit of getCandidates(work, row, col)) {
    work[index] = digit;
    steps.push({
      row,
      col,
      value: digit,
      technique: 'backtracking',
      description: `Logical techniques stalled; placed ${digit} in cell (${row + 1},${col + 1}) by trial.`,
    });
    if (searchAndRecord(work, steps)) {
      return true;
    }
    work[index] = 0;
    steps.pop();
  }
  return false;
}

/**
 * Solves a Sudoku grid and returns the full solution together with the
 * ordered list of reasoning steps that produced it. Throws an error when
 * the input grid violates Sudoku rules or has no solution.
 */
export function solveWithSteps(grid: Grid): {
  solution: Grid;
  steps: Step[];
} {
  if (!isValidGrid(grid)) {
    throw new Error('solveWithSteps: grid is not a valid partial Sudoku');
  }
  const work = grid.slice();
  const steps: Step[] = [];
  const candidates = new Map<number, number[]>();

  const emptyCells = (): number[] => {
    const list: number[] = [];
    for (let i = 0; i < CELLS; i++) {
      if (work[i] === 0) {
        list.push(i);
      }
    }
    return list;
  };

  const computeAllCandidates = (): void => {
    candidates.clear();
    for (const index of emptyCells()) {
      candidates.set(index, getCandidates(work, rowOf(index), colOf(index)));
    }
  };

  const eliminate = (index: number, digit: number): void => {
    const list = candidates.get(index);
    if (list !== undefined) {
      const position = list.indexOf(digit);
      if (position !== -1) {
        list.splice(position, 1);
      }
    }
  };

  const removeFromPeers = (index: number, digit: number): void => {
    const row = rowOf(index);
    const col = colOf(index);
    for (let c = 0; c < SIZE; c++) {
      if (c !== col) {
        eliminate(indexOf(row, c), digit);
      }
    }
    for (let r = 0; r < SIZE; r++) {
      if (r !== row) {
        eliminate(indexOf(r, col), digit);
      }
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (r !== row || c !== col) {
          eliminate(indexOf(r, c), digit);
        }
      }
    }
  };

  const fill = (
    index: number,
    digit: number,
    technique: Step['technique'],
    description: string,
  ): void => {
    work[index] = digit;
    candidates.delete(index);
    removeFromPeers(index, digit);
    steps.push({
      row: rowOf(index),
      col: colOf(index),
      value: digit,
      technique,
      description,
    });
  };

  computeAllCandidates();
  let solved = work.indexOf(0) === -1;

  while (!solved) {
    // --- technique 1: naked single ---
    let nakedIndex = -1;
    for (const index of emptyCells()) {
      const list = candidates.get(index)!;
      if (list.length === 1) {
        nakedIndex = index;
        break;
      }
    }
    if (nakedIndex !== -1) {
      const row = rowOf(nakedIndex);
      const col = colOf(nakedIndex);
      const digit = candidates.get(nakedIndex)![0];
      fill(
        nakedIndex,
        digit,
        'naked single',
        `Cell (${row + 1},${col + 1}) has only one candidate left: ${digit}.`,
      );
      solved = work.indexOf(0) === -1;
      continue;
    }

    // --- technique 2: hidden single ---
    let hiddenIndex = -1;
    let hiddenDigit = 0;
    for (let digit = 1; digit <= SIZE && hiddenIndex === -1; digit++) {
      for (let r = 0; r < SIZE && hiddenIndex === -1; r++) {
        const spots: number[] = [];
        for (let c = 0; c < SIZE; c++) {
          const index = indexOf(r, c);
          if (work[index] === 0 && candidates.get(index)!.includes(digit)) {
            spots.push(index);
          }
        }
        if (spots.length === 1) {
          hiddenIndex = spots[0];
          hiddenDigit = digit;
        }
      }
      for (let c = 0; c < SIZE && hiddenIndex === -1; c++) {
        const spots: number[] = [];
        for (let r = 0; r < SIZE; r++) {
          const index = indexOf(r, c);
          if (work[index] === 0 && candidates.get(index)!.includes(digit)) {
            spots.push(index);
          }
        }
        if (spots.length === 1) {
          hiddenIndex = spots[0];
          hiddenDigit = digit;
        }
      }
      for (let b = 0; b < SIZE && hiddenIndex === -1; b++) {
        const startRow = Math.floor(b / 3) * 3;
        const startCol = (b % 3) * 3;
        const spots: number[] = [];
        for (let r = startRow; r < startRow + 3; r++) {
          for (let c = startCol; c < startCol + 3; c++) {
            const index = indexOf(r, c);
            if (work[index] === 0 && candidates.get(index)!.includes(digit)) {
              spots.push(index);
            }
          }
        }
        if (spots.length === 1) {
          hiddenIndex = spots[0];
          hiddenDigit = digit;
        }
      }
    }
    if (hiddenIndex !== -1) {
      const row = rowOf(hiddenIndex);
      const col = colOf(hiddenIndex);
      fill(
        hiddenIndex,
        hiddenDigit,
        'hidden single',
        `Digit ${hiddenDigit} can only be placed in cell (${row + 1},${col + 1}) within one of its units.`,
      );
      solved = work.indexOf(0) === -1;
      continue;
    }

    // --- technique 3: candidate elimination (pointing pairs/triples) ---
    const eliminations: string[] = [];
    for (let b = 0; b < SIZE; b++) {
      const startRow = Math.floor(b / 3) * 3;
      const startCol = (b % 3) * 3;
      for (let digit = 1; digit <= SIZE; digit++) {
        const inBox: number[] = [];
        for (let r = startRow; r < startRow + 3; r++) {
          for (let c = startCol; c < startCol + 3; c++) {
            const index = indexOf(r, c);
            if (work[index] === 0 && candidates.get(index)!.includes(digit)) {
              inBox.push(index);
            }
          }
        }
        if (inBox.length === 0) {
          continue;
        }
        const rows = new Set(inBox.map((index) => rowOf(index)));
        const cols = new Set(inBox.map((index) => colOf(index)));
        if (rows.size === 1) {
          const row = rows.values().next().value!;
          for (let c = 0; c < SIZE; c++) {
            const index = indexOf(row, c);
            if (work[index] !== 0 || boxOf(index) === b) {
              continue;
            }
            if (candidates.get(index)!.includes(digit)) {
              eliminate(index, digit);
              eliminations.push(
                `removed ${digit} from (${row + 1},${c + 1}) (box ${b + 1} pointing along row ${row + 1})`,
              );
            }
          }
        }
        if (cols.size === 1) {
          const col = cols.values().next().value!;
          for (let r = 0; r < SIZE; r++) {
            const index = indexOf(r, col);
            if (work[index] !== 0 || boxOf(index) === b) {
              continue;
            }
            if (candidates.get(index)!.includes(digit)) {
              eliminate(index, digit);
              eliminations.push(
                `removed ${digit} from (${r + 1},${col + 1}) (box ${b + 1} pointing along column ${col + 1})`,
              );
            }
          }
        }
      }
    }
    if (eliminations.length > 0) {
      const exposed = emptyCells().find((index) => candidates.get(index)!.length === 1);
      if (exposed !== undefined) {
        const row = rowOf(exposed);
        const col = colOf(exposed);
        const digit = candidates.get(exposed)![0];
        fill(
          exposed,
          digit,
          'candidate elimination',
          `Candidate elimination: ${eliminations.slice(0, 3).join('; ')}. ` +
            `Cell (${row + 1},${col + 1}) is now reduced to a single candidate ${digit}.`,
        );
        solved = work.indexOf(0) === -1;
        continue;
      }
      continue;
    }

    // --- fallback: backtracking search ---
    // This is the extension point for advanced techniques (X-Wing etc.).
    // When the MVP techniques stall, the remaining cells are solved by
    // search so that a complete solution is still guaranteed.
    if (!searchAndRecord(work, steps)) {
      throw new Error('solveWithSteps: puzzle has no valid solution');
    }
    break;
  }

  return { solution: work, steps };
}

/**
 * Returns true when the grid has exactly one valid completion, and false
 * when it has zero or multiple solutions. Throws an error when the input
 * grid violates Sudoku rules.
 */
export function hasUniqueSolution(grid: Grid): boolean {
  if (!isValidGrid(grid)) {
    throw new Error('hasUniqueSolution: grid is not a valid partial Sudoku');
  }
  const work = grid.slice();
  let count = 0;

  const search = (): boolean => {
    if (count > 1) {
      return true;
    }
    const index = findEmptyWithFewestCandidates(work);
    if (index === -2) {
      return false;
    }
    if (index === -1) {
      count++;
      return count > 1;
    }
    const row = rowOf(index);
    const col = colOf(index);
    for (const digit of getCandidates(work, row, col)) {
      work[index] = digit;
      if (search()) {
        return true;
      }
      work[index] = 0;
    }
    return false;
  };

  search();
  return count === 1;
}
