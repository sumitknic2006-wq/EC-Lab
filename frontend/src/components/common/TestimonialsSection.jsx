/**
 * TestimonialsSection
 * Recreates the Testimonials & Metrics Bar from the reference image:
 * - Eyebrow: "• Testimonials"
 * - 2 Testimonial quote cards with 5 green stars and author avatars
 * - 4-column metric stats bar:
 *   - 94% Verification Accuracy
 *   - 120+ Active Projects
 *   - 30hr Saved per Review
 *   - 10x Faster Discovery
 */
export default function TestimonialsSection() {
  return (
    <section className="testimonials-section" aria-labelledby="testimonials-title">
      <div className="container-page" style={{ textAlign: 'center' }}>
        {/* Eyebrow */}
        <div
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--accent-blue)',
            letterSpacing: '0.04em',
            marginBottom: '2rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <span>•</span> Testimonials
        </div>

        {/* 2-Column Testimonials */}
        <div className="testimonials-grid">
          {/* Testimonial 1 */}
          <div className="testimonial-card">
            <p className="testimonial-quote">
              &ldquo;EC LAB transformed our department research evaluations. We indexed over 120 hardware prototypes in one semester, and physical QR verification made faculty auditing seamless.&rdquo;
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="testimonial-author-row">
                <div
                  className="author-avatar"
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  AR
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Dr. Alex Rivera
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Department Head, Robotics &amp; IoT
                  </div>
                </div>
              </div>

              {/* 5 Green Stars */}
              <div className="testimonial-stars" aria-label="5 stars rating">
                {'★★★★★'.split('').map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="testimonial-card">
            <p className="testimonial-quote">
              &ldquo;The best academic tool investment we made this year. Automated schematic archiving alone saves our laboratory engineers 30 hours per evaluation cycle on documentation checks.&rdquo;
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="testimonial-author-row">
                <div
                  className="author-avatar"
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  SC
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Prof. Sarah Chen
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Senior Evaluator, Embedded Systems
                  </div>
                </div>
              </div>

              {/* 5 Green Stars */}
              <div className="testimonial-stars" aria-label="5 stars rating">
                {'★★★★★'.split('').map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Metrics Counter Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
            maxWidth: '1000px',
            margin: '0 auto',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-medium)',
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
              94%
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Accuracy Rate
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: '#10b981' }}>
              120+
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Active Projects
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
              30hr
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Saved per Review
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: '#2563eb' }}>
              10x
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Faster Discovery
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
