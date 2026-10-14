import { useEffect, useState } from 'react';
import { Fish } from 'lucide-react';
import BlobCursor from './BlobCursor';

const MS_INTRO = 4000; // cuánto dura la intro antes de hacer zoom sola
const MS_ZOOM = 900;   // debe coincidir con la duración del zoom en App.css

function sinAnimaciones() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function IntroLogin({ children }) {
  // 'intro' → 'zoom' → 'listo'
  const [fase, setFase] = useState(() => (sinAnimaciones() ? 'listo' : 'intro'));
  const [seMovio, setSeMovio] = useState(false);

  useEffect(() => {
    if (fase === 'listo') return;
    const espera = fase === 'intro' ? MS_INTRO : MS_ZOOM;
    const siguiente = fase === 'intro' ? 'zoom' : 'listo';
    const temporizador = setTimeout(() => setFase(siguiente), espera);
    return () => clearTimeout(temporizador);
  }, [fase]);

  function saltar() {
    if (fase === 'intro') setFase('zoom');
  }

  return (
    <>
      <div
        className={`login-escena ${fase === 'intro' ? '' : 'login-escena-visible'}`}
        inert={fase === 'intro' ? true : undefined}
      >
        {children}
      </div>

      {fase !== 'listo' && (
        <div
          className={`intro ${fase === 'zoom' ? 'intro-zoom' : ''}`}
          onClick={saltar}
          onMouseMove={() => setSeMovio(true)}
          onTouchMove={() => setSeMovio(true)}
        >
          <div className={`intro-blobs ${seMovio ? 'intro-blobs-visible' : ''}`}>
            <BlobCursor
              fillColor="#7cc4ec"
              innerColor="rgba(255, 255, 255, 0.8)"
              opacity={0.6}
            />
          </div>

          <div className="intro-contenido">
            <div className="intro-marca">
              <Fish size={56} color="#9cc7ef" />
              <span>Fishy</span>
            </div>
            <p className="intro-pista">Mueve el cursor · Haz clic para continuar</p>
          </div>
        </div>
      )}
    </>
  );
}