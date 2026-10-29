import { Link } from '../../routes/router';

/**
 * EC LAB - How It Works Placeholder Section
 * Explains the physical QR/NFC verification workflow concisely.
 */
export default function HowItWorksPlaceholder() {
  return (
    <section id="how-it-works" className="placeholder-section" aria-labelledby="hiw-heading">
      <div className="container-page">
        <div className="section-header">
          <div className="badge-eclab">
            <span className="badge-dot" />
            <span>VERIFICATION WORKFLOW</span>
          </div>
          <h2 id="hiw-heading" className="section-title">
            How Physical Laboratory Verification Works
          </h2>
          <p className="section-description">
            EC LAB bridges physical academic hardware prototypes with secure, centralized cloud records.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">01</div>
            <h3 className="step-title">Scan QR or Tap NFC</h3>
            <p className="step-desc">
              Every physical lab project carries a unique, tamper-resistant QR code and NFC tag. Visitors or evaluators tap or scan using any modern smartphone without requiring a special app.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">02</div>
            <h3 className="step-title">Instant Public Verification</h3>
            <p className="step-desc">
              Instantly view the project&apos;s verified summary, functional flowchart, demonstration video, and student contributor credentials without needing an account.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">03</div>
            <h3 className="step-title">Controlled Technical Access</h3>
            <p className="step-desc">
              Confidential circuit schematics, source-code links, and fabrication files are protected. Authorized faculty and evaluators can request access with faculty-guide approval.
            </p>
          </div>
        </div>

        <div className="hiw-action-row">
          <Link to="/verify/demo-tag" className="btn-secondary">
            <span>Explore Verification Demonstration</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
