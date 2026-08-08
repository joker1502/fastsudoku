import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Sudoku Guides & How-Tos',
  description:
    'Learn how to play sudoku, solve puzzles faster, and understand the techniques behind every move with clear, beginner-friendly guides.',
};

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <div className="page page-wide">
      <h1>Sudoku Guides & How-Tos</h1>
      <p className="tagline">
        Clear, step-by-step guides for every level — from your first puzzle to
        advanced solving techniques.
      </p>
      {posts.length === 0 ? (
        <p className="post-empty">No articles yet. Check back soon.</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              <time dateTime={post.date}>{post.date}</time>
              <p>{post.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
