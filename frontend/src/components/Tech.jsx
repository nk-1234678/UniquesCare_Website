import { useEffect, useState } from "react";

// SVG icons representing UNIQUE CARE integrations
const ICONS = [
  {
    label: "MongoDB",
    bg: "#ffffff",
    svg: (
      <svg viewBox="0 0 40 40" width="26" height="26">
        <text x="4" y="28" fontSize="22" fontFamily="Georgia,serif" fontWeight="700" fill="#13AA52">M</text>
        <ellipse cx="26" cy="18" rx="5" ry="8" fill="none" stroke="#13AA52" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    label: "Cloudinary",
    bg: "#ffffff",
    svg: (
      <svg viewBox="0 0 40 40" width="26" height="26">
        <path d="M8 28 Q8 18 18 18 Q16 10 26 12 Q34 12 34 20 Q40 22 38 28 Z" fill="#3448C5" opacity="0.15"/>
        <path d="M10 26 Q10 19 19 19 Q17 12 26 13 Q33 13 33 20 Q38 22 36 26 Z" fill="none" stroke="#3448C5" strokeWidth="2"/>
        <path d="M18 26 L18 22 M22 26 L22 22 M20 20 L20 17" stroke="#3448C5" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Vercel",
    bg: "#ffffff",
    svg: (
      <svg viewBox="0 0 40 40" width="26" height="26">
        <polygon points="20,8 34,32 6,32" fill="#000000"/>
      </svg>
    ),
  },
  {
    label: "Next.js",
    bg: "#ffffff",
    svg: (
      <svg viewBox="0 0 40 40" width="26" height="26">
        <circle cx="20" cy="20" r="14" fill="#000"/>
        <text x="10" y="26" fontSize="13" fontFamily="Arial,sans-serif" fontWeight="900" fill="#fff">N</text>
        <path d="M24 14 L32 28" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "JWT",
    bg: "#ffffff",
    svg: (
      <svg viewBox="0 0 40 40" width="26" height="26">
        <rect x="6" y="6" width="28" height="28" rx="5" fill="#C0272D" opacity="0.12"/>
        <text x="7" y="27" fontSize="13" fontFamily="Arial,sans-serif" fontWeight="900" fill="#C0272D">JWT</text>
      </svg>
    ),
  },
  {
    label: "React",
    bg: "#ffffff",
    svg: (
      <svg viewBox="0 0 40 40" width="26" height="26">
        <circle cx="20" cy="20" r="4" fill="#61DAFB"/>
        <ellipse cx="20" cy="20" rx="16" ry="6" fill="none" stroke="#61DAFB" strokeWidth="2"/>
        <ellipse cx="20" cy="20" rx="16" ry="6" fill="none" stroke="#61DAFB" strokeWidth="2" transform="rotate(60 20 20)"/>
        <ellipse cx="20" cy="20" rx="16" ry="6" fill="none" stroke="#61DAFB" strokeWidth="2" transform="rotate(120 20 20)"/>
      </svg>
    ),
  },
];

// Each icon gets an angle offset, spread evenly around 360°
const COUNT = ICONS.length;

export default function IntegrationSection() {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let raf;
    let last = null;
    const speed = 0.018; // degrees per ms — slow orbit

    const tick = (ts) => {
      if (last !== null) {
        setAngle((a) => (a + speed * (ts - last)) % 360);
      }
      last = ts;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Outer ellipse dimensions (CSS px)
  const RX = 310; // horizontal radius
  const RY = 150; // vertical radius
  const CX = 400; // SVG center X
  const CY = 220; // SVG center Y
  const W = 800;
  const H = 440;

  return (
    <section style={{
      background: "",
      padding: "80px 0 64px",
      borderTop: "1.5px solid #E4E8EC",
      borderBottom: "1.5px solid #E4E8EC",
      overflow: "hidden",
      fontFamily: "'Raleway','Segoe UI',sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&family=Open+Sans:wght@400;500&display=swap');
        .int-icon-bubble {
          filter: drop-shadow(0px 4px 14px rgba(28,43,54,0.13));
          transition: filter 0.2s;
        }
        .int-icon-bubble:hover {
          filter: drop-shadow(0px 6px 20px rgba(192,39,45,0.28));
        }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", position: "relative" }}>

        {/* SVG canvas — rings + orbiting icons */}
        <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            style={{ maxWidth: 800, display: "block" }}
            overflow="visible"
          >
            {/* ── OUTER RING ── */}
            <ellipse
              cx={CX} cy={CY}
              rx={RX} ry={RY}
              fill="none"
              stroke="#E4E8EC"
              strokeWidth="1.5"
            />

            {/* ── INNER RING ── */}
            <ellipse
              cx={CX} cy={CY}
              rx={RX * 0.6} ry={RY * 0.6}
              fill="none"
              stroke="#F0F2F4"
              strokeWidth="1.5"
            />

            {/* ── CENTER TEXT ── */}
            <foreignObject x={CX - 155} y={CY - 85} width="310" height="170">
              <div style={{ textAlign: "center", padding: "0 8px" }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#C0272D",
                  marginBottom: 10,
                  fontFamily: "'Raleway',sans-serif",
                }}>
                  Integration
                </div>
                <div style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#1C2B36",
                  lineHeight: 1.25,
                  marginBottom: 12,
                  fontFamily: "'Raleway',sans-serif",
                  letterSpacing: "-0.02em",
                }}>
                  Built on tools<br />your team trusts
                </div>
                <div style={{
                  fontSize: 13,
                  color: "#7A8C96",
                  lineHeight: 1.65,
                  fontFamily: "'Open Sans',sans-serif",
                }}>
                  UNIQUE CARE integrates seamlessly with the platforms powering your campus infrastructure.
                </div>
              </div>
            </foreignObject>

            {/* ── ORBITING ICONS ── */}
            {ICONS.map((icon, i) => {
              const baseAngle = (360 / COUNT) * i;
              const rad = ((angle + baseAngle) * Math.PI) / 180;

              // Position on outer ellipse
              const x = CX + RX * Math.cos(rad);
              const y = CY + RY * Math.sin(rad);

              // Connector line from inner ring edge to icon
              const innerX = CX + RX * 0.6 * Math.cos(rad);
              const innerY = CY + RY * 0.6 * Math.sin(rad);

              return (
                <g key={icon.label}>
                  {/* Dashed connector */}
                  <line
                    x1={innerX} y1={innerY}
                    x2={x} y2={y}
                    stroke="#E0E4E8"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />

                  {/* Icon bubble */}
                  <g transform={`translate(${x}, ${y})`} className="int-icon-bubble">
                    {/* White circle bg with red border accent */}
                    <circle r="28" fill="#ffffff" />
                    <circle r="28" fill="none" stroke="#F0C0C2" strokeWidth="1.5" />

                    {/* Subtle red dot at top */}
                    <circle cx="0" cy="-28" r="3.5" fill="#C0272D" />

                    {/* Icon centered */}
                    <foreignObject x="-13" y="-13" width="26" height="26">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26 }}>
                        {icon.svg}
                      </div>
                    </foreignObject>
                  </g>

                  {/* Label below icon */}
                  <text
                    x={x}
                    y={y + 42}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="Raleway, sans-serif"
                    fill="#8A9BA8"
                    letterSpacing="0.04em"
                  >
                    {icon.label}
                  </text>
                </g>
              );
            })}

            {/* ── CENTER DOT ── */}
            <circle cx={CX} cy={CY} r="5" fill="#C0272D" opacity="0.25" />
            <circle cx={CX} cy={CY} r="2.5" fill="#C0272D" />
          </svg>
        </div>

        {/* Bottom stat strip — animated counters */}
        <AnimatedStats />
      </div>
    </section>
  );
}

// ── STATS DATA ──────────────────────────────────────────────
const STATS_DATA = [
  { end: 6,   suffix: "+",  label: "Integrated Services",  duration: 1200 },
  { end: 99,  suffix: "%",  label: "Platform Uptime",      duration: 1800 },
  { end: 248, suffix: "",   label: "Complaints Resolved",  duration: 2000 },
  { end: 4,   suffix: " Roles", label: "Access Levels",   duration: 900  },
];

function useCountUp(end, duration, trigger) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let startTime = null;
    const startVal = 0;

    const step = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startVal + eased * (end - startVal)));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(end);
    };

    requestAnimationFrame(step);
  }, [trigger, end, duration]);

  return count;
}

