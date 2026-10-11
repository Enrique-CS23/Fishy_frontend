import { useState } from 'react';
import { Search } from 'lucide-react';
import { useReportes } from '../api/useReportes';
import TablaReportes from '../components/TablaReportes';
import { capitalizar } from '../utils/formato';

export default function Reportes() {
  const {
    reportes, estados, riesgos, categorias,
    nombreEstado, nombreRiesgo, cargando, error, recargar,
  } = useReportes();


  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroRiesgo, setFiltroRiesgo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  if (cargando) return <p className="texto-suave">Cargando reportes…</p>;
  if (error) {
    return (
      <p className="login-error">
        {error}
        <button className="btn-link" onClick={recargar}>Reintentar</button>
      </p>
    );
  }

  const texto = busqueda.trim().toLowerCase();
  const filtrados = reportes.filter((r) => {
    if (filtroEstado && r.tieneEstado !== filtroEstado) return false;
    if (filtroRiesgo === 'sin' && r.tieneRiesgo) return false;
    if (filtroRiesgo && filtroRiesgo !== 'sin' && r.tieneRiesgo !== filtroRiesgo) return false;
    if (filtroCategoria && !r.categorias.includes(filtroCategoria)) return false;
    if (texto) {

      const dondeBuscar = [
        r.titulo,
        r.autor,
        ...r.evidencias.map((e) => `${e.url} ${e.descripcion}`),
      ].join(' ').toLowerCase();
      if (!dondeBuscar.includes(texto)) return false;
    }
    return true;
  });

  const hayFiltros = busqueda || filtroEstado || filtroRiesgo || filtroCategoria;

  function limpiarFiltros() {
    setBusqueda('');
    setFiltroEstado('');
    setFiltroRiesgo('');
    setFiltroCategoria('');
  }

  return (
    <>
      <div className="filtros">
        <label className="buscador">
          <Search size={16} />
          <input
            placeholder="Buscar por título, autor, dominio o teléfono…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>

        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {estados.map((e) => (
            <option key={e.id} value={e.id}>{capitalizar(e.nombre)}</option>
          ))}
        </select>

        <select value={filtroRiesgo} onChange={(e) => setFiltroRiesgo(e.target.value)}>
          <option value="">Todos los riesgos</option>
          {riesgos.map((g) => (
            <option key={g.id} value={g.id}>{g.nombre}</option>
          ))}
          <option value="sin">Sin clasificar</option>
        </select>

        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.nombre}>{c.nombre}</option>
          ))}
        </select>
      </div>

      <div className="resultados">
        <span className="texto-suave">{filtrados.length} de {reportes.length} reportes</span>
        {hayFiltros && (
          <button className="btn-link" onClick={limpiarFiltros}>Limpiar filtros</button>
        )}
      </div>

      <TablaReportes
        reportes={filtrados}
        nombreEstado={nombreEstado}
        nombreRiesgo={nombreRiesgo}
      />
    </>
  );
}
