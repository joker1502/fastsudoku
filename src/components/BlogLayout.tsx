import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatTag, getAllPosts, type Post } from "@/lib/posts";

interface BlogLayoutProps {
  post: Post;
}

function cleanTitle(title: string): string {
  return title.replace(/ \| fastsudoku$/, "");
}

export default async function BlogLayout({ post }: BlogLayoutProps) {
  const Content = post.Content;
  const allPosts = await getAllPosts();
  const related = allPosts
    .filter(
      (other) =>
        other.slug !== post.slug &&
        other.tags.some((tag) => post.tags.includes(tag)),
    )
    .slice(0, 3);

  const clean = cleanTitle(post.title);

  return (
    <main className="py-8">
      <div className="mx-auto max-w-3xl px-4">
        <Link href="/guides" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
          <ArrowLeft className="size-4" /> Back to Blog
        </Link>

        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">{clean}</h1>

        <div className="mb-8 flex items-center gap-3 text-sm text-gray-400">
          <span>{post.date}</span>
          <span>&middot;</span>
          <span>{post.readTime}</span>
        </div>

        <div className="prose prose-gray max-w-none space-y-5 leading-relaxed [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-3 [&_ol]:pl-5 [&_li]:leading-relaxed [&_strong]:font-semibold [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse [&_th]:p-2 [&_th]:text-left [&_th]:border [&_td]:p-2 [&_td]:border">
          <Content />
        </div>

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/guides/tags/${tag}`}
                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500 transition-colors hover:bg-blue-600 hover:text-white"
              >
                {formatTag(tag)}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-xl border border-blue-600/10 bg-blue-50 p-6 text-center">
          <h2 className="text-lg font-bold text-gray-800">Try it yourself</h2>
          <p className="mt-1 text-sm text-gray-500">Apply what you just learned — open the hints tool and solve any puzzle step by step.</p>
          <Link href="/" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700">
            Open fastsudoku Hints &rarr;
          </Link>
        </div>

        {related.length > 0 && (
          <section className="mt-10 border-t pt-8">
            <h2 className="mb-6 text-xl font-semibold">Related Articles</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/guides/${r.slug}`}
                  className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-blue-600/50"
                >
                  <p className="text-sm font-medium transition-colors hover:text-blue-600">{cleanTitle(r.title)}</p>
                  <p className="mt-1 text-xs text-gray-400">{r.date}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
