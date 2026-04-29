import { Hero } from '@/components/blocks/Hero';
import { Why } from '@/components/blocks/Why';
import { UseCases } from '@/components/blocks/UseCases';
import { Stats } from '@/components/blocks/Stats';
import { CTA } from '@/components/blocks/CTA';
import { ContactForm } from '@/components/blocks/ContactForm';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Why />
      <UseCases />
      <Stats />
      <CTA />
      <ContactForm />
    </>
  );
}