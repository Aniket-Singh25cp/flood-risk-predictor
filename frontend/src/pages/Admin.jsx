/**
 * Admin.jsx — Administrative prediction log view.
 * GET /admin/logs is planned for BW5. Until then, shows mock table with clear labels.
 */

import RiskBadge from '../components/RiskBadge.jsx';
import { formatProbability } from '../utils/riskUtils.js';

const MOCK_LOGS = [
  { id: 1, district: 'Patna',               state: 'Bihar',         probability: 0.4281, level: 'Medium', actual_outcome: null,   timestamp: '2026-11-25T10:30:00+05:30', model: 'heuristic-0.1' },
  { id: 2, district: 'Kamrup Metropolitan', state: 'Assam',         probability: 0.7820, level: 'High',   actual_outcome: 'High', timestamp: '2026-11-24T14:00:00+05:30', model: 'heuristic-0.1' },
  { id: 3, district: 'Lucknow',             state: 'Uttar Pradesh', probability: 0.1100, level: 'Low',    actual_outcome: 'Low',  timestamp: '2026-11-24T09:30:00+05:30', model: 'heuristic-0.1' },
  { id: 4, district: 'Ernakulam',           state: 'Kerala',        probability: 0.5600, level: 'High',   actual_outcome: null,   timestamp: '2026-11-23T18:00:00+05:30', model: 'heuristic-0.1' },
];

function OutcomeCell({ actual, predicted }) {
  if (!actual) {
    return <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>Pending</span>;
  }
  const match = actual === predicted;
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <RiskBadge level={actual} />
      <span style={{ fontSize: '0.75rem', color: match ? 'var(--risk-low-text)' : 'var(--risk-high-text)', fontWeight: 600 }}>
        {match ? '✓ Match' : '✗ Mismatch'}
      </span>
    </span>
  );
}

export default function Admin() {
  return (
    <main className="page-content">
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h1>Admin — Prediction Log</h1>
            <p>Record of predictions versus actual flood outcomes. Used for model validation.</p>
          </div>
          <span className="mock-notice">Mock data — GET /admin/logs planned for BW5</span>
        </div>
      </header>

      {/* Notice */}
      <div className="alert-banner info" role="note" style={{ marginBottom: 'var(--space-5)' }}>
        <span aria-hidden="true">ℹ</span>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>Development view</div>
          <div style={{ fontSize: '0.8125rem' }}>
            <code>GET /admin/logs</code> (requires <code>Authorization: Bearer &lt;ADMIN_TOKEN&gt;</code>) is planned for backend BW5.
            The table below shows mock log entries for layout development only.
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        <div className="stat-card accent-navy">
          <div className="stat-card-label">Total predictions</div>
          <div className="stat-card-value">{MOCK_LOGS.length}</div>
          <div className="stat-card-sub">Mock data</div>
        </div>
        <div className="stat-card accent-low">
          <div className="stat-card-label">Outcomes recorded</div>
          <div className="stat-card-value">{MOCK_LOGS.filter(l => l.actual_outcome).length}</div>
          <div className="stat-card-sub">Verified</div>
        </div>
        <div className="stat-card accent-high">
          <div className="stat-card-label">Pending outcome</div>
          <div className="stat-card-value">{MOCK_LOGS.filter(l => !l.actual_outcome).length}</div>
          <div className="stat-card-sub">Awaiting data</div>
        </div>
        <div className="stat-card accent-navy">
          <div className="stat-card-label">Model</div>
          <div className="stat-card-value" style={{ fontSize: '0.875rem', marginTop: 4 }}>heuristic-0.1</div>
          <div className="stat-card-sub">Current version</div>
        </div>
      </div>

      {/* Log table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Prediction Log</span>
          <span className="mock-notice">Mock data</span>
        </div>
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Prediction log">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">District</th>
                <th scope="col">State</th>
                <th scope="col">Predicted</th>
                <th scope="col">Probability</th>
                <th scope="col">Actual Outcome</th>
                <th scope="col">Timestamp</th>
                <th scope="col">Model</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LOGS.map(log => (
                <tr key={log.id}>
                  <td className="text-muted text-sm">{log.id}</td>
                  <td style={{ fontWeight: 500 }}>{log.district}</td>
                  <td className="text-muted text-sm">{log.state}</td>
                  <td><RiskBadge level={log.level} /></td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{formatProbability(log.probability)}</span>
                  </td>
                  <td>
                    <OutcomeCell actual={log.actual_outcome} predicted={log.level} />
                  </td>
                  <td className="text-muted text-sm" style={{ whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  <td>
                    <code style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', background: 'var(--color-bg)', padding: '1px 5px', borderRadius: 3 }}>
                      {log.model}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="disclaimer" role="note" style={{ marginTop: 'var(--space-5)' }}>
        <span className="disclaimer-icon" aria-hidden="true">⚠</span>
        <span>Decision-support estimate. Not an official flood warning. Admin data shown is mock only until BW5.</span>
      </div>
    </main>
  );
}
