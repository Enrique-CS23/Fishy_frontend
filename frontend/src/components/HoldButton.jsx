import { useEffect, useRef, useState } from 'react';
import './HoldButton.css';

const TAMANOS = {
  sm: { alto: 40, relleno: 18, fuente: 14 },
  md: { alto: 48, relleno: 24, fuente: 16 },
  lg: { alto: 56, relleno: 30, fuente: 18 },
};

const PASOS = 12;

// Forma del relleno (clip-path). Con `amplitud` > 0 el borde que avanza es una onda.
function recorte(progreso, direccion, amplitud, tiempo) {
  if (progreso <= 0) return 'polygon(0 0, 0 0, 0 0)';
  if (progreso >= 1) return 'inset(0)';

  const avance = progreso * 100;
  const fuerza = amplitud * Math.min(1, progreso * 6, (1 - progreso) * 6);
  const borde = [];

  for (let i = 0; i <= PASOS; i++) {
    const c = (i / PASOS) * 100;
    const onda = (fuerza * Math.sin(i * 0.9 + tiempo / 180)).toFixed(2);

    if (direccion === 'left') borde.push(`calc(${100 - avance}% + ${onda}px) ${c}%`);
    else if (direccion === 'down') borde.push(`${c}% calc(${avance}% + ${onda}px)`);
    else if (direccion === 'up') borde.push(`${c}% calc(${100 - avance}% + ${onda}px)`);
    else borde.push(`calc(${avance}% + ${onda}px) ${c}%`);
  }

  const esquinas = {
    right: ['0 0', '0 100%'],
    left: ['100% 0', '100% 100%'],
    down: ['0 0', '100% 0'],
    up: ['0 100%', '100% 100%'],
  };
  const [inicio, fin] = esquinas[direccion] ?? esquinas.right;
  return `polygon(${[inicio, ...borde, fin].join(', ')})`;
}

// Muestra los dos textos apilados para que el botón no cambie de ancho al terminar.
function Etiqueta({ terminado, normal, listo }) {
  return (
    <span className="hold-btn-texto">
      <span className={terminado ? 'hold-btn-oculto' : undefined}>{normal}</span>
      <span className={terminado ? undefined : 'hold-btn-oculto'}>{listo}</span>
    </span>
  );
}

export default function HoldButton({
  children = 'Mantén para confirmar',
  doneLabel = 'Listo',
  backgroundColor = '#2e2e32',
  fillColor = '#ef4444',
  textColor = '#f5f5f5',
  fillTextColor = '#ffffff',
  size = 'md',
  radius = 12,
  fillDirection = 'right',
  holdTime = 2000,
  releaseTime = 220,
  pressScale = 0.97,
  wave = false,
  waveAmplitude = 6,
  glow = false,
  resetAfter = 1200,
  disabled = false,
  onHold,
}) {
  const [fase, setFase] = useState('idle'); // 'idle' | 'holding' | 'done'
  const relleno = useRef(null);
  const motor = useRef(null);
  const progreso = useRef(0);
  const modo = useRef('idle'); // 'idle' | 'holding' | 'releasing' | 'done'
  const alMantener = useRef(onHold);

  useEffect(() => {
    alMantener.current = onHold;
  }, [onHold]);

  useEffect(() => {
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const amplitud = wave && !sinMovimiento ? waveAmplitude : 0;
    let cuadro = 0;
    let temporizador = 0;
    let ultimo = 0;

    function pintar(tiempo) {
      if (relleno.current) {
        relleno.current.style.clipPath = recorte(progreso.current, fillDirection, amplitud, tiempo);
      }
    }

    function bucle(tiempo) {
      // Limitar dt evita saltos si la pestaña estuvo en segundo plano
      const dt = Math.min(tiempo - ultimo, 50);
      ultimo = tiempo;

      if (modo.current === 'holding') {
        progreso.current = Math.min(1, progreso.current + dt / holdTime);
        if (progreso.current >= 1) {
          modo.current = 'done';
          pintar(tiempo);
          setFase('done');
          alMantener.current?.();
          temporizador = setTimeout(reiniciar, resetAfter);
          return;
        }
      } else if (modo.current === 'releasing') {
        progreso.current = Math.max(0, progreso.current - dt / releaseTime);
        if (progreso.current === 0) {
          modo.current = 'idle';
          pintar(tiempo);
          return;
        }
      } else {
        return;
      }

      pintar(tiempo);
      cuadro = requestAnimationFrame(bucle);
    }

    function arrancar(nuevoModo) {
      if (modo.current === 'done') return;
      modo.current = nuevoModo;
      setFase(nuevoModo === 'holding' ? 'holding' : 'idle');
      ultimo = performance.now();
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(bucle);
    }

    function reiniciar() {
      modo.current = 'releasing';
      setFase('idle');
      ultimo = performance.now();
      cuadro = requestAnimationFrame(bucle);
    }

    motor.current = {
      presionar: () => arrancar('holding'),
      soltar: () => {
        if (modo.current === 'holding') arrancar('releasing');
      },
    };

    return () => {
      cancelAnimationFrame(cuadro);
      clearTimeout(temporizador);
    };
  }, [holdTime, releaseTime, resetAfter, fillDirection, wave, waveAmplitude]);

  const medidas = TAMANOS[size] ?? TAMANOS.md;
  const terminado = fase === 'done';
  const clases = [
    'hold-btn',
    fase === 'holding' ? 'hold-btn-presionado' : '',
    terminado ? 'hold-btn-listo' : '',
    glow ? 'hold-btn-brillo' : '',
  ].join(' ');

  const estilo = {
    '--hold-bg': backgroundColor,
    '--hold-fill': fillColor,
    '--hold-text': textColor,
    '--hold-fill-text': fillTextColor,
    '--hold-radius': `${radius}px`,
    '--hold-scale': pressScale,
    '--hold-alto': `${medidas.alto}px`,
    '--hold-relleno': `${medidas.relleno}px`,
    '--hold-fuente': `${medidas.fuente}px`,
  };

  return (
    <button
      type="button"
      className={clases}
      style={estilo}
      disabled={disabled}
      onPointerDown={(e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        motor.current?.presionar();
      }}
      onPointerUp={() => motor.current?.soltar()}
      onPointerCancel={() => motor.current?.soltar()}
      onKeyDown={(e) => {
        if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
          e.preventDefault();
          motor.current?.presionar();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === ' ' || e.key === 'Enter') motor.current?.soltar();
      }}
      onBlur={() => motor.current?.soltar()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="hold-btn-capa">
        <Etiqueta terminado={terminado} normal={children} listo={doneLabel} />
      </span>
      <span ref={relleno} className="hold-btn-capa hold-btn-relleno" aria-hidden="true">
        <Etiqueta terminado={terminado} normal={children} listo={doneLabel} />
      </span>
    </button>
  );
}
