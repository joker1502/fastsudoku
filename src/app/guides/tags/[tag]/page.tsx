import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllTags, getPostsByTag, formatTag } from "@/lib/posts";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t: string) => ({ tag: t }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return { title: `${formatTag(tag)} - fastsudoku` };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const filtered = await getPostsByTag(tag);
  if (filtered.length === 0) notFound();

  const sorted = [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1));
  const allTags = await getAllTags();

  return (
    <main className="py-10">
      <div className="mx-auto max-w-4xl px-4">
        <Link href="/guides" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
          <ArrowLeft className="size-4" /> Back to Blog
        </Link>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">{formatTag(tag)}</h1>
        <p className="text-gray-500">{filtered.length} article{filtered.length > 1 ? "s" : ""}</p>

        <div className="my-8 flex flex-wrap gap-2">
          <Link
            href="/guides/tags"
            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500 transition-colors hover:bg-blue-600 hover:text-white"
          >
            All
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={`/guides/tags/${t}`}
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs transition-colors hover:bg-blue-600 hover:text-white ${
                t === tag ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {formatTag(t)}
            </Link>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((post) => (
            <div key={post.slug} className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-600/30 hover:shadow-md">
              <Link href={`/guides/${post.slug}`}>
                <h2 className="font-semibold transition-colors hover:text-blue-600">{post.title}</h2>
              </Link>
              <p className="mt-1 flex-1 text-sm text-gray-500 line-clamp-2">{post.description}</p>
              {post.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-1.5 gap-y-0.5">
                  {post.tags.map((t) => (
                    <Link key={t} href={`/guides/tags/${t}`} className="text-xs text-gray-400 transition-colors hover:text-blue-600">
                      #{formatTag(t)}
                    </Link>
                  ))}
                </div>
              )}
              <div className="mt-3 text-xs text-gray-400">{post.date}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
