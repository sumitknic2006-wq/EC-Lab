import { Link } from '../../routes/router';

export default function Header() {
  return (
    <header style={styles.header}>
      <div className="container-page" style={styles.container}>
        <Link to="/" style={styles.brandLink} aria-label="EC LAB Home">
          <div style={styles.brand}>
            <div style={styles.logoMark}>
              <span style={styles.logoAccent} />
            </div>
            <div>
              <div style={styles.brandTitle}>EC LAB</div>
              <div className="header-brand-subtitle" style={styles.brandSubtitle}>
                Academic Project Repository
              </div>
            </div>
          </div>
        </Link>

        <div style={styles.tagWrapper}>
          <Link
            to="/verify/demo-tag"
            className="badge-eclab badge-clickable"
            aria-label="View QR / NFC physical verification demonstration"
          >
            <span className="badge-dot" />
            QR / NFC Verification
          </Link>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: 'var(--bg-header)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border-medium)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    height: 'var(--header-height)',
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
  },
  logoMark: {
    width: '36px',
    height: '36px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-medium)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxShadow: 'var(--shadow-sm)',
  },
  logoAccent: {
    width: '12px',
    height: '12px',
    backgroundColor: 'var(--accent-red)',
    borderRadius: '3px',
    boxShadow: 'var(--accent-red-glow)',
  },
  brandTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.25rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
  },
  brandSubtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
    letterSpacing: '0.01em',
  },
  tagWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
};
