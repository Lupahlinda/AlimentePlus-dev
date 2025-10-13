import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api';

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('todos'); // 'todos' | 'pendente' | 'em andamento' | 'concluída'
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]); // ids

  // Mock: list donations saved locally
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/doacoes');
        if (mounted) setItems(data || []);
      } catch (e) {
        if (mounted) setError('Não foi possível carregar as doações.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = items
    .filter((d) => filter === 'todos' ? true : (d.status || 'pendente').toLowerCase() === filter)
    .filter((d) => (d.descricao || d.item || '').toLowerCase().includes(query.toLowerCase()));

  const updateStatus = async (id, status) => {
    setItems((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));
    try {
      await api.patch(`/doacoes/${id}`, { status });
    } catch (_) {}
  };

  const toggleSelect = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const selectAll = () => setSelected(filtered.map((d) => d.id));
  const clearSelection = () => setSelected([]);
  const bulkUpdate = async (status) => {
    const toUpdate = [...selected];
    setItems((prev) => prev.map((d) => toUpdate.includes(d.id) ? { ...d, status } : d));
    setSelected([]);
    try {
      await Promise.all(toUpdate.map((id) => api.patch(`/doacoes/${id}`, { status })));
    } catch (_) {}
  };

  return (
    <div className="section space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">Histórico de Doações</h1>
        <div className="flex-1 min-w-[220px] max-w-xs">
          <input className="input-field" placeholder="Buscar por descrição" value={query} onChange={(e)=>setQuery(e.target.value)} />
        </div>
        <div className="flex gap-2 text-sm">
          {['todos','pendente','em andamento','concluída'].map((f) => (
            <button
              key={f}
              className={`px-3 py-1 rounded-full border ${filter===f? 'bg-primary text-white border-primary':'border-gray-200 text-textSecondary hover:bg-gray-50'}`}
              onClick={() => setFilter(f)}
            >{f[0].toUpperCase()+f.slice(1)}</button>
          ))}
        </div>
      </div>
      {selected.length > 0 && (
        <div className="card flex items-center justify-between gap-3">
          <div className="text-sm text-textSecondary">Selecionados: {selected.length}</div>
          <div className="flex gap-2">
            <button className="button-primary" onClick={() => bulkUpdate('concluída')}>Marcar como concluída</button>
            <button className="button-accent" onClick={() => bulkUpdate('pendente')}>Marcar como pendente</button>
            <button className="text-sm text-primary hover:underline" onClick={clearSelection}>Limpar</button>
          </div>
        </div>
      )}
      {loading ? (
        <div className="card space-y-2">
          <div className="skeleton h-5 w-56"></div>
          <div className="skeleton h-4 w-40"></div>
        </div>
      ) : error ? (
        <div className="card"><p>{error}</p></div>
      ) : items.length === 0 ? (
        <div className="card">
          <p className="text-textSecondary">Você ainda não possui doações (mock). Publique sua primeira doação!</p>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((d) => {
            const status = (d.status || 'pendente').toLowerCase();
            const badgeClass = status === 'concluída' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent';
            return (
              <li key={d.id} className="card space-y-2">
                <div className="flex items-start justify-between">
                  <div className="font-medium text-textPrimary">{d.descricao || d.item}</div>
                  <span className={`badge ${badgeClass}`}>{d.status || 'pendente'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={selected.includes(d.id)} onChange={()=>toggleSelect(d.id)} />
                  <span className="text-textSecondary">Selecionar</span>
                </div>
                <div className="text-sm text-textSecondary">Qtd: {d.quantidade ?? d.quantity}</div>
                <div className="text-sm">
                  <label className="block text-xs text-textSecondary mb-1">Alterar status</label>
                  <select
                    className="input-field"
                    value={d.status || 'pendente'}
                    onChange={(e) => updateStatus(d.id, e.target.value)}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em andamento">Em andamento</option>
                    <option value="concluída">Concluída</option>
                  </select>
                </div>
                <div className="pt-1">
                  <Link className="button-accent w-full inline-block text-center" to={`/doacao/${d.id}`}>Detalhes</Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
