import React from 'react'

// Team members — replace image URLs with your actual photos
const teamMembers = [
  {
    name: 'Dr. Anika Sharma',
    designation: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  },
  {
    name: 'Rohan Mehta',
    designation: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80',
  },
  {
    name: 'Priya Nair',
    designation: 'Head of Product',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
  },
  {
    name: 'Arjun Kapoor',
    designation: 'Lead Engineer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
]

function MemberCard({ name, designation, image }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: 220,
      // Extra top padding so the photo can overflow above the card
      paddingTop: 60,
      flexShrink: 0,
    }}>

      {/* ── RED CARD BODY ── */}
      <div style={{
        position: 'relative',
        background: '#C0272D',
        borderRadius: '12px 12px 10px 10px',
        overflow: 'hidden',
        // fixed height for the card (photo overflows above)
        height: 280,
        width: '100%',
      }}>

        {/* Rotated watermark text on left edge */}
        <div style={{
          position: 'absolute',
          left: -28,
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          fontSize: 38,
          fontWeight: 800,
          color: 'rgba(255,255,255,0.12)',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          pointerEvents: 'none',
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}>
          Directors
        </div>

        {/* Bottom name + designation bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '14px 14px 12px',
          background: 'linear-gradient(to top, rgba(140,15,20,0.85) 0%, transparent 100%)',
          zIndex: 2,
        }}>
          {/* Small red flame icon */}
          <div style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#C0272D" stroke="none">
              <path d="M12 2C12 2 6 8.5 6 13.5a6 6 0 0 0 12 0C18 8.5 12 2 12 2zm0 16a3 3 0 0 1-3-3c0-2.5 3-6 3-6s3 3.5 3 6a3 3 0 0 1-3 3z"/>
            </svg>
          </div>
          <p style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.2,
            margin: 0,
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}>{name}</p>
          <p style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.7)',
            marginTop: 2,
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}>{designation}</p>
        </div>
      </div>

      {/* ── PHOTO — overflows above the card ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '88%',
        height: 310,
        zIndex: 3,
        pointerEvents: 'none',
      }}>
        <img
          src={image}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            // Bottom of photo blends into card
            maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
            display: 'block',
          }}
        />
      </div>

    </div>
  )
}

export default function AboutTeam() {
  return (
    <section style={{ padding: '56px 0 72px' }}>
      <div className="wrap">

        {/* Section heading */}
        <h2 style={{
          fontSize: 36,
          fontWeight: 700,
          color: '#1A1A1A',
          textAlign: 'center',
          marginBottom: 52,
          fontFamily: "'IBM Plex Sans', sans-serif",
          letterSpacing: '-0.01em',
        }}>
          Meet Our Team
        </h2>
        <p style={{
        maxWidth: 720,
        margin: "0 auto 40px",
        textAlign: "center",
        color: "#666",
        lineHeight: 1.7,
        fontSize: 15
        }}>
        Our leadership team brings together expertise in healthcare technology, 
        software engineering, and operations. With a shared vision of modernizing 
        lab infrastructure, they guide UNIQUE CARE in building reliable, scalable, 
        and transparent solutions for smart lab maintenance.
        </p>

        {/* Cards row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 28,
          flexWrap: 'wrap',
        }}>
          {teamMembers.map((member, i) => (
            <MemberCard key={i} {...member} />
          ))}
        </div>

        {/* Description text below */}
        <p style={{
          marginTop: 52,
          fontSize: 13.5,
          color: '#888',
          lineHeight: 1.8,
          textAlign: 'center',
          maxWidth: 680,
          margin: '52px auto 0',
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}>
          Our board brings decades of combined experience in healthcare technology,
          diagnostic lab operations, and enterprise software. Together, they guide
          UNIQUE CARE's mission to digitize labs across India with precision and purpose.
        </p>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .team-cards-row {
            flex-direction: column !important;
            align-items: center !important;
          }
        }
      `}</style>
    </section>
  )
}