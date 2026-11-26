/**
 * PredictionForm.jsx
 * Full form for POST /predict.
 * Fields and ranges exactly match docs/api-contract.md and backend/app/schemas.py.
 */

import { useState } from 'react';
import { FIELD_CONFIG, validateForm, buildPayload } from '../utils/validation.js';
import { submitPrediction } from '../services/predictionService.js';
import LoadingState from './LoadingState.jsx';

const INITIAL_VALUES = {
  district_id: '',
  latitude: '',
  longitude: '',
  rain_1d: '',
  rain_3d: '',
  rain_7d: '',
  river_level_m: '',
  soil_saturation: '',
  elevation_m: '',
};

// Districts from /risk-map (matches sample_districts.py)
const KNOWN_DISTRICTS = [
  { id: 1, name: 'Patna',               state: 'Bihar' },
  { id: 2, name: 'Kamrup Metropolitan', state: 'Assam' },
  { id: 3, name: 'Lucknow',             state: 'Uttar Pradesh' },
  { id: 4, name: 'Ernakulam',           state: 'Kerala' },
];

function FormField({ name, value, error, onChange }) {
  const cfg = FIELD_CONFIG[name];
  if (!cfg) return null;
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={`field-${name}`}>
        {cfg.label}
        <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: 6, fontSize: '0.8125rem' }}>
          ({cfg.unit})
        </span>
        {cfg.required
          ? <span className="required" aria-label="required"> *</span>
          : <span className="optional"> optional</span>}
      </label>
      <input
        id={`field-${name}`}
        name={name}
        type="number"
        className={`form-input${error ? ' error' : ''}`}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        min={cfg.min}
        max={cfg.max}
        step={cfg.step}
        placeholder={cfg.hint}
        aria-describedby={error ? `err-${name}` : `hint-${name}`}
        aria-required={cfg.required}
        aria-invalid={!!error}
      />
      {error
        ? <span id={`err-${name}`} className="form-error" role="alert">{error}</span>
        : <span id={`hint-${name}`} className="form-hint">{cfg.hint}</span>
      }
    </div>
  );
}

