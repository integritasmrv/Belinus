import { Metadata } from 'next';
import { getPost } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props { params: Promise<{ lang: string; slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title.rendered} — Belinus Energy`,
    description: post.excerpt?.rendered?.replace(/<[^>]*>/g, '').slice(0, 160) || '',
    openGraph: {
      title: post.title.rendered,
      images: post.featured_media_url ? [post.featured_media_url] : [],
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const dateLocale = lang === 'en' ? 'en-GB' : lang === 'nl' ? 'nl-BE' : 'fr-BE';

  return (
    <article className="pt-32 pb-24 px-6 bg-bg">
      <div className="max-w-3xl mx-auto">
        <Link href={`/${lang}/blog`} className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-widest uppercase text-white/40 hover:text-accent transition-colors mb-8">← Back to Blog</Link>

        <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-4">
          {new Date(post.date).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        <h1 className="text-[clamp(28px,4vw,48px)] font-black leading-[1.1] tracking-[-0.02em] text-white mb-8" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

        {post.featured_media_url && (
          <img src={post.featured_media_url} alt={post.title.rendered} className="w-full h-64 md:h-80 object-cover mb-10 rounded-none" />
        )}

        {post.author && (
          <div className="flex items-center gap-3 mb-10 pb-10 border-b border-white/[0.08]">
            {post.author.avatar && <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full" />}
            <div className="text-sm font-semibold text-white/70">{post.author.name}</div>
          </div>
        )}

        <div className="prose prose-invert prose-lg max-w-none text-white/75 leading-relaxed
          prose-headings:text-white prose-headings:font-bold
          prose-a:text-accent prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-none
          prose-blockquote:border-accent prose-blockquote:text-white/70
          prose-strong:text-white prose-strong:font-semibold"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      </div>
    </article>
  );
}