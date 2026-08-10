import type { Metadata } from "next";
import HintsPage from "@/components/HintsPage";

export const metadata: Metadata = {
  title: "Sudoku Hints - Free Sudoku Solver & Step-by-Step Help - fastsudoku",
  description:
    "Stuck on a sudoku? Enter your grid or generate one, get the next logical move explained, or reveal the full solution step by step. Free fastsudoku hints and solver, no sign-up.",
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "fastsudoku Hints",
    operatingSystem: "Web",
    applicationCategory: "GameApplication",
    description:
      "fastsudoku hints tool: get the next logical move explained or reveal the full solution step by step.",
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HintsPage />
    </>
  );
}
