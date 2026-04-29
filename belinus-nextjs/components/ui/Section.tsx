interface SectionProps { children: React.ReactNode; className?: string; id?: string; dark?: boolean; }

export function Section({ children, className = '', id, dark = true }: SectionProps) {
  return (
    <section id={id} className={`py-24 md:py-32 px-6 ${dark ? 'bg-bg' : 'bg-bg-alt'} ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}