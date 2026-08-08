import Link from 'next/link';
import type { Post } from '@/lib/posts';

interface BlogLayoutProps {
  post: Post;
}

export default function BlogLayout({ post }: BlogLayoutProps) {
  const Content = post.Content;
  return (
    <article className="page page-wide">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/blog">All guides</Link>
      </nav>
      <h1 className="post-title">{post.title}</h1>
      <p className="post-date">
        <time dateTime={post.date}>{post.date}</time>
      </p>
      <p className="post-description">{post.description}</p>
      <div className="prose">
        <Content />
      </div>
      <section className="cta" aria-label="Related tools">
        <h2>Put it into practice</h2>
        <p>
          Ready to try what you just learned? Start a puzzle, get unstuck with
          the solver, or grab printable sheets.
        </p>
        <div className="cta-links">
          <Link href="/play">Play sudoku</Link>
          <Link href="/solver">Open the solver</Link>
          <Link href="/printable">Printable puzzles</Link>
        </div>
      </section>
    </article>
  );
}
