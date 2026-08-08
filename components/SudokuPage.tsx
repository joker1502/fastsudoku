import { generateSudoku } from '@/src/sudoku';
import SudokuGame from './SudokuGame';

interface SudokuPageProps {
  title: string;
  subtitle: string;
}

export default function SudokuPage({ title, subtitle }: SudokuPageProps) {
  const { puzzle, solution } = generateSudoku('easy');
  return (
    <div className="page">
      <h1>{title}</h1>
      <p className="tagline">{subtitle}</p>
      <SudokuGame initialPuzzle={puzzle} initialSolution={solution} />
    </div>
  );
}
