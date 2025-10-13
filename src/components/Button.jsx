export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-6 py-3 rounded-md font-semibold shadow-sm transition';
  const variants = {
    primary: 'bg-primary text-white hover:opacity-95',
    accent: 'bg-accent text-white hover:opacity-95',
    outline: 'bg-transparent text-primary border border-primary hover:bg-primary/5',
  };
  const cn = `${base} ${variants[variant] || variants.primary} ${className}`;
  return (
    <button className={cn} {...props}>
      {children}
    </button>
  );
}
