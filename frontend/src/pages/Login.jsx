import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, borrarTokens, guardarTokens } from '../api/client';
import fishyLogo from '../assets/fishy.png';

export default function Login() {
  const navegar = useNavigate();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function iniciarSesion(evento) {
    evento.preventDefault(); // evita que el <form> recargue la página
    setError('');
    setEnviando(true);

    try {
      // 1) POST /auth/login  ->  { accessToken, refreshToken }
      const tokens = await api('/auth/login', {
        metodo: 'POST',
        datos: { correo: correo.trim(), contrasena },
      });
      guardarTokens(tokens);

      // 2) GET /auth/me  ->  { id, correo, rol }   (ya viaja con el token)
      const perfil = await api('/auth/me');
      if (perfil.rol !== 'admin') {
        borrarTokens();
        setError('Esta cuenta no tiene permisos de administrador.');
        setEnviando(false);
        return;
      }

      // 3) Todo bien: al panel. replace = el login no queda en el historial
      navegar('/', { replace: true });
    } catch (e) {
      borrarTokens();
      // VULN-S07: se muestra el mensaje del servidor tal cual
      // ("El usuario no existe" / "Password incorrecto") -> enumeración de usuarios
      setError(e.message);
      setEnviando(false);
    }
  }

  return (
    <div className="auth-split-container">
      {/* Banner izquierdo (diseño original del equipo) */}
      <div className="auth-banner-side">
        <img src={fishyLogo} alt="Fishy Logo" className="auth-banner-logo" />
        <p className="auth-banner-text">
          La plataforma comunitaria para la prevención, detección y reporte de fraudes digitales y phishing.
        </p>
      </div>

      {/* Formulario */}
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