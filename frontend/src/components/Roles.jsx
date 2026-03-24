import React from 'react'
import { useState } from 'react';

const ROLES = [
  {
    title: "Student",
    color: "#C0272D",
    actions: ["Scan QR codes to report issues", "Submit complaints with photos", "Track complaint status in real time", "Rate resolutions"],
  },
  {
    title: "Lab Assistant",
    color: "#3D4F5C",
    actions: ["View all complaints for assigned lab", "Add internal notes to complaints", "Escalate issues to admin", "View equipment complaint history"],
  },
  {
    title: "Maintenance Staff",
    color: "#3D4F5C",
    actions: ["View only assigned complaints", "Update work progress status", "Mark complaints as resolved", "Add resolution notes"],
  },
  {
    title: "Administrator",
    color: "#C0272D",
    actions: ["Full access across all labs", "Assign complaints to staff", "Generate monthly reports", "Manage users, labs, and settings"],
  },
];

const Roles = () => {

    const [activeRole, setActiveRole] = useState(0);

  return (
    <div>

        {/* ROLES */}
      <section id="roles" style={{ background: "#F5F5F5", borderBottom: "1.5px solid #E0E0E0" }}>
        <div className="wrap">
          <div style={{ marginBottom: 28 }}>
            <span className="tag">Access Control</span>
            <h2 style={{ fontSize: 30, fontWeight: 700, marginTop: 12, marginBottom: 6 }}>Four roles. One system.</h2>
            <p style={{ color: "#666", fontSize: 15 }}>Each user sees only what they need. Enforced at every layer.</p>
          </div>

          {/* Role tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {ROLES.map((r, i) => (
              <button key={i} className={`role-btn${activeRole===i?" active":""}`} onClick={() => setActiveRole(i)}>{r.title}</button>
            ))}
          </div>

          {/* Role card */}
          <div style={{ background: ROLES[activeRole].color, borderRadius: 4, padding: 28, border: `1.5px solid ${ROLES[activeRole].color}` }}>
            <div className="mono" style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Permissions</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 18 }}>{ROLES[activeRole].title}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {ROLES[activeRole].actions.map((a, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 4, padding: "11px 14px", fontSize: 13, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 12 }}>✓</span>{a}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Roles