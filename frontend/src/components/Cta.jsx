import React from 'react'

const Cta = () => {
return (
    <div>

    {/* CTA */}
    <section style={{ background: "#1A1A1A", padding: "60px 0" }}>
    <div className="wrap"  style={{padding: "0 104px"}}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}>
        <div>
            <span className="tag tag-red" style={{ borderColor: "#C0272D", color: "#C0272D", background: "rgba(192,39,45,0.1)" }}>Ready to Deploy</span>
            <h2 style={{ fontSize: 34, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginTop: 12, marginBottom: 10 }}>
            Go paperless. Go smarter.<br /><span style={{ color: "#C0272D" }}>Go UNIQUE CARE.</span>
            </h2>
            <p style={{ color: "#888", fontSize: 15, lineHeight: 1.7, maxWidth: 480 }}>
            Set up UNIQUE CARE across your labs today. Eliminate maintenance chaos and give every stakeholder the visibility they deserve.
            </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button style={{ background: "transparent", color: "#888", border: "1.5px solid #444", borderRadius: 4, padding: "10px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Request Access</button>
            <button style={{ background: "transparent", color: "#888", border: "1.5px solid #444", borderRadius: 4, padding: "10px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>View Docs</button>
        </div>
        </div>
    </div>
    </section>
</div>
)
}

export default Cta