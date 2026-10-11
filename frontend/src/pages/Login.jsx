import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, borrarTokens, guardarTokens } from '../api/client';
import { Fish } from 'lucide-react';

export default function Login() {
  const navegar = useNavigate();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function iniciarSesion(evento) {
    evento.preventDefault(); 
    setError('');
    setEnviando(true);

    try {

      const tokens = await api('/auth/login', {
        metodo: 'POST',
        datos: { correo: correo.trim(), contrasena },
      });
      guardarTokens(tokens);

      const perfil = await api('/auth/me');
      if (perfil.rol !== 'admin') {
        borrarTokens();
        setError('Esta cuenta no tiene permisos de administrador.');
        setEnviando(false);
        return;
      }

      navegar('/', { replace: true });
    } catch (e) {
      borrarTokens();

      setError(e.message);
      setEnviando(false);
    }
  }

  return (
    <div className="auth-split-container">
      <div className="auth-banner-side">
        <div className="login-marca">
          <Fish size={40} color="#9cc7ef" />
          <span>Fishy</span>
        </div>
        <h1 className="login-titulo">Panel de moderación</h1>
        <p className="auth-banner-text">
          Revisa, clasifica y publica los reportes de fraude y phishing que envía la comunidad.
        </p>
        <svg className="login-olas" viewBox="0 0 1200 240" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 120 C150 80 300 80 450 120 S750 160 900 120 S1100 80 1200 100 V240 H0 Z" fill="currentColor" opacity="0.06" />
          <path d="M0 160 C200 125 350 130 550 165 S900 200 1050 160 S1150 140 1200 150 V240 H0 Z" fill="currentColor" opacity="0.07" />
          <path d="M0 200 C180 180 330 185 520 205 S860 230 1020 205 S1140 190 1200 195 V240 H0 Z" fill="currentColor" opacity="0.09" />
        </svg>
      </div>

      <div className="auth-form-side">
        <form className="auth-form-content" onSubmit={iniciarSesion}>
          <h2 style={{ fontSize: '28px', color: '#1f2937' }}>Iniciar sesión</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
            Acceso exclusivo para administradores de Fishy
          </p>

          {error && <p className="login-error" role="alert">{error}</p>}

          <input
            className="web-input"
            type="email"
            placeholder="Correo electrónico"
            autoComplete="username"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <input
            className="web-input"
            type="password"
            placeholder="Contraseña"
            autoComplete="current-password"
            required
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />

          <button type="submit" className="btn-primary-web" disabled={enviando}>
            {enviando ? 'Entrando…' : 'Entrar a la plataforma'}
          </button>
        </form>
      </div>
    </div>
  );
}