import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { api } from '../api/client';

export default function Lecturas() {
  const [lecturas, setLecturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [abierto, setAbierto] = useState(false);

  // El estado solo cambia dentro de los callbacks de la promesa:
  // así no hay setState síncrono dentro del useEffect (regla react-hooks/set-state-in-effect).
  function cargar() {
    return api('/lecturas')
      .then((datos) => {
        setLecturas([...datos].sort((a, b) => a.orden - b.orden));
        setError('');
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }

  useEffect(() => { void cargar(); }, []);

  function recargar() {
    setCargando(true);
    setError('');
    void cargar();
  }

  const siguienteOrden = lecturas.length ? Math.max(...lecturas.map((l) => l.orden)) + 1 : 1;

  return (
    <>
      <div className="resultados" style={{ justifyContent: 'space-between' }}>
        <span className="texto-suave">{lecturas.length} lecturas</span>
        <button
          className="btn-primary-web"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={() => setAbierto(true)}
        >
          <Plus size={16} /> Nueva lectura
        </button>
      </div>

      {cargando && <p className="texto-suave">Cargando lecturas…</p>}
      {error && (
        <p className="login-error">
          {error}
          <button className="btn-link" onClick={recargar}>Reintentar</button>
        </p>
      )}

      {!cargando && !error && (lecturas.length === 0 ? (
        <p className="tabla-vacia">Todavía no hay lecturas.</p>
      ) : (
        <div className="tabla-contenedor">
          <table className="tabla">
            <thead>
              <tr><th>Orden</th><th>Título</th><th>Contenido</th></tr>
            </thead>
            <tbody>
              {lecturas.map((l) => (
                <tr key={l.id}>
                  <td className="celda-numero">{l.orden}</td>
                  <td className="celda-titulo">{l.titulo}</td>
                  <td className="texto-suave">
                    {l.contenido.length > 100 ? l.contenido.slice(0, 100) + '…' : l.contenido}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {abierto && (
        <NuevaLecturaModal
          siguienteOrden={siguienteOrden}
          onCerrar={() => setAbierto(false)}
          onCreada={() => { setAbierto(false); recargar(); }}
        />
      )}
    </>
  );
}

function NuevaLecturaModal({ siguienteOrden, onCerrar, onCreada }) {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [orden, setOrden] = useState(siguienteOrden);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function guardar(evento) {
    evento.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await api('/lecturas', {
        metodo: 'POST',
        datos: {
          titulo: titulo.trim(),
          contenido: contenido.trim(),
          orden: Number(orden),
        },
      });
      onCreada();
    } catch (e) {
      setError(e.message);
      setEnviando(false);
    }
  }

  return (
    <div className="modal-fondo">
      <button type="button" className="modal-fondo-cerrar" aria-label="Cerrar" tabIndex={-1} onClick={onCerrar} />
      <form className="modal" onSubmit={guardar}>
        <div className="modal-encabezado">
          <h3>Nueva lectura</h3>
          <button type="button" className="btn-icono" onClick={onCerrar} aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>

        <p className="modal-subtitulo">Título</p>
        <input
          className="web-input"
          maxLength={255}
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej. El engaño telefónico"
        />

        <p className="modal-subtitulo">Contenido</p>
        <textarea
          className="web-input"
          style={{ height: 200, resize: 'vertical' }}
          required
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        />

        <p className="modal-subtitulo">Orden (debe ser único)</p>
        <input
          className="web-input"
          type="number"
          min={1}
          step={1}
          required
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
        />

        {error && <p className="login-error" role="alert">{error}</p>}

        <div className="moderacion-botones">
          <button type="button" className="btn-rechazar" onClick={onCerrar}>Cancelar</button>
          <button type="submit" className="btn-primary-web" disabled={enviando}>
            {enviando ? 'Guardando…' : 'Guardar lectura'}
          </button>
        </div>
      </form>
    </div>
  );
}