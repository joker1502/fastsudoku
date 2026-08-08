import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Play Sudoku Online Free - Daily Puzzles & Solver',
  description:
    'Play sudoku online free. Daily 9x9 sudoku puzzles in Easy, Medium, Hard and Evil with pencil notes, 3 hints, a timer and instant error checking.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