function StatCard({ end, suffix, label, duration, trigger, index }) {
  const count = useCountUp(end, duration, trigger);

  return (
    <div style={{
      textAlign: "center",
      padding: "24px 16px",
      flex: 1,
      borderRight: index < STATS_DATA.length - 1 ? "1.5px solid #E4E8EC" : "none",
      opacity: trigger ? 1 : 0,
      transform: trigger ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.5s ease ${index * 0.12}s, transform 0.5s ease ${index * 0.12}s`,
    }}>
      {/* Big number */}
      <div style={{
        fontSize: 44,
        fontWeight: 900,
        color: "#C0272D",
        lineHeight: 1,
        letterSpacing: "-0.03em",
        fontFamily: "'Raleway', sans-serif",
        marginBottom: 8,
      }}>
        {count}{suffix}
      </div>

      {/* Thin red underline accent */}
      <div style={{
        width: 28,
        height: 2.5,
        background: "#C0272D",
        borderRadius: 2,
        margin: "0 auto 10px",
        opacity: 0.25,
      }} />

      {/* Label */}
      <div style={{
        fontSize: 12,
        fontWeight: 600,
        color: "#3D4F5C",
        letterSpacing: "0.02em",
        fontFamily: "'Raleway', sans-serif",
      }}>
        {label}
      </div>
    </div>
  );
}

function AnimatedStats() {
  const [triggered, setTriggered] = useState(false);
  const ref = useState(() => {
    if (typeof IntersectionObserver === "undefined") return null;
    return null;
  });
  const containerRef = useState(null);

  // Use a ref callback to observe when stats scroll into view
  const setRef = (el) => {
    if (!el || triggered) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
  };

  return (
    <div
      ref={setRef}
      style={{
        display: "flex",
        marginTop: 0,
        paddingTop: 0,
        borderTop: "1.5px solid #E4E8EC",
        background: "",
        borderRadius: "0 0 8px 8px",
        overflow: "hidden",
      }}
    >
      {STATS_DATA.map((s, i) => (
        <StatCard
          key={i}
          index={i}
          end={s.end}
          suffix={s.suffix}
          label={s.label}
          duration={s.duration}
          trigger={triggered}
        />
      ))}
    </div>
  );
}