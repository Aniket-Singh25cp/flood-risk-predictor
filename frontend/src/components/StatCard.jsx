/**
 * StatCard.jsx
 * Summary metric card for the dashboard overview strip.
 */

export default function StatCard({ label, value, sub, accent, loading }) {
  return (
    <div className={`stat-card${accent ? ` accent-${accent}` : ''}`} role="region" aria-label={label}>
      <div className="stat-card-label">{label}</div>
      {loading ? (
        <div className="skeleton" style={{ height: 36, width: '60%', marginBottom: 4 }} />
      ) : (
        <div className="stat-card-value">{value ?? '—'}</div>
      )}
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}
