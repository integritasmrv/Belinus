# Belinus Energy — Next.js Front-End

Dark, cinematic B2B landing page. Built with Next.js 15, Tailwind CSS, GSAP animations, and next-intl for EN/NL/FR.

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS** (styling)
- **GSAP + ScrollTrigger** (animations)
- **next-intl** (i18n: EN, NL, FR)
- **WordPress REST API** (existing CMS, CF7 forms)

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000/en

## Adding a Page

```bash
# 1. Create page
# app/[lang]/new-page/page.tsx

# 2. Add translations
# messages/en.json  (add "NewPage": { "title": "...", ... })
# messages/nl.json
# messages/fr.json

# 3. Add to nav
# components/layout/Nav.tsx
```

## Adding Translatable Text

```tsx
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('SectionName');
  return <h1>{t('headline')}</h1>;
}
```

## Environment Variables

```env
NEXT_PUBLIC_WP_API_URL=https://master.belinus.net/wp-json/wp/v2
NEXT_PUBLIC_HATCHET_WEBHOOK_URL=https://hatchet.example.com/webhook
```

## Project Structure

```
app/[lang]/          # Locale pages (en, nl, fr)
  layout.tsx         # Nav + Footer wrapper
  page.tsx           # Homepage
  about/page.tsx     # Example extra page

components/
  ui/                # Button, Card, Section, Eyebrow, StatCard
  blocks/            # Hero, Why, UseCases, Stats, CTA, ContactForm
  layout/            # Nav, Footer

messages/
  en.json            # English
  nl.json            # Dutch
  fr.json            # French
```

## Deployment

1. Push to GitHub
2. Import in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## Animations

All scroll animations use GSAP ScrollTrigger:

```tsx
// Animate children on scroll
gsap.fromTo('.selector', { y: 30, opacity: 0 }, {
  y: 0, opacity: 1, duration: 0.5, stagger: 0.1,
  scrollTrigger: { trigger: '.selector', start: 'top 75%' }
});

// Parallax
gsap.to('.bg', {
  yPercent: -20,
  scrollTrigger: { trigger: '.section', start: 'top bottom', end: 'bottom top', scrub: true }
});
```

## Form → Hatchet CRM

`ContactForm` component fires to Hatchet on submit:

```json
{
  "topic": "wordpress:lead_captured",
  "data": {
    "firstName": "...", "lastName": "...", "email": "...",
    "phone": "...", "company": "...", "function": "...",
    "productInterest": "...", "message": "...",
    "gdprConsent": true, "source": "belinus-website"
  }
}
```

Add `NEXT_PUBLIC_HATCHET_WEBHOOK_URL` to deploy with live CRM sync.
