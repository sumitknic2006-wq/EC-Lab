/**
 * EC LAB - API Service Utility
 * Centralizes API calls with configurable base URL via Vite environment variables.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

/**
 * In-memory storage for the session-bound CSRF token.
 * Tokens are NEVER persisted in localStorage, sessionStorage, or client cookies.
 */
let inMemoryCsrfToken = null;

/**
 * Returns the active in-memory CSRF token.
 * @returns {string|null}
 */
export function getCsrfToken() {
  return inMemoryCsrfToken;
}

/**
 * Updates the in-memory CSRF token.
 * @param {string|null} token
 */
export function setCsrfToken(token) {
  inMemoryCsrfToken = typeof token === 'string' && token.trim() ? token.trim() : null;
}

/**
 * Fetches and stores a fresh CSRF token from the server.
 * @returns {Promise<string>}
 */
export async function fetchCsrfToken() {
  try {
    const data = await apiRequest('/api/v1/auth/csrf-token', {
      method: 'GET',
    });
    if (data?.data?.csrfToken) {
      setCsrfToken(data.data.csrfToken);
      return data.data.csrfToken;
    }
    return null;
  } catch (error) {
    console.error('Failed to retrieve CSRF token:', error.message);
    throw error;
  }
}

/**
 * Generic helper for executing API requests.
 * Uses credentials: 'include' by default for seamless server-side session cookies.
 * Automatically attaches x-csrf-token for mutating state-changing requests.
 * Handles network failures and non-JSON responses safely without crashing.
 *
 * @param {string} endpoint - API path (e.g. '/api/v1/health')
 * @param {RequestInit} [options] - Standard fetch options
 * @returns {Promise<any>}
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const method = (options.method || 'GET').toUpperCase();
  const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // If this is a state-changing operation and we have a CSRF token in memory, attach it
  if (isMutating && inMemoryCsrfToken) {
    defaultHeaders['x-csrf-token'] = inMemoryCsrfToken;
  }

  let response;
  try {
    response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
  } catch (fetchErr) {
    const networkError = new Error('Unable to connect to EC LAB server. Please check your network connection.');
    networkError.isNetworkError = true;
    networkError.originalError = fetchErr;
    throw networkError;
  }

  const data = await response.json().catch(() => ({}));

  // Automatically update in-memory CSRF token if the server returns a refreshed token
  if (data?.data?.csrfToken) {
    setCsrfToken(data.data.csrfToken);
  }

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Checks backend health status.
 * @returns {Promise<{ status: string, message: string, timestamp?: string }>}
 */
export function checkHealth() {
  return apiRequest('/api/v1/health');
}

/**
 * Registers a new student account (public student-only registration).
 * @param {Object} userData - { name, email, password, department, rollNumber }
 * @returns {Promise<{ status: string, data: { user: Object, csrfToken: string } }>}
 */
export function signup(userData) {
  return apiRequest('/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Authenticates user credentials and establishes a fresh server session.
 * @param {Object} credentials - { email, password }
 * @returns {Promise<{ status: string, data: { user: Object, csrfToken: string } }>}
 */
export function login(credentials) {
  return apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Fetches the currently authenticated user profile from MongoDB via server session.
 * @returns {Promise<{ status: string, data: { user: Object } }>}
 */
export function getMe() {
  return apiRequest('/api/v1/auth/me', {
    method: 'GET',
  });
}

/**
 * Destroys the current server session and clears session cookies.
 * @returns {Promise<{ status: string, message: string }>}
 */
export function logout() {
  return apiRequest('/api/v1/auth/logout', {
    method: 'POST',
  });
}

/**
 * Retrieves a paginated list of approved public projects with optional filters.
 * @param {Object} [params] - Filter and pagination options
 * @param {number} [params.page] - Page number (1-based)
 * @param {number} [params.limit] - Page size limit (up to 50)
 * @param {string} [params.category] - Academic project category
 * @param {string} [params.search] - Search keyword across title, summary, tags (max 100 chars)
 * @param {string} [params.department] - Department filter
 * @param {string} [params.academicYear] - Academic year filter (e.g. '2025-2026')
 * @param {AbortSignal} [params.signal] - Optional AbortSignal for cancellation
 * @returns {Promise<{ status: string, data: { projects: Array, pagination: Object } }>}
 */
export function getProjects(params = {}) {
  const { page, limit, category, search, department, academicYear, signal } = params;
  const searchParams = new URLSearchParams();

  if (page) searchParams.append('page', String(page));
  if (limit) searchParams.append('limit', String(limit));
  if (category && category !== 'All Projects') searchParams.append('category', category);
  if (search && search.trim()) searchParams.append('search', search.trim().slice(0, 100));
  if (department) searchParams.append('department', department);
  if (academicYear) searchParams.append('academicYear', academicYear);

  const queryString = searchParams.toString();
  const endpoint = `/api/v1/projects${queryString ? `?${queryString}` : ''}`;

  return apiRequest(endpoint, { signal });
}

/**
 * Retrieves a single approved public project by its unique slug.
 * @param {string} slug - Unique project slug
 * @param {Object} [options]
 * @param {AbortSignal} [options.signal] - Optional fetch abort signal
 * @returns {Promise<{ status: string, data: { project: Object } }>}
 */
export function getProjectBySlug(slug, options = {}) {
  if (!slug || typeof slug !== 'string') {
    const error = new Error('Project slug is required');
    error.status = 400;
    return Promise.reject(error);
  }

  const encodedSlug = encodeURIComponent(slug.trim());
  const endpoint = `/api/v1/projects/${encodedSlug}`;

  return apiRequest(endpoint, options);
}

export default {
  API_BASE_URL,
  apiRequest,
  checkHealth,
  getCsrfToken,
  setCsrfToken,
  fetchCsrfToken,
  signup,
  login,
  getMe,
  logout,
  getProjects,
  getProjectBySlug,
};


