import { EstadoBadge, RiesgoBadge } from './Badges';
import { formatearFecha } from '../utils/formato';

export default function TablaReportes({ reportes, nombreEstado, nombreRiesgo, alSeleccionar }) {
  if (reportes.length === 0) {
    return <p className="tabla-vacia">No hay reportes que coincidan con los filtros.</p>;
  }

  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <thead>
          <tr>
            <th>Reporte</th>
            <th>Categorías</th>
            <th>Publicado</th>
            <th>Riesgo</th>
            <th>Estado</th>
            <th className="celda-numero" title="Personas a las que les pasó lo mismo">Me pasó</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((r) => (
            <tr key={r.id} className="fila-clic" onClick={() => alSeleccionar(r)}>
              <td>
                <div className="celda-titulo">{r.titulo}</div>
                <div className="texto-suave">{r.autor}</div>
              </td>
              <td>
                {r.categorias.map((c) => (
                  <span key={c} className="chip">{c}</span>
                ))}
              </td>
              <td className="texto-suave">{formatearFecha(r.fecha_pub)}</td>
              <td><RiesgoBadge nombre={nombreRiesgo[r.tieneRiesgo]} /></td>
              <td><EstadoBadge nombre={nombreEstado[r.tieneEstado]} /></td>
              <td className="celda-numero">{r.mePasoIgualCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
