import { useEffect, useState } from 'react';
import { api } from './client';

// Hook propio: carga lo que necesitan las páginas de reportes.
// Lo usan Panel, Reportes y Por revisar, así no repetimos este código 3 veces.
export function useReportes() {
  const [reportes, setReportes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [riesgos, setRiesgos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0); // cambiarla = volver a cargar

  useEffect(() => {
    // 4 peticiones al mismo tiempo; esperamos a que lleguen todas
    Promise.all([api('/reportes'), api('/estados'), api('/riesgos'), api('/categorias')])
      .then(([listaReportes, listaEstados, listaRiesgos, listaCategorias]) => {
        setReportes(listaReportes);
        setEstados(listaEstados);
        setRiesgos(listaRiesgos);
        setCategorias(listaCategorias);
        setError('');
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [version]);

  function recargar() {
    setCargando(true);
    setVersion((v) => v + 1);
  }

  // El backend manda estado y riesgo como ID (UUID). Estos "diccionarios"
  // traducen id -> nombre:  nombreEstado['db3f...'] === 'pendiente'
  const nombreEstado = Object.fromEntries(estados.map((e) => [e.id, e.nombre]));
  const nombreRiesgo = Object.fromEntries(riesgos.map((r) => [r.id, r.nombre]));

  return {
    reportes, estados, riesgos, categorias,
    nombreEstado, nombreRiesgo,
    cargando, error, recargar,
  };
}