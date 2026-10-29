import { Link } from '../../routes/router';
import { useRouter } from '../../routes/useRouter';
import { useAuth } from '../../context/useAuth';

export default function Header() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="header-glass">
      <div className="container-page header-container">
        {/* Brand Left */}
        <Link to="/" className="header-brand" aria-label="EC LAB Home">
          <div className="header-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div className="header-brand-title">EC LAB</div>
            <div className="header-brand-sub">Academic Repository</div>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="header-nav-center" aria-label="Main Navigation">
          <Link to="/" className="header-nav-link">Home</Link>
          <a href="#projects" className="header-nav-link">Projects</a>
          <a href="#workflow" className="header-nav-link">The Workflow</a>
          <a href="#capabilities" className="header-nav-link">Capabilities</a>
          <a href="#pricing" className="header-nav-link">Access</a>
        </nav>

        {/* Right CTA / Auth Group */}
        <div className="header-nav-right">
          <Link
            to="/verify/demo-tag"
            className="badge-eclab badge-clickable"
            aria-label="View QR / NFC physical verification demonstration"
          >
            <span className="badge-dot" />
            QR / NFC Verification
          </Link>

          <div className="header-auth-group">
            {loading ? (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>...</span>
            ) : isAuthenticated && user ? (
              <>
                <Link to="/profile" className="header-user-btn" aria-label="View your student profile">
                  <span className="header-user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  type="button"
                  className="header-logout-btn"
                  onClick={handleLogout}
                  aria-label="Sign out of your session"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="header-login-link">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                  style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}
                >
                  Start as Student →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
