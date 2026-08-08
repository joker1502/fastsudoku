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
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return notFound();
  }
  return <BlogLayout post={post} />;
}
