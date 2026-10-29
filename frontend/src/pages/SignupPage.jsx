import { useState } from 'react';
import { Link } from '../routes/router';
import { useRouter } from '../routes/useRouter';
import { useAuth } from '../context/useAuth';

export default function SignupPage() {
  const { signup, isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('Electronics & Communication Engineering');
  const [rollNumber, setRollNumber] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated, redirect to profile
  if (isAuthenticated) {
    navigate('/profile', { replace: true });
    return null;
  }

  const validateForm = () => {
    if (!name.trim() || name.trim().length < 2 || name.trim().length > 100) {
      return 'Full Name must be between 2 and 100 characters.';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim().toLowerCase())) {
      return 'Please provide a valid academic email address.';
    }

    if (!password || password.length < 8 || password.length > 128) {
      return 'Password must be between 8 and 128 characters long.';
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpper || !hasLower || !hasNumber) {
      return 'Password must include at least one uppercase letter, one lowercase letter, and one number.';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        department: department.trim(),
        rollNumber: rollNumber.trim() ? rollNumber.trim().toUpperCase() : undefined,
      });
      navigate('/profile');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check the provided information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" style={{ maxWidth: '540px' }}>
        <div className="auth-header">
          <div className="auth-badge">
            <span className="badge-dot" />
            Student Registration
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Register your student profile for the EC LAB academic project repository
          </p>
        </div>

        {errorMessage && (
          <div className="auth-alert auth-alert-error" role="alert">
            {errorMessage}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-name">
              Full Name <span style={{ color: 'var(--accent-red)' }}>*</span>
            </label>
            <input
              id="signup-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              autoComplete="name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">
              Academic Email <span style={{ color: 'var(--accent-red)' }}>*</span>
            </label>
            <input
              id="signup-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.rivera@eclab.edu"
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-department">
              Department
            </label>
            <input
              id="signup-department"
              type="text"
              className="form-input"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Electronics & Communication Engineering"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-roll">
              Student Roll / Enrollment Number{' '}
              <span className="form-label-hint">(Optional)</span>
            </label>
            <input
              id="signup-roll"
              type="text"
              className="form-input"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="ECE2026-042"
              autoComplete="off"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">
              Password <span style={{ color: 'var(--accent-red)' }}>*</span>
              <span className="form-label-hint">8–128 chars, 1 uppercase, 1 lowercase, 1 digit</span>
            </label>
            <div className="form-input-wrapper">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input has-toggle"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="new-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="btn-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={0}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-confirm-password">
              Confirm Password <span style={{ color: 'var(--accent-red)' }}>*</span>
            </label>
            <input
              id="signup-confirm-password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="new-password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Registering Account...' : 'Register Student Account'}
          </button>
        </form>

        <div className="auth-notice-box">
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>Institutional Policy:</strong> Public registration is strictly reserved for students. Newly created accounts start with unverified email status (<code>isEmailVerified: false</code>) until institutional email verification is configured.
          </p>
          <p style={{ margin: 0 }}>
            Faculty and administrative accounts are provisioned exclusively through laboratory administration.
          </p>
        </div>

        <div className="auth-footer">
          Already registered?{' '}
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
