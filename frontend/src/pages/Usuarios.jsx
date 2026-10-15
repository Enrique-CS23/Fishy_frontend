import { useEffect, useState } from 'react';
import { Search, Trash2, X } from 'lucide-react';
import { api } from '../api/client';
import { formatearFecha } from '../utils/formato';
import HoldButton from '../components/HoldButton';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [miId, setMiId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [aEliminar, setAEliminar] = useState(null);

  async function cargar() {
    setCargando(true);
    setError('');
    try {
      const [lista, yo] = await Promise.all([api('/usuarios'), api('/usuarios/me')]);
      setUsuarios(lista);
      setMiId(yo.id);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  if (cargando) return <p className="texto-suave">Cargando usuarios…</p>;
  if (error) {
    return (
      <p className="login-error">
        {error}
        <button className="btn-link" onClick={cargar}>Reintentar</button>
      </p>
    );
  }

  const texto = busqueda.trim().toLowerCase();
  const filtrados = usuarios.filter((u) =>
    !texto || `${u.nombre} ${u.correo}`.toLowerCase().includes(texto),
  );

  return (
    <>
      <div className="filtros">
        <label className="buscador">
          <Search size={16} />
          <input
            placeholder="Buscar por nombre o correo…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>
      </div>

      <div className="resultados">
        <span className="texto-suave">
          {filtrados.length} de {usuarios.length} usuarios
        </span>
        {busqueda && (
          <button className="btn-link" onClick={() => setBusqueda('')}>Limpiar búsqueda</button>
        )}
      </div>

      {filtrados.length === 0 ? (
        <p className="tabla-vacia">No hay usuarios que coincidan.</p>
      ) : (
        <div className="tabla-contenedor">
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Registro</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u) => {
                const soyYo = u.id === miId;
                return (
                  <tr key={u.id}>
                    <td className="celda-titulo">
                      {u.nombre} {soyYo && <span className="badge badge-aprobado">Tú</span>}
                    </td>
                    <td>{u.correo}</td>
                    <td className="texto-suave">{formatearFecha(u.fecha_creado)}</td>
                    <td>
                      <button
                        className="btn-icono"
                        title={soyYo ? 'No puedes eliminar tu propia cuenta' : 'Eliminar usuario'}
                        aria-label={`Eliminar a ${u.correo}`}
                        disabled={soyYo}
                        onClick={() => setAEliminar(u)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {aEliminar && (
        <ConfirmarEliminar
          usuario={aEliminar}
          onCerrar={() => setAEliminar(null)}
          onEliminado={(id) => {
            setUsuarios((lista) => lista.filter((x) => x.id !== id));
            setAEliminar(null);
          }}
        />
      )}
    </>
  );
}

function ConfirmarEliminar({ usuario, onCerrar, onEliminado }) {
  const [error, setError] = useState('');
  const [eliminando, setEliminando] = useState(false);

  function cerrar() {
    if (!eliminando) onCerrar();
  }

  async function confirmar() {
    setError('');
    setEliminando(true);
    try {
      await api(`/usuarios/${usuario.id}`, { metodo: 'DELETE' });
      setTimeout(() => onEliminado(usuario.id), 1200);
    } catch (e) {
      setError(e.message);
      setEliminando(false);
    }
  }

  return (
    <div className="modal-fondo" onClick={cerrar}>
      <div
        className="modal"
        style={{ maxWidth: 440 }}
        role="alertdialog"
        aria-labelledby="titulo-eliminar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-encabezado">
          <h3 id="titulo-eliminar">Eliminar usuario</h3>
          <button className="btn-icono" onClick={cerrar} aria-label="Cerrar" disabled={eliminando}>
            <X size={16} />
          </button>
        </div>

        <p className="modal-nota">
          ¿Seguro que quieres eliminar a <strong>{usuario.nombre}</strong> ({usuario.correo})?
          No se revertirá la acción. Mantén presionado el botón para confirmar.
        </p>

        {error && <p className="login-error" role="alert">{error}</p>}

        <div className="moderacion-botones">
          <button className="btn-primary-web" onClick={cerrar} disabled={eliminando}>
            Cancelar
          </button>
                    <HoldButton
            doneLabel="Eliminado"
            backgroundColor="#2e2e32"
            fillColor="#EF4444"
            textColor="#f5f5f5"
            fillTextColor="#ffffff"
            size="sm"
            radius={12}
            fillDirection="right"
            holdTime={2000}
            releaseTime={220}
            pressScale={0.97}
            wave
            waveAmplitude={7}
            glow
            resetAfter={1200}
            onHold={confirmar}
          >
            Mantén para eliminar
          </HoldButton>
        </div>
      </div>
    </div>
  );
}