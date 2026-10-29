import { useState, useEffect } from 'react';
import { AuthContext } from './authContext';
import {
  fetchCsrfToken,
  getMe,
  login as apiLogin,
  signup as apiSignup,
  logout as apiLogout,
} from '../services/api';

/**
 * AuthProvider
 * Centralizes client-side authentication state backed by secure HTTP-only cookies
 * and in-memory CSRF tokens.
 *
 * Security guarantees:
 * - Passwords, session IDs, and tokens are NEVER stored in localStorage or sessionStorage.
 * - Initial state is always verified against MongoDB via GET /api/v1/auth/me.
 * - CSRF token is obtained on initialization and refreshed upon session regeneration.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Fetch CSRF token for the session, then verify identity via /me
    fetchCsrfToken()
      .catch((err) => {
        console.warn('Initial CSRF token fetch notice:', err.message);
        return null;
      })
      .then(() => getMe())
      .then((response) => {
        if (isMounted) {
          setUser(response?.data?.user || null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setUser(null);
          if (err.isNetworkError) {
            setAuthError('Unable to connect to the authentication service. Working in offline mode.');
          }
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Performs user login.
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} Safe user DTO
   */
  const login = async (credentials) => {
    setAuthError(null);
    try {
      const response = await apiLogin(credentials);
      const authenticatedUser = response?.data?.user;
      setUser(authenticatedUser || null);
      return authenticatedUser;
    } catch (err) {
      if (err.status === 403 && err.message?.toLowerCase().includes('csrf')) {
        await fetchCsrfToken().catch(() => {});
      }
      throw err;
    }
  };

  /**
   * Registers a new student account (public student-only registration).
   * @param {Object} userData - { name, email, password, department, rollNumber }
   * @returns {Promise<Object>} Safe user DTO
   */
  const signup = async (userData) => {
    setAuthError(null);
    try {
      const response = await apiSignup(userData);
      const registeredUser = response?.data?.user;
      setUser(registeredUser || null);
      return registeredUser;
    } catch (err) {
      if (err.status === 403 && err.message?.toLowerCase().includes('csrf')) {
        await fetchCsrfToken().catch(() => {});
      }
      throw err;
    }
  };

  /**
   * Logs out the current user, destroys the server session, and clears client state.
   */
  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.warn('Logout server notification notice:', err.message);
    } finally {
      setUser(null);
      await fetchCsrfToken().catch(() => {});
    }
  };

  /**
   * Refreshes the user's profile state directly from MongoDB.
   */
  const refreshUser = async () => {
    try {
      const response = await getMe();
      if (response?.data?.user) {
        setUser(response.data.user);
        return response.data.user;
      }
      setUser(null);
      return null;
    } catch (err) {
      if (err.status === 401) {
        setUser(null);
      }
      throw err;
    }
  };

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: Boolean(user),
    isStudent: user?.role === 'student',
    isFaculty: user?.role === 'faculty',
    isAdmin: user?.role === 'admin',
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
