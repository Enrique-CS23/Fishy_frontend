const ETIQUETA_ESTADO = { pendiente: 'Pendiente', aprobado: 'Aprobado', rechazado: 'Rechazado' };

export function EstadoBadge({ nombre }) {
  return <span className={`badge badge-${nombre}`}>{ETIQUETA_ESTADO[nombre] ?? nombre}</span>;
}

export function RiesgoBadge({ nombre }) {
  if (!nombre) return <span className="badge badge-sin-riesgo">Sin clasificar</span>;
  return <span className={`badge badge-${nombre.toLowerCase()}`}>{nombre}</span>;
}