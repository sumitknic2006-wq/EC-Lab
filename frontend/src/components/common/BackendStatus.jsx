import { useState, useEffect, useCallback } from 'react';
import { checkHealth, API_BASE_URL } from '../../services/api';

export default function BackendStatus() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const verifyConnection = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const response = await checkHealth();
      setData(response);
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Unable to connect to backend server');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    checkHealth()
      .then((response) => {
        if (isMounted) {
          setData(response);
          setStatus('success');
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Unable to connect to backend server');
          setStatus('error');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleArea}>
          <span style={styles.indicator(status)} />
          <h3 style={styles.title}>EC LAB API Connection</h3>
        </div>
        <button
          type="button"
          onClick={verifyConnection}
          disabled={status === 'loading'}
          style={styles.retestButton}
        >
          {status === 'loading' ? 'Checking...' : 'Retest'}
        </button>
      </div>

      <div style={styles.metaRow}>
        <span style={styles.label}>Target Endpoint:</span>
        <code style={styles.code}>{API_BASE_URL}/api/v1/health</code>
      </div>

      <div style={styles.content}>
        {status === 'loading' && (
          <div style={styles.stateContainer}>
            <span style={styles.loadingSpinner} />
            <span style={styles.mutedText}>Testing connection to Express backend...</span>
          </div>
        )}

        {status === 'success' && (
          <div style={styles.stateContainer}>
            <div style={styles.badgeSuccess}>Connected (HTTP 200)</div>
            <p style={styles.messageText}>
              <strong>Server Message:</strong> {data?.message || 'API is active'}
            </p>
            {data?.timestamp && (
              <p style={styles.timestampText}>
                <strong>Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {status === 'error' && (
          <div style={styles.stateContainer}>
            <div style={styles.badgeError}>Connection Failed</div>
            <p style={styles.errorText}>{error}</p>
            <p style={styles.hintText}>
              Ensure the backend is running on port 5001 (e.g. <code>cd backend && npm run dev</code>).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#0a0f1d',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '20px',
    maxWidth: '560px',
    margin: '28px auto',
    color: '#f8fafc',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(225, 29, 72, 0.1)',
    textAlign: 'left',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  titleArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  title: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#ffffff',
    letterSpacing: '-0.01em',
  },
  indicator: (status) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block',
    backgroundColor:
      status === 'success'
        ? '#10b981'
        : status === 'error'
        ? '#ef4444'
        : '#f59e0b',
    boxShadow:
      status === 'success'
        ? '0 0 8px #10b981'
        : status === 'error'
        ? '0 0 8px #ef4444'
        : '0 0 8px #f59e0b',
  }),
  retestButton: {
    backgroundColor: 'transparent',
    border: '1px solid #e11d48',
    color: '#ffffff',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    color: '#94a3b8',
    marginBottom: '14px',
    paddingBottom: '12px',
    borderBottom: '1px solid #1e293b',
  },
  label: {
    color: '#64748b',
  },
  code: {
    color: '#f43f5e',
    backgroundColor: '#111827',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'ui-monospace, monospace',
    fontSize: '0.8rem',
  },
  content: {
    minHeight: '60px',
  },
  stateContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  badgeSuccess: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '4px',
    padding: '3px 8px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  badgeError: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#f87171',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '4px',
    padding: '3px 8px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  messageText: {
    margin: '4px 0 0 0',
    color: '#e2e8f0',
    fontSize: '0.95rem',
  },
  timestampText: {
    margin: 0,
    color: '#94a3b8',
    fontSize: '0.82rem',
  },
  errorText: {
    margin: '4px 0 0 0',
    color: '#fca5a5',
    fontSize: '0.95rem',
  },
  hintText: {
    margin: '4px 0 0 0',
    color: '#64748b',
    fontSize: '0.82rem',
  },
  mutedText: {
    color: '#94a3b8',
    fontSize: '0.9rem',
  },
  loadingSpinner: {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid #e11d48',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};
