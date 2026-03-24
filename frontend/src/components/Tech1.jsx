import React from 'react'


const TECH = [
{ name: "React.js", desc: "Frontend & API routes" },
{ name: "MongoDB Atlas", desc: "Cloud NoSQL database" },
{ name: "NextAuth + JWT", desc: "Authentication & sessions" },
{ name: "Cloudinary", desc: "Image CDN storage" },
{ name: "Vercel", desc: "Deployment & CI/CD" },
{ name: "bcrypt", desc: "Password hashing" },
];


const Tech1 = () => {
return (
<div>
        {/* TECHNOLOGY */}
    <section id="technology" style={{ background: "#fff", borderBottom: "1.5px solid #E0E0E0" }}>
    <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
        <div>
            <span className="tag">Tech Stack</span>
            <h2 style={{ fontSize: 30, fontWeight: 700, marginTop: 12, marginBottom: 12 }}>Production-grade<br />modern stack.</h2>
            <p style={{ color: "#666", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
            Every technology choice is deliberate — optimized for security, performance, and institutional scale.
            </p>

            {/* Architecture diagram */}
            <div className="box" style={{ overflow: "hidden" }}>
            <div style={{ background: "#1A1A1A", padding: "9px 14px" }}>
                <span className="mono" style={{ color: "#666", fontSize: 11 }}>// architecture.txt</span>
            </div>
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                ["Browser / QR Interface", "#C0272D"],
                ["React.js Frontend", "#3D4F5C"],
                ["Next.js API Routes", "#3D4F5C"],
                ["MongoDB Atlas", "#777"],
                ["Cloudinary · NextAuth", "#777"],
                ].map(([label, clr], i) => (
                <div key={i} style={{ paddingLeft: i * 14, display: "flex", flexDirection: "column", gap: 2 }}>
                    {i > 0 && <span className="mono" style={{ fontSize: 10, color: "#ccc", paddingLeft: 4 }}>↓</span>}
                    <div style={{ border: `1.5px solid ${clr}`, borderRadius: 3, padding: "5px 12px", fontSize: 12, color: clr, fontWeight: 600, background: `${clr}10`, display: "inline-block" }}>{label}</div>
                </div>
                ))}
            </div>
            </div>
        </div>

        {/* Tech boxes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {TECH.map((t, i) => (
            <div key={i} className="box hover-box" style={{ padding: 18 }}>
                <div style={{ width: 6, height: 6, background: "#C0272D", borderRadius: 1, marginBottom: 10 }}></div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{t.desc}</div>
            </div>
            ))}
        </div>
        </div>
    </div>
    </section>
</div>
)
}

export default Tech1