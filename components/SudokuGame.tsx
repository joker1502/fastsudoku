'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  generateSudoku,
  isCompleteGrid,
  getConflicts,
  type Difficulty,
} from '@/src/sudoku';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'evil'];
const CELLS = 81;

interface SudokuGameProps {
  initialPuzzle: number[];
  initialSolution: number[];
  initialDifficulty?: Difficulty;
  generator?: (difficulty: Difficulty) => { puzzle: number[]; solution: number[] };
}

function timeLabel(seconds: number): string {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function emptyNotes(): Set<number>[] {
  return Array.from({ length: CELLS }, () => new Set<number>());
}

export default function SudokuGame({
  initialPuzzle,
  initialSolution,
  initialDifficulty = 'easy',
  generator = generateSudoku,
}: SudokuGameProps) {
  const [puzzle, setPuzzle] = useState<number[]>(initialPuzzle);
  const [solution, setSolution] = useState<number[]>(initialSolution);
  const [values, setValues] = useState<number[]>(initialPuzzle.slice());
  const [notes, setNotes] = useState<Set<number>[]>(emptyNotes);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [selected, setSelected] = useState(-1);
  const [pencil, setPencil] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [solved, setSolved] = useState(false);

  const given = useMemo(() => puzzle.map((value) => value !== 0), [puzzle]);

  const conflicts = useMemo(() => {
    const set = new Set<number>();
    for (const cell of getConflicts(values)) {
      set.add(cell.row * 9 + cell.col);
    }
    return set;
  }, [values]);

  function finishIfComplete(next: number[]): void {
    if (isCompleteGrid(next)) {
      setSolved(true);
    }
  }

  function newGame(nextDifficulty: Difficulty): void {
    const { puzzle: p, solution: s } = generator(nextDifficulty);
    setDifficulty(nextDifficulty);
    setPuzzle(p);
    setSolution(s);
    setValues(p.slice());
    setNotes(emptyNotes());
    setSelected(-1);
    setSeconds(0);
    setHintsLeft(3);
    setSolved(false);
  }

  function enterDigit(digit: number): void {
    if (solved || selected < 0 || given[selected]) {
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
    setSelected((((selected + delta) % CELLS) + CELLS) % CELLS);
  }

  useEffect(() => {
    if (solved) {
      return;
    }
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [solved]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key >= '1' && event.key <= '9') {
        enterDigit(Number(event.key));
        return;
      }
      if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') {
        event.preventDefault();
        erase();
        return;
      }
      if (event.key === 'p' || event.key === 'P') {
        setPencil((value) => !value);
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

  function cellClass(index: number): string {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const classes = ['cell'];
    if (col === 2 || col === 5) {
      classes.push('br');
    }
    if (row === 2 || row === 5) {
      classes.push('bb');
    }
    if (given[index]) {
      classes.push('given');
    }
    if (index === selected) {
      classes.push('selected');
    } else if (
      selected >= 0 &&
      values[index] !== 0 &&
      values[index] === values[selected]
    ) {
      classes.push('same');
    }
    if (conflicts.has(index)) {
      classes.push('conflict');
    }
    return classes.join(' ');
  }

  return (
    <div className="game-shell">
      <div className="topbar">
        <div className="timer" role="timer">
          {timeLabel(seconds)}
        </div>
        <button
          className="hint"
          onClick={useHint}
          disabled={solved || hintsLeft <= 0}
        >
          Hint ({hintsLeft})
        </button>
        <button className="new" onClick={() => newGame(difficulty)}>
          New Game
        </button>
      </div>

      <div className="difficulty" role="group" aria-label="Difficulty">
        {DIFFICULTIES.map((level) => (
          <button
            key={level}
            className={difficulty === level ? 'active' : ''}
            onClick={() => newGame(level)}
          >
            {level[0].toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      <div className="board" aria-label="Sudoku board">
        {values.map((value, index) => (
          <button
            key={index}
            className={cellClass(index)}
            onClick={() => setSelected(index)}
            aria-label={
              `Cell row ${Math.floor(index / 9) + 1} column ${(index % 9) + 1}` +
              (value !== 0 ? `, value ${value}` : '')
            }
          >
            {value !== 0 ? (
              <span className={given[index] ? 'given-value' : 'entered'}>
                {value}
              </span>
            ) : notes[index].size > 0 ? (
              <span className="notes">
                {Array.from({ length: 9 }, (_, d) => d + 1).map((digit) => (
                  <span key={digit} className={notes[index].has(digit) ? 'on' : 'off'}>
                    {notes[index].has(digit) ? digit : ''}
                  </span>
                ))}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="pad" role="group" aria-label="Enter digit">
        {Array.from({ length: 9 }, (_, d) => d + 1).map((digit) => (
          <button key={digit} className="digit" onClick={() => enterDigit(digit)}>
            {digit}
          </button>
        ))}
        <button className="digit erase" onClick={erase} aria-label="Erase">
          ✕
        </button>
      </div>

      <div className="tools">
        <button
          className={pencil ? 'pencil active' : 'pencil'}
          onClick={() => setPencil((value) => !value)}
        >
          Pencil {pencil ? 'on' : 'off'}
        </button>
      </div>

      {solved && (
        <div className="win">
          <h2>Solved!</h2>
          <p>Completed in {timeLabel(seconds)}</p>
          <button onClick={() => newGame(difficulty)}>Play Again</button>
        </div>
      )}
    </div>
  );
}
