import { Link } from '../../routes/router';

/**
 * Footer
 * Modern, clean SaaS footer matching the luminous Outreach.ai aesthetic.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-medium)',
        paddingTop: '4rem',
        paddingBottom: '3rem',
        marginTop: 'auto',
      }}
    >
      <div className="container-page">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-gradient-btn)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                EC LAB
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '340px', lineHeight: 1.6, margin: 0 }}>
              Smart laboratory repository and physical hardware verification system using tamper-proof QR &amp; NFC technology.
            </p>
          </div>

          {/* Nav Column 1 */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Repository
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <a href="#projects" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                All Projects
              </a>
              <a href="#workflow" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                The Workflow
              </a>
              <a href="#capabilities" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Capabilities
              </a>
            </div>
          </div>

          {/* Nav Column 2 */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Hardware Verification
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <Link to="/verify/demo-tag" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                NFC Tag Demo
              </Link>
              <a href="#projects" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                QR Code Scanner
              </a>
              <Link to="/signup" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Student Access
              </Link>
            </div>
          </div>

          {/* Nav Column 3 */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Account &amp; Security
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <Link to="/login" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link to="/signup" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Register as Student
              </Link>
              <a href="#pricing" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Faculty Licensing
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-medium)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>&copy; {currentYear} Electronics &amp; Communication Engineering Laboratory. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Hardware Tagging v2.0</span>
            <span>REST API v1</span>
            <span>Tamper-proof Physical Audit</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
