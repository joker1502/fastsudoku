import type { Metadata } from "next";
import SudokuPage from "@/components/SudokuPage";
import { KIDS_4X4_SPEC, KIDS_6X6_SPEC } from "@/sudoku";

export const metadata: Metadata = {
  title: "Sudoku for Children - Easy 4x4 & 6x6 Puzzles - fastsudoku",
  description:
    "Kid-friendly sudoku for children in big 4x4 and 6x6 grids at fastsudoku — the perfect first sudoku for children learning to play.",
};

const KIDS_SIZE_OPTIONS = [
  { spec: KIDS_4X4_SPEC, label: "4×4" },
  { spec: KIDS_6X6_SPEC, label: "6×6" },
];

export default function KidsSudokuPage() {
  return (
      <SudokuPage
      title="Sudoku for Kids"
      subtitle="Big, friendly grids that are perfect for a first sudoku. Pick a 4×4 or 6×6 board — no guesswork, just simple logic."
      sizeOptions={KIDS_SIZE_OPTIONS}
      kidMode
    />
  );
}