export default function PredictionForm({ onResult }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [locationMode, setLocationMode] = useState('district'); // 'district' | 'latlon'

  function handleChange(name, value) {
    setValues(v => ({ ...v, [name]: value }));
    if (errors[name]) setErrors(e => { const n = { ...e }; delete n[name]; return n; });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);

    const formValues = {
      ...values,
      ...(locationMode === 'district'
        ? { latitude: '', longitude: '' }
        : { district_id: '' }),
    };

    const { errors: errs, valid } = validateForm(formValues);
    setErrors(errs);
    if (!valid) return;

    setLoading(true);
    try {
      const payload = buildPayload(formValues);
      const result  = await submitPrediction(payload);
      onResult(result, payload);
    } catch (err) {
      setSubmitError(err);
      onResult(null, null);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setValues(INITIAL_VALUES);
    setErrors({});
    setSubmitError(null);
    onResult(null, null);
  }

  return (
    <form onSubmit={handleSubmit} onReset={handleReset} noValidate aria-label="Flood risk prediction form">
      {/* Location section */}
      <fieldset style={{ border: 'none', padding: 0, marginBottom: 20 }}>
        <legend style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: 10 }}>
          Location <span style={{ color: 'var(--color-error)' }}>*</span>
        </legend>

        {/* Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {['district', 'latlon'].map(mode => (
            <button
              key={mode}
              type="button"
              className={`btn btn-sm ${locationMode === mode ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setLocationMode(mode); setErrors(e => { const n = {...e}; delete n.location; return n; }); }}
              aria-pressed={locationMode === mode}
            >
              {mode === 'district' ? 'Select district' : 'Enter coordinates'}
            </button>
          ))}
        </div>

        {errors.location && (
          <span className="form-error" role="alert">{errors.location}</span>
        )}

        {locationMode === 'district' ? (
          <div className="form-group">
            <label className="form-label" htmlFor="field-district_id">District</label>
            <select
              id="field-district_id"
              name="district_id"
              className="form-select"
              value={values.district_id}
              onChange={e => handleChange('district_id', e.target.value)}
              aria-required="true"
            >
              <option value="">— select a district —</option>
              {KNOWN_DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.state})</option>
              ))}
            </select>
            <span className="form-hint">District list expands when backend /districts endpoint goes live (BW2)</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="field-latitude">
                Latitude <span className="required" aria-label="required"> *</span>
              </label>
              <input
                id="field-latitude"
                name="latitude"
                type="number"
                className={`form-input${errors.latitude ? ' error' : ''}`}
                value={values.latitude}
                onChange={e => handleChange('latitude', e.target.value)}
                min={6.0} max={38.0} step={0.0001}
                placeholder="6.0 – 38.0"
                aria-describedby={errors.latitude ? 'err-latitude' : 'hint-latitude'}
                aria-invalid={!!errors.latitude}
              />
              {errors.latitude
                ? <span id="err-latitude" className="form-error" role="alert">{errors.latitude}</span>
                : <span id="hint-latitude" className="form-hint">India: 6.0°N – 38.0°N</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="field-longitude">
                Longitude <span className="required" aria-label="required"> *</span>
              </label>
              <input
                id="field-longitude"
                name="longitude"
                type="number"
                className={`form-input${errors.longitude ? ' error' : ''}`}
                value={values.longitude}
                onChange={e => handleChange('longitude', e.target.value)}
                min={68.0} max={98.0} step={0.0001}
                placeholder="68.0 – 98.0"
                aria-describedby={errors.longitude ? 'err-longitude' : 'hint-longitude'}
                aria-invalid={!!errors.longitude}
              />
              {errors.longitude
                ? <span id="err-longitude" className="form-error" role="alert">{errors.longitude}</span>
                : <span id="hint-longitude" className="form-hint">India: 68.0°E – 98.0°E</span>}
            </div>
          </div>
        )}
      </fieldset>

      {/* Rainfall section */}
      <fieldset style={{ border: 'none', padding: 0, marginBottom: 20 }}>
        <legend style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: 10 }}>
          Rainfall <span style={{ color: 'var(--color-error)' }}>*</span>
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['rain_1d', 'rain_3d', 'rain_7d'].map(name => (
            <FormField key={name} name={name} value={values[name]} error={errors[name]} onChange={handleChange} />
          ))}
        </div>
      </fieldset>

      {/* Optional fields */}
      <fieldset style={{ border: 'none', padding: 0, marginBottom: 24 }}>
        <legend style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: 4 }}>
          Additional data <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: '0.8125rem' }}>(optional — improves accuracy)</span>
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
          {['river_level_m', 'soil_saturation', 'elevation_m'].map(name => (
            <FormField key={name} name={name} value={values[name]} error={errors[name]} onChange={handleChange} />
          ))}
        </div>
      </fieldset>

      {/* Submit error */}
      {submitError && (
        <div className="alert-banner error" role="alert" style={{ marginBottom: 16 }}>
          <span aria-hidden="true">⚠</span>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{submitError.message}</div>
            {submitError.status === 422 && Array.isArray(submitError.detail) && (
              <ul style={{ paddingLeft: 16, fontSize: '0.8125rem', margin: '4px 0 0' }}>
                {submitError.detail.map((e, i) => (
                  <li key={i}><strong>{e.loc?.slice(1).join(' → ')}:</strong> {e.msg}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
          aria-busy={loading}
          style={{ flex: 1 }}
        >
          {loading ? <LoadingState inline message="Running prediction…" /> : 'Run Prediction'}
        </button>
        <button type="reset" className="btn btn-secondary" disabled={loading}>
          Clear
        </button>
      </div>
    </form>
  );
}
