/**
 * PlatformCapabilitiesSection
 * Recreates the "One agent. Your entire outbound engine." section from the reference image:
 * - Eyebrow: "• Platform Capabilities"
 * - Title: "One platform. Your entire academic laboratory engine."
 * - 2 large top cards with interactive preview mockups
 * - 3 bottom cards for Multi-channel Access, Automated Review, and Native Git/Cloud Sync
 */
export default function PlatformCapabilitiesSection() {
  return (
    <section id="capabilities" className="capabilities-section" aria-labelledby="capabilities-title">
      <div className="container-page" style={{ textAlign: 'center' }}>
        {/* Eyebrow */}
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
          <span>•</span> All Capabilities
        </div>

        {/* Heading */}
        <h2
          id="capabilities-title"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            margin: '0 auto 3.5rem auto',
            maxWidth: '700px',
          }}
        >
          One platform. Your entire{' '}
          <span className="gradient-text">academic laboratory engine.</span>
        </h2>

        {/* Top Grid: 2 Large Cards */}
        <div className="capabilities-grid-top">
          {/* Card 1 */}
          <div className="capability-card">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
              AI Project Discovery
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Deep search across engineering departments, technologies, hardware platforms, and faculty guides with instant semantic ranking.
            </p>

            <div className="capability-mockup-area">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Catalog Accuracy</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981' }}>99.4% Verified</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Project Status</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-blue)', background: 'rgba(2,132,199,0.1)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                  APPROVED &amp; INDEXED
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="capability-card">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
              Smart Technical Schematics
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Every project automatically maps circuit pinouts, bill of materials, microcontroller firmware, and laboratory test benches.
            </p>

            <div className="capability-mockup-area">
              <div style={{ background: '#ffffff', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#0284c7' }}>
                &gt; Verified pinout: ESP32-S3 + SX1262 LoRa <br />
                &gt; Signal integrity: 98.7% SNR @ 868MHz
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: 3 Medium Cards */}
        <div className="capabilities-grid-bottom">
          <div className="capability-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: 'var(--accent-blue)' }}>⚲</div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
              Multi-channel Verification
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Scan in the physical lab with NFC, read the QR tag on hardware casing, or browse on the responsive portal.
            </p>
          </div>

          <div className="capability-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: 'var(--accent-blue)' }}>⚙</div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
              Automated Review Workflow
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Streamlined evaluation pipeline for faculty advisors to audit milestones, code, and physical hardware demos.
            </p>
          </div>

          <div className="capability-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: 'var(--accent-blue)' }}>⚡</div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
              Native Cloud &amp; Git Sync
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Continuous sync with GitHub repositories, CAD designs, circuit schematics, and secure object archives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
