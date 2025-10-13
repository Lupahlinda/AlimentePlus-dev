import { useState } from 'react';
import api from '@/services/api';

export default function RequestHelp() {
  const [form, setForm] = useState({
    nome: '',
    documento: '', // CPF/CNPJ
    telefone: '',
    email: '',
    endereco: '',
    localizacao: '', // opcional: lat,lng
    moradores: 1,
    renda: '', // faixa
    itens: [{ nome: 'Cesta básica', quantidade: 1 }],
    urgencia: 'média',
    justificativa: '',
    comprovacoes: '', // links ou descrição
    consentimento: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const updateItem = (idx, patch) => {
    setForm((prev) => ({
      ...prev,
      itens: prev.itens.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    }));
  };

  const addItem = () => setForm((prev) => ({ ...prev, itens: [...prev.itens, { nome: '', quantidade: 1 }] }));
  const removeItem = (idx) => setForm((prev) => ({ ...prev, itens: prev.itens.filter((_, i) => i !== idx) }));

  const canSubmit =
    form.nome && form.documento && form.telefone && form.endereco && form.justificativa && form.consentimento &&
    form.itens.every((i) => i.nome && Number(i.quantidade) > 0);

  // Helpers de máscara/validação simples (mock)
  const onlyDigits = (s) => (s || '').replace(/\D+/g, '');
  const formatPhone = (s) => {
    const d = onlyDigits(s).slice(0, 11);
    if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
    return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
  };
  const isValidPhone = (s) => onlyDigits(s).length >= 10;
  const formatCpfCnpj = (s) => {
    const d = onlyDigits(s).slice(0, 14);
    if (d.length <= 11) {
      return d
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return d
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  };
  const isValidCpfCnpj = (s) => {
    const len = onlyDigits(s).length;
    return len === 11 || len === 14;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!isValidCpfCnpj(form.documento)) nextErrors.documento = 'Informe um CPF/CNPJ válido (11 ou 14 dígitos).';
    if (!isValidPhone(form.telefone)) nextErrors.telefone = 'Informe um telefone válido (10 ou 11 dígitos).';
    setErrors(nextErrors);
    if (!canSubmit || Object.keys(nextErrors).length > 0) return;
    setSubmitting(true);
    try {
      let lat, lng;
      if (typeof form.localizacao === 'string' && form.localizacao.includes(',')) {
        const m = form.localizacao.split(',').map((v) => parseFloat(v.trim()));
        if (m.length === 2 && m.every((n) => Number.isFinite(n))) {
          lat = m[0];
          lng = m[1];
        }
      }
      const payload = {
        ...form,
        status: 'em análise',
        createdAt: Date.now(),
        lat, lng,
      };
      await api.post('/solicitacoes', payload);
      alert('Solicitação enviada! Nossa equipe analisará seu pedido.');
      // reset
      setForm({
        nome: '', documento: '', telefone: '', email: '', endereco: '', localizacao: '', moradores: 1, renda: '',
        itens: [{ nome: 'Cesta básica', quantidade: 1 }], urgencia: 'média', justificativa: '', comprovacoes: '', consentimento: false,
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      alert('Não foi possível enviar a solicitação. Verifique o servidor mock.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section max-w-3xl space-y-4">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-1">Solicitar Recebimento de Doação</h1>
        <p className="text-sm text-textSecondary">Preencha o formulário com atenção. Algumas perguntas ajudam a entender a real necessidade para priorização justa.</p>
      </div>
      <form onSubmit={handleSubmit} className="card space-y-6" aria-label="Formulário de solicitação de doação">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="nome">Nome completo / Instituição</label>
            <input id="nome" className="input-field" value={form.nome} onChange={(e)=>setField('nome', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="documento">CPF/CNPJ</label>
            <input id="documento" className="input-field" placeholder="Somente números" value={form.documento}
              onChange={(e)=>setField('documento', formatCpfCnpj(e.target.value))} required />
            {errors.documento && <p className="text-xs text-red-600 mt-1">{errors.documento}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="telefone">Telefone</label>
            <input id="telefone" className="input-field" placeholder="(00) 00000-0000" value={form.telefone}
              onChange={(e)=>setField('telefone', formatPhone(e.target.value))} required />
            {errors.telefone && <p className="text-xs text-red-600 mt-1">{errors.telefone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email (opcional)</label>
            <input id="email" type="email" className="input-field" value={form.email} onChange={(e)=>setField('email', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" htmlFor="endereco">Endereço</label>
            <input id="endereco" className="input-field" value={form.endereco} onChange={(e)=>setField('endereco', e.target.value)} required />
            <p className="text-xs text-textSecondary mt-1">Preferencialmente com bairro e ponto de referência.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="localizacao">Localização (lat,lng) opcional</label>
            <input id="localizacao" className="input-field" placeholder="-15.83,-48.10" value={form.localizacao} onChange={(e)=>setField('localizacao', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="moradores">Número de moradores</label>
            <input id="moradores" type="number" min={1} className="input-field" value={form.moradores} onChange={(e)=>setField('moradores', Number(e.target.value))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="renda">Faixa de renda familiar</label>
            <select id="renda" className="input-field" value={form.renda} onChange={(e)=>setField('renda', e.target.value)}>
              <option value="">Selecione</option>
              <option value="até 1 SM">até 1 Salário Mínimo</option>
              <option value="1-2 SM">1 a 2 Salários Mínimos</option>
              <option value="acima de 2 SM">acima de 2 Salários Mínimos</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="urgencia">Nível de urgência</label>
            <select id="urgencia" className="input-field" value={form.urgencia} onChange={(e)=>setField('urgencia', e.target.value)}>
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Itens solicitados</h2>
            <button type="button" className="button-accent" onClick={addItem}>Adicionar item</button>
          </div>
          <div className="space-y-3">
            {form.itens.map((it, idx) => (
              <div key={idx} className="grid md:grid-cols-6 gap-3 items-end">
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium mb-1">Item</label>
                  <input className="input-field" placeholder="Ex.: Arroz, Feijão, Leite"
                    value={it.nome}
                    onChange={(e)=>updateItem(idx, { nome: e.target.value })}
                    required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Quantidade</label>
                  <input type="number" min={1} className="input-field" value={it.quantidade}
                    onChange={(e)=>updateItem(idx, { quantidade: Number(e.target.value) })} required />
                </div>
                {form.itens.length > 1 && (
                  <div className="md:col-span-6">
                    <button type="button" className="text-sm text-primary hover:underline" onClick={()=>removeItem(idx)}>Remover</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="justificativa">Explique sua necessidade</label>
          <textarea id="justificativa" className="input-field" rows={4} placeholder="Descreva a situação, despesas essenciais e como a doação ajudará"
            value={form.justificativa} onChange={(e)=>setField('justificativa', e.target.value)} required />
          <p className="text-xs text-textSecondary mt-1">Essa informação é importante para priorização. Evite dados sensíveis desnecessários.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="comprovacoes">Comprovações (links ou descrição)</label>
          <textarea id="comprovacoes" className="input-field" rows={3} placeholder="Links para cadÚnico, NIS, carta da escola, receituário, etc. (opcional)"
            value={form.comprovacoes} onChange={(e)=>setField('comprovacoes', e.target.value)} />
        </div>

        <div className="flex items-start gap-2">
          <input id="consentimento" type="checkbox" checked={form.consentimento} onChange={(e)=>setField('consentimento', e.target.checked)} />
          <label htmlFor="consentimento" className="text-sm">Declaro que as informações são verdadeiras e autorizo contato para verificação (mock).</label>
        </div>

        <button type="submit" disabled={!canSubmit || submitting} className="button-primary w-full">
          {submitting ? 'Enviando...' : 'Enviar solicitação'}
        </button>
      </form>
    </div>
  );
}
