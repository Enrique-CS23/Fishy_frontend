import React, { useState } from 'react';
import './App.css';

const INITIAL_REPORTS = [
  { id: 1, inicial: 'A', color: '#00BCD4', autor: 'Anónimo', titulo: 'Falso SMS de paquetería retenida', descripcion: 'Me llegó un SMS diciendo que mi paquete estaba retenido en aduana y pedían $50 MXN para liberarlo. El enlace lleva a una página idéntica a Correos de México.', categoria: 'SMS', mePaso: 24, comentarios: 2, fecha: 'Hace 2 horas' },
  { id: 2, inicial: 'N', color: '#2196F3', autor: 'Nophishing', titulo: 'Correo falso del Banco Santander', descripcion: 'Recibí un correo familiar que aparentemente era de mi banco, para notificarme que tenía un cargo retenido en mi tarjeta. Sabían mi nombre completo.', categoria: 'Email', mePaso: 48, comentarios: 5, fecha: 'Hace 5 horas' },
  { id: 3, inicial: 'C', color: '#00BCD4', autor: 'Cass.Garcia', titulo: 'Oferta de trabajo fraudulenta por WhatsApp', descripcion: 'Un número desconocido con prefijo internacional me contactó ofreciéndome ganar $1,000 MXN diarios solo por darle "Like" a videos de YouTube.', categoria: 'WhatsApp', mePaso: 89, comentarios: 15, fecha: 'Ayer' },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeScreen, setActiveScreen] = useState('feed'); // feed, newReport, readings, settings, profile, editReport
  const [authScreen, setAuthScreen] = useState('login'); // login, register, recover
  const [showResetAlert, setShowResetAlert] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="auth-split-container">
        {/* Banner Lateral Izquierdo */}
        <div className="auth-banner-side">
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>🐟</div>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>Fishy Web</h1>
          <p style={{ fontSize: '16px', opacity: 0.8, marginTop: '8px', textAlign: 'center', maxWidth: '380px' }}>
            La plataforma comunitaria para la prevención, detección y reporte de fraudes digitales y phishing.
          </p>
        </div>

        {/* Formulario Derecho */}
        <div className="auth-form-side">
          <div className="auth-form-content">
            {authScreen === 'login' && (
              <>
                <h2 style={{ fontSize: '28px', color: '#1f2937' }}>Iniciar sesión</h2>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>Ingresa tus credenciales para acceder a la plataforma</p>
                
                <input className="web-input" type="email" placeholder="Correo electrónico" />
                <input className="web-input" type="password" placeholder="Contraseña" />
                
                <button className="btn-primary-web" onClick={() => setIsLoggedIn(true)}>Entrar a la plataforma</button>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '13px' }}>
                  <button style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }} onClick={() => setAuthScreen('recover')}>¿Olvidaste tu contraseña?</button>
                  <button style={{ background: 'none', border: 'none', color: 'var(--figma-dark-blue)', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setAuthScreen('register')}>Crear cuenta nueva</button>
                </div>
              </>
            )}

            {authScreen === 'register' && (
              <>
                <h2 style={{ fontSize: '28px', color: '#1f2937' }}>Crear cuenta</h2>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Sé parte de la comunidad de protección digital</p>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input className="web-input" placeholder="Nombre" />
                  <input className="web-input" placeholder="Apellidos" />
                </div>
                <input className="web-input" placeholder="Nombre de usuario" />
                <input className="web-input" type="email" placeholder="Correo electrónico" />
                <input className="web-input" type="password" placeholder="Contraseña" />
                
                <button className="btn-primary-web" onClick={() => setIsLoggedIn(true)}>Registrarse</button>
                <button style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', marginTop: '8px' }} onClick={() => setAuthScreen('login')}>¿Ya tienes cuenta? Inicia sesión</button>
              </>
            )}

            {authScreen === 'recover' && (
              <>
                <h2 style={{ fontSize: '28px', color: '#1f2937' }}>Recuperar cuenta</h2>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>Ingresa tu correo o usuario para recibir un enlace de recuperación.</p>
                <input className="web-input" placeholder="Correo o nombre de usuario" />
                <button className="btn-primary-web" onClick={() => setShowResetAlert(true)}>Enviar enlace</button>
                <button style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', marginTop: '8px' }} onClick={() => setAuthScreen('login')}>Volver a Inicio de sesión</button>
              </>
            )}
          </div>
        </div>

        {/* Modal de Alerta */}
        {showResetAlert && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: 'white', padding: '32px', borderRadius: '16px', maxWidth: '400px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Correo enviado</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
                Si existe una cuenta asociada, recibirás un correo con las instrucciones para restablecer tu contraseña.
              </p>
              <button className="btn-primary-web" style={{ width: '100%' }} onClick={() => { setShowResetAlert(false); setAuthScreen('login'); }}>
                Entendido
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="web-app-container">
      {/* Sidebar Izquierda */}
      <aside className="sidebar">
        <div>
          <div className="brand-header">
            <span>🐟</span>
            <span>Fishy</span>
          </div>

          <nav className="nav-menu">
            <button className={`nav-item ${activeScreen === 'feed' ? 'active' : ''}`} onClick={() => setActiveScreen('feed')}>
              <span>🏠</span> Inicio / Feed
            </button>
            <button className={`nav-item ${activeScreen === 'newReport' ? 'active' : ''}`} onClick={() => setActiveScreen('newReport')}>
              <span>➕</span> Nuevo Reporte
            </button>
            <button className={`nav-item ${activeScreen === 'readings' ? 'active' : ''}`} onClick={() => setActiveScreen('readings')}>
              <span>📖</span> Centro de Lecturas
            </button>
            <button className={`nav-item ${activeScreen === 'settings' ? 'active' : ''}`} onClick={() => setActiveScreen('settings')}>
              <span>⚙️</span> Configuración
            </button>
          </nav>
        </div>

        {/* Perfil en la parte inferior de la Sidebar */}
        <div className="sidebar-user">
          <div className="user-info" style={{ cursor: 'pointer' }} onClick={() => setActiveScreen('profile')}>
            <div className="user-avatar">U</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Usuario</div>
              <div style={{ fontSize: '11px', color: '#a0aec0' }}>Ver perfil</div>
            </div>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#fc8181', cursor: 'pointer', fontSize: '16px' }} title="Cerrar sesión" onClick={() => setIsLoggedIn(false)}>
            🚪
          </button>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="main-wrapper">
        <header className="top-bar">
          <h2 className="page-title">
            {activeScreen === 'feed' && 'Panel de Reportes Recientes'}
            {activeScreen === 'newReport' && 'Crear un nuevo reporte de fraude'}
            {activeScreen === 'readings' && 'Módulos de Aprendizaje y Prevención'}
            {activeScreen === 'settings' && 'Ajustes del Sistema'}
            {activeScreen === 'profile' && 'Perfil de Usuario'}
            {activeScreen === 'editReport' && 'Editar Reporte'}
          </h2>
          <button className="btn-primary-web" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setActiveScreen('newReport')}>
            + Publicar Alerta
          </button>
        </header>

        <div className="content-body">
          <div className="content-max-width">
            {activeScreen === 'feed' && <MainFeedWeb setActiveScreen={setActiveScreen} />}
            {activeScreen === 'readings' && <ReadingsWeb />}
            {activeScreen === 'newReport' && <NewReportWeb setActiveScreen={setActiveScreen} />}
            {activeScreen === 'settings' && <SettingsWeb />}
            {activeScreen === 'profile' && <ProfileWeb setIsLoggedIn={setIsLoggedIn} setActiveScreen={setActiveScreen} />}
            {activeScreen === 'editReport' && <EditReportWeb setActiveScreen={setActiveScreen} />}
          </div>
        </div>
      </main>
    </div>
  );
}

