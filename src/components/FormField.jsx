import React from 'react';

/**
 * Componente FormField
 * 
 * Um componente reutilizável para campos de formulário que:
 * - Garante a acessibilidade com associação label-input
 * - Exibe mensagens de erro de forma acessível
 * - Suporta descrições de ajuda
 * - Gerencia estados de erro e validação
 * - Estilização consistente em todo o aplicativo
 * 
 * @param {string} id - ID único para o campo (obrigatório para acessibilidade)
 * @param {string} label - Rótulo do campo
 * @param {boolean} [required=false] - Se o campo é obrigatório
 * @param {string} [error] - Mensagem de erro a ser exibida
 * @param {string} [description] - Texto de ajuda descritivo
 * @param {ReactNode} children - Elemento de input/select/textarea
 * @param {string} [className=''] - Classes CSS adicionais
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
