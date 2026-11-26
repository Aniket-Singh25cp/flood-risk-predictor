/**
 * riskUtils.js
 * Mapping from risk level string → colours, CSS classes, labels.
 * Single source of truth for all visual risk representation.
 */

export const RISK_LEVELS = ['Low', 'Medium', 'High', 'Severe'];

/** CSS class suffix used in components.css */
export function riskClass(level) {
  if (!level) return 'unknown';
  const map = { Low: 'low', Medium: 'medium', High: 'high', Severe: 'severe' };
  return map[level] ?? 'unknown';
}

/** Leaflet circle marker colour */
export function riskColor(level) {
  const map = {
    Low:    '#16a34a',
    Medium: '#ca8a04',
    High:   '#ea580c',
    Severe: '#dc2626',
  };
  return map[level] ?? '#6b7280';
}

/** Human-readable label (always include text even if colour is shown) */
export function riskLabel(level) {
  return RISK_LEVELS.includes(level) ? level : 'Unknown';
}

/** ARIA label for screen readers */
export function riskAriaLabel(level, probability) {
  const pct = probability !== undefined ? ` (${Math.round(probability * 100)}% probability)` : '';
  return `${riskLabel(level)} flood risk${pct}`;
}

/** Map probability [0,1] → risk level (mirrors backend thresholds) */
export function probabilityToLevel(p) {
  if (p < 0.25) return 'Low';
  if (p < 0.50) return 'Medium';
  if (p < 0.75) return 'High';
  return 'Severe';
}

/** Format probability as percentage string */
export function formatProbability(p) {
  if (p === undefined || p === null) return '—';
  return `${Math.round(p * 100)}%`;
}
