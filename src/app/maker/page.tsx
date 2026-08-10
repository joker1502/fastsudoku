import type { Metadata } from "next";
import MakerPage from "@/components/MakerPage";

export const metadata: Metadata = {
  title: "Sudoku Puzzle Maker - Generate, Play & Print Free Sudoku - fastsudoku",
  description:
    "Generate a sudoku puzzle, play it online with hints and a timer, then print as many copies as you need. Free fastsudoku puzzle maker, no sign-up.",
};

export default function MakerRoute() {
  return <MakerPage />;
}
