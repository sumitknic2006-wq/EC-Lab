/**
 * TheWorkflowSection
 * Recreates the 2-column workflow layout from the reference image:
 * Left side:
 * - Eyebrow: "• The Lab Workflow"
 * - Title: "From prototype to verified archive. Fully automated."
 * - "Learn now →" gradient pill button
 * - Floating workflow card preview with simulated nodes
 * Right side:
 * - 3 clean stacked feature cards with icons and descriptions
 */
export default function TheWorkflowSection() {
  return (
    <section id="workflow" className="workflow-section" aria-labelledby="workflow-title">
      <div className="container-page">
        <div className="workflow-layout-grid">
          {/* Left Column: Heading, CTA, and Preview Card */}
          <div className="workflow-left">
            <div
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--accent-blue)',
                letterSpacing: '0.04em',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>•</span> The Lab Workflow
            </div>

            <h2
              id="workflow-title"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
                margin: '0 0 1.5rem 0',
              }}
            >
              From prototype to verified archive.{' '}
              <span className="gradient-text">Fully automated.</span>
            </h2>

            <a
              href="#projects"
              className="btn-primary"
              style={{
                padding: '0.65rem 1.4rem',
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '2rem',
              }}
            >
              Learn now →
            </a>

            {/* Simulated Workflow Visual Card */}
            <div className="workflow-card-preview">
              <div className="workflow-preview-node">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Hardware Telemetry Enriched
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      PCB layout and sensor data stream synced
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#0284c7',
                    background: 'rgba(2, 132, 199, 0.08)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  AUTONOMOUS
                </span>
              </div>

              <div className="workflow-preview-node">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'rgba(37, 99, 235, 0.12)',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    ⚡
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Faculty Review &amp; Approval
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Encrypted audit trail with tamper-proof signature
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  VERIFIED
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Vertical Feature Cards */}
          <div className="workflow-right-stack">
            {/* Card 1 */}
            <div className="workflow-feature-box">
              <div className="feature-box-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="feature-box-title">Finds Ideal Projects</h3>
              <p className="feature-box-desc">
                AI scans academic repositories using your department criteria — Embedded Systems, IoT, Robotics,
                Biomedical, and Renewable Energy — with zero manual effort.
              </p>
            </div>

            {/* Card 2 */}
            <div className="workflow-feature-box">
              <div className="feature-box-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                  <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
                </svg>
              </div>
              <h3 className="feature-box-title">Enriches Technical Data</h3>
              <p className="feature-box-desc">
                Automatically enriches each project with source schematics, BOM parts list, firmware binaries,
                faculty reviewer notes, and hardware validation logs.
              </p>
            </div>

            {/* Card 3 */}
            <div className="workflow-feature-box">
              <div className="feature-box-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01" />
                </svg>
              </div>
              <h3 className="feature-box-title">Instant QR &amp; NFC Verification</h3>
              <p className="feature-box-desc">
                Tap or scan the physical hardware prototype directly in the laboratory to access authenticated
                demonstrations, evaluation scorecards, and live sensor readings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
