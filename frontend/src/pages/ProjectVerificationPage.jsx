import { Link } from '../routes/router';
import { useRouter } from '../routes/useRouter';

/**
 * ProjectVerificationPage
 * Informational demonstration page explaining how physical QR/NFC project
 * verification functions within the EC LAB platform.
 *
 * Demonstrates the 3-step physical-to-digital workflow, points to the
 * illustrative IoT Environmental Node project, and contrasts public metadata
 * with restricted technical assets.
 */
export default function ProjectVerificationPage() {
  const { navigate } = useRouter();

  return (
    <div className="verification-page">
      <div className="container-page">
        {/* Breadcrumb Navigation */}
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
          <span className="breadcrumb-current" aria-current="page">
            Physical QR/NFC Verification
          </span>
        </nav>

        {/* Prominent Demonstration Verification Banner */}
        <div className="demo-notice-banner verification-demo-banner" role="status">
          <span className="demo-notice-dot" aria-hidden="true" />
          <div className="demo-notice-text">
            <strong>DEMO VERIFICATION PAGE — No real tag or cryptographic verification has been performed.</strong>{' '}
            This preview models the end-user experience when scanning a physical laboratory tag. No actual NFC payload,
            HMAC cryptographic signature, or database verification has taken place.
          </div>
        </div>

        {/* Page Hero Header */}
        <header className="verification-header">
          <div className="badge-eclab">
            <span className="badge-dot" />
            <span>PHYSICAL LAB VERIFICATION (CONCEPT PREVIEW)</span>
          </div>

          <h1 className="verification-title">Verify an Academic Project</h1>

          <p className="verification-description">
            In modern engineering institutions, student prototypes on laboratory workbenches require tamper-resistant
            attribution. EC LAB is designed to support secure project-to-tag verification in a future implementation,
            enabling faculty evaluators and visitors to inspect authentic project credentials directly from any smartphone.
          </p>
        </header>

        {/* Three-Step Verification Flow */}
        <section className="verification-steps-section" aria-labelledby="vfy-steps-heading">
          <h2 id="vfy-steps-heading" className="visually-hidden">
            Three-Step Verification Process
          </h2>

          <div className="vfy-steps-grid">
            {/* Step 1 */}
            <div className="vfy-step-card">
              <div className="vfy-step-header">
                <span className="vfy-step-number">01</span>
                <span className="vfy-step-tag">PHYSICAL INTERACTION</span>
              </div>
              <div className="vfy-step-icon" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 8a6 6 0 0 1 12 0" />
                  <path d="M8.5 10.5a3.5 3.5 0 0 1 7 0" />
                  <circle cx="12" cy="13" r="1" fill="currentColor" />
                  <path d="M12 17v4" />
                </svg>
              </div>
              <h3 className="vfy-step-title">Scan QR / Tap NFC</h3>
              <p className="vfy-step-desc">
                The visitor approaches the physical prototype in the laboratory. They scan the laser-etched QR code
                or tap the embedded NTAG213 NFC chip with any standard mobile device—no dedicated application install required.
              </p>
            </div>

            {/* Step 2 */}
            <div className="vfy-step-card">
              <div className="vfy-step-header">
                <span className="vfy-step-number">02</span>
                <span className="vfy-step-tag">DIGITAL RESOLUTION</span>
              </div>
              <div className="vfy-step-icon" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <h3 className="vfy-step-title">Open Canonical Profile</h3>
              <p className="vfy-step-desc">
                The mobile browser is redirected to the project&apos;s public profile on the EC LAB platform. In a future
                production implementation, the backend will validate that the scanned hardware tag corresponds to an authentic departmental record.
              </p>
            </div>

            {/* Step 3 */}
            <div className="vfy-step-card">
              <div className="vfy-step-header">
                <span className="vfy-step-number">03</span>
                <span className="vfy-step-tag">ACADEMIC INSPECTION</span>
              </div>
              <div className="vfy-step-icon" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="m9 15 2 2 4-4" />
                </svg>
              </div>
              <h3 className="vfy-step-title">Review Published Information</h3>
              <p className="vfy-step-desc">
                Evaluators immediately review the verified abstract, academic year, department, student contributors,
                faculty guide, architecture flowchart, and prototype demonstration video on the spot.
              </p>
            </div>
          </div>
        </section>

        {/* Illustrative Simulation Scan Card */}
        <section className="simulated-scan-card" aria-labelledby="sim-scan-heading">
          <div className="sim-scan-top-bar">
            <div className="sim-scan-tag-indicator">
              <span className="scan-pulse-dot" aria-hidden="true" />
              <span>SIMULATED DEMO SCAN RESULT</span>
            </div>
            <span className="demo-indicator-pill">NON-FUNCTIONAL PREVIEW</span>
          </div>

          <div className="sim-scan-content">
            <div className="sim-scan-visual">
              <div className="sim-qr-box" aria-hidden="true">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <path d="M14 14h3v3h-3zM17 17h4v4h-4zM14 20h3v1h-3z" />
                </svg>
              </div>
              <div className="sim-tag-id-label">
                <span>SIMULATED TAG IDENTIFIER</span>
                <code>ECLAB-DEMO-TAG-8492</code>
              </div>
            </div>

            <div className="sim-scan-details">
              <span className="sim-status-badge">
                ⚠ Illustrative Demonstration Only — Unverified Record
              </span>
              <h2 id="sim-scan-heading" className="sim-project-title">
                IoT Smart Laboratory Environmental Node
              </h2>
              <div className="sim-project-meta">
                <span>Department: Electronics &amp; Communication Engineering</span>
                <span className="meta-sep" aria-hidden="true">•</span>
                <span>Academic Year: 2025-2026</span>
                <span className="meta-sep" aria-hidden="true">•</span>
                <span>Location: Lab 402, Workbench 07</span>
              </div>
              <p className="sim-project-summary">
                Low-power environmental telemetry station engineered with ESP32 and LoRaWAN for laboratory
                micro-climate compliance. All attributes displayed here are mock values for interface review.
              </p>

              <div className="sim-scan-actions">
                <Link
                  to="/projects/iot-environmental-node"
                  className="btn-primary"
                  aria-label="Open illustrative IoT Environmental Node public overview"
                >
                  <span>Open Illustrative Project Overview</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigate('/#projects')}
                  aria-label="Return to central repository"
                >
                  Return to Projects Repository
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Public vs. Restricted Information Boundary Section */}
        <section className="verification-boundary-section" aria-labelledby="boundary-heading">
          <div className="section-header">
            <div className="badge-eclab">
              <span className="badge-dot" />
              <span>ACCESS CONTROL POLICY</span>
            </div>
            <h2 id="boundary-heading" className="section-title">
              Public vs. Restricted Information Boundary
            </h2>
            <p className="section-description">
              EC LAB enforces strict intellectual property separation. Scanning a physical tag grants immediate access
              to general public credentials while keeping proprietary technical files safely locked.
            </p>
          </div>

          <div className="boundary-comparison-grid">
            {/* Public Information Card */}
            <div className="boundary-card boundary-card-public">
              <div className="boundary-card-header">
                <div className="boundary-icon-wrapper public-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="boundary-title">Public Project Information</h3>
                  <span className="boundary-subtitle">Available to all visitors via tag scan</span>
                </div>
              </div>

              <ul className="boundary-list">
                <li className="boundary-list-item allowed">
                  <span className="boundary-check" aria-hidden="true">✓</span>
                  <div>
                    <strong>Project Overview &amp; Abstract:</strong> High-level problem statement and engineering objective.
                  </div>
                </li>
                <li className="boundary-list-item allowed">
                  <span className="boundary-check" aria-hidden="true">✓</span>
                  <div>
                    <strong>Academic Context:</strong> Department, academic year, semester, and laboratory location.
                  </div>
                </li>
                <li className="boundary-list-item allowed">
                  <span className="boundary-check" aria-hidden="true">✓</span>
                  <div>
                    <strong>Team Attribution:</strong> Student contributors and assigned faculty guide designations.
                  </div>
                </li>
                <li className="boundary-list-item allowed">
                  <span className="boundary-check" aria-hidden="true">✓</span>
                  <div>
                    <strong>System Flowchart:</strong> High-level functional architecture and block diagrams.
                  </div>
                </li>
                <li className="boundary-list-item allowed">
                  <span className="boundary-check" aria-hidden="true">✓</span>
                  <div>
                    <strong>Demonstration Video:</strong> Short recorded prototype walkthrough and testbench operation.
                  </div>
                </li>
              </ul>
            </div>

            {/* Restricted Technical Assets Card */}
            <div className="boundary-card boundary-card-restricted">
              <div className="boundary-card-header">
                <div className="boundary-icon-wrapper restricted-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <h3 className="boundary-title">Restricted Technical Documents</h3>
                  <span className="boundary-subtitle">Requires authenticated authorization</span>
                </div>
              </div>

              <ul className="boundary-list">
                <li className="boundary-list-item locked">
                  <span className="boundary-cross" aria-hidden="true">🔒</span>
                  <div>
                    <strong>PCB Schematics &amp; Gerbers:</strong> KiCad/Altium production fabrication archives.
                  </div>
                </li>
                <li className="boundary-list-item locked">
                  <span className="boundary-cross" aria-hidden="true">🔒</span>
                  <div>
                    <strong>Firmware Source Repositories:</strong> Micro-controller C/C++ code, API keys, and cryptographic seeds.
                  </div>
                </li>
                <li className="boundary-list-item locked">
                  <span className="boundary-cross" aria-hidden="true">🔒</span>
                  <div>
                    <strong>Internal Defense Evaluations:</strong> Committee grading rubrics, thesis reports, and defense marks.
                  </div>
                </li>
                <li className="boundary-list-item locked">
                  <span className="boundary-cross" aria-hidden="true">🔒</span>
                  <div>
                    <strong>Formal Access Workflow:</strong> Accessible only to active faculty supervisors and administrators via the EC LAB approval service.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Security & Boundary Notice Footer Box */}
        <div className="security-notice-box" role="note">
          <div className="security-notice-icon" aria-hidden="true">ℹ</div>
          <p className="security-notice-text">
            <strong>Demonstration Boundary Notice:</strong> This page is purely an informational user-experience preview.
            No real QR codes, NFC tags, or cryptographic proofs have been generated or validated. In future phases,
            authorized hardware tags will link to secure backend verification services with time-limited signed tokens.
          </p>
        </div>
      </div>
    </div>
  );
}
