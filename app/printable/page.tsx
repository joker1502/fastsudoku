import type { Metadata } from 'next';
import { generateSudoku } from '@/src/sudoku';
import PrintablePage from '@/components/PrintablePage';

export const metadata: Metadata = {
  title: 'Printable Sudoku - Free PDF Puzzles to Print',
  description:
    'Print free sudoku puzzles to PDF. Generate Easy, Medium, Hard or Evil sudoku grids with an optional answer key — clean A4/letter layouts ready to print for classwork, homework, or just for fun.',
};

export const dynamic = 'force-dynamic';

export default function PrintableRoute() {
  const initialSets = Array.from({ length: 2 }, () => generateSudoku('medium'));
  return <PrintablePage initialSets={initialSets} />;
}
