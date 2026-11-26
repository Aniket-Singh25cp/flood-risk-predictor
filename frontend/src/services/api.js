/**
 * api.js — Central API service
 * All requests read the base URL from import.meta.env.VITE_API_URL.
 * Never hardcode localhost.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

class ApiError extends Error {
  constructor(message, status, detail) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

/**
 * Core fetch wrapper. Throws ApiError on HTTP or network errors.
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  let response;

  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      ...options,
    });
  } catch (networkErr) {
    throw new ApiError(
      'Cannot reach the backend server. Check that the API is running and VITE_API_URL is set.',
      0,
      null
    );
  }

  if (!response.ok) {
    let detail = null;
    try {
      const body = await response.json();
      detail = body.detail ?? body;
    } catch {
      /* non-JSON error body */
    }

    if (response.status === 422) {
      // FastAPI validation errors: detail is an array of { loc, msg, type }
      throw new ApiError('Validation error — check your inputs.', 422, detail);
    }

    throw new ApiError(
      `Server returned ${response.status}: ${response.statusText}`,
      response.status,
      detail
    );
  }

  // 204 No Content
  if (response.status === 204) return null;

  return response.json();
}

/** GET /health */
export async function fetchHealth() {
  return request('/health');
}

/** POST /predict */
export async function fetchPredict(payload) {
  return request('/predict', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** GET /risk-map */
export async function fetchRiskMap() {
  return request('/risk-map');
}

/** POST /alerts/simulate (planned BW5 — not live yet) */
export async function simulateAlert(payload) {
  return request('/alerts/simulate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** GET /admin/logs (planned BW5 — requires ADMIN_TOKEN) */
export async function fetchAdminLogs(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const token = import.meta.env.VITE_ADMIN_TOKEN ?? '';
  return request(`/admin/logs${qs ? `?${qs}` : ''}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export { ApiError };
