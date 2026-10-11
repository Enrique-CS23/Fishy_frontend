import { useEffect, useState } from 'react';
import { api } from './client';

export function useReportes() {
  const [reportes, setReportes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [riesgos, setRiesgos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
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

  const nombreEstado = Object.fromEntries(estados.map((e) => [e.id, e.nombre]));
  const nombreRiesgo = Object.fromEntries(riesgos.map((r) => [r.id, r.nombre]));

  return {
    reportes, estados, riesgos, categorias,
    nombreEstado, nombreRiesgo,
    cargando, error, recargar,
  };
}