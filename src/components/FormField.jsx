import React from 'react';

/**
 * FormField
 * - Garante associação label-control
 * - Exibe mensagem de erro e descrição com ARIA
 */
const FormField = ({
  id,
  label,
  required = false,
  error,
  description,
  children,
  className = '',
}) => {
  const describedBy = [
    description ? `${id}-description` : null,
    error ? `${id}-error` : null,
  ]
    .filter(Boolean)
    .join(' ');

  const childWithProps = React.isValidElement(children)
    ? React.cloneElement(children, {
        id,
        'aria-invalid': !!error,
        'aria-describedby': describedBy || undefined,
        className: `${children.props.className || ''} input-field`.trim(),
      })
    : children;

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-textPrimary mb-1">
        {label}
        {required && <span className="text-red-600 ml-1" aria-hidden> *</span>}
      </label>
      {childWithProps}
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
      {description && (
        <p className="mt-1 text-sm text-textSecondary" id={`${id}-description`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default FormField;
