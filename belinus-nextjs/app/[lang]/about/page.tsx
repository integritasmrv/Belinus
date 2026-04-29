import { Metadata } from 'next';

export const dynamic = 'force-static';

import { Eyebrow } from '@/components/ui/Eyebrow';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About — Belinus Energy',
  description: "Learn about Belinus's graphene supercapacitor technology, our mission to revolutionize commercial battery storage, and the experienced team behind our innovative energy solutions.",
};

export default function AboutPage() {
  return (
    <section className="pt-32 pb-24 px-6 bg-bg">
      <div className="max-w-3xl mx-auto">
        <Eyebrow>About</Eyebrow>
        <h1 className="text-[clamp(36px,5vw,72px)] font-black leading-[1.05] tracking-[-0.025em] text-white mb-8 mt-4">
          We're making commercial battery storage simpler, safer and smarter.
        </h1>
        <div className="space-y-6 text-[17px] text-white/60 leading-relaxed">
          <p>
            Belinus was founded in Belgium with a clear mission: to develop next-generation commercial battery storage that eliminates the fire risks and environmental concerns associated with lithium-ion technology.
          </p>
          <p>
            Our graphene-based supercapacitors deliver 99% round-trip efficiency with a 35-year operational lifespan — dramatically reducing total cost of ownership compared to traditional battery solutions. No thermal runaway. No rare earth materials. No compromise.
          </p>
        </div>

        <Section className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="text-4xl font-black text-accent mb-2">35yr</div>
              <div className="text-sm text-white/40">Warranty</div>
            </Card>
            <Card className="p-8 text-center">
              <div className="text-4xl font-black text-accent mb-2">99%</div>
              <div className="text-sm text-white/40">Round-trip efficiency</div>
            </Card>
            <Card className="p-8 text-center">
              <div className="text-4xl font-black text-accent mb-2">0%</div>
              <div className="text-sm text-white/40">Thermal runaway risk</div>
            </Card>
          </div>
        </Section>

        <Section className="mt-20">
          <h2 className="text-[clamp(24px,3vw,40px)] font-black text-white mb-8">
            Key advantages over lithium-ion
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ['Non-flammable', 'No thermal runaway or fire risk under any condition'],
              ['Longer lifespan', '35-year operational life vs 10-15 years for lithium-ion'],
              ['Higher efficiency', '99% round-trip vs 85-90% for lithium-ion'],
              ['Faster charging', 'Rapid charge/discharge cycles without degradation'],
              ['No rare earths', 'Sustainable materials, lower environmental impact'],
              ['Lower TCO', 'Reduced replacement and maintenance costs over time'],
            ].map(([title, desc]) => (
              <Card key={title} className="p-6">
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section className="mt-20">
          <h2 className="text-[clamp(24px,3vw,40px)] font-black text-white mb-8">
            Technology partners
          </h2>
          <div className="flex flex-wrap gap-6">
            {['Energyville', 'Flanders Make', 'VITO'].map((partner) => (
              <div key={partner} className="px-6 py-3 border border-white/10 text-white/40 text-sm font-semibold">
                {partner}
              </div>
            ))}
          </div>
        </Section>

        <Section className="mt-20 text-center">
          <h2 className="text-[clamp(24px,3vw,40px)] font-black text-white mb-4">
            Ready to explore Belinus?
          </h2>
          <p className="text-white/50 mb-8 max-w-lg mx-auto">
            Talk to our team about how graphene supercapacitor technology can transform your energy infrastructure.
          </p>
          <Button href="/en/contact" variant="primary">
            Get in Touch
          </Button>
        </Section>
      </div>
    </section>
  );
}
