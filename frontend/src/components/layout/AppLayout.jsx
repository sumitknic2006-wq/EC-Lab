import Header from './Header';
import Footer from './Footer';

/**
 * Shared layout foundation providing top navigation, responsive main container,
 * and academic institutional footer.
 */
export default function AppLayout({ children }) {
  return (
    <div style={styles.wrapper}>
      <Header />
      <main style={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-secondary)',
  },
  main: {
    flex: 1,
    paddingTop: '2.5rem',
    paddingBottom: '3.5rem',
  },
};
