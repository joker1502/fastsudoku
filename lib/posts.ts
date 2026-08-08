import fs from 'node:fs';
import path from 'node:path';
import { evaluate } from '@mdx-js/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import type { ComponentType } from 'react';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

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
  Content: ComponentType;
}

function parseMeta(frontmatter: unknown): { title: string; description: string; date: string } {
  const meta = (frontmatter ?? {}) as {
    title?: unknown;
    description?: unknown;
    date?: unknown;
  };
  return {
    title: typeof meta.title === 'string' ? meta.title : '',
    description: typeof meta.description === 'string' ? meta.description : '',
    date: typeof meta.date === 'string' ? meta.date : '',
  };
}

async function evaluatePost(slug: string): Promise<Post> {
  const source = await fs.promises.readFile(path.join(BLOG_DIR, `${slug}.mdx`), 'utf8');
  const result = await evaluate(source, RUNTIME);
  const meta = parseMeta(result.frontmatter);
  return {
    slug,
    ...meta,
    Content: result.default as unknown as ComponentType,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const files = (await fs.promises.readdir(BLOG_DIR)).filter((file) =>
    file.endsWith('.mdx'),
  );
  const posts = await Promise.all(
    files.map((file) => evaluatePost(path.basename(file, '.mdx'))),
  );
  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) {
    return null;
  }
  return evaluatePost(slug);
}
