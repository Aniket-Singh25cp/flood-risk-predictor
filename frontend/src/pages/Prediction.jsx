/**
 * Prediction.jsx — Full prediction form page.
 */

import { useState } from 'react';
import PredictionForm from '../components/PredictionForm.jsx';
import PredictionResult from '../components/PredictionResult.jsx';

export default function Prediction() {
  const [result, setResult] = useState(null);

  function handleResult(res) {
    setResult(res);
  }

  return (
    <main className="page-content">
      <header className="page-header">
        <h1>Flood Risk Prediction</h1>
        <p>Enter district environmental data to get a flood probability estimate from the heuristic model.</p>
      </header>

      <div className="form-page">
        {/* Form */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Input Parameters</span>
          </div>
          <div className="card-body">
            <PredictionForm onResult={handleResult} />
          </div>
        </div>

        {/* Result */}
        <div>
          {result ? (
            <div className="card result-card" style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 24px)' }}>
              <div className="card-header">
                <span className="card-title">Prediction Result</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {new Date().toLocaleTimeString('en-IN', { timeStyle: 'short' })}
                </span>
              </div>
              <PredictionResult result={result} />
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 48, gap: 12, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <div style={{ fontSize: '3rem', opacity: 0.3 }} aria-hidden="true">📊</div>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>No prediction yet</div>
              <div style={{ fontSize: '0.875rem', maxWidth: 280 }}>
                Fill in the form on the left and click <strong>Run Prediction</strong> to see flood risk analysis.
              </div>
              <div className="disclaimer" style={{ textAlign: 'left', marginTop: 8, maxWidth: 320 }} role="note">
                <span className="disclaimer-icon" aria-hidden="true">⚠</span>
                <span>Decision-support estimate. Not an official flood warning.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
