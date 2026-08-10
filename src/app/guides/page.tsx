import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatTag } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Sudoku Guide - Learn Sudoku Logic & Techniques - fastsudoku",
  description:
    "Learn how to play sudoku, understand sudoku logic, and master solving techniques with clear, beginner-friendly guides at fastsudoku.",
};

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <main className="py-10">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Sudoku Guide</h1>
        <p className="mb-8 text-gray-500">
          Learn sudoku logic, techniques, and step-by-step solving — from your first puzzle to advanced play.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          {posts.length === 0 && (
            <p className="text-sm text-gray-500">Fresh sudoku guides coming soon — check back shortly.</p>
          )}
          {posts.map((post) => (
            <div key={post.slug} className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-600/30 hover:shadow-md">
              <Link href={`/guides/${post.slug}`} className="mt-0.5">
                <h2 className="text-base font-bold transition-colors hover:text-blue-600">{post.title}</h2>
              </Link>
              <p className="mt-1 flex-1 text-sm text-gray-500 line-clamp-2">{post.description}</p>
              {post.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-1.5 gap-y-0.5">
                  {post.tags.map((tag) => (
                    <Link key={tag} href={`/guides/tags/${tag}`} className="text-xs text-gray-400 transition-colors hover:text-blue-600">
                      #{formatTag(tag)}
                    </Link>
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-blue-600/10 bg-blue-50 p-5 text-center">
          <h2 className="font-semibold text-gray-800">Try it yourself</h2>
          <p className="mt-1 text-sm text-gray-500">Apply what you read — open the hints tool and get step-by-step help on any puzzle.</p>
          <Link href="/" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            fastsudoku Hints &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
