import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../api/client';
import HoldButton from './HoldButton';

export default function ConfirmarBorradoUsuario({ usuario, onCerrar, onEliminado }) {
  const [error, setError] = useState('');

  useEffect(() => {
    function alPresionarTecla(e) {
      if (e.key === 'Escape') onCerrar();
    }
    window.addEventListener('keydown', alPresionarTecla);
    return () => window.removeEventListener('keydown', alPresionarTecla);
  }, [onCerrar]);

  async function eliminar() {
    setError('');
    try {
      await api(`/usuarios/${usuario.id}`, { metodo: 'DELETE' });
      // Deja ver el "Eliminado" del botón antes de cerrar el modal
      setTimeout(onEliminado, 1200);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div
        className="modal modal-confirmar"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-encabezado">
          <div>
            <h3>Eliminar usuario</h3>
            <p className="texto-suave">{usuario.nombre} · {usuario.correo}</p>
          </div>
          <button className="btn-icono" title="Cerrar" onClick={onCerrar}>
            <X size={18} />
          </button>
        </header>

        <p className="confirmar-aviso">
          Esta acción es definitiva y no se puede deshacer. Sus reportes se conservan sin autor;
          sus &quot;me pasó igual&quot; y su progreso de lecturas se borran.
        </p>
        <p className="confirmar-aviso">Mantén presionado el botón para confirmar.</p>

        {error && <p className="login-error">{error}</p>}

        <div className="confirmar-accion">
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
            onHold={eliminar}
          >
            Mantén para eliminar
          </HoldButton>
        </div>
      </div>
    </div>
  );
}
