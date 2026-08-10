import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply to using fastsudoku — the free online sudoku site, its puzzles and solver.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-7 pb-14">
      <h1 className="mb-2 text-[1.6rem] font-semibold tracking-tight">Terms of Service</h1>
      <p className="mb-6 text-sm text-gray-500">Last updated: August 2026</p>
      <div className="prose">
        <p>
          By using this sudoku site you agree to these terms. If you do not
          agree, please do not use the site.
        </p>
        <h2>Use of the site</h2>
        <p>
          This site provides free online tools: a playable sudoku game, a
          step-by-step solver, a daily puzzle, and print-ready puzzles. You may
          use these tools for personal, non-commercial purposes.
        </p>
        <h2>Intellectual property</h2>
        <p>
          The site content, including its puzzles, text, and design, is
          provided for your personal use. You may not copy, resell, or
          redistribute the puzzles or content in bulk without permission.
        </p>
        <h2>No warranty</h2>
        <p>
          The site and its tools are provided &ldquo;as is&rdquo; without any
          warranties. While we work to keep the site available and the solver
          correct, we cannot guarantee that the service will be uninterrupted
          or error-free.
        </p>
        <h2>Advertising</h2>
        <p>
          The site is supported by third-party advertising. We are not
          responsible for the content of third-party advertisements.
        </p>
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, we are not liable for any
          damages arising from your use of this site or its tools.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent via the{" "}
          <Link href="/">homepage</Link>.
        </p>
      </div>
    </div>
  );
}
