import type { Metadata } from "next";
import SudokuPage from "@/components/SudokuPage";
import { MEGA_16X16_SPEC } from "@/sudoku";

export const metadata: Metadata = {
  title: "Mega Sudoku - Free Online 16x16 Puzzles - fastsudoku",
  description:
    "Play mega sudoku online free at fastsudoku. Huge 16x16 grids with 4x4 boxes in Easy, Medium, Hard, and Evil — pencil notes, hints, a timer and instant error checking.",
};

export default function MegaSudokuPage() {
  return (
    <SudokuPage
      title="Mega Sudoku"
      subtitle="Play mega sudoku online for free. The classic game on a giant 16×16 grid with 4×4 boxes — a proper workout for experienced solvers."
      spec={MEGA_16X16_SPEC}
      initialDifficulty="medium"
    />
  );
}
