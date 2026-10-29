export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div className="container-page" style={styles.container}>
        <div style={styles.info}>
          <div style={styles.title}>EC LAB</div>
          <div style={styles.description}>
            Smart Laboratory Project Repository and Verification System using QR/NFC Technology.
          </div>
        </div>
        <div style={styles.attribution}>
          &copy; {currentYear} Electronics & Communication Engineering. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-medium)',
    paddingTop: '2.5rem',
    paddingBottom: '2.5rem',
    marginTop: 'auto',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
  },
  description: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    maxWidth: '520px',
    lineHeight: 1.5,
  },
  attribution: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    paddingTop: '0.75rem',
    borderTop: '1px solid var(--border-subtle)',
    width: '100%',
  },
};
