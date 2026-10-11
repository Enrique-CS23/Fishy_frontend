import { useState } from 'react';
import { useReportes } from '../api/useReportes';
import TablaReportes from '../components/TablaReportes';
import DetalleReporte from '../components/DetalleReporte';

export default function PorRevisar() {
  const {
    reportes, estados, riesgos, nombreEstado, nombreRiesgo, cargando, error, recargar,
  } = useReportes();
  const [seleccionado, setSeleccionado] = useState(null);

  if (cargando) return <p className="texto-suave">Cargando reportes…</p>;
  if (error) {
    return (
      <p className="login-error">
        {error}
        <button className="btn-link" onClick={recargar}>Reintentar</button>
      </p>
    );
  }

  const pendientes = reportes
    .filter((r) => nombreEstado[r.tieneEstado] === 'pendiente')
    .sort((a, b) => b.mePasoIgualCount - a.mePasoIgualCount);

  return (
    <>
      <p className="texto-suave cola-resumen">
        {pendientes.length} reportes esperan revisión. Primero los que más usuarios confirmaron.
      </p>

      {pendientes.length === 0 ? (
        <p className="tabla-vacia">Todo al día: no hay reportes pendientes.</p>
      ) : (
        <TablaReportes
          reportes={pendientes}
          nombreEstado={nombreEstado}
          nombreRiesgo={nombreRiesgo}
          alSeleccionar={setSeleccionado}
        />
      )}

      {seleccionado && (
        <DetalleReporte
          reporte={seleccionado}
          estados={estados}
          riesgos={riesgos}
          nombreEstado={nombreEstado}
          nombreRiesgo={nombreRiesgo}
          onCerrar={() => setSeleccionado(null)}
          onModerado={() => {
            setSeleccionado(null);
            recargar();
          }}
        />
      )}
    </>
  );
}
