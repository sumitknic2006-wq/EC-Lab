import { Link } from '../routes/router';
import { useRouter } from '../routes/useRouter';
import { useAuth } from '../context/useAuth';

export default function ProfilePage() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  if (loading) {
    return (
      <div className="container-page" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ color: 'var(--text-muted)' }}>Verifying session with EC LAB server...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="auth-page-wrapper">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="auth-badge">Authentication Required</div>
          <h1 className="auth-title">Session Expired or Absent</h1>
          <p className="auth-subtitle" style={{ marginBottom: '1.5rem' }}>
            Please sign in to view your academic student portal profile.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/login" className="btn-primary">
              Sign In
            </Link>
            <Link to="/signup" className="btn-secondary">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const roleBadgeClass =
    user.role === 'admin'
      ? 'role-badge-admin'
      : user.role === 'faculty'
      ? 'role-badge-faculty'
      : 'role-badge-student';

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-block">
            <div className="profile-avatar">{initial}</div>
            <div>
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-email">{user.email}</p>
            </div>
          </div>

          <div className="profile-badges">
            <span className={`role-badge ${roleBadgeClass}`}>
              {user.role}
            </span>
            {user.isEmailVerified ? (
              <span className="role-badge status-badge-verified">
                Email Verified
              </span>
            ) : (
              <span className="role-badge status-badge-pending">
                Pending Email Verification
              </span>
            )}
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-field-box">
            <div className="profile-field-label">Department</div>
            <div className="profile-field-value">{user.department || 'Not specified'}</div>
          </div>

          <div className="profile-field-box">
            <div className="profile-field-label">Student Roll Number</div>
            <div className="profile-field-value">{user.rollNumber || 'Not assigned'}</div>
          </div>

          <div className="profile-field-box">
            <div className="profile-field-label">Account Status</div>
            <div className="profile-field-value" style={{ color: '#4ade80' }}>
              ● Active
            </div>
          </div>

          <div className="profile-field-box">
            <div className="profile-field-label">Member Since</div>
            <div className="profile-field-value">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}
            </div>
          </div>
        </div>

        <div className="auth-notice-box" style={{ marginBottom: '2rem' }}>
          <strong>Email Verification Policy:</strong> Newly registered student accounts currently have <code>isEmailVerified: false</code>. Institutional email verification workflows will be integrated in future phases. No sensitive project submissions are currently affected.
        </div>

        <div className="profile-actions">
          <Link to="/" className="btn-secondary">
            Browse Repository
          </Link>
          <Link to="/verify/demo-tag" className="btn-secondary">
            Tag Verification
          </Link>
          <button
            type="button"
            className="btn-primary"
            style={{ backgroundColor: '#be123c' }}
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
