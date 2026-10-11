export function formatearFecha(iso) {
  return new Date(iso).toLocaleString('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}


export function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
