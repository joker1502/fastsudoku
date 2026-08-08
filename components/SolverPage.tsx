'use client';

import { useEffect, useMemo, useState } from 'react';
import { isValidGrid, solveWithSteps, type Step } from '@/src/sudoku';
import SolverBoard from './SolverBoard';

const CELLS = 81;

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

const TECHNIQUE_LABELS: Record<Step['technique'], string> = {
  'naked single': '裸单（唯一候选）',
  'hidden single': '隐单（唯一位置）',
  'candidate elimination': '候选数排除',
  'backtracking': '试填回溯',
};

function peersOf(index: number): number[] {
  const row = Math.floor(index / 9);
  const col = index % 9;
  const peers = new Set<number>();
  for (let c = 0; c < 9; c++) {
    peers.add(row * 9 + c);
  }
  for (let r = 0; r < 9; r++) {
    peers.add(r * 9 + col);
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      peers.add(r * 9 + c);
    }
  }
  peers.delete(index);
  return [...peers];
}

export default function SolverPage() {
  const [input, setInput] = useState<number[]>(() => EXAMPLE.slice());
  const [selected, setSelected] = useState(-1);
  const [view, setView] = useState<'edit' | 'steps'>('edit');
  const [steps, setSteps] = useState<Step[]>([]);
  const [solution, setSolution] = useState<number[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const given = useMemo(() => input.map((value) => value !== 0), [input]);

  const stepBoard = useMemo(() => {
    const board = input.slice();
    for (let i = 0; i < stepIndex && i < steps.length; i++) {
      const step = steps[i];
      board[step.row * 9 + step.col] = step.value;
    }
    return board;
  }, [input, steps, stepIndex]);

  const currentStep =
    view === 'steps' && stepIndex < steps.length ? steps[stepIndex] : null;
  const highlightIndex =
    currentStep !== null ? currentStep.row * 9 + currentStep.col : null;
  const peerIndexes =
    highlightIndex !== null ? peersOf(highlightIndex) : [];

  useEffect(() => {
    if (!autoplay || view !== 'steps') {
      return;
    }
    if (stepIndex >= steps.length) {
      setAutoplay(false);
      return;
    }
    const id = window.setTimeout(
      () => setStepIndex((i) => Math.min(i + 1, steps.length)),
      900,
    );
    return () => window.clearTimeout(id);
  }, [autoplay, view, stepIndex, steps.length]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (view !== 'edit') {
        return;
      }
      if (event.key >= '1' && event.key <= '9') {
        enterDigit(Number(event.key));
        return;
      }
      if (
        event.key === 'Backspace' ||
        event.key === 'Delete' ||
        event.key === '0'
      ) {
        event.preventDefault();
        erase();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveSelection(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveSelection(1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveSelection(-9);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveSelection(9);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  function loadExample(): void {
    setInput(EXAMPLE.slice());
    setSelected(-1);
    setView('edit');
    setSteps([]);
    setSolution([]);
    setStepIndex(0);
    setAutoplay(false);
    setMessage(null);
  }

  function solve(): void {
    if (!isValidGrid(input)) {
      setMessage(
        'Invalid grid — a row, column, or 3x3 box contains a duplicate digit.',
      );
      return;
    }
    try {
      const result = solveWithSteps(input);
      setSteps(result.steps);
      setSolution(result.solution);
      setStepIndex(0);
      setAutoplay(false);
      setMessage(null);
      setView('steps');
    } catch {
      setMessage('No solution found for this puzzle. Check the givens for mistakes.');
    }
  }

  function backToEdit(): void {
    setView('edit');
    setAutoplay(false);
    setMessage(null);
  }

  function enterDigit(digit: number): void {
    if (view !== 'edit' || selected < 0) {
      return;
    }
    const next = input.slice();
    next[selected] = digit;
    setInput(next);
  }

  function erase(): void {
    if (view !== 'edit' || selected < 0) {
      return;
    }
    const next = input.slice();
    next[selected] = 0;
    setInput(next);
  }

  function moveSelection(delta: number): void {
    if (view !== 'edit') {
      return;
    }
    if (selected < 0) {
      setSelected(0);
      return;
    }
    setSelected((((selected + delta) % CELLS) + CELLS) % CELLS);
  }

  return (
    <div className="page">
      <h1>Sudoku Solver</h1>
      <p className="tagline">
        Enter any puzzle, hit Solve, and follow along step by step as every
        digit is placed with the solving technique and reasoning explained.
      </p>

      {view === 'edit' ? (
        <>
          <div className="solver-actions top">
            <button onClick={loadExample}>Load example</button>
            <button className="solve" onClick={solve}>
              Solve
            </button>
          </div>
          {message && (
            <p className="message" role="alert">
              {message}
            </p>
          )}
          <SolverBoard
            values={input}
            given={given}
            selected={selected}
            onCellClick={setSelected}
          />
          <div className="pad" role="group" aria-label="Enter digit">
            {Array.from({ length: 9 }, (_, d) => d + 1).map((digit) => (
              <button
                key={digit}
                className="digit"
                onClick={() => enterDigit(digit)}
              >
                {digit}
              </button>
            ))}
            <button className="digit erase" onClick={erase} aria-label="Erase">
              ✕
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="progress" role="progressbar" aria-valuenow={stepIndex} aria-valuemin={0} aria-valuemax={steps.length}>
            <div
              className="progress-fill"
              style={{
                width: `${steps.length === 0 ? 100 : (stepIndex / steps.length) * 100}%`,
              }}
            />
          </div>
          <p className="progress-label">
            Step {stepIndex} of {steps.length}
          </p>

          {currentStep !== null ? (
            <div className="step-card" aria-live="polite">
              <p className="step-technique">
                {TECHNIQUE_LABELS[currentStep.technique]}{' '}
                <span className="step-technique-en">
                  · {currentStep.technique}
                </span>
              </p>
              <p className="step-cell">
                Row {currentStep.row + 1}, Column {currentStep.col + 1} →{' '}
                {currentStep.value}
              </p>
              <p className="step-description">{currentStep.description}</p>
            </div>
          ) : (
            <div className="solved-banner">
              <h2>Solved!</h2>
              <p>
                The complete solution is shown above — {steps.length} steps in
                total.
              </p>
            </div>
          )}

          <SolverBoard
            values={stepBoard}
            given={given}
            highlightIndex={highlightIndex}
            peerIndexes={peerIndexes}
            readOnly
          />

          <div className="nav-controls">
            <button
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              disabled={stepIndex === 0}
            >
              Prev
            </button>
            <button
              onClick={() => setAutoplay((value) => !value)}
              disabled={stepIndex === steps.length}
            >
              {autoplay ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => setStepIndex((i) => Math.min(steps.length, i + 1))}
              disabled={stepIndex === steps.length}
            >
              Next
            </button>
          </div>

          <div className="solver-actions">
            <button onClick={backToEdit}>Edit puzzle</button>
            <button onClick={loadExample}>New example</button>
          </div>
        </>
      )}
    </div>
  );
}
