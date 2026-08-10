import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags, getPostsByTag, formatTag } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Sudoku Topics - fastsudoku",
  description: "Browse sudoku guides on fastsudoku by topic — beginners, techniques, advanced patterns and variants.",
};

export default async function TagsPage() {
  const tags = await getAllTags();
  const counts = new Map<string, number>();
  for (const tag of tags) {
    counts.set(tag, (await getPostsByTag(tag)).length);
  }

  return (
    <main className="py-10">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-bold tracking-tight">Topics</h1>
        <p className="mt-2 text-gray-500">Browse articles by topic.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/guides/tags/${tag}`}
              className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-blue-600 hover:text-white"
            >
              {formatTag(tag)} ({counts.get(tag)})
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
