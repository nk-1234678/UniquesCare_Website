import React from "react"
import { QrCode, FileEdit, UserCheck, Wrench, CheckCircle2 } from "lucide-react"

const STEPS = [
  {
    n: "01",
    icon: QrCode,
    title: "Scan Equipment QR",
    desc: "Simply scan the unique QR code attached to any laboratory equipment using your smartphone camera"
  },
  {
    n: "02",
    icon: FileEdit,
    title: "Report the Issue",
    desc: "Fill out a quick digital form describing the maintenance issue. Add photos and priority level."
  },
  {
    n: "03",
    icon: UserCheck,
    title: "Auto-Assign & Track",
    desc: "The system automatically routes the ticket to the right technician and tracks progress in real-time."
  },
  {
    n: "04",
    icon: Wrench,
    title: "Resolve & Review",
    desc: "Technician resolves the issue, marks it complete, and the system logs everything for audit trails."
  },
 
]

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      style={{
        background: "#fff",
        padding: "100px 0",
        borderBottom: "1.5px solid #E0E0E0"
      }}
    >
      <div className="wrap" style={{display:"flex", padding: "0 104px",flexDirection:"column"}}>

        {/* Header */}
        <div
        style={{
            textAlign: "center",
            marginBottom: 60,
            backgroundColor: "",
            maxWidth: "600px",
            margin: "0 auto 60px"
        }}
        >
          <span
            style={{
              color: "#C0272D",
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: "0.15em",
              textTransform: "uppercase"
            }}
          >
            How It Works
          </span>

          <h2
        style={{
            fontSize: 40,
            fontWeight: 700,
            marginTop: 8
        }}
        >
        Four Simple Steps to  
        Streamlined Maintenance
        </h2>

          <p
            style={{
              color: "#777",
              fontSize: 18,
              marginTop: 8
            }}
          >
            Our intuitive process makes reporting and managing maintenance issues effortless for everyone.
          </p>
        </div>

        {/* Steps Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 28
          }}
        >
          {STEPS.map((s, i) => {
            const Icon = s.icon

            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  background: "#fff",
                  border: "1.5px solid #E0E0E0",
                  borderRadius: 14,
                  padding: 26,
                  transition: "all .25s"
                }}
                className="hover-box"
              >

                {/* Step Number */}
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: 22,
                    background: "#C0272D",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 20
                  }}
                >
                  {s.n}
                </div>

                {/* Icon */}
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 12,
                    background: "#FFF5F5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18
                  }}
                >
                  <Icon size={28} color="#C0272D" />
                </div>

                {/* Title */}
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 8
                  }}
                >
                  {s.title}
                </div>

                {/* Description */}
                <div
                  style={{
                    fontSize: 14,
                    color: "#666",
                    lineHeight: 1.6
                  }}
                >
                  {s.desc}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks