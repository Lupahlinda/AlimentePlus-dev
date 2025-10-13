import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="section max-w-2xl">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-2">Página não encontrada</h1>
        <p className="text-textSecondary mb-4">A página que você tentou acessar não existe ou foi movida.</p>
        <div className="flex items-center gap-3">
          <Link to="/" className="button-primary">Ir para a página inicial</Link>
          <Link to="/mapa" className="button-accent">Abrir o mapa</Link>
        </div>
      </div>
    </div>
  );
}
