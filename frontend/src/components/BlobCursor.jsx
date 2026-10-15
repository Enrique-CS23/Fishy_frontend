import { useEffect, useRef } from 'react';
import './BlobCursor.css';

const TAMANOS = [60, 125, 75];
const TAMANOS_INTERNOS = [20, 35, 25];
// 0 a 1: mientras más alto, más rápido alcanza al cursor
const VELOCIDADES = [0.3, 0.1, 0.18];

export default function BlobCursor({
  fillColor = '#7cc4ec',
  innerColor = 'rgba(255, 255, 255, 0.8)',
  opacity = 0.6,
  sizes = TAMANOS,
  innerSizes = TAMANOS_INTERNOS,
  speeds = VELOCIDADES,
  blur = 12,
}) {
  const contenedor = useRef(null);
  const manchas = useRef([]);
  const puntos = useRef([]);

  useEffect(() => {
    const el = contenedor.current;
    const objetivo = { x: 0, y: 0, activo: false };
    const posiciones = sizes.map(() => ({ x: 0, y: 0 }));

    function mover(clientX, clientY) {
      const caja = el.getBoundingClientRect();
      objetivo.x = clientX - caja.left;
      objetivo.y = clientY - caja.top;

      if (!objetivo.activo) {
        // Primer movimiento: las manchas aparecen justo donde está el cursor
        objetivo.activo = true;
        posiciones.forEach((p) => {
          p.x = objetivo.x;
          p.y = objetivo.y;
        });
        el.classList.add('blob-cursor-activo');
      }
    }

    const alMoverMouse = (e) => mover(e.clientX, e.clientY);
    const alTocar = (e) => {
      const toque = e.touches[0];
      if (toque) mover(toque.clientX, toque.clientY);
    };

    window.addEventListener('mousemove', alMoverMouse);
    window.addEventListener('touchmove', alTocar, { passive: true });

    let cuadro;
    function animar() {
      if (objetivo.activo) {
        posiciones.forEach((p, i) => {
          p.x += (objetivo.x - p.x) * speeds[i];
          p.y += (objetivo.y - p.y) * speeds[i];

          manchas.current[i].style.transform =
            `translate3d(${p.x - sizes[i] / 2}px, ${p.y - sizes[i] / 2}px, 0)`;
          puntos.current[i].style.transform =
            `translate3d(${p.x - innerSizes[i] / 2}px, ${p.y - innerSizes[i] / 2}px, 0)`;
        });
      }
      cuadro = requestAnimationFrame(animar);
    }
    cuadro = requestAnimationFrame(animar);

    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener('mousemove', alMoverMouse);
      window.removeEventListener('touchmove', alTocar);
    };
  }, [sizes, innerSizes, speeds]);

  return (
    <div ref={contenedor} className="blob-cursor" aria-hidden="true">
      <svg className="blob-cursor-svg" width="0" height="0">
        <defs>
          <filter id="blob-cursor-goo" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="desenfoque" />
            <feColorMatrix
              in="desenfoque"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            />
          </filter>
        </defs>
      </svg>

      <div className="blob-cursor-fundido" style={{ opacity }}>
        {sizes.map((tam, i) => (
          <div
            key={i}
            ref={(nodo) => { manchas.current[i] = nodo; }}
            className="blob-cursor-mancha"
            style={{ width: tam, height: tam, background: fillColor }}
          />
        ))}
      </div>

      {innerSizes.map((tam, hola) => (
        <div
          key={hola}
          ref={(nodo) => { puntos.current[hola] = nodo; }}
          className="blob-cursor-punto"
          style={{ width: tam, height: tam, background: innerColor }}
        />
      ))}
    </div>
  );
}