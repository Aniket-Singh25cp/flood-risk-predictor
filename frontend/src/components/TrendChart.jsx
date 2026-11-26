/**
 * TrendChart.jsx
 * Recharts wrapper for time-series charts.
 */

import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ReferenceLine,
} from 'recharts';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

const CUSTOM_TOOLTIP_STYLE = {
  background: '#fff',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  fontSize: '0.8125rem',
  padding: '8px 12px',
  fontFamily: 'var(--font-sans)',
};

/** Rainfall bar chart */
export function RainfallChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} unit=" mm" width={52} />
        <Tooltip
          formatter={(v, n) => [`${v} mm`, n === 'rain_1d' ? '1-day' : n === 'rain_3d' ? '3-day' : '7-day']}
          labelFormatter={formatDate}
          contentStyle={CUSTOM_TOOLTIP_STYLE}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem', paddingTop: 8 }}
          formatter={v => v === 'rain_1d' ? '1-day rainfall' : v === 'rain_3d' ? '3-day cumulative' : '7-day cumulative'}
        />
        <Bar dataKey="rain_1d" name="rain_1d" fill="#93c5fd" radius={[3,3,0,0]} maxBarSize={18} />
        <Bar dataKey="rain_3d" name="rain_3d" fill="#3b82f6" radius={[3,3,0,0]} maxBarSize={18} />
        <Bar dataKey="rain_7d" name="rain_7d" fill="#1e3a5f" radius={[3,3,0,0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** River level line chart */
export function RiverLevelChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} unit=" m" width={44} />
        <Tooltip
          formatter={v => [`${v} m`, 'River level']}
          labelFormatter={formatDate}
          contentStyle={CUSTOM_TOOLTIP_STYLE}
        />
        <ReferenceLine y={5} stroke="#ea580c" strokeDasharray="4 4" label={{ value: 'Warning', position: 'insideTopRight', fontSize: 10, fill: '#ea580c' }} />
        <Line type="monotone" dataKey="river_level_m" name="River level (m)" stroke="#0369a1" strokeWidth={2} dot={{ r: 3, fill: '#0369a1' }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** Flood probability trend line chart */
export function ProbabilityChart({ data }) {
  const COLORS = {
    Low: '#16a34a', Medium: '#ca8a04', High: '#ea580c', Severe: '#dc2626',
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    const color = COLORS[payload.level] ?? '#6b7280';
    return <circle cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={1.5} />;
  };

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} domain={[0, 1]}
          tickFormatter={v => `${Math.round(v * 100)}%`} width={44} />
        <ReferenceLine y={0.25} stroke="#ca8a04" strokeDasharray="4 4" strokeOpacity={0.7} />
        <ReferenceLine y={0.50} stroke="#ea580c" strokeDasharray="4 4" strokeOpacity={0.7} />
        <ReferenceLine y={0.75} stroke="#dc2626" strokeDasharray="4 4" strokeOpacity={0.7} />
        <Tooltip
          formatter={v => [`${Math.round(v * 100)}%`, 'Flood probability']}
          labelFormatter={formatDate}
          contentStyle={CUSTOM_TOOLTIP_STYLE}
        />
        <Line type="monotone" dataKey="probability" name="Flood probability" stroke="#475569" strokeWidth={2.5} dot={<CustomDot />} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** Multi-district comparison line chart */
export function DistrictComparisonChart({ data, districts }) {
  const DISTRICT_COLORS = ['#1e3a5f', '#0369a1', '#7c3aed', '#065f46'];
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} domain={[0, 1]}
          tickFormatter={v => `${Math.round(v * 100)}%`} width={44} />
        <Tooltip
          formatter={(v, n) => [`${Math.round(v * 100)}%`, n]}
          labelFormatter={formatDate}
          contentStyle={CUSTOM_TOOLTIP_STYLE}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem', paddingTop: 8 }} />
        {districts.map((name, i) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            stroke={DISTRICT_COLORS[i % DISTRICT_COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
