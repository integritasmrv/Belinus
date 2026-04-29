# Belinus Energy — Next.js Website

## Overview
Next.js headless front-end for Belinus Energy (B2B lithium-free battery storage).
WordPress REST API as CMS. Designed to match Silverfish Studios' cinematic dark aesthetic.

**Target**: https://belinus.com

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Front-end | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Animations | GSAP + ScrollTrigger |
| i18n | next-intl (EN/NL/FR) |
| CMS | WordPress REST API (existing) |
| Forms | Contact Form 7 (WP) via Hatchet |
| Deployment | Vercel |

---

## Project Structure

```
/
├── app/
│   ├── [lang]/              # i18n routing: /en, /nl, /fr
│   │   ├── layout.tsx       # Locale layout with nav + footer
│   │   ├── page.tsx         # Homepage
│   │   └── about/page.tsx   # Example of adding a new page
│   ├── layout.tsx           # Root layout (fonts, global styles)
│   └── globals.css           # CSS variables, Tailwind base
├── components/
│   ├── ui/                  # Primitives: Button, Card, Section
│   ├── blocks/              # Page sections: Hero, ValueProps, UseCases, Stats
│   └── layout/              # Nav, Footer, PageWrapper
├── lib/
│   ├── wordpress.ts         # WordPress REST API client
│   ├── gsap.ts            # GSAP + ScrollTrigger setup
│   └── i18n.ts            # next-intl config
├── messages/
│   ├── en.json              # English translations
│   ├── nl.json              # Dutch translations
│   └── fr.json              # French translations
├── public/
│   └── videos/              # Hero video (place in /public/videos/)
├── SPEC.md                  # This file
└── README.md                # Setup instructions
```

---

## Adding a New Page

1. Create `app/[lang]/[pagename]/page.tsx`
2. Import sections from `components/blocks/`
3. Add translations in `messages/[lang].json`
4. Add to nav in `components/layout/Nav.tsx`
5. Push to GitHub → auto-deploys to Vercel

Example:
```tsx
// app/[lang]/products/page.tsx
import { Hero } from '@/components/blocks/Hero';
import { useTranslations } from 'next-intl';

export default async function ProductsPage({ params }: { params: { lang: string } }) {
  return (
    <main>
      <Hero headline="Our Products" subhead="..." />
    </main>
  );
}
```

---

## Design Tokens

```css
--color-bg:        #0a0a0a;
--color-bg-alt:    #111111;
--color-bg-card:   #141414;
--color-text:      #ffffff;
--color-muted:     rgba(255,255,255,0.55);
--color-border:    rgba(255,255,255,0.08);
--color-accent:    #00C98D;
```

---

## Animation Standards

- **Entrance**: GSAP ScrollTrigger, `opacity: 0 → 1`, `y: 30 → 0`, 500ms ease-out
- **Stagger**: 80ms between children
- **Hero parallax**: ScrollTrigger scrub, background moves at 0.3x scroll speed
- **Reduced motion**: All animations respect `prefers-reduced-motion`

---

## WordPress CMS Integration

WordPress REST API base: `https://master.belinus.net/wp-json/wp/v2/`

Pages fetched via: `/wp-json/wp/v2/pages?slug=home`
Forms: Contact Form 7 submissions go directly to Hatchet CRM (no WP form needed)

---

## Deployment

1. Push to GitHub
2. Vercel auto-detects Next.js
3. Environment variables:
   - `NEXT_PUBLIC_WP_API_URL=https://master.belinus.net/wp-json/wp/v2`
   - `NEXT_PUBLIC_HATCHET_WEBHOOK_URL=https://hatchet.example.com/webhook`

---

## i18n (next-intl)

All user-facing strings must use translations:

```tsx
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('Hero');
  return <h1>{t('headline')}</h1>;  // from messages/en.json
}
```

---

## AI Agent Instructions

When building new features:
1. Read SPEC.md first
2. Follow the component structure in `components/`
3. Use GSAP for all scroll animations (not CSS animations)
4. All text must use `useTranslations` from next-intl
5. Use Tailwind for styling — no inline styles
6. Test with `npm run dev` before committing
7. Respect `prefers-reduced-motion`

---

## Last Updated
2026-04-29
