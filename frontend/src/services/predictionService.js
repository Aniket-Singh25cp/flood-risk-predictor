/**
 * predictionService.js
 * Wraps POST /predict with mock-aware behaviour.
 */

import { fetchPredict } from './api.js';

/** Call POST /predict with a validated payload. */
export async function submitPrediction(payload) {
  return fetchPredict(payload);
}
