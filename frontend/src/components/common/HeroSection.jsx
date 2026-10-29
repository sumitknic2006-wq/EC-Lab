/**
 * EC LAB - Landing Page Hero Section
 * Features:
 * - Eyebrow, Main Heading with subtle red accent, supporting description
 * - Primary CTA ('Explore Projects' -> #projects) and Secondary CTA ('How It Works' -> #how-it-works)
 * - 3-column trust/feature points
 * - Right-side physical hardware & QR/NFC verification concept visual (CSS + SVG)
 */
export default function HeroSection() {
  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="container-page">
        <div className="hero-grid">
          {/* Left Column: Hero Messaging */}
          <div className="hero-content">
            <div className="badge-eclab">
              <span className="badge-dot" />
              <span>SMART LABORATORY · PROJECT REPOSITORY</span>
            </div>

            <h1 id="hero-heading" className="hero-title">
              Discover Innovation.{' '}
              <span className="text-accent-red">Verify Every Project.</span>
            </h1>

            <p className="hero-paragraph">
              Explore academic projects through one centralized repository. Scan
              a project&apos;s QR code or NFC tag to access its verified overview,
              demonstration, technologies, and team details.
            </p>

            <div className="hero-cta-group">
              <a href="#projects" className="btn-primary" aria-label="Explore Projects section">
                Explore Projects
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </a>

              <a href="#how-it-works" className="btn-secondary" aria-label="Learn how EC LAB works">
                How It Works
              </a>
            </div>

            {/* Trust & Key Features Row */}
            <div className="hero-trust-row" role="list">
              <div className="trust-item" role="listitem">
                <span className="trust-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01" />
                  </svg>
                </span>
                <span>QR &amp; NFC Project Verification</span>
              </div>

              <div className="trust-item" role="listitem">
                <span className="trust-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m4 6 8-4 8 4-8 4-8-4Z" />
                    <path d="m4 12 8 4 8-4" />
                    <path d="m4 18 8 4 8-4" />
                  </svg>
                </span>
                <span>Centralized Academic Repository</span>
              </div>

              <div className="trust-item" role="listitem">
                <span className="trust-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <span>Controlled Access to Technical Documents</span>
              </div>
            </div>
          </div>

          {/* Right Column: Physical Laboratory Project & QR/NFC Concept Visual */}
          <div className="hero-visual-wrapper" aria-hidden="true">
            <div className="device-card">
              {/* Device Header Bar */}
              <div className="device-header">
                <div className="device-status">
                  <span className="live-dot" />
                  <span className="device-tag">LABORATORY PROTOTYPE</span>
                </div>
                <div className="device-id">SIMULATED TAG: ECLAB-2026-NFC</div>
              </div>

              {/* Hardware PCB / Sensor Visual Body */}
              <div className="device-body">
                {/* Circuit Traces Background SVG */}
                <svg className="circuit-svg" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 40 H120 V90 H200 V40 H380" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                  <path d="M40 180 H140 V130 H260 V180 H360" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                  <path d="M120 90 L160 130" stroke="rgba(225,29,72,0.3)" strokeWidth="1.5" />
                  <path d="M240 110 L280 70" stroke="rgba(225,29,72,0.3)" strokeWidth="1.5" />
                  <circle cx="120" cy="90" r="3" fill="#e11d48" />
                  <circle cx="160" cy="130" r="3" fill="#e11d48" />
                  <circle cx="280" cy="70" r="3" fill="#e11d48" />
                </svg>

                {/* Central QR / NFC Tag Module */}
                <div className="qr-module-card">
                  <div className="qr-target-corners">
                    <span className="corner top-left" />
                    <span className="corner top-right" />
                    <span className="corner bottom-left" />
                    <span className="corner bottom-right" />
                  </div>

                  {/* Stylized QR Matrix Pattern */}
                  <div className="qr-matrix">
                    <svg width="100" height="100" viewBox="0 0 29 29" fill="none">
                      {/* Top-Left Position Detection Pattern */}
                      <rect x="1" y="1" width="7" height="7" fill="#f8fafc" />
                      <rect x="2" y="2" width="5" height="5" fill="#0c1222" />
                      <rect x="3" y="3" width="3" height="3" fill="#e11d48" />

                      {/* Top-Right Position Detection Pattern */}
                      <rect x="21" y="1" width="7" height="7" fill="#f8fafc" />
                      <rect x="22" y="2" width="5" height="5" fill="#0c1222" />
                      <rect x="23" y="3" width="3" height="3" fill="#e11d48" />

                      {/* Bottom-Left Position Detection Pattern */}
                      <rect x="1" y="21" width="7" height="7" fill="#f8fafc" />
                      <rect x="2" y="22" width="5" height="5" fill="#0c1222" />
                      <rect x="3" y="23" width="3" height="3" fill="#e11d48" />

                      {/* Data Dots & Timing Patterns */}
                      <rect x="11" y="2" width="2" height="2" fill="#94a3b8" />
                      <rect x="15" y="2" width="2" height="2" fill="#94a3b8" />
                      <rect x="11" y="6" width="2" height="2" fill="#e11d48" />
                      <rect x="10" y="10" width="3" height="3" fill="#f8fafc" />
                      <rect x="16" y="10" width="3" height="3" fill="#f8fafc" />
                      <rect x="13" y="14" width="3" height="3" fill="#e11d48" />
                      <rect x="10" y="18" width="2" height="2" fill="#94a3b8" />
                      <rect x="15" y="18" width="2" height="2" fill="#f8fafc" />
                      <rect x="11" y="22" width="2" height="2" fill="#94a3b8" />
                      <rect x="15" y="24" width="2" height="2" fill="#e11d48" />
                      <rect x="21" y="11" width="2" height="2" fill="#94a3b8" />
                      <rect x="25" y="14" width="2" height="2" fill="#f8fafc" />
                      <rect x="22" y="18" width="3" height="3" fill="#e11d48" />
                      <rect x="21" y="24" width="2" height="2" fill="#94a3b8" />
                    </svg>
                  </div>

                  <div className="nfc-scan-hint">
                    <span className="nfc-signal-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2.2">
                        <path d="M6 8a6 6 0 0 1 12 0" />
                        <path d="M8.5 10.5a3.5 3.5 0 0 1 7 0" />
                        <circle cx="12" cy="13" r="1" fill="#e11d48" />
                        <path d="M12 17v4" />
                      </svg>
                    </span>
                    <span>TAP NFC OR SCAN QR</span>
                  </div>
                </div>
              </div>

              {/* Device Project Metadata Preview */}
              <div className="device-footer">
                <div className="device-project-title">
                  IoT Smart Laboratory Environmental Node
                </div>
                <div className="device-meta-badges">
                  <span className="mini-badge">Embedded Systems</span>
                  <span className="mini-badge">LoRaWAN</span>
                  <span className="mini-badge badge-verified">✓ Simulated Verification Concept</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
