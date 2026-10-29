import { useRouter } from '../routes/useRouter';

/**
 * NotFoundPage
 * Friendly fallback displayed when an invalid URL or unknown project slug is requested.
 */
export default function NotFoundPage({ requestedSlug, currentPath }) {
  const { navigate } = useRouter();

  return (
    <div className="not-found-page">
      <div className="container-page">
        <div className="not-found-card">
          <div className="not-found-icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <span className="not-found-pill">404 NOT FOUND</span>
          <h1 className="not-found-title">Page or Project Not Found</h1>

          <p className="not-found-desc">
            {requestedSlug ? (
              <>
                The requested project &ldquo;<strong>{requestedSlug}</strong>&rdquo;
                does not exist in the repository, is still under evaluation review, or has not been approved for public release.
              </>
            ) : (
              <>
                The path &ldquo;<strong>{currentPath}</strong>&rdquo; does not match any active repository page.
              </>
            )}
          </p>

          <div className="not-found-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate('/#projects')}
            >
              Back to Projects Repository
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/')}
            >
              Go to Home Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
