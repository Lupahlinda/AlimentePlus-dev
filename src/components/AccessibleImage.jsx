import React from 'react';

/**
 * AccessibleImage
 * - Usa loading="lazy" por padrão
 * - Requer alt descritivo
 */
const AccessibleImage = ({ src, alt, className = '', ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`w-full h-auto ${className}`}
      {...props}
    />
  );
};

export default AccessibleImage;
