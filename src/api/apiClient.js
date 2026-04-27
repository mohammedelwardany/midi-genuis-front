import { BASE_URL } from './endpoints';

// ─── Token helpers ────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem('auth_token');

// ─── Build default headers ────────────────────────────────────────────────────
function buildHeaders(extra = {}) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...extra,
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// ─── Core request handler ─────────────────────────────────────────────────────
async function request(method, endpoint, { body, params, headers: extraHeaders } = {}) {
  // Build query string for GET params
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    url = `${url}?${qs}`;
  }

  const config = {
    method,
    headers: buildHeaders(extraHeaders),
  };

  if (body !== undefined) {
    if (body instanceof FormData) {
      config.body = body;
      // Let the browser set the boundary for multipart/form-data
      delete config.headers['Content-Type'];
    } else {
      config.body = JSON.stringify(body);
    }
  }

  const response = await fetch(url, config);

  // Parse JSON or fall back to text
  let data;
  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    // Global 401 Logout
    if (response.status === 401 && !url.includes('/auth/login')) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }

    // Throw structured error so Redux thunks can catch it
    const error = new Error(data?.message || `HTTP ${response.status}`);
    error.status = response.status;
    error.data   = data;
    throw error;
  }

  return data;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * GET  /endpoint?params
 * @param {string} endpoint
 * @param {{ params?: object, headers?: object }} options
 */
export const get = (endpoint, options = {}) =>
  request('GET', endpoint, options);

/**
 * POST /endpoint  { body }
 * @param {string} endpoint
 * @param {object} body
 * @param {{ headers?: object }} options
 */
export const post = (endpoint, body, options = {}) =>
  request('POST', endpoint, { ...options, body });

/**
 * PUT  /endpoint  { body }
 * @param {string} endpoint
 * @param {object} body
 * @param {{ headers?: object }} options
 */
export const put = (endpoint, body, options = {}) =>
  request('PUT', endpoint, { ...options, body });

/**
 * DELETE /endpoint
 * @param {string} endpoint
 * @param {{ headers?: object }} options
 */
export const del = (endpoint, options = {}) =>
  request('DELETE', endpoint, options);

const apiClient = { get, post, put, del };
export default apiClient;
