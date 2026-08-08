import type { Metadata } from 'next';
import SolverPage from '@/components/SolverPage';

export const metadata: Metadata = {
  title: 'Sudoku Solver - Step by Step Solutions',
  description:
    'Free sudoku solver with step-by-step solutions. Enter any puzzle and watch each step solved with the technique explained — naked singles, hidden singles, candidate elimination — until the full solution is complete.',
};

export default function SolverRoute() {
  return <SolverPage />;
}
