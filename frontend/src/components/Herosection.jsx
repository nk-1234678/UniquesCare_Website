import React from "react"

const STATS = [
  { value: "< 2 min", label: "Complaint Submission" },
  { value: "99%", label: "Target Uptime" },
  { value: "4", label: "User Roles" },
  { value: "< 2s", label: "API Response Time" }
]

function Herosection() {
  return (
    <section
      style={{
        background: "#fff",
        borderBottom: "1.5px solid #E0E0E0",
        padding: "100px 0"
      }}
    >
      <div
        className="wrap"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center"
        }}
      >
        {/* Tag */}
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#888"
          }}
        >
          Smart Lab Management
        </span>

        {/* Heading */}
        <h1
          style={{
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: 14,
            marginBottom: 18
          }}
        >
          Maintenance Issues.
          <br />
          <span style={{ color: "#C0272D" }}>Solved Instantly.</span>
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: 17,
            color: "#555",
            lineHeight: 1.7,
            maxWidth: 600,
            margin: "0 auto 32px auto"
          }}
        >
          Replace manual complaint registers with QR-code driven tracking.
          Real-time visibility, full accountability, and frictionless issue
          resolution for every laboratory.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginBottom: 50
          }}
        >
          <button className="btn-red">Get Started Free →</button>
          <button className="btn-outline">Watch Demo</button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            borderTop: "1.5px solid #E0E0E0",
            paddingTop: 30,
            maxWidth: 700,
            margin: "0 auto"
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              style={{
                borderRight: i < 3 ? "1.5px solid #E0E0E0" : "none",
                padding: "0 16px"
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#111"
                }}
              >
                {s.value}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#888",
                  marginTop: 4
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Herosection