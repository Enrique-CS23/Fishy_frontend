
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
  const [pagina, setPagina] = useState(1);

  const usuariosPorPagina = 10;

  // El estado solo cambia dentro de los callbacks de la promesa:
  // así no hay setState síncrono dentro del useEffect (regla react-hooks/set-state-in-effect).
  function cargar() {
    return Promise.all([api('/usuarios'), api('/usuarios/me')])
      .then(([lista, yo]) => {
        setMiId(yo.id);
        setUsuarios(lista.filter((u) => u.id !== yo.id));
        setPagina(1);
        setError('');
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    void cargar();
  }, []);

  function reintentar() {
    setCargando(true);
    setError('');
    void cargar();
  }

  const texto = busqueda.trim().toLowerCase();

  const filtrados = usuarios.filter((u) =>
    `${u.nombre} ${u.correo}`.toLowerCase().includes(texto),
  );

  const totalPaginas = Math.max(
    1,
    Math.ceil(filtrados.length / usuariosPorPagina),
  );

  const usuariosPagina = filtrados.slice(
    (pagina - 1) * usuariosPorPagina,
    pagina * usuariosPorPagina,
  );

  if (cargando) {
    return <p className="texto-suave">Cargando usuarios…</p>;
  }

  if (error) {
    return (
      <p className="login-error">
        {error}
        <button className="btn-link" onClick={reintentar}>
          Reintentar
        </button>
      </p>
    );
  }

  return (
    <>
      <div className="filtros">
        <label className="buscador">
          <Search size={16} />

          <input
            placeholder="Buscar por nombre o correo…"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
          />
        </label>
      </div>

      <div className="resultados">
        <span className="texto-suave">
          {filtrados.length} usuarios encontrados
        </span>

        {busqueda && (
          <button
            className="btn-link"
            onClick={() => {
              setBusqueda('');
              setPagina(1);
            }}
          >
            Limpiar búsqueda
          </button>
        )}
      </div>

      {filtrados.length === 0 ? (
        <p className="tabla-vacia">
          No hay usuarios que coincidan.
        </p>
      ) : (
        <>
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
                {usuariosPagina.map((u) => {
                  const soyYo = u.id === miId;

                  return (
                    <tr key={u.id}>
                      <td className="celda-titulo">
                        {u.nombre}{' '}
                        {soyYo && (
                          <span className="badge badge-aprobado">
                            Tú
                          </span>
                        )}
                      </td>

                      <td>{u.correo}</td>

                      <td className="texto-suave">
                        {formatearFecha(u.fecha_creado)}
                      </td>

                      <td>
                        <button
                          className="btn-icono"
                          title={
                            soyYo
                              ? 'No puedes eliminar tu propia cuenta'
                              : 'Eliminar usuario'
                          }
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

          <div className="paginacion">
            <span className="texto-suave">
              Página {pagina} de {totalPaginas}
            </span>

            <div className="paginacion-botones">
              <button
                className="btn-link"
                disabled={pagina === 1}
                onClick={() => setPagina((p) => p - 1)}
              >
                Anterior
              </button>

              <button
                className="btn-link"
                disabled={pagina >= totalPaginas}
                onClick={() => setPagina((p) => p + 1)}
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}

      {aEliminar && (
        <ConfirmarEliminar
          usuario={aEliminar}
          onCerrar={() => setAEliminar(null)}
          onEliminado={(id) => {
            setUsuarios((lista) =>
              lista.filter((x) => x.id !== id),
            );
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
    if (!eliminando) {
      onCerrar();
    }
  }

  async function confirmar() {
    setError('');
    setEliminando(true);

    try {
      await api(`/usuarios/${usuario.id}`, {
        metodo: 'DELETE',
      });

      setTimeout(() => onEliminado(usuario.id), 1200);
    } catch (e) {
      setError(e.message);
      setEliminando(false);
    }
  }

  return (
    <div className="modal-fondo">
      <button type="button" className="modal-fondo-cerrar" aria-label="Cerrar" tabIndex={-1} onClick={cerrar} />
      <div
        className="modal"
        style={{ maxWidth: 440 }}
        role="alertdialog"
        aria-labelledby="titulo-eliminar"
      >
        <div className="modal-encabezado">
          <h3 id="titulo-eliminar">Eliminar usuario</h3>

          <button
            className="btn-icono"
            onClick={cerrar}
            aria-label="Cerrar"
            disabled={eliminando}
          >
            <X size={16} />
          </button>
        </div>

        <p className="modal-nota">
          ¿Seguro que quieres eliminar a{' '}
          <strong>{usuario.nombre}</strong> ({usuario.correo})?
          No se revertirá la acción. Mantén presionado el botón
          para confirmar.
        </p>

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <div className="moderacion-botones">
          <button
            className="btn-primary-web"
            onClick={cerrar}
            disabled={eliminando}
          >
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