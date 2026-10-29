import { useState } from 'react';

/**
 * HeroSection
 * Recreates the exact luminous light SaaS aesthetic from the reference image:
 * - Top pill badge: "• Multi-channel Academic Lab v2.0 is live"
 * - Centered bold headline with gradient accent
 * - Dual pill CTAs ("Start as Student →", "Watch Live Demo →")
 * - Central interactive dashboard showcase with connected hubs, +24% growth velocity sparkline
 * - Overlapping floating search capsule with tab pills
 * - Institutional logo cloud
 */
export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'All', label: 'All', icon: '🌐' },
    { id: 'Translate', label: 'Translate', icon: '文' },
    { id: 'Calendar', label: 'Calendar', icon: '📅' },
    { id: 'Document', label: 'Document', icon: '📄' },
    { id: 'Map', label: 'Map', icon: '📍' },
  ];

  return (
    <section className="hero-wrapper" aria-labelledby="hero-title">
      <div className="container-page">
        {/* Pill Badge */}
        <div className="hero-pill-badge">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#0284c7',
              display: 'inline-block',
            }}
          />
          <span>Multi-channel Academic Lab v2.0 is live</span>
        </div>

        {/* Main Title */}
        <h1 id="hero-title" className="hero-main-title">
          The smartest way to <br />
          <span className="gradient-text">generate &amp; verify research at scale</span>
        </h1>

        {/* Lead Subtitle */}
        <p className="hero-lead-text">
          EC LAB finds, qualifies, and catalogs academic research and hardware prototypes 24/7
          turning laboratory archives into verified public intelligence while your campus thrives.
        </p>

        {/* Action Buttons */}
        <div className="hero-actions-row">
          <a href="#projects" className="btn-hero-primary">
            Start for free →
          </a>
          <a href="#workflow" className="btn-hero-secondary">
            Watch Live Demo →
          </a>
        </div>

        {/* Showcase Glassmorphic Dashboard Card */}
        <div className="hero-dashboard-card" aria-label="EC LAB interactive dashboard showcase">
          <div className="hero-dashboard-grid">
            {/* Left Panel: Connected Hubs */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Connected hubs</h3>
                  <p className="panel-sub">Active laboratory sensor &amp; archive sync</p>
                </div>
                <span className="hub-chip-status">Live Sync</span>
              </div>

              {/* AI Recommendation Banner */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(6, 182, 212, 0.06) 100%)',
                  border: '1px solid rgba(2, 132, 199, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--accent-blue)', fontSize: '0.9rem' }}>✦</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>AI Recommendation</strong>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.65rem 0', lineHeight: 1.5 }}>
                  Connect your campus telemetry to automatically suggest verification windows based on hardware availability.
                </p>
                <a
                  href="#projects"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'var(--accent-blue)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  Link Lab Node →
                </a>
              </div>

              {/* Hub Items */}
              <div className="hub-card-item">
                <div className="hub-card-left">
                  <div className="hub-icon-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <div className="hub-name">IoT Environmental Hub</div>
                    <div className="hub-desc">LoRaWAN &amp; Telemetry Stream</div>
                  </div>
                </div>
                <span className="hub-chip-status">Connected</span>
              </div>

              <div className="hub-card-item" style={{ marginBottom: 0 }}>
                <div className="hub-card-left">
                  <div className="hub-icon-box" style={{ background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                      <path d="M6 6h10M6 10h10" />
                    </svg>
                  </div>
                  <div>
                    <div className="hub-name">Institutional Git &amp; Schematics</div>
                    <div className="hub-desc">Gerber &amp; Technical Docs Sync</div>
                  </div>
                </div>
                <span className="hub-chip-status">Active</span>
              </div>
            </div>

            {/* Right Panel: Growth Velocity & Sparkline */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Reply Rate Growth</h3>
                  <p className="panel-sub">Last 6 Months Performance</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Growth velocity</div>
                  <div className="panel-stat-pill">+24%</div>
                </div>
              </div>

              {/* Sparkline Graphic (Matching reference image curve & months) */}
              <div style={{ marginTop: '2rem', position: 'relative' }}>
                <svg
                  viewBox="0 0 360 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: '100%', height: 'auto', overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Subtle Grid Lines */}
                  <line x1="0" y1="20" x2="360" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="360" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="360" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Gradient Area under curve */}
                  <path
                    d="M 10 110 C 60 112, 100 95, 150 85 C 200 75, 230 80, 270 45 C 310 15, 340 22, 350 20 L 350 130 L 10 130 Z"
                    fill="url(#curveGradient)"
                  />

                  {/* Elegant Curve Line */}
                  <path
                    d="M 10 110 C 60 112, 100 95, 150 85 C 200 75, 230 80, 270 45 C 310 15, 340 22, 350 20"
                    stroke="#0284c7"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Dot on current peak */}
                  <circle cx="350" cy="20" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
                </svg>

                {/* Month Markers Row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.75rem',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                  }}
                >
                  <span>JAN</span>
                  <span>FEB</span>
                  <span>MAR</span>
                  <span>APR</span>
                  <span>MAY</span>
                  <span>JUN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Floating Search Capsule */}
          <div className="hero-floating-capsule">
            <div className="capsule-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`capsule-tab-pill ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
              <span
                style={{
                  marginLeft: 'auto',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                }}
                onClick={() => setSearchQuery('')}
                title="Clear"
              >
                ✕
              </span>
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="capsule-input-box"
                placeholder="Ask anything... (Search projects, hardware tags, or researchers)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const el = document.getElementById('projects');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Institutional Trust Logo Cloud Bar */}
        <div className="logo-cloud-section" style={{ marginTop: '5rem', border: 'none', background: 'transparent' }}>
          <div className="logo-cloud-grid">
            <div className="logo-cloud-item">
              <span style={{ fontSize: '1.4rem' }}>⚡</span> blend
            </div>
            <div className="logo-cloud-item">
              <span style={{ fontSize: '1.4rem' }}>✦</span> cameo
            </div>
            <div className="logo-cloud-item">
              <span style={{ fontSize: '1.4rem' }}>🐼</span> bitpanda
            </div>
            <div className="logo-cloud-item">
              <span style={{ fontSize: '1.4rem' }}>❄</span> bloomreach
            </div>
            <div className="logo-cloud-item">
              <span style={{ fontSize: '1.4rem' }}>🦛</span> hippo
            </div>
            <div className="logo-cloud-item">
              <span style={{ fontSize: '1.4rem' }}>▽</span> Cerebral
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
