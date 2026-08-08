'use client';

import { useMemo, useState } from 'react';
import { generateSudokuSeeded, type Difficulty } from '@/src/sudoku';
import SudokuGame from './SudokuGame';

const DEFAULT_DIFFICULTY: Difficulty = 'medium';

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function fromDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(key: string, delta: number): string {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + delta);
  return toDateKey(date);
}

function prettyDate(key: string): string {
  return fromDateKey(key).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface DailyPageProps {
  initialDate: string;
}

export default function DailyPage({ initialDate }: DailyPageProps) {
  const [dateKey, setDateKey] = useState(initialDate);

  const initial = useMemo(
    () => generateSudokuSeeded(dateKey, DEFAULT_DIFFICULTY),
    [dateKey],
  );

  return (
    <div className="page">
      <h1>Daily Sudoku</h1>
      <p className="tagline">
        Today's puzzle — {prettyDate(dateKey)}. One free puzzle a day, the same
        for every player worldwide. Pick a difficulty and race the clock.
      </p>

      <div className="date-nav" role="group" aria-label="Date navigation">
        <button onClick={() => setDateKey(addDays(dateKey, -1))} aria-label="Previous day">
          ‹ Prev
        </button>
        <span className="date-label">{prettyDate(dateKey)}</span>
        <button onClick={() => setDateKey(addDays(dateKey, 1))} aria-label="Next day">
          Next ›
        </button>
      </div>

      <SudokuGame
        key={dateKey}
        initialDifficulty={DEFAULT_DIFFICULTY}
        initialPuzzle={initial.puzzle}
        initialSolution={initial.solution}
        generator={(difficulty: Difficulty) =>
          generateSudokuSeeded(dateKey, difficulty)
        }
      />
    </div>
  );
}
