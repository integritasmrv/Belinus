export const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://master.belinus.net/wp-json/wp/v2';

export interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
}

export async function getPage(slug: string): Promise<WPPage | null> {
  try {
    const res = await fetch(`${WP_API_URL}/pages?slug=${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] || null;
  } catch { return null; }
}