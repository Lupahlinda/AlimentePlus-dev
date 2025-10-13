export default function Card({ className = '', children, ...props }) {
  const cn = `bg-surface p-4 rounded-card shadow-[0px_2px_8px_rgba(0,0,0,0.05)] ${className}`;
  return (
    <div className={cn} {...props}>
      {children}
    </div>
  );
}
