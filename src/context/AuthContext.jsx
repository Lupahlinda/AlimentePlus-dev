/**
 * Contexto de Autenticação
 * 
 * Fornece um contexto global para gerenciar o estado de autenticação do usuário.
 * 
 * Funcionalidades:
 * - Armazena o estado do usuário autenticado
 * - Gerencia login/logout
 * - Persiste a sessão no localStorage
 * - Fornece funções de autenticação para toda a aplicação
 */

import React, { createContext, useState, useMemo, useCallback } from 'react';

export const AuthContext = createContext({ user: null, login: () => {}, logout: () => {} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = useCallback((email, password) => {

    const mockUser = { email, tipo: 'doador' };
    setUser(mockUser);

    localStorage.setItem('auth_user', JSON.stringify(mockUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
  }, []);

  React.useEffect(() => {
    const saved = localStorage.getItem('auth_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (_) {}
    }
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
