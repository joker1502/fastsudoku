import { cn } from "@/lib/utils";
import { WATERMARK_TEXT } from "@/lib/site";

interface PrintBoardProps {
  puzzle: number[];
  solution: number[];
  answer?: boolean;
  label?: string;
  watermark?: boolean;
}

export default function PrintBoard({
  puzzle,
  solution,
  answer = false,
  label,
  watermark = false,
}: PrintBoardProps) {
  return (
    <figure
      className={cn("w-full m-0", answer ? "board-answer" : "board-puzzle")}
    >
      {label ? (
        <figcaption className="mb-1.5 text-[0.8rem] font-semibold text-gray-700">
          {label}
        </figcaption>
      ) : null}
      <div className="relative">
        <div className="pboard" role="img" aria-label={label ?? "fastsudoku grid"}>
          {Array.from({ length: 81 }, (_, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            return (
              <span
                key={index}
                className={cn(
                  "pcell",
                  (col === 2 || col === 5) && "br",
                  (row === 2 || row === 5) && "bb",
                )}
              >
                <span className="pval">{puzzle[index] !== 0 ? puzzle[index] : ""}</span>
                <span className="aval">{solution[index]}</span>
              </span>
            );
          })}
        </div>
        {watermark && (
          <span className="print-watermark" aria-hidden="true">
            {WATERMARK_TEXT}
          </span>
        )}
      </div>
    </figure>
  );
}
