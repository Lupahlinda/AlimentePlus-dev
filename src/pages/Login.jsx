import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('mock_email');
    if (savedEmail) setForm((f) => ({ ...f, email: savedEmail }));
  }, []);

  const validate = () => {
    const next = {};
    const emailRe = /[^@\s]+@[^@\s]+\.[^@\s]+/;
    if (!form.email || !emailRe.test(form.email)) {
      next.email = 'Informe um e-mail válido.';
    }
    if (!form.password) {
      next.password = 'Informe sua senha.';
    }
    return next;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('mock_email', form.email);
      login(form.email, form.password);
      alert('Login mockado com sucesso!');
      setLoading(false);
      navigate('/');
    }, 800);
  };

  return (
    <div className="section max-w-md space-y-4">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-1">Bem-vindo(a) de volta</h1>
        <p className="text-sm text-textSecondary">Acesse sua conta para publicar e acompanhar suas doações.</p>
      </div>
      <form onSubmit={onSubmit} className="card space-y-4" aria-label="Formulário de login" noValidate>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            required
          />
          {errors.email && (
            <p id="login-email-error" className="text-xs text-red-700 mt-1" role="alert">{errors.email}</p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium" htmlFor="password">Senha</label>
            <button type="button" className="text-xs text-primary hover:underline" onClick={() => alert('Recuperação de senha (mock)')}>Esqueceu a senha?</button>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            className="input-field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            required
          />
          {errors.password && (
            <p id="login-password-error" className="text-xs text-red-700 mt-1" role="alert">{errors.password}</p>
          )}
        </div>
        <button type="submit" disabled={loading} className="button-primary w-full touch-target">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="text-sm text-center text-textSecondary">
          Não tem conta? <a className="text-primary hover:underline" onClick={(e) => { e.preventDefault(); navigate('/register'); }} href="/register">Criar conta</a>
        </p>
      </form>
    </div>
  );
}
