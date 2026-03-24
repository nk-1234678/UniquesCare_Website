import React from "react";
import { QrCode, BarChart3, Bell, Users, Clock, Shield } from "lucide-react";

const FEATURES = [
{
    icon: QrCode,
    title: "QR-Based Reporting",
    desc: "Scan a lab QR code and submit a complaint in under 2 minutes — no manual selection needed."
},
{
    icon: Users,
    title: "Role-Based Access",
    desc: "Students, Lab Assistants, Maintenance Staff, and Admins each get their own tailored view."
},
{
    icon: Clock,
    title: "Real-Time Tracking",
    desc: "Follow every complaint from Pending → Assigned → In Progress → Resolved, live."
},
{
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Monthly reports, resolution trends, category breakdowns, and staff performance scores."
},
{
    icon: Shield,
    title: "Secure Cloud Storage",
    desc: "All complaints and images stored securely in MongoDB Atlas and Cloudinary CDN."
},
{
    icon: Bell,
    title: "Smart Notifications",
    desc: "Automated alerts to staff when complaints are reported, assigned, or resolved."
}
]

const Features = () => {
return (
    <section
        id="features"
        style={{
        background: "#F5F5F5",
        borderBottom: "1.5px solid #E0E0E0",
        padding: "90px 0"
    }}
    >

      {/* HOVER CSS */}
        <style>{`
        .feature-box{
            background:#fff;
            border:1.5px solid #E0E0E0;
            transition:all .25s ease;
            cursor:pointer;
        }
        .feature-box:hover{
            background:#C0272D;
            color:#fff;
            border-color:#C0272D;
            transform:translateY(-6px);
        }
        .feature-box:hover .feature-desc{
            color:rgba(255,255,255,.85);
        }
        .feature-box:hover .icon-box{
            background:rgba(255,255,255,.2);
        }
        .feature-box:hover svg{
        color:#fff;
        }
    `}</style>

    <div className="wrap" style={{backgroundColor:"",padding: "0 104px"}}>

        {/* Header */}
        <div
            style={{
            margin: "0 auto 60px auto",
            maxWidth: 650,
            textAlign: "center",
            
            }}
        >
        <span className="tag">Platform Features</span>

        <h2
            style={{
                fontSize: 38,
                fontWeight: 700,
                marginTop: 12,
                marginBottom: 8
            }}
        >
            Everything You Need for Efficient Maintenance
        </h2>

        <p style={{ color: "#666", fontSize: 18 }}>
            Our platform provides a complete suite of tools designed specifically for
            institutional laboratory maintenance management.
        </p>
        </div>

        {/* Grid */}
        <div
        style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 28 // increased from 22 to 28
          }}
        >
          {FEATURES.map((f, i) => {
            const Icon = f.icon;

            return (
              <div
                key={i}
                className="feature-box"
                style={{
                  padding: 28, // increased from 24
                  borderRadius: 10
                }}
              >
                {/* Icon */}
                <div
                  className="icon-box"
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 10,
                    background: "#F1F1F1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18, // slightly increased
                    transition: "all .25s"
                  }}
                >
                  <Icon size={22} color="#C0272D" />
                </div>

                {/* Title */}
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    marginBottom: 10
                  }}
                >
                  {f.title}
                </div>

                {/* Description */}
                <div
                  className="feature-desc"
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "#666",
                    transition: "all .25s"
                  }}
                >
                  {f.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;