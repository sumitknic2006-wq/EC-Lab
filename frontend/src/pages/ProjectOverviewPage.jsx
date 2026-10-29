import { useState, useEffect, useCallback } from 'react';
import { getProjectBySlug, API_BASE_URL } from '../services/api';
import { Link } from '../routes/router';
import { useRouter } from '../routes/useRouter';

/**
 * Validates that an external or relative URL uses a safe protocol.
 * Rejects javascript:, data:, vbscript:, and malformed URIs.
 *
 * @param {string} url
 * @returns {boolean}
 */
function isSafeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed, window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * ProjectOverviewPage
 * Dedicated public overview for an individual academic project in EC LAB.
 * Connects directly to GET /api/v1/projects/:slug.
 * Renders approved project details, academic abstract, system flowchart,
 * demonstration video, team/faculty supervision metadata, physical QR/NFC
 * tag identification, and a prominent confidential asset boundary notice.
 */
export default function ProjectOverviewPage({ slug }) {
  const { navigate } = useRouter();

  const [loadingSlug, setLoadingSlug] = useState(slug);
  const [project, setProject] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null); // 'not_found' | 'network_error' | 'invalid_data'
  const [errorMessage, setErrorMessage] = useState(null);
  const [retryNonce, setRetryNonce] = useState(0);

  // Derived loading state prevents UI flash during slug transitions
  const isLoading = loadingSlug !== slug || (!project && !errorStatus);

  const cleanSlug = typeof slug === 'string' ? decodeURIComponent(slug).trim() : '';

  const handleRetry = useCallback(() => {
    setLoadingSlug(null);
    setErrorStatus(null);
    setErrorMessage(null);
    setRetryNonce((prev) => prev + 1);
  }, []);

  // Synchronize project data with public detail API
  useEffect(() => {
    let ignore = false;
    const abortController = new AbortController();

    getProjectBySlug(cleanSlug, { signal: abortController.signal })
      .then((response) => {
        if (!ignore) {
          const projectData = response?.data?.project;

          if (!projectData || typeof projectData !== 'object' || !projectData.title) {
            setErrorStatus('invalid_data');
            setErrorMessage('The project record is missing essential metadata.');
            setProject(null);
          } else {
            setProject(projectData);
            setErrorStatus(null);
            setErrorMessage(null);
          }
          setLoadingSlug(slug);
        }
      })
      .catch((err) => {
        if (!ignore && err.name !== 'AbortError') {
          if (
            err.status === 404 ||
            err.status === 400 ||
            err.message?.toLowerCase().includes('not found') ||
            err.message?.toLowerCase().includes('required')
          ) {
            setErrorStatus('not_found');
            setErrorMessage(err.message || 'Project not found');
          } else {
            setErrorStatus('network_error');
            setErrorMessage(
              err.message || 'Failed to connect to the laboratory project repository.'
            );
          }
          setProject(null);
          setLoadingSlug(slug);
        }
      });


    return () => {
      ignore = true;
      abortController.abort();
    };
  }, [slug, cleanSlug, retryNonce]);

  // Shared Breadcrumb Component
  const renderBreadcrumb = (currentTitle) => (
    <nav className="detail-breadcrumb" aria-label="Breadcrumbs">
      <button
        type="button"
        className="btn-back-link"
        onClick={() => navigate('/#projects')}
        aria-label="Return to Projects Repository"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back to Projects Repository</span>
      </button>

      <span className="breadcrumb-separator" aria-hidden="true">/</span>
      <Link to="/" className="breadcrumb-crumb">Home</Link>
      <span className="breadcrumb-separator" aria-hidden="true">/</span>
      <button
        type="button"
        className="breadcrumb-crumb-btn"
        onClick={() => navigate('/#projects')}
      >
        Repository
      </button>
      <span className="breadcrumb-separator" aria-hidden="true">/</span>
      <span className="breadcrumb-current" aria-current="page">
        {currentTitle || cleanSlug || 'Overview'}
      </span>
    </nav>
  );

  // State 1: Active Loading Indicator
  if (isLoading) {
    return (
      <div className="project-detail-page">
        <div className="container-page">
          {renderBreadcrumb('Loading Project...')}
          <div className="repo-loading-state" role="status" aria-live="polite">
            <div className="repo-loading-spinner" aria-hidden="true" />
            <p className="repo-loading-text">
              Loading academic project overview for &ldquo;<strong>{cleanSlug}</strong>&rdquo;...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Project Not Found (404)
  if (errorStatus === 'not_found') {
    return (
      <div className="project-detail-page">
        <div className="container-page">
          {renderBreadcrumb('Project Not Found')}
          <div className="empty-state-card" role="status">
            <div className="empty-state-icon" aria-hidden="true">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="empty-state-title">Project Not Found</h2>
            <p className="empty-state-desc">
              The requested academic project &ldquo;<strong>{cleanSlug}</strong>&rdquo; does not
              exist in the repository, is still under review, or has not been approved for public display.
            </p>
            <div className="detail-error-actions">
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

  // State 3: API / Network Failure (with Retry)
  if (errorStatus === 'network_error') {
    return (
      <div className="project-detail-page">
        <div className="container-page">
          {renderBreadcrumb('Connection Error')}
          <div className="repo-error-state" role="alert">
            <div className="repo-error-icon" aria-hidden="true">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="repo-error-title">Repository Connection Error</h2>
            <p className="repo-error-desc">
              Unable to load project &ldquo;<strong>{cleanSlug}</strong>&rdquo; from the laboratory
              API service ({API_BASE_URL}).
              {errorMessage ? ` (${errorMessage})` : ' Please verify the backend server is reachable.'}
            </p>
            <div className="detail-error-actions">
              <button
                type="button"
                className="btn-retry"
                onClick={handleRetry}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span>Retry Loading</span>
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/#projects')}
              >
                Back to Projects Repository
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 4: Invalid Data Response
  if (errorStatus === 'invalid_data' || !project) {
    return (
      <div className="project-detail-page">
        <div className="container-page">
          {renderBreadcrumb('Invalid Data')}
          <div className="repo-error-state" role="alert">
            <div className="repo-error-icon" aria-hidden="true">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="repo-error-title">Invalid Project Record</h2>
            <p className="repo-error-desc">
              The repository service returned an incomplete or invalid project record for &ldquo;<strong>{cleanSlug}</strong>&rdquo;.
            </p>
            <div className="detail-error-actions">
              <button
                type="button"
                className="btn-retry"
                onClick={handleRetry}
              >
                <span>Retry Loading</span>
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/#projects')}
              >
                Back to Projects Repository
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 5: Success Response with Approved Project Record
  const teamMembers = Array.isArray(project.teamMembers) ? project.teamMembers : [];
  const facultyGuides = Array.isArray(project.facultyGuides) ? project.facultyGuides : [];
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const hasSafeFlowchart = isSafeUrl(project.flowchartImageUrl);
  const hasSafeVideo = isSafeUrl(project.publicDemoVideoUrl);
  const hasSafeQrAsset = isSafeUrl(project.qrCodeAssetUrl);

  return (
    <div className="project-detail-page">
      <div className="container-page">
        {/* Breadcrumb Navigation */}
        {renderBreadcrumb(project.title)}

        {/* Live Repository Project Record Banner */}
        <div className="live-repo-banner detail-live-banner" role="status">
          <span className="live-repo-dot" aria-hidden="true" />
          <div className="live-repo-text">
            <strong>Official Project Record:</strong> This is the verified public overview of an approved
            academic project published from the EC LAB laboratory repository.
          </div>
        </div>

        {/* Project Hero Header */}
        <header className="project-detail-header">
          <div className="detail-top-badges">
            {project.category && (
              <span className="project-category-badge">{project.category}</span>
            )}
            <span className="approved-indicator-pill">APPROVED RECORD</span>
            {project.academicYear && (
              <span className="badge-academic-year">{project.academicYear}</span>
            )}
          </div>

          <h1 className="project-detail-title">{project.title}</h1>

          {/* Academic Affiliation Row */}
          {(project.department || project.laboratory || project.semester) && (
            <div className="project-detail-meta-row">
              {project.department && (
                <div className="meta-block">
                  <span className="meta-label">Department</span>
                  <span className="meta-value">{project.department}</span>
                </div>
              )}
              {project.department && project.laboratory && (
                <div className="meta-sep" aria-hidden="true">•</div>
              )}
              {project.laboratory && (
                <div className="meta-block">
                  <span className="meta-label">Laboratory</span>
                  <span className="meta-value">{project.laboratory}</span>
                </div>
              )}
              {(project.department || project.laboratory) && project.semester && (
                <div className="meta-sep" aria-hidden="true">•</div>
              )}
              {project.semester && (
                <div className="meta-block">
                  <span className="meta-label">Academic Stage</span>
                  <span className="meta-value">{project.semester}</span>
                </div>
              )}
            </div>
          )}

          {/* Technology Tags */}
          {tags.length > 0 && (
            <div className="project-detail-tags" aria-label="Technology Stack">
              {tags.map((tag) => (
                <span key={tag} className="tech-tag tech-tag-lg">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Confidential Asset Security Notice */}
        <div className="security-boundary-card" role="note">
          <div className="security-boundary-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div className="security-boundary-body">
            <h2 className="security-boundary-title">
              Confidential Technical Documents &amp; Source Code Restricted
            </h2>
            <p className="security-boundary-desc">
              In accordance with academic intellectual property policies, full PCB fabrication files (Gerbers),
              complete firmware repositories, and grading defense records are restricted to authorized laboratory
              evaluators. They are <strong>not publicly exposed</strong> on this overview page.
            </p>
            <div className="security-boundary-badges">
              <span className="sec-pill sec-pill-allowed">✓ Public Overview &amp; Architecture Allowed</span>
              <span className="sec-pill sec-pill-restricted">🔒 Schematics &amp; Source Code Locked</span>
            </div>
          </div>
        </div>

        {/* Two-Column Detail Layout */}
        <div className="detail-layout-grid">
          {/* Main Column */}
          <main className="detail-main-column">
            {/* Overview & Abstract Section */}
            <section className="detail-section-card" aria-labelledby="scope-heading">
              <h2 id="scope-heading" className="detail-card-heading">
                Project Scope &amp; Summary
              </h2>
              <p className="detail-lead-paragraph">
                {project.summary || 'No project summary provided.'}
              </p>

              {/* Full Academic Abstract (if provided by API) */}
              {project.abstract && (
                <div className="abstract-block">
                  <h3 className="abstract-heading">Academic Abstract</h3>
                  <p className="abstract-text">{project.abstract}</p>
                </div>
              )}
            </section>

            {/* System Architecture & Flowchart */}
            <section className="detail-section-card" aria-labelledby="architecture-heading">
              <div className="section-card-header-row">
                <h2 id="architecture-heading" className="detail-card-heading">
                  System Architecture &amp; Flowchart
                </h2>
                <span className="workflow-status-badge">PUBLIC SPECIFICATION</span>
              </div>
              <p className="detail-card-desc">
                High-level architecture illustrating hardware components, data acquisition, and functional workflow.
              </p>

              {hasSafeFlowchart ? (
                <div className="flowchart-image-container">
                  <img
                    src={project.flowchartImageUrl}
                    alt={`System architecture flowchart for ${project.title}`}
                    className="flowchart-img"
                    loading="lazy"
                  />
                  <p className="flowchart-caption">
                    Official system architecture diagram for {project.title}.
                  </p>
                </div>
              ) : (
                <div className="architecture-note-card">
                  <p className="architecture-note-text">
                    No architecture flowchart diagram has been uploaded for this public record.
                    Technical design details are summarized in the scope and academic abstract above.
                  </p>
                </div>
              )}
            </section>

            {/* Prototype Demo Video Section */}
            <section className="detail-section-card" aria-labelledby="demo-video-heading">
              <h2 id="demo-video-heading" className="detail-card-heading">
                Prototype Demonstration Video
              </h2>
              <p className="detail-card-desc">
                Academic project submissions may include a recorded video demonstrating bench testing,
                sensor telemetry, or hardware functionality.
              </p>

              {hasSafeVideo ? (
                <div className="demo-video-container">
                  <a
                    href={project.publicDemoVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-watch-video"
                    aria-label={`Watch demonstration video for ${project.title} on external host`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>Watch Demonstration Video</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                  <p className="video-external-notice">
                    Links to verified laboratory demonstration media hosted externally.
                  </p>
                </div>
              ) : (
                <div className="demo-video-placeholder-frame" aria-label="Demo Video Placeholder">
                  <div className="video-inner-visual">
                    <div className="video-circuit-grid" aria-hidden="true" />
                    <div className="video-play-mock-btn" aria-hidden="true">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    <div className="video-placeholder-badge">
                      NO DEMONSTRATION VIDEO ATTACHED
                    </div>
                  </div>

                  <div className="video-meta-bar">
                    <div className="video-meta-title">Laboratory Prototype Recording</div>
                    <div className="video-meta-note">
                      No demonstration video has been attached to this project record.
                    </div>
                  </div>
                </div>
              )}
            </section>
          </main>

          {/* Sidebar Column */}
          <aside className="detail-sidebar-column">
            {/* Physical Prototype Tag Identification Card */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <div className="sidebar-header-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M6 8a6 6 0 0 1 12 0" />
                    <path d="M8.5 10.5a3.5 3.5 0 0 1 7 0" />
                    <circle cx="12" cy="13" r="1" fill="currentColor" />
                    <path d="M12 17v4" />
                  </svg>
                </div>
                <h3 className="sidebar-card-title">Physical Prototype Tag</h3>
              </div>

              <p className="sidebar-card-text">
                Physical laboratory hardware prototypes are labeled with QR or NFC identifiers linking
                evaluators directly to this public record.
              </p>

              <div className="verification-details-list">
                <div className="vfy-item">
                  <span className="vfy-label">Hardware QR Identifier</span>
                  <span className="vfy-code">
                    {project.qrCodeIdentifier || 'Identifier Pending'}
                  </span>
                </div>
                {project.laboratory && (
                  <div className="vfy-item">
                    <span className="vfy-label">Assigned Laboratory</span>
                    <span className="vfy-value">{project.laboratory}</span>
                  </div>
                )}
                {project.academicYear && (
                  <div className="vfy-item">
                    <span className="vfy-label">Academic Evaluation Year</span>
                    <span className="vfy-value">{project.academicYear}</span>
                  </div>
                )}
              </div>

              {/* QR Code Asset Preview if available */}
              {hasSafeQrAsset && (
                <div className="qr-asset-preview">
                  <img
                    src={project.qrCodeAssetUrl}
                    alt={`Physical prototype QR code for ${project.title}`}
                    className="qr-asset-img"
                    loading="lazy"
                  />
                  <span className="qr-asset-caption">Registered Physical Tag QR</span>
                </div>
              )}

              <div className="vfy-verified-badge">
                <span className="vfy-check" aria-hidden="true">✓</span>
                <span>Approved Academic Laboratory Record</span>
              </div>

              <div className="sidebar-link-action">
                <Link to="/verify/demo-tag" className="btn-link-learn-verify">
                  <span>How Physical Verification Works</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Academic Supervision & Team Members */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <div className="sidebar-header-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="sidebar-card-title">Project Team &amp; Supervision</h3>
              </div>

              {/* Faculty Guides */}
              <div className="faculty-guide-block">
                <div className="team-role-label">Faculty Supervision</div>
                {facultyGuides.length > 0 ? (
                  facultyGuides.map((guide, idx) => (
                    <div key={guide.name || idx} className="faculty-guide-item">
                      <div className="faculty-name">{guide.name}</div>
                      {guide.designation && <div className="faculty-desc">{guide.designation}</div>}
                      {guide.department && <div className="faculty-sub">{guide.department}</div>}
                    </div>
                  ))
                ) : (
                  <div className="faculty-desc">No faculty supervisors listed.</div>
                )}
              </div>

              {/* Student Team */}
              <div className="team-members-list">
                <div className="team-role-label">Student Contributors</div>
                {teamMembers.length > 0 ? (
                  teamMembers.map((member, idx) => (
                    <div key={member.name || idx} className="team-member-item">
                      <div className="member-avatar" aria-hidden="true">
                        {member.name ? member.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div className="member-info">
                        <div className="member-name">{member.name || 'Student Contributor'}</div>
                        {member.contribution && (
                          <div className="member-role">{member.contribution}</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="faculty-desc">No student contributors listed.</div>
                )}
              </div>
            </div>

            {/* Confidential Assets Policy Box */}
            <div className="sidebar-card sidebar-card-restricted">
              <div className="sidebar-card-header">
                <div className="sidebar-header-icon red-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="sidebar-card-title">Restricted Assets</h3>
              </div>

              <p className="sidebar-card-text">
                The following technical documents are protected under departmental intellectual property policies:
              </p>

              <ul className="restricted-list">
                <li className="restricted-item">
                  <span className="restricted-bullet" aria-hidden="true">🔒</span>
                  <span>Complete KiCad / Altium schematic files &amp; PCB Gerber archives</span>
                </li>
                <li className="restricted-item">
                  <span className="restricted-bullet" aria-hidden="true">🔒</span>
                  <span>Microcontroller firmware source code and proprietary network keys</span>
                </li>
                <li className="restricted-item">
                  <span className="restricted-bullet" aria-hidden="true">🔒</span>
                  <span>Evaluation defense rubrics and confidential committee assessment records</span>
                </li>
              </ul>

              <div className="request-help-text">
                Authorized faculty members, mentors, and accredited evaluators may request access through the EC LAB governance portal.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
