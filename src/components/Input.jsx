export default function Input({ label, id, className = '', ...props }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium">
          {label}
        </label>
      )}
      <input id={id} className="input-field" {...props} />
    </div>
  );
}
