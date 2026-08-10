import type { Difficulty, SudokuSpec } from "@/sudoku";
import SudokuGame from "./SudokuGame";

interface SudokuPageProps {
  title: string;
  subtitle: string;
  initialDifficulty?: Difficulty;
  spec?: SudokuSpec;
  sizeOptions?: { spec: SudokuSpec; label: string }[];
  showDailyToggle?: boolean;
  kidMode?: boolean;
}

export default function SudokuPage({
  title,
  subtitle,
  initialDifficulty,
  spec,
  sizeOptions,
  showDailyToggle,
  kidMode,
}: SudokuPageProps) {
  return (
    <div className="mx-auto max-w-[560px] px-4 py-7 pb-14 text-center">
      <h1 className="mb-2 text-[1.6rem] font-semibold tracking-tight">{title}</h1>
      <p className="mb-5 text-sm text-gray-500">{subtitle}</p>
      <SudokuGame
        initialDifficulty={initialDifficulty}
        spec={spec}
        sizeOptions={sizeOptions}
        showDailyToggle={showDailyToggle}
        kidMode={kidMode}
      />
    </div>
  );
}
