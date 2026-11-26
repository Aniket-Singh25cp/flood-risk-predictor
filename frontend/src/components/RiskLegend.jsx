/**
 * RiskLegend.jsx
 * Standalone map legend panel.
 */

const ITEMS = [
  { level: 'Low',    cls: 'low',    color: '#16a34a', label: 'Low risk (< 25%)' },
  { level: 'Medium', cls: 'medium', color: '#ca8a04', label: 'Medium risk (25–50%)' },
  { level: 'High',   cls: 'high',   color: '#ea580c', label: 'High risk (50–75%)' },
  { level: 'Severe', cls: 'severe', color: '#dc2626', label: 'Severe risk (≥ 75%)' },
];

export default function RiskLegend({ style }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-sm)',
        fontSize: '0.78125rem',
        ...style,
      }}
      role="note"
      aria-label="Flood risk level legend"
    >
      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Risk Level
      </div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {ITEMS.map(({ level, color, label }) => (
          <li key={level} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: color,
                border: '1.5px solid rgba(0,0,0,0.12)',
                flexShrink: 0,
              }}
            />
            <span style={{ color: 'var(--color-text-primary)' }}>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
