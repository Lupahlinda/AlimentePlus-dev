import React from 'react';

const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-surface focus:text-textPrimary focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
  >
    Pular para o conteúdo principal
  </a>
);

export default SkipLink;
