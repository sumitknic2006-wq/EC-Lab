/**
 * EC LAB - Phase 5, Step 3 Frontend Authentication Integration Test Suite
 * Tests the frontend api.js service methods, CSRF token lifecycle, session persistence,
 * and error handling matching the actual browser behavior.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/models/User.js';

dotenv.config();

const API_BASE_URL = 'http://localhost:5001';

// In-memory CSRF simulation mirroring frontend/src/services/api.js
let inMemoryCsrfToken = null;

class BrowserSessionSimulator {
  constructor(clientId) {
    this.cookies = new Map();
    this.clientId = clientId || `frontend_client_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  storeCookies(response) {
    let rawCookies = [];
    if (typeof response.headers.getSetCookie === 'function') {
      rawCookies = response.headers.getSetCookie();
    } else {
      const single = response.headers.get('set-cookie');
      if (single) rawCookies = [single];
    }

    for (const cookieStr of rawCookies) {
      const parts = cookieStr.split(';')[0].split('=');
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (value === '' || cookieStr.toLowerCase().includes('max-age=0')) {
          this.cookies.delete(name);
        } else {
          this.cookies.set(name, value);
        }
      }
    }
  }

  async apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const method = (options.method || 'GET').toUpperCase();
    const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'x-test-client-id': this.clientId,
    };

    if (isMutating && inMemoryCsrfToken) {
      defaultHeaders['x-csrf-token'] = inMemoryCsrfToken;
    }

    const cookieHeader = Array.from(this.cookies.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');

    const headers = {
      ...defaultHeaders,
      ...options.headers,
    };

    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    let response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (err) {
      const networkError = new Error('Unable to connect to EC LAB server. Please check your network connection.');
      networkError.isNetworkError = true;
      networkError.originalError = err;
      throw networkError;
    }

    this.storeCookies(response);

    const data = await response.json().catch(() => ({}));

    if (data?.data?.csrfToken) {
      inMemoryCsrfToken = data.data.csrfToken;
    }

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('=== EC LAB Phase 5 Step 3: Frontend Authentication Integration Test ===\n');

  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    await mongoose.connect(mongoUri);
  }

  const timestamp = Date.now();
  const testEmail = `frontend.student.${timestamp}@eclab.edu`;
  const testPassword = 'Password123!';
  const createdUserIds = [];

  try {
    const browser = new BrowserSessionSimulator();

    // 1. Initial CSRF token fetch on application initialization
    console.log('Test 1: Initial CSRF Token Lifecycle');
    const csrfData = await browser.apiRequest('/api/v1/auth/csrf-token');
    assert(csrfData.status === 'success', 'CSRF token endpoint responds successfully');
    assert(typeof inMemoryCsrfToken === 'string' && inMemoryCsrfToken.length === 64, 'In-memory CSRF token initialized (64 chars)');
    const initialCsrfToken = inMemoryCsrfToken;

    // 2. Unauthenticated /me returns 401
    console.log('\nTest 2: Initial Unauthenticated State');
    let unauthCaught = false;
    try {
      await browser.apiRequest('/api/v1/auth/me');
    } catch (err) {
      unauthCaught = true;
      assert(err.status === 401, 'Unauthenticated /me request caught with 401 status');
    }
    assert(unauthCaught, 'Unauthenticated visitor correctly handled as null user without crashing');

    // 3. Signup with in-memory CSRF token & session regeneration
    console.log('\nTest 3: Student Registration with In-Memory CSRF');
    const signupData = await browser.apiRequest('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Jordan Lee',
        email: testEmail,
        password: testPassword,
        department: 'Electronics & Communication Engineering',
        rollNumber: `ECE${timestamp.toString().slice(-6)}`,
      }),
    });
    assert(signupData.status === 'success', 'Signup succeeded with status success');
    assert(signupData.data.user.role === 'student', 'User role is student');
    assert(signupData.data.user.isEmailVerified === false, 'isEmailVerified is strictly false');
    assert(signupData.data.user.passwordHash === undefined, 'passwordHash is omitted from frontend DTO');
    assert(Boolean(browser.cookies.get('eclab.sid')), 'eclab.sid cookie stored in browser simulator');
    assert(inMemoryCsrfToken !== initialCsrfToken, 'In-memory CSRF token was refreshed after session regeneration');
    if (signupData.data.user.id) {
      createdUserIds.push(signupData.data.user.id);
    }

    // 4. Reload simulation: GET /me restores authenticated state
    console.log('\nTest 4: Page Reload Simulation (/me)');
    const reloadData = await browser.apiRequest('/api/v1/auth/me');
    assert(reloadData.status === 'success', '/me returns 200 for active session');
    assert(reloadData.data.user.email === testEmail.toLowerCase(), 'Restored user profile email matches');
    assert(reloadData.data.user.department === 'Electronics & Communication Engineering', 'Restored user department matches');

    // 5. Duplicate signup error handling (409)
    console.log('\nTest 5: Duplicate Signup Error Handling');
    let duplicateCaught = false;
    try {
      await browser.apiRequest('/api/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Another Jordan',
          email: testEmail,
          password: testPassword,
        }),
      });
    } catch (err) {
      duplicateCaught = true;
      assert(err.status === 409, `Duplicate email safely caught with 409 (got ${err.status})`);
      assert(err.message.includes('already exists'), 'Readable duplicate error message');
    }
    assert(duplicateCaught, 'Duplicate registration handled safely');

    // 6. Logout with CSRF token clears server session and local cookies
    console.log('\nTest 6: Logout Lifecycle & State Reset');
    const logoutData = await browser.apiRequest('/api/v1/auth/logout', {
      method: 'POST',
    });
    assert(logoutData.status === 'success', 'Logout succeeded');

    // 7. Verify post-logout /me fails with 401
    let postLogoutCaught = false;
    try {
      await browser.apiRequest('/api/v1/auth/me');
    } catch (err) {
      postLogoutCaught = true;
      assert(err.status === 401, 'Post-logout /me returns 401');
    }
    assert(postLogoutCaught, 'Server session successfully invalidated on logout');

    // 8. Re-arm CSRF token for guest
    await browser.apiRequest('/api/v1/auth/csrf-token');
    const guestCsrf = inMemoryCsrfToken;

    // 9. Login with credentials and in-memory CSRF token
    console.log('\nTest 7: Login Flow & Token Refresh');
    const loginData = await browser.apiRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    assert(loginData.status === 'success', 'Login succeeded');
    assert(loginData.data.user.email === testEmail.toLowerCase(), 'Logged-in user email verified');
    assert(inMemoryCsrfToken !== guestCsrf, 'CSRF token refreshed upon login session regeneration');

    // 10. Failed login (wrong password)
    console.log('\nTest 8: Failed Login Error Handling');
    const failClient = new BrowserSessionSimulator();
    let loginFailCaught = false;
    try {
      await failClient.apiRequest('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: testEmail,
          password: 'IncorrectPassword999!',
        }),
      });
    } catch (err) {
      loginFailCaught = true;
      assert(err.status === 401, 'Incorrect password rejected with 401');
      assert(err.message === 'Invalid email or password', 'Generic error message protects against account probing');
    }
    assert(loginFailCaught, 'Failed login handled safely');

    // 11. Public APIs remain unauthenticated and operational
    console.log('\nTest 9: Public Repository Unauthenticated Compatibility');
    const unauthBrowser = new BrowserSessionSimulator();
    const projectsData = await unauthBrowser.apiRequest('/api/v1/projects');
    assert(projectsData.status === 'success', 'Public project repository list works without authentication');
    assert(Array.isArray(projectsData.data.projects), 'Public projects array returned');

    const healthData = await unauthBrowser.apiRequest('/api/v1/health');
    assert(healthData.status === 'ok', 'Health check is operational');

    console.log('\nCleaning up temporary test user...');
    if (createdUserIds.length > 0) {
      await User.deleteMany({ _id: { $in: createdUserIds } });
      console.log(`  ✓ Removed ${createdUserIds.length} test user record(s)`);
    }

  } catch (globalErr) {
    console.error('Test execution error:', globalErr);
    failed++;
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('  ✓ Disconnected from MongoDB');
    }
  }

  console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
