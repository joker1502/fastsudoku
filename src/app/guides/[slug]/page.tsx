import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPost } from '@/lib/posts';
import BlogLayout from '@/components/BlogLayout';

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return {};
  }
  return {
    title: `${post.title} - fastsudoku`,
    description: post.description,
    keywords: post.tags,
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  if (slug === "what-is-sudoku") return notFound();
  const post = await getPost(slug);
  if (!post) {
    return notFound();
  }
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "fastsudoku" },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogLayout post={post} />
    </>
  );
}
