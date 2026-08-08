import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Play Sudoku Online Free - Daily Puzzles & Solver',
  description:
    'Play sudoku online free. Daily 9x9 sudoku puzzles in Easy, Medium, Hard and Evil with pencil notes, 3 hints, a timer and instant error checking.',
};

const NAV_LINKS = [
  { href: '/', label: 'Play' },
  { href: '/solver', label: 'Solver' },
  { href: '/printable', label: 'Printable' },
  { href: '/daily', label: 'Daily' },
  { href: '/blog', label: 'Guides' },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-nav">
          <a href="/" className="site-nav-brand" aria-label="Sudoku home">
            <span className="site-nav-logo">9</span>
            <span className="site-nav-name">Sudoku</span>
          </a>
          <nav aria-label="Main navigation">
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
