import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Grid3x3,
  Hash,
  Lightbulb,
  Smile,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "What Is Sudoku? A Beginner's Guide - fastsudoku",
  description:
    "What is sudoku? Learn the one simple rule, how the grid works, how to play your first puzzle, and why millions of people solve it every day — all on fastsudoku.",
};

export default function WhatIsSudokuPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What Is Sudoku? A Beginner's Guide",
    description:
      "What is sudoku? Learn the one simple rule, how the grid works, how to play your first puzzle, and why millions of people solve it every day.",
    datePublished: "2026-08-09",
    author: { "@type": "Organization", name: "fastsudoku" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50/50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            What Is Sudoku? A Beginner&apos;s Guide
          </h1>
          <p className="mt-4 max-w-xl text-lg text-gray-500">
            One rule. Nine numbers. Millions of players. Everything you need to
            know to start solving today — explained in plain English.
          </p>
        </div>
      </section>

      {/* The One Rule */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            The One Rule
          </h2>
          <div className="mt-4 rounded-xl border-l-4 border-blue-600 bg-blue-50/60 p-6">
            <blockquote className="text-lg font-medium text-gray-800">
              Every row, every column, and every 3&times;3 box must contain the
              numbers 1 through 9 exactly once.
            </blockquote>
            <p className="mt-3 text-sm text-gray-500">
              No arithmetic. No addition. No multiplication. Only logic. Every
              technique you will ever learn is just a clever way of applying
              this one sentence.
            </p>
          </div>
        </div>
      </section>

      {/* How to Play */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            How to Play
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            No strategy required — just the rule and a little patience.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-600/30 hover:shadow-md"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <step.icon className="size-5" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600">
                    {i + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Called Sudoku + Pick Your Level */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            {/* Why the name */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Why &ldquo;Sudoku&rdquo;?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                From Japanese{" "}
                <strong className="text-gray-700">sū</strong> (number) +{" "}
                <strong className="text-gray-700">doku</strong> (single).
                Popularized in Japan in the 1980s, though its ancestor — called
                <em> Number Place</em> — first appeared in an American puzzle
                magazine in the late 1970s.
              </p>
            </div>

            {/* Pick Your Level */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Pick Your Level
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Same rule, different challenge. Start easy and work your way up.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/maker"
                  className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-600/30 hover:shadow-md"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-50">
                    <Grid3x3 className="size-4 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Easy &amp; Medium
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Plenty of given numbers — most cells resolve with a single
                      look.
                    </p>
                  </div>
                </Link>
                <Link
                  href="/maker"
                  className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-600/30 hover:shadow-md"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                    <Lightbulb className="size-4 text-orange-500" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Hard &amp; Evil
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Fewer clues. You&rsquo;ll need pencil notes and
                      multi-step logic.
                    </p>
                  </div>
                </Link>
                <Link
                  href="/kids"
                  className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-600/30 hover:shadow-md"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-pink-50">
                    <Smile className="size-4 text-pink-500" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Kids 4&times;4 &amp; 6&times;6
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Smaller grids for young players — same logic, less
                      overwhelm.
                    </p>
                  </div>
                </Link>
                <Link
                  href="/mega"
                  className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-600/30 hover:shadow-md"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                    <Zap className="size-4 text-purple-500" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Mega 16&times;16
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      A giant grid with 4&times;4 boxes — a serious workout for
                      experienced solvers.
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Questions */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Common Questions
          </h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-gray-900">
                Is sudoku math?
              </h3>
              <p className="mt-1.5 text-sm text-gray-500">
                No. It uses numbers as symbols — you could swap them for letters
                or shapes and the puzzle would work exactly the same. There is
                zero calculation involved.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-gray-900">
                Do I need to guess?
              </h3>
              <p className="mt-1.5 text-sm text-gray-500">
                On a well-made puzzle, never. Every move can be found by logic
                alone. If you find yourself guessing, there is a technique you
                have not spotted yet.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-gray-900">
                Can I get better?
              </h3>
              <p className="mt-1.5 text-sm text-gray-500">
                Yes — and faster than you think. Beginners improve fastest by
                learning a few core{" "}
                <Link
                  href="/guides/sudoku-techniques"
                  className="text-blue-600 hover:underline"
                >
                  solving techniques
                </Link>{" "}
                and practising regularly. Our{" "}
                <Link
                  href="/guides/sudoku-for-beginners"
                  className="text-blue-600 hover:underline"
                >
                  beginner&rsquo;s guide
                </Link>{" "}
                walks you through your first finished puzzle step by step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-blue-600/10 bg-blue-50/50">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Ready to Start?
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Reading about the rule is one thing — feeling it click is another.
            No sign-up, just the grid and the rule.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/maker"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Play a Puzzle <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Try the Hints Tool
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-400">
            <Link href="/kids" className="hover:text-gray-600">
              Kids 4&times;4 / 6&times;6
            </Link>
            <Link href="/mega" className="hover:text-gray-600">
              Mega 16&times;16
            </Link>
            <Link href="/guides" className="hover:text-gray-600">
              All Guides
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

const STEPS = [
  {
    icon: Grid3x3,
    title: "Look at the grid",
    desc: "Find a row, column, or box where only a few numbers are missing. Those are your easiest wins.",
  },
  {
    icon: Hash,
    title: "Ask: what can go here?",
    desc: "Check the row, column, and box of an empty cell. Cross off any number already used in those three units.",
  },
  {
    icon: Lightbulb,
    title: "Place the number",
    desc: "When a cell has only one legal option left, fill it in. That is the sudoku feeling — and it is addictive.",
  },
  {
    icon: ArrowRight,
    title: "Repeat",
    desc: "Every placed number removes options from other cells. The puzzle opens up step by step until the grid is full.",
  },
];