// Componentes del Dashboard

function MainFeedWeb() {
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const filtros = ['Todos', 'SMS', 'URL', 'Email', 'WhatsApp'];

  return (
    <div className="dashboard-grid">
      {/* Columna Principal: Buscador y Lista de Reportes */}
      <div>
        <div className="search-filter-card">
          <div className="search-bar-web">
            <span>🔍</span>
            <input placeholder="Buscar palabras clave, dominios sospechosos, teléfonos..." />
          </div>
          <div className="filter-pills-web">
            {filtros.map(f => (
              <button key={f} className={`pill-btn ${selectedFilter === f ? 'active' : ''}`} onClick={() => setSelectedFilter(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {INITIAL_REPORTS.map(r => (
          <div key={r.id} className="report-card-web">
            <div className="card-header">
              <div className="author-info">
                <div className="user-avatar" style={{ backgroundColor: r.color, color: 'white' }}>{r.inicial}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{r.autor}</span>
                    <span className="badge-verified">✓ Verificado</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>{r.fecha}</span>
                </div>
              </div>
              <span className="category-tag">{r.categoria}</span>
            </div>

            <h3 style={{ fontSize: '16px', color: '#111827' }}>{r.titulo}</h3>
            <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>{r.descripcion}</p>

            <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '8px 0' }} />

            <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#6b7280' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563' }}>👍 {r.mePaso} Me pasó igual</button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563' }}>💬 {r.comentarios} Comentarios</button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', marginLeft: 'auto' }}>🔗 Compartir</button>
            </div>
          </div>
        ))}
      </div>

      {/* Columna Derecha: Widgets de Información */}
      <div>
        <div className="widget-card">
          <h4 style={{ fontSize: '15px', marginBottom: '12px' }}>📊 Estadísticas de la Comunidad</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
              <span>Reportes hoy:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--figma-dark-blue)' }}>128</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
              <span>Modalidad más común:</span>
              <span style={{ fontWeight: 'bold', color: '#d97706' }}>SMS / Paquetería</span>
            </div>
          </div>
        </div>

        <div className="widget-card" style={{ background: 'linear-gradient(135deg, #0C4775, #1e5d8d)', color: 'white' }}>
          <h4 style={{ fontSize: '15px', marginBottom: '8px' }}>🛡️ Recomendación del día</h4>
          <p style={{ fontSize: '12px', opacity: 0.9, lineHeight: '1.4' }}>
            Ningún banco oficial te pedirá tu contraseña o token mediante llamadas telefónicas o enlaces enviados por SMS.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReadingsWeb() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: 'white', padding: '24px', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Nivel Actual: Cinturón Blanco en Ciberseguridad</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>Completa los módulos para obtener tus insignias de prevención.</p>
        <div style={{ height: '10px', background: '#e5e7eb', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: '35%', height: '100%', background: 'var(--figma-dark-blue)' }}></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {[
          { title: 'El engaño telefónico', sub: 'Aprende a identificar a los falsos agentes bancarios.', icon: '📞' },
          { title: 'Especial Mundial 2026', sub: 'Evita estafas en la compra de boletos y hospedaje.', icon: '🎟️' },
          { title: 'Tiendas online falsas', sub: 'Cómo verificar el certificado SSL y la reputación.', icon: '🛍️' },
          { title: 'Robo de cuentas de WhatsApp', sub: 'Activa la verificación en dos pasos en tu teléfono.', icon: '📱' },
        ].map((m, idx) => (
          <div key={idx} className="widget-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer' }}>
            <span style={{ fontSize: '32px' }}>{m.icon}</span>
            <h4 style={{ fontSize: '16px' }}>{m.title}</h4>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>{m.sub}</p>
            <button className="btn-primary-web" style={{ marginTop: 'auto', padding: '8px' }}>Comenzar Módulo</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewReportWeb({ setActiveScreen }) {
  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '20px' }}>Detalles de la alerta</h3>
      
      <div>
        <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Tipo de amenaza</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['Mensaje / SMS', 'Correo Electrónico', 'Enlace / URL', 'Llamada / Otro'].map(t => (
            <button key={t} className="pill-btn" style={{ flex: 1, padding: '10px' }}>{t}</button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Título breve</label>
        <input className="web-input" placeholder="Ej. SMS falso sobre cuenta bloqueada en BBVA" />
      </div>

      <div>
        <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Origen (Teléfono, Dominio o Correo sender)</label>
        <input className="web-input" placeholder="Ej. +52 55 0000 0000 o soporte-falso.com" />
      </div>

      <div>
        <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Descripción detallada</label>
        <textarea className="web-input" style={{ height: '120px', resize: 'vertical' }} placeholder="Escribe exactamente lo que sucedió para prevenir a otros usuarios..."></textarea>
      </div>

      <button className="btn-primary-web" onClick={() => setActiveScreen('feed')}>Publicar Reporte</button>
    </div>
  );
}

function SettingsWeb() {
  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '18px' }}>Preferencias de Cuenta</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ padding: '16px', background: 'var(--figma-field-bg)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Notificaciones por correo</span>
          <input type="checkbox" defaultChecked />
        </div>
        <div style={{ padding: '16px', background: 'var(--figma-field-bg)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Autenticación de dos factores (2FA)</span>
          <button className="btn-primary-web" style={{ padding: '6px 12px', fontSize: '12px' }}>Configurar</button>
        </div>
      </div>
    </div>
  );
}

function ProfileWeb({ setIsLoggedIn, setActiveScreen }) {
  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="user-avatar" style={{ width: '80px', height: '80px', fontSize: '32px' }}>U</div>
        <div>
          <h2 style={{ fontSize: '24px' }}>Usuario Registrado</h2>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>Miembro desde Agosto 2026</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div className="widget-card" style={{ flex: 1, textAlign: 'center', background: 'var(--figma-field-bg)' }}>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--figma-dark-blue)' }}>3</span>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>Reportes Creados</p>
        </div>
        <div className="widget-card" style={{ flex: 1, textAlign: 'center', background: 'var(--figma-field-bg)' }}>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>15</span>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>Votos Útiles</p>
        </div>
      </div>

      <button style={{ background: 'var(--figma-light-red)', color: 'red', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', maxWidth: '200px' }} onClick={() => setIsLoggedIn(false)}>
        Cerrar Sesión
      </button>
    </div>
  );
}

function EditReportWeb({ setActiveScreen }) {
  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3>Editar Reporte</h3>
      <input className="web-input" defaultValue="Falso recibo de compra en tienda en línea" />
      <textarea className="web-input" style={{ height: '100px' }} defaultValue="Me llegó un SMS diciendo que mi paquete estaba retenido..."></textarea>
      <button className="btn-primary-web" onClick={() => setActiveScreen('profile')}>Guardar Cambios</button>
    </div>
  );
}