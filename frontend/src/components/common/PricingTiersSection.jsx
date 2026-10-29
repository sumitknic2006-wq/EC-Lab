import { Link } from '../../routes/router';

/**
 * PricingTiersSection
 * Recreates the exact 3-card pricing grid from the reference image:
 * - Eyebrow: "• Pricing"
 * - Title: "Simple pricing that pays for itself."
 * - Starter ($0), Growth ($24 featured with gradient badge), Enterprise ($16/seat)
 */
export default function PricingTiersSection() {
  return (
    <section id="pricing" className="pricing-section" aria-labelledby="pricing-title">
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
          <span>•</span> Pricing &amp; Access
        </div>

        {/* Heading */}
        <h2
          id="pricing-title"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            margin: '0 auto 3.5rem auto',
            maxWidth: '600px',
          }}
        >
          Simple pricing that <br />
          <span className="gradient-text">pays for itself.</span>
        </h2>

        {/* 3-Card Grid */}
        <div className="pricing-grid">
          {/* Card 1: Starter */}
          <div className="pricing-card">
            <h3 className="pricing-plan-name">Starter</h3>
            <p className="pricing-plan-sub">For Individual Students &amp; Researchers</p>

            <div className="pricing-price-row">
              <span className="pricing-amount">$0</span>
              <span className="pricing-period">/ lifetime</span>
            </div>

            <Link
              to="/signup"
              className="btn-secondary"
              style={{ width: '100%', marginBottom: '2rem', textAlign: 'center' }}
            >
              Get Started →
            </Link>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
              Sandbox
            </div>

            <ul className="pricing-feature-list">
              <li className="pricing-feature-item">
                <span className="pricing-check-icon" style={{ color: '#94a3b8' }}>✓</span>
                <span>Public Repository Search</span>
              </li>
              <li className="pricing-feature-item">
                <span className="pricing-check-icon" style={{ color: '#94a3b8' }}>✓</span>
                <span>QR Code Verification Scan</span>
              </li>
              <li className="pricing-feature-item">
                <span className="pricing-check-icon" style={{ color: '#94a3b8' }}>✓</span>
                <span>Student Project Submission</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Growth (Featured) */}
          <div className="pricing-card featured">
            <div className="pricing-badge-featured">Most Popular</div>

            <h3 className="pricing-plan-name">Growth</h3>
            <p className="pricing-plan-sub">For Active Research Labs &amp; Faculty</p>

            <div className="pricing-price-row">
              <span className="pricing-amount" style={{ color: 'var(--accent-blue)' }}>$24</span>
              <span className="pricing-period">/ month</span>
            </div>

            <a
              href="#projects"
              className="btn-primary"
              style={{ width: '100%', marginBottom: '2rem', textAlign: 'center' }}
            >
              Start 7-Day Free Trial →
            </a>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
              Full Capabilities
            </div>

            <ul className="pricing-feature-list">
              <li className="pricing-feature-item">
                <span className="pricing-check-icon">✓</span>
                <span><strong>5,000 AI Project Scans</strong></span>
              </li>
              <li className="pricing-feature-item">
                <span className="pricing-check-icon">✓</span>
                <span>Advanced Schematic &amp; PCB Sync</span>
              </li>
              <li className="pricing-feature-item">
                <span className="pricing-check-icon">✓</span>
                <span>Multi-channel QR + NFC Tagging</span>
              </li>
              <li className="pricing-feature-item">
                <span className="pricing-check-icon">✓</span>
                <span>Faculty Review &amp; Audit Portal</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Enterprise */}
          <div className="pricing-card">
            <h3 className="pricing-plan-name">Enterprise</h3>
            <p className="pricing-plan-sub">For Department &amp; University Scale</p>

            <div className="pricing-price-row">
              <span className="pricing-amount">$16</span>
              <span className="pricing-period">/ user / mo</span>
            </div>

            <a
              href="#projects"
              className="btn-secondary"
              style={{ width: '100%', marginBottom: '2rem', textAlign: 'center' }}
            >
              Contact Sales →
            </a>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
              Institutional Scale
            </div>

            <ul className="pricing-feature-list">
              <li className="pricing-feature-item">
                <span className="pricing-check-icon">✓</span>
                <span>Unlimited Repository Records</span>
              </li>
              <li className="pricing-feature-item">
                <span className="pricing-check-icon">✓</span>
                <span>Dedicated Campus Account Manager</span>
              </li>
              <li className="pricing-feature-item">
                <span className="pricing-check-icon">✓</span>
                <span>Campus SSO &amp; Advanced Security</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
