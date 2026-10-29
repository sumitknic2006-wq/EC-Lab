/**
 * EC LAB - Projects Repository Placeholder Section
 * Target for the 'Explore Projects' CTA until the full repository directory is built.
 */
export default function ProjectsPlaceholder() {
  return (
    <section id="projects" className="placeholder-section" aria-labelledby="repo-heading">
      <div className="container-page">
        <div className="section-header">
          <div className="badge-eclab">
            <span className="badge-dot" />
            <span>CENTRAL REPOSITORY</span>
          </div>
          <h2 id="repo-heading" className="section-title">
            Approved Academic Projects
          </h2>
          <p className="section-description">
            Explore validated engineering innovations across Embedded Systems, IoT, VLSI, and Robotics.
          </p>
        </div>

        <div className="repository-placeholder-card">
          <div className="placeholder-icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="1.75">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <h3 className="placeholder-card-title">Repository Catalog Activation</h3>
          <p className="placeholder-card-desc">
            The full interactive repository with department filters, academic-year search, category pills, and public project detail cards is scheduled for upcoming Phase 3 development steps.
          </p>
          <div className="placeholder-badge">
            Status: Phase 3, Step 3 Queued
          </div>
        </div>
      </div>
    </section>
  );
}
