import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import { evaluate } from '@mdx-js/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import type { ComponentType } from 'react';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'guides');

const RUNTIME = {
  Fragment,
  jsx,
  jsxs,
  development: false,
  remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
};

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readTime: string;
  Content: ComponentType;
}

function parseMeta(frontmatter: unknown): {
  title: string;
  description: string;
  date: string;
  tags: string[];
} {
  const meta = (frontmatter ?? {}) as {
    title?: unknown;
    description?: unknown;
    date?: unknown;
    tags?: unknown;
  };
  const rawTags = Array.isArray(meta.tags)
    ? meta.tags.filter((t): t is string => typeof t === 'string')
    : typeof meta.tags === 'string'
      ? [meta.tags]
      : [];
  const tags = rawTags.map((t) =>
    t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
  );
  return {
    title: typeof meta.title === 'string' ? meta.title : '',
    description: typeof meta.description === 'string' ? meta.description : '',
    date: typeof meta.date === 'string' ? meta.date : '',
    tags,
  };
}

/** Rough reading time in minutes from the raw MDX body (frontmatter stripped). */
function readingTime(body: string): string {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*`_\-[\]()!]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = text.length === 0 ? 0 : text.split(' ').length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function parseFrontmatterBlock(raw: string): { body: string } {
  const match = raw.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return { body: match ? match[1] : raw };
}

async function evaluatePost(slug: string): Promise<Post> {
  const source = await fs.promises.readFile(path.join(BLOG_DIR, `${slug}.mdx`), 'utf8');
  const result = await evaluate(source, RUNTIME);
  const meta = parseMeta(result.frontmatter);
  const { body } = parseFrontmatterBlock(source);
  return {
    slug,
    ...meta,
    readTime: readingTime(body),
    Content: result.default as unknown as ComponentType,
  };
}

export const getAllPosts = cache(async (): Promise<Post[]> => {
  const files = (await fs.promises.readdir(BLOG_DIR)).filter((file) =>
    file.endsWith('.mdx'),
  );
  const posts = await Promise.all(
    files.map((file) => evaluatePost(path.basename(file, '.mdx'))),
  );
  return posts
    .filter((post) => post.slug !== "what-is-sudoku")
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
});

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return evaluatePost(slug);
});

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) tags.add(tag);
  }
  return [...tags].sort();
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.tags.includes(tag));
}

export function formatTag(tag: string): string {
  return tag.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
