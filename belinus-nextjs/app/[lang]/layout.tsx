import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import en from '@/messages/en.json';
import nl from '@/messages/nl.json';
import fr from '@/messages/fr.json';

const messagesMap: Record<Locale, Record<string, unknown>> = { en, nl, fr };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!locales.includes(lang as Locale)) {
    notFound();
  }

  const messages = messagesMap[lang as Locale] || messagesMap.en;

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-white antialiased">
        <NextIntlClientProvider messages={messages}>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <Nav />
          <main id="main-content">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
