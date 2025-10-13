import { useEffect, useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);

  // Mock: check if user already exists
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem('mock_users') || '[]');
    if (existing.length > 0) {
      // just a mock side-effect
    }
  }, []);

  const validate = () => {
    const next = {};
    if (!form.name || form.name.trim().length < 2) {
      next.name = 'Informe seu nome (mínimo 2 caracteres).';
    }
    const emailRe = /[^@\s]+@[^@\s]+\.[^@\s]+/;
    if (!form.email || !emailRe.test(form.email)) {
      next.email = 'Informe um e-mail válido.';
    }
    if (!form.password || form.password.length < 6) {
      next.password = 'A senha deve ter pelo menos 6 caracteres.';
    }
    return next;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setSubmitting(true);
    try {
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      users.push(form);
      localStorage.setItem('mock_users', JSON.stringify(users));
      setCreated(true);
      // Opcional: limpar senha após cadastro
      setForm((prev) => ({ ...prev, password: '' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section max-w-md space-y-4">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-1">Criar conta</h1>
        <p className="text-sm text-textSecondary">Junte-se ao Alimente+ para doar, receber e acompanhar ações perto de você.</p>
      </div>
      {created && (
        <div className="card" role="status" aria-live="polite">
          <p className="text-green-700">Usuário criado (mock)! Agora você já pode entrar.</p>
        </div>
      )}
      <form onSubmit={onSubmit} className="card space-y-4" aria-label="Formulário de cadastro" noValidate>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Nome</label>
          <input
            id="name"
            name="name"
            className="input-field"
            autoComplete="name"
            value={form.name}
            onChange={(e)=>setForm({...form, name: e.target.value})}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            required
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-red-700 mt-1" role="alert">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="input-field"
            autoComplete="email"
            inputMode="email"
            value={form.email}
            onChange={(e)=>setForm({...form, email: e.target.value})}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            required
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-red-700 mt-1" role="alert">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            className="input-field"
            autoComplete="new-password"
            value={form.password}
            onChange={(e)=>setForm({...form, password: e.target.value})}
            minLength={6}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error password-help' : 'password-help'}
            required
          />
          <p id="password-help" className="text-xs text-textSecondary mt-1">Use ao menos 6 caracteres. É um cadastro mock apenas para testes.</p>
          {errors.password && (
            <p id="password-error" className="text-xs text-red-700 mt-1" role="alert">{errors.password}</p>
          )}
        </div>
        <button className="button-primary w-full touch-target" disabled={submitting}>
          {submitting ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
}
