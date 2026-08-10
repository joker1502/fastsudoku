import type { MetadataRoute } from 'next';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);
  const staticRoutes = [
    { route: '', priority: 1, changeFrequency: 'weekly' as const },
    { route: '/what-is-sudoku', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/kids', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/mega', priority: 0.9, changeFrequency: 'weekly' as const },
    { route: '/maker', priority: 0.8, changeFrequency: 'weekly' as const },
    { route: '/guides', priority: 0.6, changeFrequency: 'weekly' as const },
    { route: '/privacy', priority: 0.3, changeFrequency: 'monthly' as const },
    { route: '/terms', priority: 0.3, changeFrequency: 'monthly' as const },
    { route: '/pricing', priority: 0.7, changeFrequency: 'weekly' as const },
  ].map(({ route, priority, changeFrequency }) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
  const postRoutes = posts.map((post) => ({
    url: `${SITE_URL}/guides/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  const tagRoutes = tags.map((tag) => ({
    url: `${SITE_URL}/guides/tags/${tag}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  }));
  return [
    ...staticRoutes,
    ...postRoutes,
    { url: `${SITE_URL}/guides/tags`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    ...tagRoutes,
  ];
}
