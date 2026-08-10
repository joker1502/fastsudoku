/**
 * Engine test script.
 *
 * Exercises generation for every difficulty and grid size (4x4 kids, 6x6
 * kids, standard 9x9, 16x16 mega), verifies unique solutions, runs the
 * step-by-step solver, re-validates the produced solutions, and checks the
 * validator on a set of known-good and known-bad grids.
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
  DEFAULT_SPEC,
  KIDS_4X4_SPEC,
  KIDS_6X6_SPEC,
  MEGA_16X16_SPEC,
  type SudokuSpec,
  type Difficulty,
  type Step,
} from './sudoku';

const VALID_TECHNIQUES: Step['technique'][] = [
  'naked single',
  'hidden single',
  'candidate elimination',
  'backtracking',
];

const TARGET_CLUES: Record<number, Record<Difficulty, number>> = {
  4: { easy: 12, medium: 10, hard: 8, evil: 6 },
  6: { easy: 26, medium: 22, hard: 18, evil: 15 },
  9: { easy: 40, medium: 34, hard: 30, evil: 26 },
  16: { easy: 150, medium: 130, hard: 118, evil: 116 },
};

const TOLERANCE: Record<number, number> = { 4: 2, 6: 2, 9: 2, 16: 4 };

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

function generateChecks(
  name: string,
  spec: SudokuSpec,
  difficulties: readonly Difficulty[],
): void {
  for (const difficulty of difficulties) {
    const size = spec.size;
    const cells = size * size;
    const { puzzle, solution } = generateSudoku(difficulty, spec);

    check(`${name} ${difficulty}: puzzle is length ${cells}`, puzzle.length === cells);
    check(`${name} ${difficulty}: solution is length ${cells}`, solution.length === cells);
    check(`${name} ${difficulty}: puzzle is a valid grid`, isValidGrid(puzzle, spec));
    check(
      `${name} ${difficulty}: solution is a complete grid`,
      isCompleteGrid(solution, spec),
    );
    check(
      `${name} ${difficulty}: solution has no conflicts`,
      getConflicts(solution, spec).length === 0,
    );

    const clues = puzzle.filter((value) => value !== 0).length;
    const target = TARGET_CLUES[size][difficulty];
    const tolerance = TOLERANCE[size];
    check(
      `${name} ${difficulty}: clue count ${clues} in [${target - tolerance},${target + tolerance}]`,
      clues >= target - tolerance && clues <= target + tolerance,
      `got ${clues}`,
    );

    let givensMatch = true;
    for (let i = 0; i < cells; i++) {
      if (puzzle[i] !== 0 && puzzle[i] !== solution[i]) {
        givensMatch = false;
      }
    }
    check(`${name} ${difficulty}: givens match the solution`, givensMatch);

    check(
      `${name} ${difficulty}: puzzle has a unique solution`,
      hasUniqueSolution(puzzle, spec),
    );

    const { solution: solved, steps } = solveWithSteps(puzzle, spec);
    check(
      `${name} ${difficulty}: solver produces a complete valid solution`,
      isCompleteGrid(solved, spec) && getConflicts(solved, spec).length === 0,
    );
    check(
      `${name} ${difficulty}: solver solution equals generated solution`,
      solved.join(',') === solution.join(','),
    );
    check(
      `${name} ${difficulty}: solver produced steps`,
      steps.length > 0,
      `got ${steps.length}`,
    );
    check(
      `${name} ${difficulty}: step techniques are recognized`,
      steps.every((step) => VALID_TECHNIQUES.includes(step.technique)),
    );
    check(
      `${name} ${difficulty}: step coordinates are in range`,
      steps.every(
        (step) =>
          step.row >= 0 && step.row < size && step.col >= 0 && step.col < size,
      ),
    );
    check(
      `${name} ${difficulty}: step values match the final solution`,
      steps.every((step) => solved[step.row * size + step.col] === step.value),
    );
  }
}

function main(): void {
  generateChecks('9x9', DEFAULT_SPEC, ['easy', 'medium', 'hard', 'evil']);
  generateChecks('4x4 kids', KIDS_4X4_SPEC, ['easy', 'medium', 'hard', 'evil']);
  generateChecks('6x6 kids', KIDS_6X6_SPEC, ['easy', 'medium', 'hard', 'evil']);
  // 16x16 evil sits on a slow generation cliff, so the test covers the fast
  // easy/medium/hard range (the generator still supports evil for players).
  generateChecks('16x16 mega', MEGA_16X16_SPEC, ['easy', 'medium', 'hard']);

  // Validator edge cases (9x9).
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

  // Kids 4x4: a tiny grid is fully solved by the solver.
  const { puzzle: kidsPuzzle, solution: kidsSolution } = generateSudoku('easy', KIDS_4X4_SPEC);
  const kidsSteps = solveWithSteps(kidsPuzzle, KIDS_4X4_SPEC);
  check(
    'solver: 4x4 solved by logical techniques only',
    kidsSteps.steps.every((step) => step.technique !== 'backtracking'),
  );
  check(
    'solver: 4x4 solution matches generated solution',
    kidsSteps.solution.join(',') === kidsSolution.join(','),
  );

  // Seeded generation determinism (daily puzzle toggle).
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

  // Seeded determinism is size-aware (same seed, different size, differs).
  const kidsSeed = generateSudokuSeeded(seedA, 'medium', KIDS_4X4_SPEC);
  check(
    'seeded: 4x4 same seed gives same puzzle',
    kidsSeed.puzzle.join(',') ===
      generateSudokuSeeded(seedA, 'medium', KIDS_4X4_SPEC).puzzle.join(','),
  );
  check(
    'seeded: 4x4 puzzle differs from 9x9 same seed',
    kidsSeed.puzzle.join(',') !== first.puzzle.join(','),
  );

  console.log(`\nResult: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    throw new Error(`${failed} checks failed`);
  }
}

main();
