interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export function Eyebrow({ children, className = '' }: EyebrowProps) {
  return (
    <p
      className={`text-[11px] font-bold tracking-[0.25em] uppercase text-accent mb-4 ${className}`}
    >
      {children}
    </p>
  );
}
