/**
 * validation.js
 * Client-side validation for the prediction form.
 * Ranges must stay in sync with docs/api-contract.md and backend/app/schemas.py.
 */

export const FIELD_CONFIG = {
  rain_1d: {
    label: 'Rainfall — last 1 day',
    unit: 'mm',
    required: true,
    min: 0,
    max: 2000,
    step: 0.1,
    hint: '0 – 2000 mm',
  },
  rain_3d: {
    label: 'Rainfall — last 3 days',
    unit: 'mm',
    required: true,
    min: 0,
    max: 3000,
    step: 0.1,
    hint: '0 – 3000 mm',
  },
  rain_7d: {
    label: 'Rainfall — last 7 days',
    unit: 'mm',
    required: true,
    min: 0,
    max: 5000,
    step: 0.1,
    hint: '0 – 5000 mm',
  },
  river_level_m: {
    label: 'River level',
    unit: 'm',
    required: false,
    min: 0,
    max: 100,
    step: 0.01,
    hint: '0 – 100 m (optional)',
  },
  soil_saturation: {
    label: 'Soil saturation',
    unit: '(0 – 1)',
    required: false,
    min: 0,
    max: 1,
    step: 0.01,
    hint: '0.0 (dry) – 1.0 (fully saturated), optional',
  },
  elevation_m: {
    label: 'Elevation',
    unit: 'm',
    required: false,
    min: -100,
    max: 9000,
    step: 1,
    hint: '-100 – 9000 m (optional)',
  },
};

/**
 * Validate a single field value.
 * @returns {string|null} error message or null if valid
 */
export function validateField(name, value, config) {
  const cfg = config ?? FIELD_CONFIG[name];
  if (!cfg) return null;

  const str = String(value ?? '').trim();

  if (cfg.required && str === '') {
    return `${cfg.label} is required.`;
  }
  if (str === '') return null; // optional empty → ok

  const num = Number(str);
  if (isNaN(num)) return `${cfg.label} must be a number.`;
  if (num < cfg.min) return `${cfg.label} must be ≥ ${cfg.min} ${cfg.unit}.`;
  if (num > cfg.max) return `${cfg.label} must be ≤ ${cfg.max} ${cfg.unit}.`;
  return null;
}

/**
 * Validate the full form values object.
 * @returns {{ errors: Record<string,string>, valid: boolean }}
 */
export function validateForm(values) {
  const errors = {};

  for (const [name, cfg] of Object.entries(FIELD_CONFIG)) {
    const err = validateField(name, values[name], cfg);
    if (err) errors[name] = err;
  }

  // Location: need district_id OR (latitude + longitude)
  const hasDistrict = values.district_id && values.district_id !== '';
  const hasLatLon =
    values.latitude !== '' && values.latitude !== undefined &&
    values.longitude !== '' && values.longitude !== undefined;

  if (!hasDistrict && !hasLatLon) {
    errors.location = 'Select a district or enter latitude and longitude.';
  }

  return { errors, valid: Object.keys(errors).length === 0 };
}

/**
 * Build a clean payload for POST /predict from form values.
 * Excludes empty optional fields.
 */
export function buildPayload(values) {
  const payload = {
    rain_1d: parseFloat(values.rain_1d),
    rain_3d: parseFloat(values.rain_3d),
    rain_7d: parseFloat(values.rain_7d),
  };

  if (values.district_id && values.district_id !== '') {
    payload.district_id = parseInt(values.district_id, 10);
  }
  if (values.latitude !== '' && values.latitude !== undefined) {
    payload.latitude = parseFloat(values.latitude);
  }
  if (values.longitude !== '' && values.longitude !== undefined) {
    payload.longitude = parseFloat(values.longitude);
  }
  if (values.river_level_m !== '' && values.river_level_m !== undefined) {
    payload.river_level_m = parseFloat(values.river_level_m);
  }
  if (values.soil_saturation !== '' && values.soil_saturation !== undefined) {
    payload.soil_saturation = parseFloat(values.soil_saturation);
  }
  if (values.elevation_m !== '' && values.elevation_m !== undefined) {
    payload.elevation_m = parseFloat(values.elevation_m);
  }

  return payload;
}
