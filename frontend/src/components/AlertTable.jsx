/**
 * AlertTable.jsx
 * Displays a list of district alerts in a readable table.
 */

import RiskBadge from './RiskBadge.jsx';
import { formatProbability } from '../utils/riskUtils.js';

function StatusPill({ status }) {
  const map = {
    active:    { bg: '#fee2e2', color: '#b91c1c', label: 'Active' },
    resolved:  { bg: '#dcfce7', color: '#15803d', label: 'Resolved' },
    simulated: { bg: '#fef9c3', color: '#a16207', label: 'Simulated' },
    pending:   { bg: '#f3f4f6', color: '#374151', label: 'Pending' },
  };
  const s = map[status] ?? map.pending;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: '0.6875rem', fontWeight: 600,
                   padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
      {s.label}
    </span>
  );
}

export default function AlertTable({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon" aria-hidden="true">📋</div>
        <div className="empty-state-title">No alerts</div>
        <div className="empty-state-desc">No district alerts are currently active.</div>
      </div>
    );
  }

  return (
    <div className="data-table-wrap">
      <table className="data-table" aria-label="District alerts">
        <thead>
          <tr>
            <th scope="col">District</th>
            <th scope="col">State</th>
            <th scope="col">Risk Level</th>
            <th scope="col">Probability</th>
            <th scope="col">Issued At</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, i) => (
            <tr key={alert.id ?? i}>
              <td style={{ fontWeight: 500 }}>{alert.district}</td>
              <td className="text-muted">{alert.state ?? '—'}</td>
              <td><RiskBadge level={alert.level} /></td>
              <td>
                <div className="prob-bar-wrap">
                  <div className="prob-bar">
                    <div
                      className={`prob-bar-fill risk-${alert.level?.toLowerCase()}`}
                      style={{ width: `${Math.round((alert.probability ?? 0) * 100)}%` }}
                      role="presentation"
                    />
                  </div>
                  <span style={{ fontSize: '0.8125rem', minWidth: 36, textAlign: 'right' }}>
                    {formatProbability(alert.probability)}
                  </span>
                </div>
              </td>
              <td className="text-muted text-sm">
                {alert.timestamp
                  ? new Date(alert.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                  : '—'}
              </td>
              <td><StatusPill status={alert.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
