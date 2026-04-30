interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
}

export function Button({
  variant = 'primary',
  href,
  children,
  className = '',
  type = 'button',
  onClick,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 px-10 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer';

  const variants = {
    primary:
      'bg-accent text-black border-2 border-accent hover:bg-transparent hover:text-accent',
    secondary:
      'bg-transparent text-white border border-white/30 hover:border-white/70 hover:text-white',
    ghost: 'bg-transparent text-white border border-white/30 hover:border-white/70',
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
