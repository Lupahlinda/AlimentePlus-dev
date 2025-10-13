import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';

export default function DonationDetails() {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock: load a specific donation by id
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get(`/doacoes/${id}`);
        if (mounted) setDonation(data || null);
      } catch (e) {
        if (mounted) setError('Não foi possível carregar a doação.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const title = useMemo(() => (donation ? (donation.descricao || donation.item) : 'Doação não encontrada'), [donation]);
  const isConcluded = donation?.status?.toLowerCase() === 'concluída';

  return (
    <div className="section max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/historico" className="text-sm">← Voltar</Link>
        {donation && (
          <span className={`badge ${isConcluded ? 'bg-primary/10 text-primary' : ''}`}>{donation.status || 'pendente'}</span>
        )}
      </div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      {loading ? (
        <div className="card"><p>Carregando...</p></div>
      ) : error ? (
        <div className="card"><p>{error}</p></div>
      ) : !donation ? (
        <div className="card"><p>Não encontramos essa doação.</p></div>
      ) : (
        <div className="card">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-textSecondary">Quantidade</dt>
              <dd className="font-medium">{donation.quantidade ?? donation.quantity}</dd>
            </div>
            <div>
              <dt className="text-sm text-textSecondary">Validade</dt>
              <dd className="font-medium">{donation.validade || '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-textSecondary">Localização</dt>
              <dd className="font-medium">{donation.localizacao || '—'}</dd>
            </div>
          </dl>
          <div className="mt-4">
            <button
              className="button-primary w-full"
              disabled={isConcluded}
              onClick={() => {
                const next = { ...donation, status: 'concluída' };
                api.patch(`/doacoes/${donation.id}`, { status: 'concluída' }).catch(() => {});
                setDonation(next);
              }}
            >{isConcluded ? 'Doação concluída' : 'Marcar como concluída (mock)'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
