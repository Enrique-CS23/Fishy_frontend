import { useEffect, useState } from 'react';
import { MessageSquare, Users, X } from 'lucide-react';
import { api, API } from '../api/client';
import { EstadoBadge, RiesgoBadge } from './Badges';
import { desactivarUrl, formatearFecha } from '../utils/formato';

const ORDEN_RIESGO = ['Bajo', 'Medio', 'Alto'];

export default function DetalleReporte({
  reporte, estados, riesgos, nombreEstado, nombreRiesgo, onCerrar, onModerado,
}) {
  const [riesgoElegido, setRiesgoElegido] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [comentarios, setComentarios] = useState([]);
  const [cargandoComentarios, setCargandoComentarios] = useState(true);
  const [errorComentarios, setErrorComentarios] = useState('');

  // Comentarios del reporte. El estado solo cambia dentro de los callbacks de la promesa
  // (regla react-hooks/set-state-in-effect).
  useEffect(() => {
    api(`/reportes/${reporte.id}/comentarios`)
      .then((lista) => setComentarios(lista))
      .catch((e) => setErrorComentarios(e.message))
      .finally(() => setCargandoComentarios(false));
  }, [reporte.id]);

  useEffect(() => {
    function alPresionarTecla(e) {
      if (e.key === 'Escape') onCerrar();
    }
    window.addEventListener('keydown', alPresionarTecla);
    return () => window.removeEventListener('keydown', alPresionarTecla);
  }, [onCerrar]);

  const estadoActual = nombreEstado[reporte.tieneEstado];
  const esPendiente = estadoActual === 'pendiente';
  const riesgosOrdenados = [...riesgos].sort(
    (a, b) => ORDEN_RIESGO.indexOf(a.nombre) - ORDEN_RIESGO.indexOf(b.nombre),
  );

  async function moderar(nombreNuevoEstado) {
    if (!riesgoElegido) {
      setError('Elige un nivel de riesgo antes de decidir.');
      return;
    }
    const nuevoEstado = estados.find((e) => e.nombre === nombreNuevoEstado);
    setEnviando(true);
    setError('');
    try {
      await api(`/reportes/${reporte.id}/moderar`, {
        metodo: 'PATCH',
        datos: { tieneEstado: nuevoEstado.id, tieneRiesgo: riesgoElegido },
      });
      onModerado();
    } catch (e) {
      setError(e.message);
      setEnviando(false);
    }
  }

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <dialog
        className="modal"
        open
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-encabezado">
          <div>
            <h3>{reporte.titulo}</h3>
            <p className="texto-suave">
              {reporte.autor} · {formatearFecha(reporte.fecha_pub)} · a {reporte.mePasoIgualCount} personas les pasó igual
            </p>
          </div>
          <button className="btn-icono" title="Cerrar" onClick={onCerrar}>
            <X size={18} />
          </button>
        </header>

        <div className="modal-etiquetas">
          <EstadoBadge nombre={estadoActual} />
          <RiesgoBadge nombre={nombreRiesgo[reporte.tieneRiesgo]} />
          {reporte.categorias.map((c) => (
            <span key={c} className="chip">{c}</span>
          ))}
        </div>

        <h4 className="modal-subtitulo">Evidencias</h4>
        {reporte.evidencias.length === 0 && (
          <p className="texto-suave">Este reporte no tiene evidencias.</p>
        )}
        {reporte.evidencias.map((ev) => (
          <div key={ev.id} className="evidencia">
            <code className="evidencia-url">{desactivarUrl(ev.url)}</code>
            <p>{ev.descripcion}</p>
            {ev.foto !== '/uploads/' && (
              <img src={API + ev.foto} alt="Captura enviada por el usuario" className="evidencia-foto" />
            )}
          </div>
        ))}

        <div className="interaccion">
          <span className="interaccion-dato">
            <Users size={16} />
            <strong>{reporte.mePasoIgualCount}</strong> les pasó igual
          </span>
          <span className="interaccion-dato">
            <MessageSquare size={16} />
            <strong>{cargandoComentarios ? (reporte.comentariosCount ?? '…') : comentarios.length}</strong> comentarios
          </span>
        </div>

        <h4 className="modal-subtitulo">Comentarios</h4>
        {cargandoComentarios && <p className="texto-suave">Cargando comentarios…</p>}
        {errorComentarios && <p className="login-error">{errorComentarios}</p>}
        {!cargandoComentarios && !errorComentarios && comentarios.length === 0 && (
          <p className="texto-suave">Este reporte todavía no tiene comentarios.</p>
        )}
        {comentarios.length > 0 && (
          <ul className="comentarios">
            {comentarios.map((c) => (
              <li key={c.id} className="comentario">
                <div className="comentario-meta">
                  <strong>{c.autor}</strong>
                  <span className="texto-suave">{formatearFecha(c.fecha_creado)}</span>
                </div>
                <p>{c.contenido}</p>
              </li>
            ))}
          </ul>
        )}

        {esPendiente ? (
          <section className="moderacion">
            <h4 className="modal-subtitulo">Nivel de riesgo</h4>
            <div className="riesgo-opciones">
              {riesgosOrdenados.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={`riesgo-opcion riesgo-${g.nombre.toLowerCase()} ${riesgoElegido === g.id ? 'elegido' : ''}`}
                  onClick={() => {
                    setRiesgoElegido(g.id);
                    setError('');
                  }}
                >
                  {g.nombre}
                </button>
              ))}
            </div>

            {error && <p className="login-error">{error}</p>}

            <div className="moderacion-botones">
              <button className="btn-rechazar" disabled={enviando} onClick={() => moderar('rechazado')}>
                Rechazar
              </button>
              <button className="btn-primary-web" disabled={enviando} onClick={() => moderar('aprobado')}>
                {enviando ? 'Guardando…' : 'Aprobar y publicar'}
              </button>
            </div>
          </section>
        ) : (
          <p className="texto-suave modal-nota">
            Este reporte ya fue moderado. El backend no permite cambiar la decisión.
          </p>
        )}
      </dialog>
    </div>
  );
}
