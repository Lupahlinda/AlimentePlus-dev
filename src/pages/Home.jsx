import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { FiGift, FiHelpCircle, FiMapPin, FiCalendar } from 'react-icons/fi';
import marcadores from '@/assets/marcadores.png';

export default function Home() {
  const [highlights, setHighlights] = useState([]);
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({ doacoes: 0, eventos: 0, solicitacoes: 0 });

  // Carregar destaques reais da API (limitados)
  useEffect(() => {
    const mock = [
      { id: 1, title: 'Feira Solidária', type: 'evento' },
      { id: 2, title: 'Cestas básicas - Bairro Centro', type: 'doacao' },
    ];
    setHighlights(mock);

    (async () => {
      try {
        const [dRes, eRes, sRes] = await Promise.allSettled([
          api.get('/doacoes'),
          api.get('/eventos'),
          api.get('/solicitacoes')
        ]);
        const d = dRes.status === 'fulfilled' ? (dRes.value.data || []) : [];
        const e = eRes.status === 'fulfilled' ? (eRes.value.data || []) : [];
        const s = sRes.status === 'fulfilled' ? (sRes.value.data || []) : [];
        setDonations(d.slice(0, 6));
        setEvents(e.slice(0, 6));
        setStats({ doacoes: d.length, eventos: e.length, solicitacoes: s.length });
      } catch (_) {}
    })();
  }, []);

  return (
    <div className="section space-y-10">
      {/* Hero */}
      <section className="card overflow-hidden">
        <div className="p-4 md:p-8 grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border-2 border-black/10 shadow-brutalSm bg-primaryLight">
              <FiMapPin className="text-primary" />
              <span className="text-sm">Ceilândia e Região</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Conecte sua doação a quem mais precisa</h1>
            <p className="text-base md:text-lg">Aproximamos doadores, voluntários e instituições para reduzir o desperdício e aumentar o impacto social.</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link className="button-accent" to="/doar">Publicar doação</Link>
              <Link className="button-primary" to="/solicitar">Pedir ajuda</Link>
              <Link className="button-primary" to="/mapa">Ver no mapa</Link>
            </div>
          </div>
          <div className="md:col-span-5 rounded-card border-2 border-black/10 shadow-card bg-primaryLight/60 aspect-[4/3] md:aspect-[16/10] overflow-hidden">
            <Link to="/mapa" aria-label="Abrir o mapa">
              <img
                src={marcadores}
                alt="Exemplo de marcadores no mapa"
                className="w-full h-full object-cover hover:opacity-95 transition"
                loading="lazy"
                decoding="async"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/doar" className="card flex items-center gap-3 hover:translate-x-0.5 hover:translate-y-0.5 transition">
          <div className="p-3 rounded-md bg-primaryLight border-2 border-black/10 shadow-brutalSm"><FiGift /></div>
          <div>
            <div className="font-semibold">Doar</div>
            <div className="text-sm text-textSecondary">Publique uma doação</div>
          </div>
        </Link>
        <Link to="/solicitar" className="card flex items-center gap-3 hover:translate-x-0.5 hover:translate-y-0.5 transition">
          <div className="p-3 rounded-md bg-primaryLight border-2 border-black/10 shadow-brutalSm"><FiHelpCircle /></div>
          <div>
            <div className="font-semibold">Receber</div>
            <div className="text-sm text-textSecondary">Solicite ajuda</div>
          </div>
        </Link>
        <Link to="/mapa" className="card flex items-center gap-3 hover:translate-x-0.5 hover:translate-y-0.5 transition">
          <div className="p-3 rounded-md bg-primaryLight border-2 border-black/10 shadow-brutalSm"><FiMapPin /></div>
          <div>
            <div className="font-semibold">Mapa</div>
            <div className="text-sm text-textSecondary">Veja perto de você</div>
          </div>
        </Link>
        <Link to="/eventos" className="card flex items-center gap-3 hover:translate-x-0.5 hover:translate-y-0.5 transition">
          <div className="p-3 rounded-md bg-primaryLight border-2 border-black/10 shadow-brutalSm"><FiCalendar /></div>
          <div>
            <div className="font-semibold">Eventos</div>
            <div className="text-sm text-textSecondary">Ações na comunidade</div>
          </div>
        </Link>
      </section>

      {/* Stats */}
      <section className="grid sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-extrabold">{stats.doacoes}</div>
          <div className="text-sm text-textSecondary">Doações</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-extrabold">{stats.eventos}</div>
          <div className="text-sm text-textSecondary">Eventos</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-extrabold">{stats.solicitacoes}</div>
          <div className="text-sm text-textSecondary">Solicitações</div>
        </div>
      </section>

      {/* Destaques de eventos */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Próximos eventos</h2>
          <Link to="/eventos" className="text-sm">Ver todos</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.slice(0,3).map((e) => (
            <div key={e.id} className="card">
              <div className="font-medium text-textPrimary">{e.titulo || e.name}</div>
              <div className="text-sm text-textSecondary">{e.date ? new Date(e.date).toLocaleDateString() : e.data} • {e.local || e.place}</div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="card"><p className="text-textSecondary">Sem eventos no momento.</p></div>
          )}
        </div>
      </section>

      {/* Doações recentes */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Doações recentes</h2>
          <Link to="/mapa" className="text-sm">Ver no mapa</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {donations.slice(0,3).map((d) => (
            <div key={d.id} className="card">
              <div className="font-medium text-textPrimary">{d.descricao || d.item}</div>
              <div className="text-sm text-textSecondary">Qtd: {d.quantidade ?? d.quantity} • Status: {d.status || 'pendente'}</div>
              <Link to={`/doacao/${d.id}`} className="text-sm text-primary hover:underline mt-1 inline-block">Detalhes</Link>
            </div>
          ))}
          {donations.length === 0 && (
            <div className="card"><p className="text-textSecondary">Sem doações no momento.</p></div>
          )}
        </div>
      </section>

      {/* Como funciona */}
      <section className="grid md:grid-cols-3 gap-4">
        {[{
          icon: <FiGift />, title: 'Doe com facilidade', text: 'Publique o que deseja doar e defina a disponibilidade.'
        },{
          icon: <FiHelpCircle />, title: 'Peça o que precisa', text: 'Solicite itens essenciais com transparência e consentimento.'
        },{
          icon: <FiMapPin />, title: 'Encontre no mapa', text: 'Enxergue doações, eventos e pedidos próximos a você.'
        }].map((s, idx) => (
          <div key={idx} className="card flex items-start gap-3">
            <div className="p-3 rounded-md bg-primaryLight border-2 border-black/10 shadow-brutalSm text-xl">{s.icon}</div>
            <div>
              <div className="font-semibold">{s.title}</div>
              <p className="text-sm text-textSecondary mt-1">{s.text}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
