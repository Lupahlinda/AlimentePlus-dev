import { useState } from 'react';
import api from '@/services/api';

export default function DonateForm() {
  const [form, setForm] = useState({
    descricao: '',
    quantidade: '',
    validade: '',
    localizacao: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, createdAt: Date.now(), status: 'pendente' };
      await api.post('/doacoes', payload);
      alert('Doação publicada!');
      setForm({ descricao: '', quantidade: '', validade: '', localizacao: '' });
    } catch (err) {
      console.error(err);
      alert('Falha ao publicar doação. Verifique o servidor mock.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Publicar Doação</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" htmlFor="descricao">Descrição</label>
            <input
              id="descricao"
              name="descricao"
              placeholder="Ex.: Cestas básicas, frutas, pães..."
              className="input-field"
              value={form.descricao}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-textSecondary mt-1">Seja específico para ajudar os receptores a identificar o item.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="quantidade">Quantidade</label>
            <input
              id="quantidade"
              name="quantidade"
              type="number"
              min={1}
              placeholder="Ex.: 10"
              className="input-field"
              value={form.quantidade}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="validade">Validade</label>
            <input
              id="validade"
              name="validade"
              type="date"
              className="input-field"
              value={form.validade}
              onChange={handleChange}
            />
            <p className="text-xs text-textSecondary mt-1">Opcional, mas útil para itens perecíveis.</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" htmlFor="localizacao">Localização</label>
            <input
              id="localizacao"
              name="localizacao"
              placeholder="Latitude,Longitude ou endereço (ex.: -23.55,-46.63)"
              className="input-field"
              value={form.localizacao}
              onChange={handleChange}
            />
          </div>
        </div>
        <button disabled={submitting} className="button-primary w-full">
          {submitting ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
}
