/**
 * Sudoku solver with step-by-step reasoning.
 *
 * The solver first applies the core techniques — naked single, hidden single,
 * and candidate elimination (pointing pairs) — and records every placement as
 * a human-readable step. If the logical techniques stall before the grid is
 * complete, the remainder is finished with backtracking search. Every
 * function accepts a SudokuSpec (defaulting to 9x9) so kids 4x4/6x6 and
 * 16x16 mega grids are supported by the same solver.
 */

import {
  type Grid,
  rowOf,
  colOf,
  boxOf,
  indexOf,
  isValidGrid,
} from './validator';
import {
  type SudokuSpec,
  DEFAULT_SPEC,
  cellsOf,
  boxCount,
  boxesPerRow,
} from './spec';

/**
 * A single solving step: the value placed in a cell, the technique that
 * justified it, and a human-readable explanation.
 */
export interface Step {
  /** Row of the placed cell (0..size-1). */
  row: number;
  /** Column of the placed cell (0..size-1). */
  col: number;
  /** Digit placed (1..size). */
  value: number;
  /**
   * Reasoning technique used. 'backtracking' is the search fallback used
   * only when the three techniques cannot make progress.
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
 * Returns the candidate digits (1..size) that may still be placed in the
 * given cell, i.e. the digits not yet used by its row, column, or box.
 * Returns an empty array when the cell is already filled.
 */
export function getCandidates(
  grid: Grid,
  row: number,
  col: number,
  spec: SudokuSpec = DEFAULT_SPEC,
): number[] {
  const index = indexOf(row, col, spec);
  if (grid[index] !== 0) {
    return [];
  }
  const used = new Set<number>();
  for (let c = 0; c < spec.size; c++) {
    used.add(grid[indexOf(row, c, spec)]);
  }
  for (let r = 0; r < spec.size; r++) {
    used.add(grid[indexOf(r, col, spec)]);
  }
  const startRow = Math.floor(row / spec.boxRows) * spec.boxRows;
  const startCol = Math.floor(col / spec.boxCols) * spec.boxCols;
  for (let r = startRow; r < startRow + spec.boxRows; r++) {
    for (let c = startCol; c < startCol + spec.boxCols; c++) {
      used.add(grid[indexOf(r, c, spec)]);
    }
  }
  const result: number[] = [];
  for (let digit = 1; digit <= spec.size; digit++) {
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
export function findEmptyWithFewestCandidates(
  grid: Grid,
  spec: SudokuSpec = DEFAULT_SPEC,
): number {
  let best = -1;
  let bestCount = spec.size + 1;
  for (let i = 0; i < cellsOf(spec); i++) {
    if (grid[i] !== 0) {
      continue;
    }
    const candidates = getCandidates(grid, rowOf(i, spec), colOf(i, spec), spec);
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
function searchAndRecord(
  work: Grid,
  steps: Step[],
  spec: SudokuSpec,
): boolean {
  const index = findEmptyWithFewestCandidates(work, spec);
  if (index === -2) {
    return false;
  }
  if (index === -1) {
    return true;
  }
  const row = rowOf(index, spec);
  const col = colOf(index, spec);
  for (const digit of getCandidates(work, row, col, spec)) {
    work[index] = digit;
    steps.push({
      row,
      col,
      value: digit,
      technique: 'backtracking',
      description: `Logical techniques stalled; placed ${digit} in cell (${row + 1},${col + 1}) by trial.`,
    });
    if (searchAndRecord(work, steps, spec)) {
      return true;
    }
    work[index] = 0;
    steps.pop();
  }
  return false;
}

/**
 * Solves a sudoku grid and returns the full solution together with the
 * ordered list of reasoning steps that produced it. Throws an error when
 * the input grid violates sudoku rules or has no solution.
 */
export function solveWithSteps(
  grid: Grid,
  spec: SudokuSpec = DEFAULT_SPEC,
): { solution: Grid; steps: Step[] } {
  if (!isValidGrid(grid, spec)) {
    throw new Error('solveWithSteps: grid is not a valid partial sudoku');
  }
  const work = grid.slice();
  const steps: Step[] = [];
  const candidates = new Map<number, number[]>();
  const size = spec.size;

  const emptyCells = (): number[] => {
    const list: number[] = [];
    for (let i = 0; i < cellsOf(spec); i++) {
      if (work[i] === 0) {
        list.push(i);
      }
    }
    return list;
  };

  const computeAllCandidates = (): void => {
    candidates.clear();
    for (const index of emptyCells()) {
      candidates.set(
        index,
        getCandidates(work, rowOf(index, spec), colOf(index, spec), spec),
      );
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
    const row = rowOf(index, spec);
    const col = colOf(index, spec);
    for (let c = 0; c < size; c++) {
      if (c !== col) {
        eliminate(indexOf(row, c, spec), digit);
      }
    }
    for (let r = 0; r < size; r++) {
      if (r !== row) {
        eliminate(indexOf(r, col, spec), digit);
      }
    }
    const startRow = Math.floor(row / spec.boxRows) * spec.boxRows;
    const startCol = Math.floor(col / spec.boxCols) * spec.boxCols;
    for (let r = startRow; r < startRow + spec.boxRows; r++) {
      for (let c = startCol; c < startCol + spec.boxCols; c++) {
        if (r !== row || c !== col) {
          eliminate(indexOf(r, c, spec), digit);
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
    emptyCount--;
    candidates.delete(index);
    removeFromPeers(index, digit);
    steps.push({
      row: rowOf(index, spec),
      col: colOf(index, spec),
      value: digit,
      technique,
      description,
    });
  };

  computeAllCandidates();
  let emptyCount = work.filter((v) => v === 0).length;
  const solved = () => emptyCount === 0;

  while (!solved()) {
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
      const row = rowOf(nakedIndex, spec);
      const col = colOf(nakedIndex, spec);
      const digit = candidates.get(nakedIndex)![0];
      fill(
        nakedIndex,
        digit,
        'naked single',
        `Cell (${row + 1},${col + 1}) has only one candidate left: ${digit}.`,
      );
      continue;
    }

    // --- technique 2: hidden single ---
    let hiddenIndex = -1;
    let hiddenDigit = 0;
    for (let digit = 1; digit <= size && hiddenIndex === -1; digit++) {
      for (let r = 0; r < size && hiddenIndex === -1; r++) {
        const spots: number[] = [];
        for (let c = 0; c < size; c++) {
          const index = indexOf(r, c, spec);
          if (work[index] === 0 && candidates.get(index)!.includes(digit)) {
            spots.push(index);
          }
        }
        if (spots.length === 1) {
          hiddenIndex = spots[0];
          hiddenDigit = digit;
        }
      }
      for (let c = 0; c < size && hiddenIndex === -1; c++) {
        const spots: number[] = [];
        for (let r = 0; r < size; r++) {
          const index = indexOf(r, c, spec);
          if (work[index] === 0 && candidates.get(index)!.includes(digit)) {
            spots.push(index);
          }
        }
        if (spots.length === 1) {
          hiddenIndex = spots[0];
          hiddenDigit = digit;
        }
      }
      const boxesAcross = boxesPerRow(spec);
      for (let b = 0; b < boxCount(spec) && hiddenIndex === -1; b++) {
        const startRow = Math.floor(b / boxesAcross) * spec.boxRows;
        const startCol = (b % boxesAcross) * spec.boxCols;
        const spots: number[] = [];
        for (let r = startRow; r < startRow + spec.boxRows; r++) {
          for (let c = startCol; c < startCol + spec.boxCols; c++) {
            const index = indexOf(r, c, spec);
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
      const row = rowOf(hiddenIndex, spec);
      const col = colOf(hiddenIndex, spec);
      fill(
        hiddenIndex,
        hiddenDigit,
        'hidden single',
        `Digit ${hiddenDigit} can only be placed in cell (${row + 1},${col + 1}) within one of its units.`,
      );
      continue;
    }

    // --- technique 3: candidate elimination (pointing pairs/triples) ---
    const eliminations: string[] = [];
    const boxesAcross = boxesPerRow(spec);
    for (let b = 0; b < boxCount(spec); b++) {
      const startRow = Math.floor(b / boxesAcross) * spec.boxRows;
      const startCol = (b % boxesAcross) * spec.boxCols;
      for (let digit = 1; digit <= size; digit++) {
        const inBox: number[] = [];
        for (let r = startRow; r < startRow + spec.boxRows; r++) {
          for (let c = startCol; c < startCol + spec.boxCols; c++) {
            const index = indexOf(r, c, spec);
            if (work[index] === 0 && candidates.get(index)!.includes(digit)) {
              inBox.push(index);
            }
          }
        }
        if (inBox.length === 0) {
          continue;
        }
        const rows = new Set(inBox.map((index) => rowOf(index, spec)));
        const cols = new Set(inBox.map((index) => colOf(index, spec)));
        if (rows.size === 1) {
          const row = rows.values().next().value!;
          for (let c = 0; c < size; c++) {
            const index = indexOf(row, c, spec);
            if (work[index] !== 0 || boxOf(index, spec) === b) {
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
          for (let r = 0; r < size; r++) {
            const index = indexOf(r, col, spec);
            if (work[index] !== 0 || boxOf(index, spec) === b) {
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
        const row = rowOf(exposed, spec);
        const col = colOf(exposed, spec);
        const digit = candidates.get(exposed)![0];
        fill(
          exposed,
          digit,
          'candidate elimination',
          `Candidate elimination: ${eliminations.slice(0, 3).join('; ')}. ` +
            `Cell (${row + 1},${col + 1}) is now reduced to a single candidate ${digit}.`,
        );
        continue;
      }
      continue;
    }

    // --- fallback: backtracking search ---
    // When the logical techniques stall, the remaining cells are solved by
    // search so that a complete solution is still guaranteed.
    if (!searchAndRecord(work, steps, spec)) {
      throw new Error('solveWithSteps: puzzle has no valid solution');
    }
    break;
  }

  return { solution: work, steps };
}

/**
 * Returns true when the grid has exactly one valid completion, and false
 * when it has zero or multiple solutions. Throws an error when the input
 * grid violates sudoku rules.
 *
 * An optional node budget bounds the search. When the budget is exceeded the
 * function returns false ("could not prove uniqueness") so that callers such
 * as the generator can bail out safely instead of hanging on very large
 * grids (16x16). With the default budget of Infinity the result is exact.
 */
export function hasUniqueSolution(
  grid: Grid,
  spec: SudokuSpec = DEFAULT_SPEC,
  nodeBudget = Infinity,
): boolean {
  if (!isValidGrid(grid, spec)) {
    throw new Error('hasUniqueSolution: grid is not a valid partial sudoku');
  }
  const work = grid.slice();
  let count = 0;
  let nodes = 0;
  let budgetExceeded = false;

  const search = (): boolean => {
    if (count > 1 || budgetExceeded) {
      return true;
    }
    nodes++;
    if (nodes > nodeBudget) {
      budgetExceeded = true;
      return true;
    }
    const index = findEmptyWithFewestCandidates(work, spec);
    if (index === -2) {
      return false;
    }
    if (index === -1) {
      count++;
      return count > 1;
    }
    const row = rowOf(index, spec);
    const col = colOf(index, spec);
    for (const digit of getCandidates(work, row, col, spec)) {
      work[index] = digit;
      if (search()) {
        return true;
      }
      work[index] = 0;
    }
    return false;
  };

  search();
  if (budgetExceeded) {
    return false;
  }
  return count === 1;
}
