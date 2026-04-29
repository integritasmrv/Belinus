export const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://master.belinus.net/wp-json/wp/v2';

export interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: string;
  date?: string;
  modified?: string;
  featured_media_url?: string;
}

export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  featured_media_url?: string;
  author?: { name: string; avatar?: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'author'?: Array<{ name: string; avatar_urls?: { '48'?: string } }>;
  };
}

export async function getPage(slug: string): Promise<WPPage | null> {
  try {
    const res = await fetch(`${WP_API_URL}/pages?slug=${slug}&_embed`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] || null;
  } catch { return null; }
}

export async function getAllPages(): Promise<WPPage[]> {
  try {
    const res = await fetch(`${WP_API_URL}/pages?per_page=100&_embed`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function getPosts(perPage = 10, page = 1): Promise<WPPost[]> {
  try {
    const res = await fetch(`${WP_API_URL}/posts?per_page=${perPage}&page=${page}&_embed`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const posts = await res.json();
    return posts.map((p: WPPost) => ({
      ...p,
      featured_media_url: p._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      author: p._embedded?.['author']?.[0]
        ? { name: p._embedded['author'][0].name, avatar: p._embedded['author'][0].avatar_urls?.['48'] }
        : undefined,
    }));
  } catch { return []; }
}

export async function getPost(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(`${WP_API_URL}/posts?slug=${slug}&_embed`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data[0]) return null;
    const p = data[0] as WPPost;
    return {
      ...p,
      featured_media_url: p._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      author: p._embedded?.['author']?.[0]
        ? { name: p._embedded['author'][0].name, avatar: p._embedded['author'][0].avatar_urls?.['48'] }
        : undefined,
    };
  } catch { return null; }
}