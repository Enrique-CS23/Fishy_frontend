import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Fish, Inbox, LayoutDashboard, LogOut, Table2, BookOpen} from 'lucide-react';
import { api, cerrarSesion } from '../api/client';

const SECCIONES = [
  { ruta: '/', nombre: 'Panel', titulo: 'Resumen de reportes', Icono: LayoutDashboard },
  { ruta: '/por-revisar', nombre: 'Por revisar', titulo: 'Reportes pendientes de moderación', Icono: Inbox },
  { ruta: '/reportes', nombre: 'Reportes', titulo: 'Todos los reportes', Icono: Table2 },
  { ruta: '/lecturas', nombre: 'Lecturas', titulo: 'Lecturas', Icono: BookOpen},
];

export default function Layout() {
  const [perfil, setPerfil] = useState(null);
  const { pathname } = useLocation();
  const seccionActual = SECCIONES.find((s) => s.ruta === pathname) ?? SECCIONES[0];

  useEffect(() => {
    api('/auth/me')
      .then((datos) => {
        if (datos.rol !== 'admin') cerrarSesion();
        else setPerfil(datos);
      })
      .catch((e) => console.log('No se pudo cargar el perfil:', e.message));
  }, []);

  return (
    <div className="web-app-container">
      <aside className="sidebar">
        <div>
          <div className="brand-header">
            <Fish size={26} color="#9cc7ef" />
            <span className="brand-nombre">Fishy</span>
          </div>

          <nav className="nav-menu">
            {SECCIONES.map(({ ruta, nombre, Icono }) => (
              <NavLink key={ruta} to={ruta} end className="nav-item">
                <Icono size={18} />
                {nombre}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-user">
          <div className="user-info">
            <div className="user-avatar">{perfil ? perfil.correo[0].toUpperCase() : '·'}</div>
            <div className="user-datos">
              <div className="user-correo">{perfil ? perfil.correo : 'Cargando…'}</div>
              <div style={{ fontSize: '11px', color: '#a0aec0' }}>Administrador</div>
            </div>
          </div>
          <button className="btn-salir" title="Cerrar sesión" onClick={cerrarSesion}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="main-wrapper">
        <header className="top-bar">
          <h2 className="page-title">{seccionActual.titulo}</h2>
        </header>
        <div className="content-body">
          <div className="content-max-width">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}