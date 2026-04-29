import { Metadata } from 'next';
import { getPosts } from '@/lib/wordpress';
import { Eyebrow } from '@/components/ui/Eyebrow';
import Link from 'next/link';

interface Props { params: Promise<{ lang: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: 'Blog — Belinus Energy', description: 'News, insights and technical articles about commercial battery storage, graphene supercapacitors and energy management.' };
}

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;
  const posts = await getPosts(20);
  const dateLocale = lang === 'en' ? 'en-GB' : lang === 'nl' ? 'nl-BE' : 'fr-BE';

  return (
    <div className="pt-32 pb-24 px-6 bg-bg">
      <div className="max-w-4xl mx-auto">
        <Eyebrow className="text-center mb-4">Blog</Eyebrow>
        <h1 className="text-[clamp(36px,5vw,60px)] font-black leading-[1.1] tracking-[-0.02em] text-white text-center mb-16">News & Insights</h1>
        {posts.length === 0 ? (
          <div className="text-center text-white/40 py-20"><p>No posts yet. Check back soon.</p></div>
        ) : (
          <div className="space-y-10">
            {posts.map((post) => (
              <article key={post.id} className="border-b border-white/[0.08] pb-10">
                {post.featured_media_url && (
                  <img src={post.featured_media_url} alt={post.title.rendered} className="w-full h-48 object-cover mb-6 rounded-none" />
                )}
                <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-3">
                  {new Date(post.date).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-3" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                <p className="text-white/55 text-[15px] leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered || '' }} />
                <Link href={`/${lang}/blog/${post.slug}`} className="text-[13px] font-semibold tracking-widest uppercase text-accent hover:text-white transition-colors">Read more →</Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}