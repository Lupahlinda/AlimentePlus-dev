import { useEffect, useMemo, useCallback, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2xUrl from '@/assets/leaflet/marker-icon-2x.png';
import markerIconUrl from '@/assets/leaflet/marker-icon.png';
import markerShadowUrl from '@/assets/leaflet/marker-shadow.png';
import api from '@/services/api';
import { Link } from 'react-router-dom';
import { FiBox, FiCalendar, FiHelpCircle } from 'react-icons/fi';
import { renderToString } from 'react-dom/server';

// Corrige os ícones padrão do Leaflet no Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2xUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
});

export default function MapView() {
  const [position, setPosition] = useState([0, 0]);
  const [hasLocation, setHasLocation] = useState(false);
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [showPanel, setShowPanel] = useState(true);
  const [showDonations, setShowDonations] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [showRequests, setShowRequests] = useState(true);
  const [map, setMap] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        setHasLocation(true);
        setLoading(false);
      },
      () => {
        // Caso negado/erro, usa coordenadas de fallback (Ceilândia - DF)
        setPosition([-15.83, -48.10]);
        setHasLocation(true);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // Carrega solicitações (com lat/lng opcional)
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/solicitacoes');
        const parsed = (data || [])
          .map((s) => {
            let lat = s.lat ?? s.latitude;
            let lng = s.lng ?? s.longitude;
            if ((lat == null || lng == null) && typeof s.localizacao === 'string') {
              const m = s.localizacao.split(',').map((v) => parseFloat(v.trim()));
              if (m.length === 2 && m.every((n) => Number.isFinite(n))) {
                lat = m[0];
                lng = m[1];
              }
            }
            if (Number.isFinite(lat) && Number.isFinite(lng)) {
              return { id: s.id, lat, lng, nome: s.nome, urgencia: s.urgencia, status: s.status };
            }
            return null;
          })
          .filter(Boolean);
        setRequests(parsed);
      } catch (_) {
        setRequests([]);
      }
    })();
  }, []);

    // Ícones (usando react-icons renderizados para string SVG), memoizados
  const donationIcon = useMemo(() => L.divIcon({
    className: 'donation-pin',
    html: `
      <div style="
        background:#FFA63F; color:white; width:32px; height:32px;
        border-radius:16px; display:flex; align-items:center; justify-content:center;
        border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,.2)
      ">
        ${renderToString(<FiBox size={16} color="#fff" />)}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
  }), []);

  // Util: calcula distância em km (Haversine)
  const distanceKm = useCallback((a, b) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const [lat1, lon1] = a; const [lat2, lon2] = b;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const la1 = toRad(lat1); const la2 = toRad(lat2);
    const h = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)**2;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  }, []);

  // Listas derivadas para painel lateral (ordenadas por distância)
  const donationList = useMemo(() => pins.map((p) => ({
    id: p.id,
    type: 'doacao',
    title: p.descricao,
    subtitle: `Qtd: ${p.quantidade ?? '—'}`,
    lat: p.lat, lng: p.lng,
    dist: hasLocation ? distanceKm(position, [p.lat, p.lng]) : null,
  })), [pins, hasLocation, position, distanceKm]);

  const eventList = useMemo(() => events.map((e) => ({
    id: e.id,
    type: 'evento',
    title: e.titulo,
    subtitle: `${e.local} • ${e.data ? new Date(e.data).toLocaleDateString() : ''}`,
    lat: e.lat, lng: e.lng,
    dist: hasLocation ? distanceKm(position, [e.lat, e.lng]) : null,
  })), [events, hasLocation, position, distanceKm]);

  const requestList = useMemo(() => requests.map((r) => ({
    id: r.id,
    type: 'solicitacao',
    title: r.nome || 'Solicitação',
    subtitle: `Urgência: ${r.urgencia || '—'}${r.status ? ` • ${r.status}` : ''}`,
    lat: r.lat, lng: r.lng,
    dist: hasLocation ? distanceKm(position, [r.lat, r.lng]) : null,
  })), [requests, hasLocation, position, distanceKm]);

  const mergedWithRequests = useMemo(() => ([
    ...(showDonations ? donationList : []),
    ...(showEvents ? eventList : []),
    ...(showRequests ? requestList : []),
  ]).sort((a, b) => (a.dist ?? Infinity) - (b.dist ?? Infinity)), [showDonations, showEvents, showRequests, donationList, eventList, requestList]);

  // Focar no item no mapa
  const focusItem = useCallback((lat, lng) => {
    if (map && typeof map.flyTo === 'function') map.flyTo([lat, lng], 15);
  }, [map]);

  const requestIcon = useMemo(() => L.divIcon({
    className: 'request-pin',
    html: `
      <div style="
        background:#6D28D9; color:white; width:30px; height:30px;
        border-radius:15px; display:flex; align-items:center; justify-content:center;
        border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,.2)
      ">
        ${renderToString(<FiHelpCircle size={16} color="#fff" />)}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  }), []);

  const eventIcon = useMemo(() => L.divIcon({
    className: 'event-pin',
    html: `
      <div style="
        background:#1A7345; color:white; width:30px; height:30px;
        border-radius:15px; display:flex; align-items:center; justify-content:center;
        border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,.2)
      ">
        ${renderToString(<FiCalendar size={16} color="#fff" />)}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  }), []);

  const userIcon = useMemo(() => L.divIcon({
    className: 'user-pin',
    html: `
      <div style="
        background:#3B82F6; color:white; width:14px; height:14px;
        border-radius:7px; border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,.2)
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  }), []);

  // Carrega doações com coordenadas para exibir no mapa
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/doacoes');
        const parsed = (data || [])
          .map((d) => {
            // Tenta usar d.lat/d.lng, ou parsear d.localizacao como "lat,lng"
            let lat = d.lat ?? d.latitude;
            let lng = d.lng ?? d.longitude;
            if ((lat == null || lng == null) && typeof d.localizacao === 'string') {
              const m = d.localizacao.split(',').map((v) => parseFloat(v.trim()));
              if (m.length === 2 && m.every((n) => Number.isFinite(n))) {
                lat = m[0];
                lng = m[1];
              }
            }
            if (Number.isFinite(lat) && Number.isFinite(lng)) {
              return { id: d.id, lat, lng, descricao: d.descricao || d.item, quantidade: d.quantidade ?? d.quantity };
            }
            return null;
          })
          .filter(Boolean);
        setPins(parsed);
      } catch (_) {
        setPins([]);
      }
    })();
  }, []);

  // Carrega eventos (com lat/lng) para exibir no mapa
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/eventos');
        const parsed = (data || [])
          .map((e) => {
            let lat = e.lat ?? e.latitude;
            let lng = e.lng ?? e.longitude;
            if ((lat == null || lng == null) && typeof e.localizacao === 'string') {
              const m = e.localizacao.split(',').map((v) => parseFloat(v.trim()));
              if (m.length === 2 && m.every((n) => Number.isFinite(n))) {
                lat = m[0];
                lng = m[1];
              }
            }
            if (Number.isFinite(lat) && Number.isFinite(lng)) {
              return { id: e.id, lat, lng, titulo: e.titulo || e.name, data: e.date || e.data, local: e.local || e.place };
            }
            return null;
          })
          .filter(Boolean);
        setEvents(parsed);
      } catch (_) {
        setEvents([]);
      }
    })();
  }, []);

  return (
    <div className="section space-y-4">
      <h1 className="text-2xl font-semibold">Mapa</h1>
      <div className="grid md:grid-cols-12 gap-4">
        <div className="md:col-span-8 card p-0 overflow-hidden">
          {!hasLocation || loading ? (
            <div className="aspect-[16/10] flex items-center justify-center">
              <div className="text-center">
                <div className="skeleton h-6 w-48 mb-2"></div>
                <p className="text-sm text-textSecondary">Aguardando localização...</p>
              </div>
            </div>
          ) : (
          <MapContainer center={position} zoom={13} className="aspect-[16/10] w-full" key={String(hasLocation)} aria-label="Mapa de doações" whenCreated={setMap}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={userIcon}>
              <Popup>Você está aqui</Popup>
            </Marker>
            {pins.map((p) => (
              <Marker
                key={p.id}
                position={[p.lat, p.lng]}
                icon={donationIcon}
              >
                <Popup>
                  <div className="space-y-1">
                    <div className="font-medium">{p.descricao}</div>
                    <div className="text-sm text-textSecondary">Qtd: {p.quantidade ?? '—'}</div>
                    <Link className="button-accent inline-block mt-2" to={`/doacao/${p.id}`}>Ver detalhes</Link>
                  </div>
                </Popup>
              </Marker>
            ))}
            {events.map((ev) => (
              <Marker key={`e-${ev.id}`} position={[ev.lat, ev.lng]} icon={eventIcon}>
                <Popup>
                  <div className="space-y-1">
                    <div className="font-medium">{ev.titulo}</div>
                    <div className="text-sm text-textSecondary">{ev.local}</div>
                    <div className="text-xs text-textSecondary">{ev.data ? new Date(ev.data).toLocaleString() : ''}</div>
                    <Link className="button-primary inline-block mt-2" to={`/eventos`}>Ver eventos</Link>
                  </div>
                </Popup>
              </Marker>
            ))}
            {requests.map((rq) => (
              <Marker key={`r-${rq.id}`} position={[rq.lat, rq.lng]} icon={requestIcon}>
                <Popup>
                  <div className="space-y-1">
                    <div className="font-medium">{rq.nome || 'Solicitação'}</div>
                    <div className="text-sm text-textSecondary">Urgência: {rq.urgencia || '—'}</div>
                    <div className="text-xs text-textSecondary">{rq.status || 'em análise'}</div>
                    <Link className="button-primary inline-block mt-2" to={`/solicitar`}>Solicitar também</Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          )}
        </div>
        <div className="md:col-span-4 space-y-3">
          <div className="card">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Próximos de você</h2>
              <button className="text-sm text-primary hover:underline md:hidden" onClick={()=>setShowPanel((v)=>!v)}>{showPanel? 'Ocultar':'Mostrar'}</button>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={showDonations} onChange={(e)=>setShowDonations(e.target.checked)} />Doações</label>
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={showEvents} onChange={(e)=>setShowEvents(e.target.checked)} />Eventos</label>
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={showRequests} onChange={(e)=>setShowRequests(e.target.checked)} />Solicitações</label>
            </div>
          </div>
          {showPanel && (
            <div className="card">
              {mergedWithRequests.length === 0 ? (
                <p className="text-sm text-textSecondary">Nada por perto no momento.</p>
              ) : (
                <ul className="space-y-3">
                  {mergedWithRequests.slice(0, 8).map((it) => (
                    <li key={`${it.type}-${it.id}`} className="border-b last:border-b-0 pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{it.title}</div>
                          <div className="text-xs text-textSecondary">{it.subtitle}</div>
                          {it.dist != null && <div className="text-xs text-textSecondary mt-1">{it.dist.toFixed(1)} km</div>}
                        </div>
                        <button className="text-sm text-primary hover:underline" onClick={()=>focusItem(it.lat, it.lng)}>Ver no mapa</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="text-xs text-textSecondary flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-accent text-white" aria-hidden></span>
          <span>Doações</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-blue-500 text-white" aria-hidden></span>
          <span>Você</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-white" aria-hidden></span>
          <span>Eventos</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-purple-700 text-white" aria-hidden></span>
          <span>Solicitações</span>
        </div>
      </div>
    </div>
  );
}
