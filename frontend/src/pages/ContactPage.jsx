import React from 'react'
import Contact from '../components/Contact'

const ContactPage = () => {
  return (
    <div style={{
      fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
      background: "#F5F5F5",
      color: "#1A1A1A",
      minHeight: "100vh"
    }}>

      {/* PAGE HEADER / HERO SECTION */}
      <section style={{
        background: "#D6E8E8",
        padding: "70px 24px 60px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>

        {/* Left chevrons */}
        <div style={{
          position: "absolute",
          left: "5%",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          opacity: 0.35
        }}>
          {[0, 1, 2].map(i => (
            <svg key={i} width="38" height="22" viewBox="0 0 38 22" fill="none">
              <polyline
                points="2,2 19,18 36,2"
                stroke="#5A9090"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          ))}
        </div>

        {/* Right chevrons */}
        <div style={{
          position: "absolute",
          right: "5%",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          opacity: 0.35
        }}>
          {[0, 1, 2].map(i => (
            <svg key={i} width="38" height="22" viewBox="0 0 38 22" fill="none">
              <polyline
                points="2,2 19,18 36,2"
                stroke="#5A9090"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          ))}
        </div>

        {/* Heading + wavy underline */}
        <div style={{ display: "inline-block" }}>
          <h1 style={{
            fontSize: "clamp(40px, 6vw, 62px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#1A1A1A",
            margin: "0",
            lineHeight: 1.1,
          }}>
            Contact Us
          </h1>

          {/* Wavy underline SVG */}
          <svg
            viewBox="0 0 260 18"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              display: "block",
              margin: "6px auto 0",
              width: "75%",
            }}
          >
            <path
              d="M2 10 C20 2, 40 18, 60 10 C80 2, 100 18, 120 10 C140 2, 160 18, 180 10 C200 2, 220 18, 258 8"
              stroke="#1A1A1A"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Subtext */}
        <p style={{
          fontSize: 15,
          color: "#4A6A6A",
          maxWidth: 480,
          margin: "20px auto 0",
          lineHeight: 1.75
        }}>
          Have questions or want to work with us? Reach out to the Unique Care team
          and we will get back to you shortly.
        </p>

      </section>

      {/* CONTACT SECTION */}
      <section className="wrap">
        <div className="wrap">
          <Contact />
        </div>
      </section>

    </div>
  )
}

export default ContactPage