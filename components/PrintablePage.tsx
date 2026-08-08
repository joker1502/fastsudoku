'use client';

import { useMemo, useState } from 'react';
import { generateSudoku, type Difficulty } from '@/src/sudoku';
import PrintBoard from './PrintBoard';

interface PuzzleSet {
  puzzle: number[];
  solution: number[];
}

interface PrintablePageProps {
  initialSets: PuzzleSet[];
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'evil'];
const PER_PAGE_OPTIONS = [1, 2, 4] as const;

function labelFor(difficulty: Difficulty): string {
  return difficulty[0].toUpperCase() + difficulty.slice(1);
}

function generateSets(difficulty: Difficulty, count: number): PuzzleSet[] {
  return Array.from({ length: count }, () => generateSudoku(difficulty));
}

function groupSheets(sets: PuzzleSet[], perPage: number): PuzzleSet[][] {
  const pages: PuzzleSet[][] = [];
  for (let i = 0; i < sets.length; i += perPage) {
    pages.push(sets.slice(i, i + perPage));
  }
  return pages;
}

export default function PrintablePage({ initialSets }: PrintablePageProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [perPage, setPerPage] = useState<1 | 2 | 4>(1);
  const [count, setCount] = useState(2);
  const [includeAnswers, setIncludeAnswers] = useState(true);
  const [revealAnswers, setRevealAnswers] = useState(false);
  const [sets, setSets] = useState<PuzzleSet[]>(initialSets);

  const puzzleSheets = useMemo(() => groupSheets(sets, perPage), [sets, perPage]);
  const answerSheets = useMemo(
    () => groupSheets(sets, perPage),
    [sets, perPage],
  );

  function generate(): void {
    setSets(generateSets(difficulty, count));
    setRevealAnswers(false);
  }

  function print(): void {
    window.print();
  }

  return (
    <div className="page page-wide">
      <h1>Printable Sudoku</h1>
      <p className="tagline">
        Generate clean, print-ready sudoku puzzles as PDFs. Pick a difficulty,
        choose how many per page, add an answer key, and print straight from
        your browser.
      </p>

      <section className="printable-config no-print" aria-label="Print settings">
        <div className="printable-field">
          <span>Difficulty</span>
          <div className="printable-seg" role="group" aria-label="Difficulty">
            {DIFFICULTIES.map((level) => (
              <button
                key={level}
                className={difficulty === level ? 'active' : ''}
                onClick={() => setDifficulty(level)}
              >
                {labelFor(level)}
              </button>
            ))}
          </div>
        </div>

        <div className="printable-field">
          <span>Puzzles per page</span>
          <div
            className="printable-seg"
            role="group"
            aria-label="Puzzles per page"
          >
            {PER_PAGE_OPTIONS.map((n) => (
              <button
                key={n}
                className={perPage === n ? 'active' : ''}
                onClick={() => setPerPage(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="printable-field">
          <span>Number of puzzles</span>
          <select
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            aria-label="Number of puzzles"
          >
            {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="printable-toggles no-print" aria-label="Print options">
        <label>
          <input
            type="checkbox"
            checked={includeAnswers}
            onChange={(event) => setIncludeAnswers(event.target.checked)}
          />
          Include answer key
        </label>
        <label>
          <input
            type="checkbox"
            checked={revealAnswers}
            onChange={(event) => setRevealAnswers(event.target.checked)}
          />
          Show answers
        </label>
      </section>

      <div className="printable-actions no-print">
        <button className="generate" onClick={generate}>
          Generate
        </button>
        <button onClick={print}>Download PDF</button>
        <button onClick={print}>Print</button>
      </div>
      <p className="printable-note no-print">
        Download PDF / Print open your browser's print dialog — choose “Save as
        PDF” as the destination.
      </p>

      <div
        className={
          revealAnswers ? 'print-zone reveal-answers' : 'print-zone'
        }
      >
        {puzzleSheets.map((page, pageIndex) => (
          <section className="sheet" key={pageIndex}>
            <header className="sheet-header">
              <span>{labelFor(difficulty)} Sudoku</span>
              <span className="muted">
                Set {pageIndex + 1} of {puzzleSheets.length}
              </span>
            </header>
            <div className={`print-grid size-${perPage}`}>
              {page.map((set, i) => {
                const n = pageIndex * perPage + i + 1;
                return (
                  <PrintBoard
                    key={n}
                    puzzle={set.puzzle}
                    solution={set.solution}
                    label={`Sudoku #${n}`}
                  />
                );
              })}
            </div>
          </section>
        ))}

        {includeAnswers &&
          answerSheets.map((page, pageIndex) => (
            <section className="sheet" key={`answer-${pageIndex}`}>
              <header className="sheet-header">
                <span>Answer Key</span>
                <span className="muted">
                  Set {pageIndex + 1} of {answerSheets.length}
                </span>
              </header>
              <div className={`print-grid size-${perPage}`}>
                {page.map((set, i) => {
                  const n = pageIndex * perPage + i + 1;
                  return (
                    <PrintBoard
                      key={n}
                      puzzle={set.solution}
                      solution={set.solution}
                      answer
                      label={`Answer #${n}`}
                    />
                  );
                })}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
