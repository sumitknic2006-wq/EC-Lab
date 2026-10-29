import { useState, useEffect, useId, useRef } from 'react';
import { getProjects, API_BASE_URL } from '../../services/api';
import { Link } from '../../routes/router';

const CATEGORIES = [
  'All Projects',
  'Embedded Systems',
  'IoT & Smart Systems',
  'Robotics & Automation',
  'VLSI & Microelectronics',
  'Edge AI & Computer Vision',
  'Communication & Signal Processing',
  'Power Electronics & Renewable Energy',
];

/**
 * ProjectRepositorySection
 * Connects directly to the public project repository API (GET /api/v1/projects).
 * Renders live, approved academic projects with search, category filtering,
 * pagination, and defensive handling for loading, empty, and error states.
 */
export default function ProjectRepositorySection() {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [retryNonce, setRetryNonce] = useState(0);

  const searchInputId = useId();
  const debounceTimerRef = useRef(null);

  // Debounced search input handler (300ms)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(value.trim());
      setCurrentPage(1);
      setIsLoading(true);
    }, 300);
  };

  const handleClearSearch = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setSearchQuery('');
    setDebouncedSearch('');
    setCurrentPage(1);
    setIsLoading(true);
  };

  const handleCategorySelect = (category) => {
    if (category === selectedCategory) return;
    setSelectedCategory(category);
    setCurrentPage(1);
    setIsLoading(true);
  };

  const handleResetFilters = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedCategory('All Projects');
    setCurrentPage(1);
    setIsLoading(true);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setRetryNonce((prev) => prev + 1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setIsLoading(true);
  };

  // Asynchronously synchronize projects with the public API
  useEffect(() => {
    let ignore = false;
    const abortController = new AbortController();

    getProjects({
      page: currentPage,
      limit: 12,
      category: selectedCategory !== 'All Projects' ? selectedCategory : undefined,
      search: debouncedSearch || undefined,
      signal: abortController.signal,
    })
      .then((response) => {
        if (!ignore) {
          const fetchedProjects = Array.isArray(response?.data?.projects)
            ? response.data.projects
            : [];

          const fetchedPagination = response?.data?.pagination || {
            total: fetchedProjects.length,
            page: currentPage,
            limit: 12,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          };

          setProjects(fetchedProjects);
          setPagination(fetchedPagination);
          setErrorMessage(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore && err.name !== 'AbortError') {
          setErrorMessage(
            err.message || 'Unable to connect to the academic project repository service.'
          );
          setProjects([]);
          setPagination({
            total: 0,
            page: 1,
            limit: 12,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          });
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
      abortController.abort();
    };
  }, [currentPage, selectedCategory, debouncedSearch, retryNonce]);

  const hasActiveFilters = Boolean(searchQuery.trim() || selectedCategory !== 'All Projects');

  return (
    <section id="projects" className="repository-section" aria-labelledby="repo-heading">
      <div className="container-page">
        {/* Section Header */}
        <div className="section-header">
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--accent-blue)',
              letterSpacing: '0.04em',
              marginBottom: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>•</span> Central Repository
          </div>
          <h2 id="repo-heading" className="section-title">
            Explore Verified <span className="gradient-text">Academic Research</span>
          </h2>
          <p className="section-description">
            Approved electronics and communication engineering projects published in the laboratory repository.
            Explore verified research, filter by technology domains, or inspect project technical summaries.
          </p>
        </div>

        {/* Live Repository Status Banner */}
        <div className="live-repo-banner" role="status">
          <span className="live-repo-dot" aria-hidden="true" />
          <span className="live-repo-text">
            <strong>Live Central Repository:</strong> Connected to public API (<code>GET /api/v1/projects</code>).
            Displaying only faculty-evaluated, approved laboratory projects.
          </span>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="repo-toolbar">
          {/* Search Input Box */}
          <div className="search-box-wrapper">
            <label htmlFor={searchInputId} className="visually-hidden">
              Search projects by title, summary, or technology tags
            </label>
            <div className="search-input-container">
              <span className="search-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </span>
              <input
                id={searchInputId}
                type="text"
                className="search-input"
                placeholder="Search projects, technologies, or keywords..."
                value={searchQuery}
                onChange={handleSearchChange}
                autoComplete="off"
                maxLength={100}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={handleClearSearch}
                  aria-label="Clear search input"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="category-chips-group" role="tablist" aria-label="Project categories">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`category-chip ${isSelected ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count Summary (shown when not loading and not in error) */}
        {!isLoading && !errorMessage && (
          <div className="results-summary">
            <span>
              Showing <strong>{projects.length}</strong> of <strong>{pagination.total}</strong> approved {pagination.total === 1 ? 'project' : 'projects'}
              {selectedCategory !== 'All Projects' && ` in "${selectedCategory}"`}
              {debouncedSearch && ` matching "${debouncedSearch}"`}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                className="btn-link-reset"
                onClick={handleResetFilters}
              >
                Reset filters
              </button>
            )}
          </div>
        )}

        {/* State 1: Initial & Active Loading State */}
        {isLoading && (
          <div className="repo-loading-state" role="status" aria-live="polite">
            <div className="repo-loading-spinner" aria-hidden="true" />
            <p className="repo-loading-text">Loading approved academic projects from repository...</p>
          </div>
        )}

        {/* State 2: API / Network Error with Retry Action */}
        {!isLoading && errorMessage && (
          <div className="repo-error-state" role="alert">
            <div className="repo-error-icon" aria-hidden="true">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="repo-error-title">Repository Connection Error</h3>
            <p className="repo-error-desc">
              Unable to load projects from the laboratory API service ({API_BASE_URL}).
              {errorMessage ? ` (${errorMessage})` : ' Please check that the server is online.'}
            </p>
            <button
              type="button"
              className="btn-retry"
              onClick={handleRetry}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* State 3: Empty State (Zero results found or Empty DB) */}
        {!isLoading && !errorMessage && projects.length === 0 && (
          <div className="empty-state-card" role="status">
            <div className="empty-state-icon" aria-hidden="true">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
                <path d="M8 11h6" />
              </svg>
            </div>
            {hasActiveFilters ? (
              <>
                <h3 className="empty-state-title">No matching projects found</h3>
                <p className="empty-state-desc">
                  No approved projects match your query {debouncedSearch ? <strong>&ldquo;{debouncedSearch}&rdquo;</strong> : ''}
                  {selectedCategory !== 'All Projects' && ` under category "${selectedCategory}"`}.
                </p>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleResetFilters}
                >
                  Clear filters and show all projects
                </button>
              </>
            ) : (
              <>
                <h3 className="empty-state-title">Academic Repository is Empty</h3>
                <p className="empty-state-desc">
                  There are currently no approved academic projects published in the laboratory repository.
                  Verified student and faculty capstones will appear here once approved by evaluators.
                </p>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleRetry}
                >
                  Refresh Repository
                </button>
              </>
            )}
          </div>
        )}

        {/* State 4: Successful Response with Projects */}
        {!isLoading && !errorMessage && projects.length > 0 && (
          <>
            <div className="projects-grid">
              {projects.map((project) => {
                const projectId = project.id || project.slug || project.title;
                const projectSlug = project.slug || '';
                const tags = Array.isArray(project.tags) ? project.tags : [];

                return (
                  <article key={projectId} className="project-card">
                    {/* Card Header */}
                    <div className="card-top-row">
                      <span className="project-category-badge">
                        {project.category || 'General'}
                      </span>
                      <span className="approved-indicator-pill">APPROVED RECORD</span>
                    </div>

                    {/* Card Title & Meta */}
                    <h3 className="project-title">{project.title || 'Untitled Project'}</h3>
                    <div className="project-academic-meta">
                      {project.academicYear && <span>{project.academicYear}</span>}
                      {project.academicYear && project.department && (
                        <span className="meta-sep" aria-hidden="true">•</span>
                      )}
                      {project.department && <span>{project.department}</span>}
                    </div>

                    {/* Card Description / Summary */}
                    <p className="project-description">
                      {project.summary || 'No project summary available.'}
                    </p>

                    {/* Technology Tags */}
                    {tags.length > 0 && (
                      <div className="project-tags-list" aria-label="Technology tags">
                        {tags.map((tag) => (
                          <span key={tag} className="tech-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Card Action Control */}
                    <div className="card-footer-action">
                      {projectSlug ? (
                        <Link
                          to={`/projects/${encodeURIComponent(projectSlug)}`}
                          className="btn-overview-link"
                          aria-label={`View public overview for project ${project.title}`}
                        >
                          <span className="btn-link-label">
                            <span>View Public Overview</span>
                          </span>
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            aria-hidden="true"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ) : (
                        <span className="overview-unavailable-text">Overview Unavailable</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <nav className="repo-pagination" aria-label="Projects repository pagination">
                <button
                  type="button"
                  className="btn-pagination"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={!pagination.hasPrevPage || isLoading}
                  aria-label="Previous page"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  <span>Previous</span>
                </button>
                <span className="pagination-info">
                  Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
                </span>
                <button
                  type="button"
                  className="btn-pagination"
                  onClick={() => handlePageChange(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={!pagination.hasNextPage || isLoading}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
}
