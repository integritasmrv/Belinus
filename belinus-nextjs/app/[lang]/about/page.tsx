import { Metadata } from 'next';

export const dynamic = 'force-static';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About — Belinus Energy',
  description: 'Belgium-based clean energy company developing lithium-free battery storage using graphene supercapacitor technology.',
};

export default function AboutPage() {
  return (
    <>
      <section className="pt-40 pb-24 px-6 bg-bg text-center">
        <div className="max-w-3xl mx-auto">
          <Eyebrow>About Belinus</Eyebrow>
          <h1 className="text-[clamp(40px,6vw,72px)] font-black leading-[1.1] tracking-[-0.02em] text-white mb-6">
            Belgian Engineering,<br />Built for Decades
          </h1>
          <p className="text-[18px] text-white/60 leading-relaxed max-w-xl mx-auto">
            Founded in Belgium, Belinus develops lithium-free commercial battery storage using proprietary graphene supercapacitor technology. Our systems are engineered for longevity, safety, and performance — without compromise.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <h3 className="text-xl font-bold text-white mb-3">Thor Park, Genk</h3>
            <p className="text-[15px] text-white/55 leading-relaxed">
              Our headquarters and R&D center is located at Thor Park, one of Europe&apos;s leading energy innovation campuses in Limburg, Belgium.
            </p>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-white mb-3">Energyville Partner</h3>
            <p className="text-[15px] text-white/55 leading-relaxed">
              As an official Energyville partner, we collaborate with Belgium&apos;s top energy research institutions to advance battery storage technology.
            </p>
          </Card>
          <Card>
            <h3 className="text-xl font-bold text-white mb-3">CE Certified</h3>
            <p className="text-[15px] text-white/55 leading-relaxed">
              All Belinus systems carry CE certification, meeting the highest European safety and performance standards for commercial energy storage.
            </p>
          </Card>
        </div>
      </Section>

      <Section dark={false}>
        <div className="text-center mb-12">
          <Eyebrow>Contact</Eyebrow>
          <h2 className="text-[clamp(28px,4vw,48px)] font-black text-white">
            Get in touch
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          <div>
            <div className="text-[13px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-3">Phone</div>
            <a href="tel:+3293963388" className="text-base text-white/70 hover:text-accent transition-colors">
              +32 (0)9 396 33 88
            </a>
          </div>
          <div>
            <div className="text-[13px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-3">Email</div>
            <a href="mailto:info@belinus.com" className="text-base text-white/70 hover:text-accent transition-colors">
              info@belinus.com
            </a>
          </div>
          <div>
            <div className="text-[13px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-3">Address</div>
            <span className="text-base text-white/70">Thor Park, 3600 Genk, Belgium</span>
          </div>
        </div>
      </Section>
    </>
  );
}
