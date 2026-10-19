import { Link } from 'react-router-dom';
import { ArrowRight, Inbox } from 'lucide-react';
import { useReportes } from '../api/useReportes';
import { EstadoBadge } from '../components/Badges';
import { formatearFecha } from '../utils/formato';
import { reportesPorCategoria, reportesPorDia, reportesPorRiesgo } from '../utils/estadisticas';
import { GraficaPorCategoria, GraficaPorDia, GraficaPorRiesgo } from '../components/Graficas';

export default function Panel() {
  const {
    reportes, riesgos, categorias, nombreEstado, nombreRiesgo, cargando, error, recargar,
  } = useReportes();

  if (cargando) return <p className="texto-suave">Cargando reportes…</p>;
  if (error) {
    return (
      <p className="login-error">
        {error}
        <button className="btn-link" onClick={recargar}>Reintentar</button>
      </p>
    );
  }

  const contarEstado = (nombre) =>
    reportes.filter((r) => nombreEstado[r.tieneEstado] === nombre).length;
  const altoRiesgo = reportes.filter((r) => nombreRiesgo[r.tieneRiesgo] === 'Alto').length;
  const recientes = reportes.slice(0, 5);
  const pendientes = contarEstado('pendiente');

  return (
    <>
      {pendientes > 0 && (
        <div className="aviso-pendientes">
          <Inbox size={18} />
          <span>
            <strong>{pendientes}</strong> {pendientes === 1 ? 'reporte espera' : 'reportes esperan'} moderación
          </span>
          <Link to="/por-revisar" className="aviso-link">
            Revisar ahora <ArrowRight size={16} />
          </Link>
        </div>
      )}

      <div className="kpis">
        <Kpi titulo="Reportes totales" valor={reportes.length} />
        <Kpi titulo="Por revisar" valor={pendientes} tono="pendiente" />
        <Kpi titulo="Aprobados" valor={contarEstado('aprobado')} tono="aprobado" />
        <Kpi titulo="Rechazados" valor={contarEstado('rechazado')} tono="rechazado" />
        <Kpi titulo="Alto riesgo" valor={altoRiesgo} tono="alto" />
      </div>

      <div className="panel-grid">
        <div className="panel-columna">
          <section className="tarjeta">
            <h3 className="tarjeta-titulo">Reportes recibidos por día</h3>
            <p className="tarjeta-nota">Últimos 14 días</p>
            <GraficaPorDia datos={reportesPorDia(reportes)} />
          </section>

          <section className="tarjeta">
            <h3 className="tarjeta-titulo">Reportes recientes</h3>
            {recientes.length === 0 ? (
              <p className="texto-suave">Todavía no hay reportes.</p>
            ) : (
              <ul className="lista-recientes">
                {recientes.map((r) => (
                  <li key={r.id}>
                    <div>
                      <div className="reciente-titulo">{r.titulo}</div>
                      <div className="texto-suave">{r.autor} · {formatearFecha(r.fecha_pub)}</div>
                    </div>
                    <EstadoBadge nombre={nombreEstado[r.tieneEstado]} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="panel-columna">
          <section className="tarjeta">
            <h3 className="tarjeta-titulo">Por categoría</h3>
            <GraficaPorCategoria datos={reportesPorCategoria(reportes, categorias)} />
          </section>
          <section className="tarjeta">
            <h3 className="tarjeta-titulo">Por nivel de riesgo</h3>
            <GraficaPorRiesgo datos={reportesPorRiesgo(reportes, riesgos)} />
          </section>
        </div>
      </div>
    </>
  );
}

function Kpi({ titulo, valor, tono = 'neutro' }) {
  return (
    <div className={`kpi kpi-${tono}`}>
      <span className="kpi-titulo">{titulo}</span>
      <span className="kpi-valor">{valor}</span>
    </div>
  );
}