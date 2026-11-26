/**
 * Alerts.jsx — Alert monitoring page.
 * /alerts/simulate is planned for BW5. Until then, shows simulated UI-only alerts.
 */

import { useState } from 'react';
import AlertTable from '../components/AlertTable.jsx';

// UI-only simulated alerts — clearly not real data
const SIMULATED_ALERTS = [
  {
    id: 1,
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    level: 'Severe',
    probability: 0.82,
    timestamp: '2026-11-25T10:30:00+05:30',
    status: 'active',
  },
  {
    id: 2,
    district: 'Patna',
    state: 'Bihar',
    level: 'Medium',
    probability: 0.43,
    timestamp: '2026-11-25T09:00:00+05:30',
    status: 'active',
  },
  {
    id: 3,
    district: 'Ernakulam',
    state: 'Kerala',
    level: 'High',
    probability: 0.56,
    timestamp: '2026-11-24T18:45:00+05:30',
    status: 'resolved',
  },
  {
    id: 4,
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    level: 'Low',
    probability: 0.11,
    timestamp: '2026-11-24T14:00:00+05:30',
    status: 'resolved',
  },
];

export default function Alerts() {
  const [alerts] = useState(SIMULATED_ALERTS);

  const activeCount   = alerts.filter(a => a.status === 'active').length;
  const severeCount   = alerts.filter(a => a.level === 'Severe').length;

  return (
    <main className="page-content">
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h1>Alert Monitor</h1>
            <p>District flood alert log and status tracker.</p>
          </div>
          <span className="mock-notice">UI simulation — /alerts/simulate planned for BW5</span>
        </div>
      </header>

      {/* Notice */}
      <div className="alert-banner warning" role="note" style={{ marginBottom: 'var(--space-5)' }}>
        <span aria-hidden="true">⚠</span>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>Simulated alerts only</div>
          <div style={{ fontSize: '0.8125rem' }}>
            The <code>POST /alerts/simulate</code> and alert log endpoints are planned for backend BW5.
            Alerts shown below are pre-defined for UI development purposes — they are not real observations.
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        <div className="stat-card accent-severe">
          <div className="stat-card-label">Active alerts</div>
          <div className="stat-card-value">{activeCount}</div>
          <div className="stat-card-sub">Requiring attention</div>
        </div>
        <div className="stat-card accent-high">
          <div className="stat-card-label">Severe level</div>
          <div className="stat-card-value">{severeCount}</div>
          <div className="stat-card-sub">Highest priority</div>
        </div>
        <div className="stat-card accent-navy">
          <div className="stat-card-label">Total in log</div>
          <div className="stat-card-value">{alerts.length}</div>
          <div className="stat-card-sub">Last 24 hours</div>
        </div>
      </div>

      {/* Alert table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Alert Log</span>
          <span className="mock-notice">Simulated</span>
        </div>
        <AlertTable alerts={alerts} />
      </div>

      <div className="disclaimer" role="note" style={{ marginTop: 'var(--space-5)' }}>
        <span className="disclaimer-icon" aria-hidden="true">⚠</span>
        <span>Decision-support estimate. Not an official flood warning. All alerts shown are simulated for UI development.</span>
      </div>
    </main>
  );
}
