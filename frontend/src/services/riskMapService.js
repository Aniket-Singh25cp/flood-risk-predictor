/**
 * riskMapService.js
 * Wraps GET /risk-map.
 */

import { fetchRiskMap } from './api.js';

export async function getRiskMapData() {
  return fetchRiskMap();
}
