/**
 * Dashboard.jsx — Main dashboard page.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';
import { getRiskMapData } from '../services/riskMapService.js';
import StatCard from '../components/StatCard.jsx';
import RiskBadge from '../components/RiskBadge.jsx';
import RiskMap from '../components/RiskMap.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { formatProbability, riskClass } from '../utils/riskUtils.js';

function DistrictRiskRow({ d }) {
  return (
    <tr>
      <td style={{ fontWeight: 500 }}>{d.name}</td>
      <td className="text-muted text-sm">{d.state}</td>
      <td><RiskBadge level={d.level} /></td>
      <td>
        <div className="prob-bar-wrap">
          <div className="prob-bar">
            <div className={`prob-bar-fill risk-${riskClass(d.level)}`}
                 style={{ width: `${Math.round(d.probability * 100)}%` }}
                 role="presentation" />
          </div>
          <span style={{ fontSize: '0.8125rem', minWidth: 36, textAlign: 'right' }}>
            {formatProbability(d.probability)}
          </span>
        </div>
      </td>
    </tr>
  );
}

export default function Dashboard() {
  const { data, loading, error, refetch } = useApi(getRiskMapData);
  const [now] = useState(() => new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));

  const districts    = data?.districts ?? [];
  const highCount    = districts.filter(d => d.level === 'High').length;
  const severeCount  = districts.filter(d => d.level === 'Severe').length;
  const isMock       = districts.some(d => d.mock);

  return (
    <main className="page-content">
      {/* Page header */}
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h1>Flood Monitoring Dashboard</h1>
            <p>District-level flood probability across India — decision-support tool for monitoring and planning.</p>
          </div>
          {!loading && !error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {isMock && <span className="mock-notice">Sample data</span>}
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Updated {now}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Summary cards */}
      <div className="stats-grid">
        <StatCard
          label="Districts monitored"
          value={loading ? null : districts.length}
          sub="Current dataset"
          accent="navy"
          loading={loading}
        />
        <StatCard
          label="High-risk districts"
          value={loading ? null : highCount}
          sub="Level: High"
          accent="high"
          loading={loading}
        />
        <StatCard
          label="Severe-risk districts"
          value={loading ? null : severeCount}
          sub="Level: Severe"
          accent="severe"
          loading={loading}
        />
        <StatCard
          label="Prediction status"
          value={loading ? null : error ? 'Offline' : 'Live'}
          sub={error ? 'API unavailable' : 'Heuristic model v0.1'}
          accent={error ? 'severe' : 'low'}
          loading={loading}
        />
      </div>

      {/* Main grid */}
      <div className="dashboard-grid">
        {/* Map + district table */}
        <div className="dashboard-col-main">
          {/* Map */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">India — Flood Risk Map</span>
              <Link to="/risk-map" className="btn btn-sm btn-secondary">Full map →</Link>
            </div>
            <div style={{ padding: 0 }}>
              {error
                ? <ErrorState error={error} onRetry={refetch} />
                : <RiskMap data={data} loading={loading} error={null} onRetry={refetch} height={360} />
              }
            </div>
          </div>

          {/* District table */}
          {!error && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">District Risk Summary</span>
                {isMock && <span className="mock-notice">Sample data</span>}
              </div>
              <div className="data-table-wrap">
                <table className="data-table" aria-label="Current district risk levels">
                  <thead>
                    <tr>
                      <th scope="col">District</th>
                      <th scope="col">State</th>
                      <th scope="col">Risk Level</th>
                      <th scope="col">Probability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading
                      ? [1,2,3,4].map(i => (
                          <tr key={i}>
                            {[1,2,3,4].map(j => (
                              <td key={j}><div className="skeleton" style={{ height: 16, width: j === 4 ? '80%' : '60%' }} /></td>
                            ))}
                          </tr>
                        ))
                      : districts.map(d => <DistrictRiskRow key={d.district_id} d={d} />)
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="dashboard-col-side">
          {/* Quick predict */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Quick Actions</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/predict" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Run Flood Prediction
              </Link>
              <Link to="/risk-map" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                View Full Risk Map
              </Link>
              <Link to="/alerts" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                View Alerts
              </Link>
            </div>
          </div>

          {/* Rainfall indicators */}
          {!loading && !error && districts.length > 0 && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">Risk Indicators</span>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {districts.map(d => (
                  <div key={d.district_id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{d.name}</span>
                      <RiskBadge level={d.level} />
                    </div>
                    <div className="prob-bar">
                      <div className={`prob-bar-fill risk-${riskClass(d.level)}`}
                           style={{ width: `${Math.round(d.probability * 100)}%` }}
                           role="presentation" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="disclaimer" role="note">
            <span className="disclaimer-icon" aria-hidden="true">⚠</span>
            <span>
              {data?.disclaimer ?? 'Decision-support estimate. Not an official flood warning.'}
            </span>
          </div>

          {/* API status note */}
          {error && (
            <div className="alert-banner error" role="alert">
              <span aria-hidden="true">⚠</span>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Backend unavailable</div>
                <div style={{ fontSize: '0.8125rem' }}>
                  Start the FastAPI server: <code style={{ fontFamily: 'var(--font-mono)' }}>uvicorn backend.app.main:app --reload</code>
                </div>
                <button className="btn btn-sm btn-secondary" onClick={refetch} style={{ marginTop: 8 }}>
                  Retry connection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
