import type { Metadata } from 'next';
import DailyPage from '@/components/DailyPage';

export const metadata: Metadata = {
  title: 'Daily Sudoku - Today\'s Puzzle & Play Free Online',
  description:
    'Play today\'s daily sudoku puzzle free online. One new puzzle a day, the same for every player worldwide — easy, medium, hard and evil with pencil notes, 3 hints and a timer.',
};

export const dynamic = 'force-dynamic';

function todayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function DailyRoute() {
  return <DailyPage initialDate={todayKey()} />;
}
