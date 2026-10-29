/**
 * EC LAB - Phase 5, Step 2 Authentication Test Suite
 * Verifies all 15 required security and functional test cases:
 * 1. Signup creates a student account.
 * 2. Attempting to submit role: 'admin' cannot create an admin.
 * 3. Client-supplied isActive and isEmailVerified cannot override safe defaults.
 * 4. Duplicate email is handled safely.
 * 5. Valid login succeeds.
 * 6. Incorrect credentials fail with a generic response.
 * 7. Inactive accounts cannot log in.
 * 8. /me returns 401 without a session and safe user data with a valid session.
 * 9. Logout invalidates the session.
 * 10. Session ID changes on login (fixation defense).
 * 11. Password hash is never returned.
 * 12. CSRF checks reject invalid state-changing requests and allow valid protected requests.
 * 13. Rate limits work without exposing secrets.
 * 14. Existing health and public project endpoints still work.
 * 15. Existing project-access authorization behavior remains unchanged.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import { checkProjectAccess } from '../src/services/projectAccessService.js';

dotenv.config();

const API_BASE_URL = 'http://localhost:5001';

class TestClient {
  constructor() {
    this.cookies = new Map();
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

  getCookie(name) {
    return this.cookies.get(name);
  }

  clear() {
    this.cookies.clear();
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const cookieHeader = Array.from(this.cookies.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');

    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    this.storeCookies(response);

    const data = await response.json().catch(() => ({}));
    return {
      status: response.status,
      ok: response.ok,
      headers: response.headers,
      data,
    };
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

async function runTestSuite() {
  console.log('=== EC LAB Phase 5 Step 2: Authentication Test Suite ===\n');

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('FATAL: MONGODB_URI is not set in environment.');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  const createdUserIds = [];

  const timestamp = Date.now();
  const testStudentEmail = `test.student.${timestamp}@eclab.edu`;
  const testPassword = 'StrongPassword123!';

  try {
    const client = new TestClient();

    // ------------------------------------------------------------------------
    // Test 1: Signup creates a student account & establishes session
    // ------------------------------------------------------------------------
    console.log('Test 1: Student Account Signup');
    const signupRes = await client.request('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Alex Rivera',
        email: testStudentEmail,
        password: testPassword,
        department: 'Electronics & Communication Engineering',
        rollNumber: `ECE${timestamp.toString().slice(-6)}`,
      }),
    });

    assert(signupRes.status === 201, `Signup returned 201 Created (got ${signupRes.status})`);
    assert(signupRes.data.status === 'success', 'Signup status is success');
    assert(signupRes.data.data?.user?.role === 'student', 'User role is student');
    assert(signupRes.data.data?.user?.email === testStudentEmail.toLowerCase(), 'Email matches normalized email');
    assert(signupRes.data.data?.user?.passwordHash === undefined, 'passwordHash is NOT in response');
    assert(typeof signupRes.data.data?.csrfToken === 'string', 'CSRF token is returned in signup payload');
    assert(Boolean(client.getCookie('eclab.sid')), 'eclab.sid session cookie was issued');

    if (signupRes.data.data?.user?.id) {
      createdUserIds.push(signupRes.data.data.user.id);
    }

    const sessionCookieOnSignup = client.getCookie('eclab.sid');

    // ------------------------------------------------------------------------
    // Test 2: Attempting to submit role: 'admin' cannot create an admin
    // ------------------------------------------------------------------------
    console.log('\nTest 2: Privilege Escalation Prevention on Signup');
    const client2 = new TestClient();
    const maliciousEmail = `malicious.admin.${timestamp}@eclab.edu`;
    const exploitRes = await client2.request('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Attacker Admin',
        email: maliciousEmail,
        password: 'Password999!',
        role: 'admin', // Maliciously requested role
      }),
    });

    assert(exploitRes.status === 201, 'Signup accepted');
    assert(exploitRes.data.data?.user?.role === 'student', 'Security: Role was forced to "student", NOT "admin"');
    if (exploitRes.data.data?.user?.id) {
      createdUserIds.push(exploitRes.data.data.user.id);
      // Double check in database directly
      const dbRecord = await User.findById(exploitRes.data.data.user.id).lean();
      assert(dbRecord.role === 'student', 'Database record confirms role is strictly "student"');
    }

    // ------------------------------------------------------------------------
    // Test 3: Client-supplied isActive and isEmailVerified cannot override safe defaults
    // ------------------------------------------------------------------------
    console.log('\nTest 3: Safe Account Defaults Enforcement');
    const client3 = new TestClient();
    const spoofEmail = `spoof.flags.${timestamp}@eclab.edu`;
    const spoofRes = await client3.request('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Spoof Flags',
        email: spoofEmail,
        password: 'Password123!',
        isActive: false, // Attempt to set inactive
        isEmailVerified: true, // Attempt to set verified
      }),
    });

    assert(spoofRes.status === 201, 'Signup succeeded');
    assert(spoofRes.data.data?.user?.isEmailVerified === false, 'isEmailVerified is strictly false (client override ignored)');
    if (spoofRes.data.data?.user?.id) {
      createdUserIds.push(spoofRes.data.data.user.id);
      const dbRecord = await User.findById(spoofRes.data.data.user.id).lean();
      assert(dbRecord.isActive === true, 'isActive defaults to true');
      assert(dbRecord.isEmailVerified === false, 'isEmailVerified defaults to false');
    }

    // ------------------------------------------------------------------------
    // Test 4: Duplicate email is handled safely (409 Conflict)
    // ------------------------------------------------------------------------
    console.log('\nTest 4: Duplicate Email Safety');
    const dupRes = await client.request('/api/v1/auth/signup', {
      method: 'POST',
      headers: {
        'x-csrf-token': signupRes.data.data?.csrfToken,
      },
      body: JSON.stringify({
        name: 'Another Alex',
        email: testStudentEmail, // duplicate
        password: 'Password123!',
      }),
    });

    assert(dupRes.status === 409, `Duplicate email rejected with 409 Conflict (got ${dupRes.status})`);
    assert(dupRes.data.status === 'fail', 'Response status is fail');
    assert(dupRes.data.message === 'An account with this email already exists', 'Safe duplicate error message returned');

    // ------------------------------------------------------------------------
    // Test 5: Valid login succeeds & returns public DTO + fresh session
    // ------------------------------------------------------------------------
    console.log('\nTest 5: Valid Login');
    const loginClient = new TestClient();
    const loginRes = await loginClient.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testStudentEmail,
        password: testPassword,
      }),
    });

    assert(loginRes.status === 200, `Login returned 200 OK (got ${loginRes.status})`);
    assert(loginRes.data.status === 'success', 'Login status is success');
    assert(loginRes.data.data?.user?.email === testStudentEmail.toLowerCase(), 'Logged in user email matches');
    assert(loginRes.data.data?.user?.passwordHash === undefined, 'passwordHash is NOT in login response');
    assert(Boolean(loginClient.getCookie('eclab.sid')), 'eclab.sid cookie received on login');
    const sessionCookieOnLogin = loginClient.getCookie('eclab.sid');

    // ------------------------------------------------------------------------
    // Test 6: Incorrect credentials fail with generic response (401)
    // ------------------------------------------------------------------------
    console.log('\nTest 6: Invalid Credentials Generic Rejection');
    const badLoginClient = new TestClient();
    const badPasswordRes = await badLoginClient.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testStudentEmail,
        password: 'WrongPassword999!',
      }),
    });
    assert(badPasswordRes.status === 401, `Wrong password returned 401 (got ${badPasswordRes.status})`);
    assert(badPasswordRes.data.message === 'Invalid email or password', 'Generic error message for wrong password');

    const nonExistentEmailRes = await badLoginClient.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nobody.does.not.exist@eclab.edu',
        password: 'SomePassword123!',
      }),
    });
    assert(nonExistentEmailRes.status === 401, `Nonexistent email returned 401 (got ${nonExistentEmailRes.status})`);
    assert(nonExistentEmailRes.data.message === 'Invalid email or password', 'Generic error message for non-existent email');

    // ------------------------------------------------------------------------
    // Test 7: Inactive accounts cannot log in (401)
    // ------------------------------------------------------------------------
    console.log('\nTest 7: Inactive Account Login Rejection');
    const inactiveEmail = `inactive.user.${timestamp}@eclab.edu`;
    const inactiveUser = await User.create({
      name: 'Deactivated User',
      email: inactiveEmail,
      passwordHash: await (await import('bcryptjs')).default.hash('Password123!', 12),
      role: 'student',
      isActive: false, // Inactive account
    });
    createdUserIds.push(inactiveUser._id);

    const inactiveLoginRes = await (new TestClient()).request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: inactiveEmail,
        password: 'Password123!',
      }),
    });

    assert(inactiveLoginRes.status === 401, `Inactive user login returned 401 (got ${inactiveLoginRes.status})`);
    assert(inactiveLoginRes.data.message === 'Invalid email or password', 'Generic rejection prevents probing inactive status');

    // ------------------------------------------------------------------------
    // Test 8: /me returns 401 without session and safe user data with valid session
    // ------------------------------------------------------------------------
    console.log('\nTest 8: Current User (/me) Verification');
    const unauthClient = new TestClient();
    const unauthMe = await unauthClient.request('/api/v1/auth/me');
    assert(unauthMe.status === 401, `Unauthenticated /me returns 401 (got ${unauthMe.status})`);

    const authMe = await loginClient.request('/api/v1/auth/me');
    assert(authMe.status === 200, `Authenticated /me returns 200 OK (got ${authMe.status})`);
    assert(authMe.data.data?.user?.email === testStudentEmail.toLowerCase(), 'Profile matches logged-in user');
    assert(authMe.data.data?.user?.passwordHash === undefined, 'passwordHash omitted from /me');

    // ------------------------------------------------------------------------
    // Test 9: Logout invalidates the session
    // ------------------------------------------------------------------------
    console.log('\nTest 9: Session Termination via Logout');
    const preLogoutCsrf = loginRes.data.data?.csrfToken;
    const logoutRes = await loginClient.request('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'x-csrf-token': preLogoutCsrf,
      },
    });

    assert(logoutRes.status === 200, `Logout returned 200 OK (got ${logoutRes.status})`);
    assert(logoutRes.data.message === 'Logged out successfully', 'Logout success message');

    // Now trying /me with the same client should fail
    const postLogoutMe = await loginClient.request('/api/v1/auth/me');
    assert(postLogoutMe.status === 401, `Post-logout /me returns 401 (got ${postLogoutMe.status})`);

    // ------------------------------------------------------------------------
    // Test 10: Session ID changes on login (fixation defense)
    // ------------------------------------------------------------------------
    console.log('\nTest 10: Session Fixation Defense (ID Regeneration)');
    const fixationClient = new TestClient();
    // 1. Visit csrf-token to establish a pre-session
    const preCsrfRes = await fixationClient.request('/api/v1/auth/csrf-token');
    const preSessionCookie = fixationClient.getCookie('eclab.sid');
    assert(Boolean(preSessionCookie), 'Pre-session cookie established');

    // 2. Perform login with pre-session CSRF token
    const fixLoginRes = await fixationClient.request('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'x-csrf-token': preCsrfRes.data.data?.csrfToken,
      },
      body: JSON.stringify({
        email: testStudentEmail,
        password: testPassword,
      }),
    });
    assert(fixLoginRes.status === 200, `Fixation test login returned 200 (got ${fixLoginRes.status})`);
    const postLoginCookie = fixationClient.getCookie('eclab.sid');
    assert(Boolean(postLoginCookie), 'Post-login cookie exists');
    assert(preSessionCookie !== postLoginCookie, 'Session ID changed upon successful login');

    // ------------------------------------------------------------------------
    // Test 11: Password hash is never returned in any response
    // ------------------------------------------------------------------------
    console.log('\nTest 11: Password Hash Leakage Check');
    assert(signupRes.data.data?.user?.passwordHash === undefined, 'No passwordHash in signup response');
    assert(loginRes.data.data?.user?.passwordHash === undefined, 'No passwordHash in login response');
    assert(authMe.data.data?.user?.passwordHash === undefined, 'No passwordHash in /me response');

    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------
    // Test 12: CSRF checks reject invalid state-changing requests & allow valid protected requests
    // ------------------------------------------------------------------------
    console.log('\nTest 12: CSRF Protection on Mutating Requests & Login CSRF Prevention');
    // Login to get an active session
    const csrfTestClient = new TestClient();
    const authSession = await csrfTestClient.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testStudentEmail,
        password: testPassword,
      }),
    });
    const validCsrf = authSession.data.data?.csrfToken;

    // 1. Mutating request with MISSING CSRF token -> should 403
    const noCsrfLogout = await csrfTestClient.request('/api/v1/auth/logout', {
      method: 'POST',
    });
    assert(noCsrfLogout.status === 403, `Mutating request with missing CSRF token rejected with 403 (got ${noCsrfLogout.status})`);
    assert(noCsrfLogout.data.message === 'Invalid or missing CSRF token', 'Correct CSRF rejection message');

    // 2. Mutating request with INVALID CSRF token -> should 403
    const badCsrfLogout = await csrfTestClient.request('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'x-csrf-token': 'invalid_forged_csrf_token_1234567890abcdef1234567890abcdef1234567890ab',
      },
    });
    assert(badCsrfLogout.status === 403, `Mutating request with forged CSRF token rejected with 403 (got ${badCsrfLogout.status})`);

    // 3. Mutating request with VALID CSRF token -> should 200
    const goodCsrfLogout = await csrfTestClient.request('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'x-csrf-token': validCsrf,
      },
    });
    assert(goodCsrfLogout.status === 200, `Mutating request with valid CSRF token succeeded with 200 (got ${goodCsrfLogout.status})`);

    // 4. Login CSRF Prevention: establish pre-existing session token, then attempt login without/with token
    const loginCsrfClient = new TestClient();
    const preSessionTokenRes = await loginCsrfClient.request('/api/v1/auth/csrf-token');
    const preSessionCsrfToken = preSessionTokenRes.data.data?.csrfToken;
    assert(typeof preSessionCsrfToken === 'string', 'Pre-session CSRF token obtained successfully');

    // Attempt login on this session WITHOUT CSRF token -> rejected with 403
    const missingCsrfLogin = await loginCsrfClient.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testStudentEmail,
        password: testPassword,
      }),
    });
    assert(missingCsrfLogin.status === 403, `Login on existing session without CSRF token rejected with 403 (got ${missingCsrfLogin.status})`);
    assert(missingCsrfLogin.data.message === 'Invalid or missing CSRF token for existing session', 'Safe Login CSRF rejection message');

    // Attempt login on this session with FORGED CSRF token -> rejected with 403
    const forgedCsrfLogin = await loginCsrfClient.request('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'x-csrf-token': 'forged_csrf_token_64_characters_long_abcdef0123456789abcdef01234567',
      },
      body: JSON.stringify({
        email: testStudentEmail,
        password: testPassword,
      }),
    });
    assert(forgedCsrfLogin.status === 403, `Login on existing session with forged CSRF token rejected with 403 (got ${forgedCsrfLogin.status})`);

    // Attempt login on this session with VALID CSRF token -> succeeds with 200
    const validCsrfLogin = await loginCsrfClient.request('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'x-csrf-token': preSessionCsrfToken,
      },
      body: JSON.stringify({
        email: testStudentEmail,
        password: testPassword,
      }),
    });
    assert(validCsrfLogin.status === 200, `Login on existing session with valid CSRF token succeeded with 200 (got ${validCsrfLogin.status})`);
    assert(typeof validCsrfLogin.data.data?.csrfToken === 'string', 'Refreshed CSRF token returned after login regeneration');
    assert(validCsrfLogin.data.data?.csrfToken !== preSessionCsrfToken, 'New CSRF token is refreshed and distinct from pre-session token');

    // ------------------------------------------------------------------------
    // Test 13: Rate limits work without exposing secrets & enforce HTTP 429
    // ------------------------------------------------------------------------
    console.log('\nTest 13: Rate Limiting & Header Validation');
    const rlRes = await (new TestClient()).request('/api/v1/auth/csrf-token');
    assert(rlRes.status === 200, 'CSRF token endpoint responds');
    // Check that no secret or DB URI is leaked in headers or body
    const bodyStr = JSON.stringify(rlRes.data);
    assert(!bodyStr.includes('mongodb+srv'), 'No database URI leaked');
    assert(!bodyStr.includes('secret_key'), 'No secret leaked in body');

    // Actual HTTP 429 enforcement test on authLimiter (15 attempts max per window)
    console.log('  Testing authLimiter threshold enforcement (15 max attempts)...');
    const rlProbeClient = new TestClient();
    const probeClientId = `probe_${timestamp}`;
    let hitRateLimit = false;
    let rateLimitResponse = null;

    // Send 15 requests to reach the limit
    for (let i = 1; i <= 15; i++) {
      await rlProbeClient.request('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'x-test-client-id': probeClientId,
        },
        body: JSON.stringify({
          email: 'wrong@example.com',
          password: 'WrongPassword123!',
        }),
      });
    }

    // 16th request MUST exceed limit and return HTTP 429
    rateLimitResponse = await rlProbeClient.request('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'x-test-client-id': probeClientId,
      },
      body: JSON.stringify({
        email: 'wrong@example.com',
        password: 'WrongPassword123!',
      }),
    });

    if (rateLimitResponse.status === 429) {
      hitRateLimit = true;
    }

    assert(hitRateLimit, `Exceeding auth rate limit returned 429 Too Many Requests (got ${rateLimitResponse?.status})`);
    assert(rateLimitResponse?.data?.status === 'fail', 'Rate limit response has status "fail"');
    assert(rateLimitResponse?.data?.message?.includes('Too many authentication attempts'), 'Rate limit message is descriptive and safe');
    assert(rateLimitResponse?.headers.get('ratelimit-limit') === '15', 'RateLimit-Limit header is 15');
    assert(rateLimitResponse?.headers.get('ratelimit-remaining') === '0', 'RateLimit-Remaining header is 0');

    // Verify health endpoint remains accessible even when authentication is rate-limited
    const healthDuringRl = await (new TestClient()).request('/api/v1/health');
    assert(healthDuringRl.status === 200, 'Health check remains 200 OK and exempt from rate limiter');

    // ------------------------------------------------------------------------
    // Test 14: Existing health and public project endpoints still work
    // ------------------------------------------------------------------------
    console.log('\nTest 14: Public API Compatibility (Unauthenticated Access)');
    const healthRes = await (new TestClient()).request('/api/v1/health');
    assert(healthRes.status === 200, 'Health endpoint responds 200 without auth');
    assert(healthRes.data.status === 'ok', 'Health status is ok');

    const projectsRes = await (new TestClient()).request('/api/v1/projects');
    assert(projectsRes.status === 200, 'Projects list endpoint responds 200 without auth');
    assert(Array.isArray(projectsRes.data.data?.projects), 'Projects array is accessible unauthenticated');

    // ------------------------------------------------------------------------
    // Test 15: Existing project-access authorization behavior remains unchanged
    // ------------------------------------------------------------------------
    console.log('\nTest 15: Project Access Authorization Hierarchy Intact');
    const mockStudentUser = {
      _id: new mongoose.Types.ObjectId(),
      role: 'student',
      isActive: true,
    };
    const mockAdminUser = {
      _id: new mongoose.Types.ObjectId(),
      role: 'admin',
      isActive: true,
    };
    const mockProject = {
      _id: new mongoose.Types.ObjectId(),
      status: 'approved',
      submittedBy: mockStudentUser._id,
      teamMembers: [],
      facultyGuides: [],
    };

    // Owner should have download access
    const ownerAuth = await checkProjectAccess(mockProject, mockStudentUser);
    assert(ownerAuth.isAuthorized === true && ownerAuth.reason === 'owner', 'Owner retains full project access');

    // Admin should have full access
    const adminAuth = await checkProjectAccess(mockProject, mockAdminUser);
    assert(adminAuth.isAuthorized === true && adminAuth.reason === 'admin', 'Admin retains full laboratory oversight');

    // Inactive user must be denied
    const inactiveAuth = await checkProjectAccess(mockProject, { _id: new mongoose.Types.ObjectId(), isActive: false });
    assert(inactiveAuth.isAuthorized === false && inactiveAuth.reason === 'user_inactive', 'Inactive user is denied project access');

  } finally {
    console.log('\nCleaning up all test accounts from MongoDB...');
    if (createdUserIds.length > 0) {
      const deleteResult = await User.deleteMany({ _id: { $in: createdUserIds } });
      console.log(`  ✓ Removed ${deleteResult.deletedCount} temporary test user(s)`);
    }

    // Clean up test sessions created during test run
    const sessionCollection = mongoose.connection.collection('sessions');
    if (sessionCollection) {
      await sessionCollection.deleteMany({
        $or: [
          { 'session.userId': { $in: createdUserIds.map((id) => String(id)) } },
        ],
      });
      console.log('  ✓ Cleaned up temporary test sessions');
    }

    await mongoose.disconnect();
    console.log('  ✓ Disconnected from MongoDB');
  }

  console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
