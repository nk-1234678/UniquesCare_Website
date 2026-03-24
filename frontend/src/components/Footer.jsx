import React from 'react'

const Footer = () => {
  return (
    <footer id="contact" style={{
      background: "#fff",
      borderTop: "1.5px solid #E0E0E0",
      padding: "48px 0 24px",
      fontFamily: "'Raleway', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&family=Open+Sans:wght@400;500&display=swap');
        .footer-wrap { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
        .footer-link { display: block; font-size: 13px; color: #666; margin-bottom: 8px; text-decoration: none; font-family: 'Open Sans', sans-serif; transition: color 0.15s; }
        .footer-link:hover { color: #C0272D; }
        .footer-divider { border: none; border-top: 1.5px solid #E8E8E8; margin: 0; }
        .footer-col-title {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #1C2B36;
          margin-bottom: 14px;
          font-family: 'Raleway', sans-serif;
        }
        .social-btn {
          width: 32px; height: 32px;
          border: 1.5px solid #E0E0E0;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #888;
          text-decoration: none;
          font-size: 14px;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .social-btn:hover { border-color: #C0272D; color: #C0272D; background: #FFF5F5; }
      `}</style>

      <div className="footer-wrap">

        {/* Main grid — 5 columns */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2.2fr 1fr 1fr 1fr 1fr",
          gap: 32,
          marginBottom: 40,
          alignItems: "start",
        }}>

          {/* Brand col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 34, height: 34,
                background: "#C0272D",
                borderRadius: 5,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: "'Raleway', sans-serif" }}>UC</span>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1, fontFamily: "'Raleway', sans-serif" }}>
                  UNIQUE <span style={{ color: "#C0272D" }}>CARE</span>
                </div>
                <div style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2, fontFamily: "'Open Sans', sans-serif" }}>
                  Smart Lab Maintenance
                </div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: "#777", lineHeight: 1.75, maxWidth: 280, fontFamily: "'Open Sans', sans-serif", marginBottom: 16 }}>
              A QR-driven platform built for institutional efficiency, transparency, and scale. Replace paper registers with real-time complaint management.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[
                { icon: "⭐", label: "GitHub" },
                { icon: "in", label: "LinkedIn" },
                { icon: "𝕏", label: "Twitter" },
                { icon: "✉", label: "Email" },
              ].map(s => (
                <a key={s.label} href="#" className="social-btn" title={s.label}>{s.icon}</a>
              ))}
            </div>

            <div style={{ fontSize: 11, color: "#bbb", fontFamily: "'Open Sans', sans-serif", lineHeight: 1.6 }}>
              The Uniques Community<br />
              Anshu · Vishwajeet · Neelam
            </div>
          </div>

          {/* Platform */}
          <div>
            <div className="footer-col-title">Platform</div>
            {[
              { label: "Features", href: "#features" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "User Roles", href: "#roles" },
              { label: "Technology", href: "#technology" },
              { label: "Integrations", href: "#" },
              { label: "Analytics", href: "#" },
            ].map(l => (
              <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
            ))}
          </div>

          {/* Project */}
          <div>
            <div className="footer-col-title">Project</div>
            {[
              { label: "HLD Document", href: "#" },
              { label: "Implementation Plan", href: "#" },
              { label: "Database Design", href: "#" },
              { label: "API Reference", href: "#" },
              { label: "GitHub Repository", href: "#" },
              { label: "Changelog", href: "#" },
            ].map(l => (
              <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
            ))}
          </div>

          {/* Resources */}
          <div>
            <div className="footer-col-title">Resources</div>
            {[
              { label: "Documentation", href: "#" },
              { label: "User Guide", href: "#" },
              { label: "Admin Manual", href: "#" },
              { label: "QR Setup Guide", href: "#" },
              { label: "FAQs", href: "#" },
              { label: "Support", href: "#" },
            ].map(l => (
              <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
            ))}
          </div>

          {/* Institution */}
          <div>
            <div className="footer-col-title">Institution</div>
            {[
              { label: "About The Uniques", href: "#" },
              { label: "Community Portal", href: "#" },
              { label: "Events", href: "#" },
              { label: "Contact Us", href: "#contact" },
              { label: "Privacy Policy", href: "#" },
              { label: "Terms of Use", href: "#" },
            ].map(l => (
              <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
            ))}
          </div>

        </div>

        {/* Newsletter strip */}
        <div style={{
          background: "#F7F8FA",
          border: "1.5px solid #E4E8EC",
          borderRadius: 6,
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 28,
          flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1C2B36", fontFamily: "'Raleway', sans-serif", marginBottom: 3 }}>
              Stay updated with UNIQUE CARE
            </div>
            <div style={{ fontSize: 12, color: "#8A9BA8", fontFamily: "'Open Sans', sans-serif" }}>
              Get notified about new features, releases, and campus updates.
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <input
              type="email"
              placeholder="your@institution.edu"
              style={{
                border: "1.5px solid #E0E0E0",
                borderRadius: 4,
                padding: "8px 14px",
                fontSize: 13,
                fontFamily: "'Open Sans', sans-serif",
                outline: "none",
                width: 220,
                color: "#1C2B36",
              }}
            />
            <button style={{
              background: "#C0272D",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "8px 20px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Raleway', sans-serif",
              whiteSpace: "nowrap",
            }}>
              Subscribe
            </button>
          </div>
        </div>

        <hr className="footer-divider" />

        {/* Bottom bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 18,
          flexWrap: "wrap",
          gap: 10,
        }}>
          <div style={{ fontSize: 12, color: "#bbb", fontFamily: "'Open Sans', sans-serif" }}>
            © 2026 UNIQUE CARE · The Uniques Community · All rights reserved
          </div>

          {/* Center links */}
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Use", "Cookie Policy"].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: "#bbb", textDecoration: "none", fontFamily: "'Open Sans', sans-serif" }}
                onMouseEnter={e => e.target.style.color = "#C0272D"}
                onMouseLeave={e => e.target.style.color = "#bbb"}>{l}</a>
            ))}
          </div>

          {/* Status */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#bbb", fontFamily: "'Open Sans', sans-serif" }}>
            <div style={{ width: 7, height: 7, background: "#22c55e", borderRadius: "50%" }}></div>
            System Operational · 99% Uptime
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer