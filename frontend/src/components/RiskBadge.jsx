/**
 * RiskBadge.jsx
 * Accessible risk level badge: coloured pill + text label.
 * Never uses colour alone — always shows the text label.
 */

import { riskClass, riskLabel, riskAriaLabel } from '../utils/riskUtils.js';

export default function RiskBadge({ level, probability, size = 'md' }) {
  const cls = riskClass(level);
  const label = riskLabel(level);
  const ariaLabel = riskAriaLabel(level, probability);

  return (
    <span
      className={`risk-badge risk-${cls}`}
      aria-label={ariaLabel}
      role="status"
    >
      <span className="risk-dot" aria-hidden="true" />
      {label}
      {size === 'lg' && probability !== undefined && (
        <span style={{ fontWeight: 400, opacity: 0.8, marginLeft: 2 }}>
          {Math.round(probability * 100)}%
        </span>
      )}
    </span>
  );
}
