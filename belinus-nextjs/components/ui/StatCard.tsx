interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export function StatCard({ value, label, className = '' }: StatCardProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="text-[clamp(36px,5vw,56px)] font-black text-accent leading-none mb-2">
        {value}
      </div>
      <div className="text-[13px] font-semibold tracking-[0.1em] uppercase text-white/50">
        {label}
      </div>
    </div>
  );
}
