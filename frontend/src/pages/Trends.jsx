/**
 * Trends.jsx — Historical trend charts.
 * Uses mock data (VITE_USE_MOCK=true) until /trend endpoint goes live (BW4).
 */

import { useState } from 'react';
import trendMock from '../mocks/trendMock.json';
import { RainfallChart, RiverLevelChart, ProbabilityChart, DistrictComparisonChart } from '../components/TrendChart.jsx';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const DISTRICTS = ['Patna', 'Kamrup Metropolitan', 'Lucknow', 'Ernakulam'];

export default function Trends() {
  const [activeDistrict] = useState('Patna');

  return (
    <main className="page-content">
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h1>Historical Trends</h1>
            <p>7-day rainfall, river level and flood probability trends by district.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {USE_MOCK && (
              <span className="mock-notice">Mock data — /trend endpoint planned for BW4</span>
            )}
          </div>
        </div>
      </header>

      {USE_MOCK && (
        <div className="alert-banner info" role="note" style={{ marginBottom: 'var(--space-5)' }}>
          <span aria-hidden="true">ℹ</span>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>Sample data only</div>
            <div style={{ fontSize: '0.8125rem' }}>
              These charts use a local mock dataset (<code>src/mocks/trendMock.json</code>) because the{' '}
              <code>GET /trend</code> endpoint is planned for backend BW4.
              Set <code>VITE_USE_MOCK=false</code> once the endpoint is live.
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <label className="form-label" htmlFor="district-select" style={{ margin: 0 }}>District:</label>
        <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{activeDistrict}</span>
        <span className="text-muted text-sm">(district switching requires live /trend endpoint)</span>
      </div>

      <div className="trends-grid">
        {/* Rainfall chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Rainfall (mm)</span>
            {USE_MOCK && <span className="mock-notice">Mock</span>}
          </div>
          <div className="card-body">
            <RainfallChart data={trendMock.rainfall} />
            <p className="text-muted text-sm" style={{ marginTop: 8 }}>
              1-day, 3-day and 7-day cumulative rainfall. Source: mock data.
            </p>
          </div>
        </div>

        {/* River level chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">River Level (m)</span>
            {USE_MOCK && <span className="mock-notice">Mock</span>}
          </div>
          <div className="card-body">
            <RiverLevelChart data={trendMock.river} />
            <p className="text-muted text-sm" style={{ marginTop: 8 }}>
              Orange dashed line marks the 5 m illustrative warning threshold.
            </p>
          </div>
        </div>

        {/* Probability trend */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Flood Probability Trend</span>
            {USE_MOCK && <span className="mock-notice">Mock</span>}
          </div>
          <div className="card-body">
            <ProbabilityChart data={trendMock.probability_series} />
            <p className="text-muted text-sm" style={{ marginTop: 8 }}>
              Coloured dots reflect the risk level at each time step. Dashed lines show Low/Medium/High thresholds.
            </p>
          </div>
        </div>

        {/* District comparison */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">District Comparison</span>
            {USE_MOCK && <span className="mock-notice">Mock</span>}
          </div>
          <div className="card-body">
            <DistrictComparisonChart data={trendMock.district_comparison} districts={DISTRICTS} />
            <p className="text-muted text-sm" style={{ marginTop: 8 }}>
              Multi-district flood probability for the latest 3 available days.
            </p>
          </div>
        </div>
      </div>

      <div className="disclaimer" role="note" style={{ marginTop: 'var(--space-5)' }}>
        <span className="disclaimer-icon" aria-hidden="true">⚠</span>
        <span>Decision-support estimate. Not an official flood warning. All trend data shown is illustrative mock data until the /trend endpoint is implemented.</span>
      </div>
    </main>
  );
}
