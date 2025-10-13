import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import Button from '@/components/Button';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path ? 'text-primary font-semibold' : 'text-textSecondary hover:text-primary';

  return (
    <header className="bg-surface border-b-2 border-black/10 shadow-card sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary px-3 py-1 rounded-md border-2 border-black/10 shadow-brutalSm">Alimente+</Link>
          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Link className={isActive('/mapa')} to="/mapa">Mapa</Link>
              <Link className={isActive('/doar')} to="/doar">Doar</Link>
              <Link className={isActive('/solicitar')} to="/solicitar">Receber</Link>
              <Link className={isActive('/eventos')} to="/eventos">Eventos</Link>
              <Link className={isActive('/historico')} to="/historico">Histórico</Link>
            </nav>
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <span className="text-sm text-textSecondary hidden lg:inline">{user.email}</span>
                  <Button variant="outline" onClick={logout}>Sair</Button>
                </>
              ) : (
                <>
                  <Link className="button-primary" to="/login">Entrar</Link>
                  <Link className="button-accent" to="/register">Criar conta</Link>
                </>
              )}
            </div>
            <button aria-label="Abrir menu" className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-200" onClick={() => setOpen((v) => !v)}>
              <span className="sr-only">Abrir menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-textPrimary">
                <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden mt-3 space-y-3">
            <nav className="flex flex-col gap-2 text-sm">
              <Link className={isActive('/mapa')} to="/mapa" onClick={() => setOpen(false)}>Mapa</Link>
              <Link className={isActive('/doar')} to="/doar" onClick={() => setOpen(false)}>Doar</Link>
              <Link className={isActive('/solicitar')} to="/solicitar" onClick={() => setOpen(false)}>Receber</Link>
              <Link className={isActive('/eventos')} to="/eventos" onClick={() => setOpen(false)}>Eventos</Link>
              <Link className={isActive('/historico')} to="/historico" onClick={() => setOpen(false)}>Histórico</Link>
            </nav>
            <div className="flex items-center gap-2">
              {user ? (
                <Button variant="outline" className="w-full" onClick={() => { setOpen(false); logout(); }}>Sair</Button>
              ) : (
                <>
                  <Link className="button-primary flex-1 text-center" to="/login" onClick={() => setOpen(false)}>Entrar</Link>
                  <Link className="button-accent flex-1 text-center" to="/register" onClick={() => setOpen(false)}>Criar conta</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
