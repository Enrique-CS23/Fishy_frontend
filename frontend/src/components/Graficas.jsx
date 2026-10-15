import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, LabelList,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

const TEXTO_EJE = { fontSize: 12, fill: '#6b7280' };
const CUADRICULA = '#eef2f7';
const ESTILO_TOOLTIP = { borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 13 };
const TEXTO_TOOLTIP = { color: '#111827' };
const COLOR_RIESGO = {
  Bajo: '#1e9e6a',
  Medio: '#e8a33d',
  Alto: '#e5484d',
  'Sin clasificar': '#94a3b8',
};

const formatoReportes = (valor) => [valor, 'Reportes'];

export function GraficaPorDia({ datos }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={datos} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={CUADRICULA} />
        <XAxis dataKey="dia" tick={TEXTO_EJE} axisLine={false} tickLine={false} minTickGap={20} />
        <YAxis allowDecimals={false} tick={TEXTO_EJE} axisLine={false} tickLine={false} />
        <Tooltip formatter={formatoReportes} contentStyle={ESTILO_TOOLTIP} itemStyle={TEXTO_TOOLTIP} />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#1d8fcb"
          strokeWidth={2}
          fill="#1d8fcb"
          fillOpacity={0.1}
          activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function GraficaPorCategoria({ datos }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={datos} layout="vertical" margin={{ top: 4, right: 32, left: 0, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke={CUADRICULA} />
        <XAxis type="number" allowDecimals={false} tick={TEXTO_EJE} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="nombre" tick={TEXTO_EJE} axisLine={false} tickLine={false} width={80} />
        <Tooltip formatter={formatoReportes} contentStyle={ESTILO_TOOLTIP} itemStyle={TEXTO_TOOLTIP} cursor={false} />
        <Bar dataKey="total" fill="#0c4775" radius={[0, 4, 4, 0]} maxBarSize={24}>
          <LabelList dataKey="total" position="right" style={TEXTO_EJE} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function GraficaPorRiesgo({ datos }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={datos} margin={{ top: 20, right: 12, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={CUADRICULA} />
        <XAxis dataKey="nombre" tick={TEXTO_EJE} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={TEXTO_EJE} axisLine={false} tickLine={false} />
        <Tooltip formatter={formatoReportes} contentStyle={ESTILO_TOOLTIP} itemStyle={TEXTO_TOOLTIP} cursor={false} />
        <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={32}>
          {datos.map((fila) => (
            <Cell key={fila.nombre} fill={COLOR_RIESGO[fila.nombre]} />
          ))}
          <LabelList dataKey="total" position="top" style={TEXTO_EJE} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
