/**
 * PredictionResult.jsx
 * Displays the POST /predict response.
 * Always shows the disclaimer. Never displays success if result is null.
 */

import RiskBadge from './RiskBadge.jsx';
import { formatProbability, riskClass } from '../utils/riskUtils.js';
import { FIELD_CONFIG } from '../utils/validation.js';

function InputsUsedList({ inputs }) {
  if (!inputs || inputs.length === 0) return null;
  return (
    <div>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
        Inputs used by model
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {inputs.map(key => (
          <span key={key} style={{
            padding: '2px 8px',
            background: 'var(--color-navy-light)',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            fontSize: '0.75rem',
            color: 'var(--color-navy)',
            fontFamily: 'var(--font-mono)',
          }}>
            {FIELD_CONFIG[key]?.label ?? key}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PredictionResult({ result }) {
  if (!result) return null;

  const pct = formatProbability(result.probability);
  const cls = riskClass(result.level);

  return (
    <div role="region" aria-label="Flood risk prediction result">
      {/* Probability dial */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '28px 20px 20px',
        borderBottom: '1px solid var(--color-border-light)',
        gap: 10,
      }}>
        {/* Big probability circle */}
        <div style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: `5px solid var(--risk-${cls}-dot)`,
          background: `var(--risk-${cls}-bg)`,
        }}>
          <span style={{ fontSize: '1.625rem', fontWeight: 700, lineHeight: 1, color: `var(--risk-${cls}-text)` }}>
            {pct}
          </span>
          <span style={{ fontSize: '0.6875rem', color: `var(--risk-${cls}-text)`, opacity: 0.8 }}>
            probability
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Risk Level
          </div>
          <RiskBadge level={result.level} probability={result.probability} size="lg" />
        </div>
      </div>

      {/* Detail rows */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Probability bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 6, color: 'var(--color-text-secondary)' }}>
            <span>Flood probability</span>
            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{pct}</span>
          </div>
          <div style={{ position: 'relative' }}>
            <div className="prob-bar" style={{ height: 10 }}>
              <div
                className={`prob-bar-fill risk-${cls}`}
                style={{ width: `${Math.round(result.probability * 100)}%` }}
                role="presentation"
              />
            </div>
            {/* Threshold markers */}
            {[25, 50, 75].map(t => (
              <div key={t} style={{
                position: 'absolute',
                top: 0,
                left: `${t}%`,
                height: 10,
                width: 1.5,
                background: 'rgba(255,255,255,0.7)',
                pointerEvents: 'none',
              }} aria-hidden="true" />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', color: 'var(--color-text-muted)', marginTop: 3 }}>
            <span>Low</span><span>Medium</span><span>High</span><span>Severe</span>
          </div>
        </div>

        <InputsUsedList inputs={result.inputs_used} />

        {/* Model version */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', borderTop: '1px solid var(--color-border-light)', paddingTop: 12 }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Model version</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-primary)' }}>
            {result.model_version}
          </span>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer" role="note" aria-label="Important disclaimer">
          <span className="disclaimer-icon" aria-hidden="true">⚠</span>
          <span>{result.disclaimer ?? 'Decision-support estimate. Not an official flood warning.'}</span>
        </div>
      </div>
    </div>
  );
}
