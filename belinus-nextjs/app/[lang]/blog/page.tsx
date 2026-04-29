import { Metadata } from 'next';
import { getPosts } from '@/lib/wordpress';
import { Card } from '@/components/ui/Card';
import { Eyebrow } from '@/components/ui/Eyebrow';
import Link from 'next/link';
import { locales } from '@/i18n';

export const dynamic = 'force-static';

interface Props {
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Blog — Belinus Energy',
    description: 'News, insights and technical articles about commercial battery storage, graphene supercapacitors and energy management.',
  };
}

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;
  const posts = await getPosts(20);

  return (
    <section className="pt-32 pb-24 px-6 bg-bg">
      <div className="max-w-5xl mx-auto">
        <Eyebrow>Blog</Eyebrow>
        <h1 className="text-[clamp(32px,4vw,56px)] font-black leading-[1.1] tracking-[-0.02em] text-white mb-12 mt-4">
          News & Insights
        </h1>

        {posts.length === 0 ? (
          <p className="text-white/40 text-center py-20">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/${lang}/blog/${post.slug}`}>
                <Card hover className="h-full overflow-hidden group">
                  {post.featured_media_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featured_media_url}
                        alt={post.title.rendered}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-3">
                      {new Date(post.date).toLocaleDateString(lang === 'en' ? 'en-GB' : lang === 'nl' ? 'nl-BE' : 'fr-BE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <h2
                      className="text-lg font-bold text-white leading-snug mb-3 group-hover:text-accent transition-colors line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    <p
                      className="text-sm text-white/45 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered || '' }}
                    />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
