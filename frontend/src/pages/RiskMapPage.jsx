/**
 * RiskMapPage.jsx — Full-screen risk map page.
 */

import { useApi } from '../hooks/useApi.js';
import { getRiskMapData } from '../services/riskMapService.js';
import RiskMap from '../components/RiskMap.jsx';
import RiskBadge from '../components/RiskBadge.jsx';
import { formatProbability } from '../utils/riskUtils.js';

export default function RiskMapPage() {
  const { data, loading, error, refetch } = useApi(getRiskMapData);
  const districts = data?.districts ?? [];
  const isMock = districts.some(d => d.mock);

  return (
    <main className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <header className="page-header" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h1>Flood Risk Map</h1>
            <p>District-level flood risk across India. Click any marker for details.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {isMock && <span className="mock-notice">Sample district data</span>}
            {!loading && !error && (
              <button className="btn btn-sm btn-secondary" onClick={refetch}>↻ Refresh</button>
            )}
          </div>
        </div>
      </header>

      {/* Map */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <RiskMap
          data={data}
          loading={loading}
          error={error}
          onRetry={refetch}
          height={520}
        />
      </div>

      {/* District strip */}
      {!loading && !error && districts.length > 0 && (
        <div className="card">
          <div className="card-body" style={{ padding: 'var(--space-3) var(--space-5)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-6)', overflowX: 'auto', flexWrap: 'wrap' }}>
              {districts.map(d => (
                <div key={d.district_id} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{d.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{d.state}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                    <RiskBadge level={d.level} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{formatProbability(d.probability)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="disclaimer" role="note">
        <span className="disclaimer-icon" aria-hidden="true">⚠</span>
        <span>{data?.disclaimer ?? 'Decision-support estimate. Not an official flood warning.'}</span>
      </div>
    </main>
  );
}
