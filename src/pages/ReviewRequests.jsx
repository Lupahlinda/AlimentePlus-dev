import { useEffect, useMemo, useState } from 'react';
import api from '@/services/api';

export default function ReviewRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('em análise'); // em análise | aprovada | recusada | todas
  const [query, setQuery] = useState('');
  const [notes, setNotes] = useState({}); // id -> note

  // Load requests
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/solicitacoes');
        if (mounted) setItems(data || []);
      } catch (e) {
        if (mounted) setError('Não foi possível carregar as solicitações.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    return (items || [])
      .filter((s) => filter === 'todas' ? true : (s.status || 'em análise') === filter)
      .filter((s) => (s.nome || '').toLowerCase().includes(query.toLowerCase()));
  }, [items, filter, query]);

  const updateStatus = async (id, status) => {
    const note = (notes[id] || '').trim();
    setItems((prev) => prev.map((s) => s.id === id ? { ...s, status, reviewNote: note, reviewedAt: Date.now() } : s));
    try {
      await api.patch(`/solicitacoes/${id}`, { status, reviewNote: note, reviewedAt: Date.now() });
    } catch (_) {}
  };

  return (
    <div className="section space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">Moderação de Solicitações</h1>
        <div className="flex-1 min-w-[220px] max-w-xs">
          <input className="input-field" placeholder="Buscar por nome" value={query} onChange={(e)=>setQuery(e.target.value)} />
        </div>
        <div className="flex gap-2 text-sm">
          {['todas','em análise','aprovada','recusada'].map((f) => (
            <button
              key={f}
              className={`px-3 py-1 rounded-full border ${filter===f? 'bg-primary text-white border-primary':'border-gray-200 text-textSecondary hover:bg-gray-50'}`}
              onClick={() => setFilter(f)}
            >{f[0].toUpperCase()+f.slice(1)}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="card space-y-2">
          <div className="skeleton h-5 w-56"></div>
          <div className="skeleton h-4 w-40"></div>
        </div>
      ) : error ? (
        <div className="card"><p>{error}</p></div>
      ) : filtered.length === 0 ? (
        <div className="card"><p className="text-textSecondary">Nenhuma solicitação encontrada.</p></div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((s) => (
            <li key={s.id} className="card space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-textPrimary">{s.nome}</div>
                  <div className="text-sm text-textSecondary">Status: {s.status || 'em análise'} • Urgência: {s.urgencia || '—'}</div>
                </div>
                <span className={`badge ${s.status === 'aprovada' ? 'bg-primary/10 text-primary' : s.status === 'recusada' ? 'bg-red-100 text-red-700' : 'bg-accent/10 text-accent'}`}>{s.status || 'em análise'}</span>
              </div>
              <div className="text-sm">
                <div className="text-textSecondary">Endereço: {s.endereco || '—'}</div>
                <div className="text-textSecondary">Telefone: {s.telefone || '—'}</div>
                <div className="text-textSecondary">Itens: {(s.itens || []).map((i)=>`${i.nome} (${i.quantidade})`).join(', ') || '—'}</div>
              </div>
              <div className="text-sm">
                <label className="block text-xs text-textSecondary mb-1">Comentário da decisão</label>
                <textarea className="input-field" rows={3} placeholder="Justifique sua decisão (opcional)"
                  value={notes[s.id] || ''} onChange={(e)=>setNotes((p)=>({ ...p, [s.id]: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2">
                <button className="button-primary" onClick={()=>updateStatus(s.id, 'aprovada')}>Aprovar</button>
                <button className="button-accent" onClick={()=>updateStatus(s.id, 'recusada')}>Recusar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
