function mismoDia(fechaA, fechaB) {
  return (
    fechaA.getFullYear() === fechaB.getFullYear() &&
    fechaA.getMonth() === fechaB.getMonth() &&
    fechaA.getDate() === fechaB.getDate()
  );
}

export function reportesPorDia(reportes) {
  const filas = [];
  const hoy = new Date();

  for (let i = 13; i >= 0; i--) {
    const dia = new Date();
    dia.setDate(hoy.getDate() - i);

    let total = 0;
    for (const reporte of reportes) {
      const fechaReporte = new Date(reporte.fecha_pub);
      if (mismoDia(fechaReporte, dia)) {
        total = total + 1;
      }
    }

    filas.push({
      dia: dia.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }),
      total: total,
    });
  }

  return filas;
}

export function reportesPorCategoria(reportes, categorias) {
  const filas = [];

  for (const categoria of categorias) {
    let total = 0;
    for (const reporte of reportes) {
      if (reporte.categorias.includes(categoria.nombre)) {
        total = total + 1;
      }
    }
    filas.push({ nombre: categoria.nombre, total: total });
  }

  filas.sort((a, b) => b.total - a.total);
  return filas;
}

export function reportesPorRiesgo(reportes, riesgos) {
  const filas = [];

  for (const nombre of ['Bajo', 'Medio', 'Alto']) {
    const riesgo = riesgos.find((r) => r.nombre === nombre);
    let total = 0;
    for (const reporte of reportes) {
      if (riesgo && reporte.tieneRiesgo === riesgo.id) {
        total = total + 1;
      }
    }
    filas.push({ nombre: nombre, total: total });
  }

  let sinClasificar = 0;
  for (const reporte of reportes) {
    if (!reporte.tieneRiesgo) {
      sinClasificar = sinClasificar + 1;
    }
  }
  filas.push({ nombre: 'Sin clasificar', total: sinClasificar });

  return filas;
}
