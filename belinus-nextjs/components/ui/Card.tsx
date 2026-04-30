interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`bg-bg-card border border-white/[0.08] p-8 md:p-10 ${
        hover ? 'transition-all duration-300 hover:border-accent hover:-translate-y-1' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
