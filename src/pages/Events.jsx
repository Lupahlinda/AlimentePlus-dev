import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock: load nearby events
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/eventos');
        if (mounted) {
          if (!data || data.length === 0) {
            // Seed de eventos próximos à Ceilândia (DF)
            const seed = [
              {
                titulo: 'Mutirão de Arrecadação',
                descricao: 'Doe 1 kg de alimento e ajude famílias em situação de vulnerabilidade.',
                date: new Date(Date.now() + 86400000).toISOString(),
                local: 'Praça da Bíblia, Ceilândia',
                lat: -15.829, lng: -48.103,
              },
              {
                titulo: 'Feira Solidária',
                descricao: 'Ponto de coleta de alimentos não perecíveis.',
                date: new Date(Date.now() + 3*86400000).toISOString(),
                local: 'Estacionamento do JK Shopping, Ceilândia',
                lat: -15.812, lng: -48.111,
              },
              {
                titulo: 'Campanha do Agasalho & Alimentos',
                descricao: 'Coleta conjunta de roupas e alimentos.',
                date: new Date(Date.now() + 5*86400000).toISOString(),
                local: 'Centro Cultural da Ceilândia',
                lat: -15.820, lng: -48.090,
              },
            ];
            try {
              // Cria em paralelo
              await Promise.all(seed.map((e) => api.post('/eventos', { ...e, createdAt: Date.now() })));
              const again = await api.get('/eventos');
              setEvents(again.data || []);
            } catch (se) {
              setEvents([]);
            }
          } else {
            setEvents(data || []);
          }
        }
      } catch (e) {
        if (mounted) setError('Não foi possível carregar os eventos.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="section space-y-4">
      <h1 className="text-2xl font-semibold">Eventos</h1>
      {loading ? (
        <div className="card">
          <div className="space-y-2">
            <div className="skeleton h-5 w-60"></div>
            <div className="skeleton h-4 w-40"></div>
          </div>
        </div>
      ) : error ? (
        <div className="card"><p>{error}</p></div>
      ) : events.length === 0 ? (
        <div className="card">
          <p className="text-textSecondary">Sem eventos no momento. Volte mais tarde.</p>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {events.map((e) => (
            <li key={e.id} className="card space-y-1">
              <div className="flex items-start justify-between">
                <div className="font-medium text-textPrimary">{e.name || e.titulo}</div>
                <span className="badge">Próximo</span>
              </div>
              <div className="text-sm text-textSecondary">
                {(e.date ? new Date(e.date).toLocaleDateString() : e.data) || 'Data a definir'} • {e.place || e.local || 'Local a definir'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
