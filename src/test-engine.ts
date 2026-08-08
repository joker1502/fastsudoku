/**
 * Engine test script.
 *
 * Exercises generation for every difficulty, verifies unique solutions,
 * runs the step-by-step solver, re-validates the produced solutions, and
 * checks the validator on a set of known-good and known-bad grids.
 * Prints PASS/FAIL per check and exits non-zero when any check fails.
 *
 * Run via: npm run test:engine  (compiled to dist/test-engine.js)
 */

import {
  generateSudoku,
  generateSudokuSeeded,
  solveWithSteps,
  hasUniqueSolution,
  isValidGrid,
  isCompleteGrid,
  getConflicts,
  type Difficulty,
  type Step,
} from './sudoku';

const VALID_TECHNIQUES: Step['technique'][] = [
  'naked single',
  'hidden single',
  'candidate elimination',
  'backtracking',
];

const TARGET_CLUES: Record<Difficulty, number> = {
  easy: 40,
  medium: 34,
  hard: 30,
  evil: 26,
};

let passed = 0;
let failed = 0;

function check(name: string, condition: boolean, detail?: string): void {
  if (condition) {
    passed++;
    console.log(`PASS: ${name}`);
  } else {
    failed++;
    console.log(`FAIL: ${name}${detail !== undefined ? ` -- ${detail}` : ''}`);
  }
}

function flatten(rows: number[][]): number[] {
  return rows.flat();
}

function main(): void {
  for (const difficulty of ['easy', 'medium', 'hard', 'evil'] as const) {
    const { puzzle, solution } = generateSudoku(difficulty);

    check(`${difficulty}: puzzle is length 81`, puzzle.length === 81);
    check(`${difficulty}: solution is length 81`, solution.length === 81);
    check(`${difficulty}: puzzle is a valid grid`, isValidGrid(puzzle));
    check(`${difficulty}: solution is a complete grid`, isCompleteGrid(solution));
    check(
      `${difficulty}: solution has no conflicts`,
      getConflicts(solution).length === 0,
    );

    const clues = puzzle.filter((value) => value !== 0).length;
    const target = TARGET_CLUES[difficulty];
    check(
      `${difficulty}: clue count ${clues} in [${target - 2},${target + 2}]`,
      clues >= target - 2 && clues <= target + 2,
      `got ${clues}`,
    );

    let givensMatch = true;
    for (let i = 0; i < 81; i++) {
      if (puzzle[i] !== 0 && puzzle[i] !== solution[i]) {
        givensMatch = false;
      }
    }
    check(`${difficulty}: givens match the solution`, givensMatch);

    check(`${difficulty}: puzzle has a unique solution`, hasUniqueSolution(puzzle));

    const { solution: solved, steps } = solveWithSteps(puzzle);
    check(
      `${difficulty}: solver produces a complete valid solution`,
      isCompleteGrid(solved) && getConflicts(solved).length === 0,
    );
    check(
      `${difficulty}: solver solution equals generated solution`,
      solved.join(',') === solution.join(','),
    );
    check(`${difficulty}: solver produced steps`, steps.length > 0, `got ${steps.length}`);
    check(
      `${difficulty}: step techniques are recognized`,
      steps.every((step) => VALID_TECHNIQUES.includes(step.technique)),
    );
    check(
      `${difficulty}: step coordinates are in range`,
      steps.every((step) => step.row >= 0 && step.row < 9 && step.col >= 0 && step.col < 9),
    );
    check(
      `${difficulty}: step values match the final solution`,
      steps.every((step) => solved[step.row * 9 + step.col] === step.value),
    );
  }

  // Validator edge cases.
  const validRows = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 4, 5, 6, 7, 8, 9, 1],
    [5, 6, 7, 8, 9, 1, 2, 3, 4],
    [8, 9, 1, 2, 3, 4, 5, 6, 7],
    [3, 4, 5, 6, 7, 8, 9, 1, 2],
    [6, 7, 8, 9, 1, 2, 3, 4, 5],
    [9, 1, 2, 3, 4, 5, 6, 7, 8],
  ];
  const complete = flatten(validRows);
  check('validator: known-good solution is valid', isValidGrid(complete));
  check('validator: known-good solution is complete', isCompleteGrid(complete));
  check(
    'validator: known-good solution has no conflicts',
    getConflicts(complete).length === 0,
  );

  const duplicateRow = complete.slice();
  duplicateRow[0] = 5;
  const rowConflicts = getConflicts(duplicateRow);
  check('validator: duplicate in row is invalid', !isValidGrid(duplicateRow));
  check(
    'validator: conflicting cells are reported',
    rowConflicts.length >= 2 && rowConflicts.some((c) => c.row === 0 && c.col === 0),
    `got ${JSON.stringify(rowConflicts)}`,
  );

  const emptyGrid = new Array<number>(81).fill(0);
  check('validator: empty grid is valid', isValidGrid(emptyGrid));
  check('validator: empty grid is not complete', !isCompleteGrid(emptyGrid));
  check('validator: empty grid has no unique solution', !hasUniqueSolution(emptyGrid));

  const emptySolve = solveWithSteps(emptyGrid);
  check(
    'solver: empty grid is solved by search fallback',
    isCompleteGrid(emptySolve.solution),
  );
  check(
    'solver: empty grid fallback used backtracking steps',
    emptySolve.steps.length > 0 &&
      emptySolve.steps.every((step) => step.technique === 'backtracking'),
  );

  // Seeded generation determinism (daily puzzle page).
  const seedA = '2026-08-08';
  const seedB = '2026-08-09';
  const first = generateSudokuSeeded(seedA, 'medium');
  const second = generateSudokuSeeded(seedA, 'medium');
  check(
    'seeded: same seed + difficulty gives the same puzzle',
    first.puzzle.join(',') === second.puzzle.join(','),
  );
  check(
    'seeded: same seed + difficulty gives the same solution',
    first.solution.join(',') === second.solution.join(','),
  );
  check(
    'seeded: generated puzzle is valid',
    isValidGrid(first.puzzle) && isCompleteGrid(first.solution),
  );
  check(
    'seeded: generated puzzle has a unique solution',
    hasUniqueSolution(first.puzzle),
  );
  const different = generateSudokuSeeded(seedB, 'medium');
  check(
    'seeded: different seed gives a different puzzle',
    different.puzzle.join(',') !== first.puzzle.join(','),
  );
  const evilSameSeed = generateSudokuSeeded(seedA, 'evil');
  check(
    'seeded: different difficulty gives a different puzzle',
    evilSameSeed.puzzle.join(',') !== first.puzzle.join(','),
  );

  console.log(`\nResult: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    throw new Error(`${failed} checks failed`);
  }
}

main();
