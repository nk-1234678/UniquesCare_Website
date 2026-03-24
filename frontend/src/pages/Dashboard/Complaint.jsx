import React, { useState } from "react";

// ─── Mock Existing Complaints ──────────────────────────────────────────────────

const initialComplaints = [
  { id: "UC-048", title: "Hostel water supply issue",     category: "Hostel",    priority: "High",   status: "In Progress", date: "Mar 18, 2026", time: "10:24 AM", description: "No water supply in Block C since morning." },
  { id: "UC-047", title: "Library book not returned tag", category: "Library",   priority: "Low",    status: "Resolved",    date: "Mar 15, 2026", time: "02:10 PM", description: "My library record shows a book as unreturned which I returned." },
  { id: "UC-046", title: "Mess food quality complaint",   category: "Mess",      priority: "Medium", status: "Pending",     date: "Mar 12, 2026", time: "08:45 AM", description: "Food quality has been consistently poor for the past week." },
  { id: "UC-045", title: "Wi-Fi issue in Block C",        category: "IT",        priority: "High",   status: "Resolved",    date: "Mar 10, 2026", time: "11:00 AM", description: "Wi-Fi is not working in Block C rooms 201–220." },
  { id: "UC-044", title: "Classroom projector broken",    category: "Academics", priority: "Medium", status: "Resolved",    date: "Mar 08, 2026", time: "09:15 AM", description: "Projector in Room 301 is not working." },
];

// ─── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = ["Select Category", "Hostel", "Mess", "Library", "IT", "Academics", "Transport", "Sports", "Medical", "Admin", "Other"];
const PRIORITIES = ["Low", "Medium", "High"];

const STATUS_STYLE = {
  "Resolved":    { bg: "#EDFAF3", color: "#16A34A" },
  "In Progress": { bg: "#FFF8EB", color: "#D97706" },
  "Pending":     { bg: "#FFF0F0", color: "#DC2626" },
};

const PRIORITY_STYLE = {
  "Low":    { bg: "#F0F9FF", color: "#0369A1" },
  "Medium": { bg: "#FFF8EB", color: "#D97706" },
  "High":   { bg: "#FFF0F0", color: "#DC2626" },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const Badge = ({ label, styleMap }) => {
  const s = styleMap[label] || {};
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "4px 12px",
      borderRadius: 99, background: s.bg, color: s.color, whiteSpace: "nowrap"
    }}>{label}</span>
  );
};

const inputStyle = {
  padding: "10px 14px", borderRadius: 11,
  border: "1.5px solid #E5E5E5", fontSize: 14,
  color: "#222", background: "#FAFAFA",
  outline: "none", fontFamily: "inherit",
  width: "100%", boxSizing: "border-box",
  transition: "border 0.2s, background 0.2s"
};

const Label = ({ children }) => (
  <label style={{
    fontSize: 11, fontWeight: 700, color: "#aaa",
    letterSpacing: "0.08em", textTransform: "uppercase",
    display: "block", marginBottom: 7
  }}>{children}</label>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const RaiseComplaintPage = () => {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const [form, setForm] = useState({
    title: "", category: "Select Category",
    priority: "Medium", description: "", attachment: null
  });
  const [errors, setErrors] = useState({});

  // ── Form Handlers ────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())                        e.title = "Title is required.";
    if (form.category === "Select Category")       e.category = "Please select a category.";
    if (!form.description.trim())                  e.description = "Description is required.";
    if (form.description.trim().length < 20)       e.description = "Please describe in at least 20 characters.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const now = new Date();
    const newComplaint = {
      id: `UC-0${49 + complaints.length}`,
      title: form.title,
      category: form.category,
      priority: form.priority,
      status: "Pending",
      date: now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      description: form.description,
    };

    setComplaints(p => [newComplaint, ...p]);
    setForm({ title: "", category: "Select Category", priority: "Medium", description: "", attachment: null });
    setSubmitted(true);
    setShowForm(false);
    setTimeout(() => setSubmitted(false), 3500);
  };

  // ── Filtered List ────────────────────────────────────────────────────────────

  const filtered = complaints.filter(c => {
    const matchStatus   = filterStatus === "All"   || c.status === filterStatus;
    const matchCategory = filterCategory === "All" || c.category === filterCategory;
    const matchSearch   = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchCategory && matchSearch;
  });

  const counts = {
    total:      complaints.length,
    pending:    complaints.filter(c => c.status === "Pending").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved:   complaints.filter(c => c.status === "Resolved").length,
  };

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#1A1A1A" }}>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        input:focus, select:focus, textarea:focus { border-color: #C0272D !important; background: #fff !important; }
        .filter-btn:hover { background: #FFF0F1 !important; color: #C0272D !important; }
        .row-hover:hover { background: #FAFAFA !important; }
      `}</style>

      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(130deg, #C0272D 0%, #7A1519 100%)",
        borderRadius: 20, padding: "28px 36px", marginBottom: 24,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        boxShadow: "0 4px 28px rgba(192,39,45,0.22)",
        animation: "fadeUp 0.4s ease both", flexWrap: "wrap", gap: 16
      }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Student Dashboard
          </p>
          <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: "#fff" }}>My Complaints</h2>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
            Raise, track and manage your complaints in one place.
          </p>
        </div>
        <button onClick={() => { setShowForm(p => !p); setErrors({}); }} style={{
          padding: "11px 26px", borderRadius: 11, border: "2px solid rgba(255,255,255,0.5)",
          background: showForm ? "rgba(255,255,255,0.15)" : "#fff",
          color: showForm ? "#fff" : "#C0272D",
          fontSize: 14, fontWeight: 700, cursor: "pointer",
          backdropFilter: "blur(4px)", transition: "all 0.2s"
        }}>
          {showForm ? "✕ Cancel" : "+ Raise Complaint"}
        </button>
      </div>

      {/* ── Success Toast ─────────────────────────────────────────────── */}
      {submitted && (
        <div style={{
          background: "#EDFAF3", border: "1px solid #A7F3D0", borderRadius: 12,
          padding: "14px 20px", marginBottom: 20, fontSize: 14,
          color: "#065F46", fontWeight: 600, display: "flex", gap: 10, alignItems: "center",
          animation: "slideDown 0.3s ease both"
        }}>
          ✅ Your complaint has been submitted successfully! We'll update you on its status.
        </div>
      )}

      {/* ── Complaint Form ────────────────────────────────────────────── */}
      {showForm && (
        <div style={{
          background: "#fff", borderRadius: 18, padding: "28px",
          border: "1px solid #F0F0F0", boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
          marginBottom: 24, animation: "slideDown 0.35s ease both"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 18, borderBottom: "1px solid #F5F5F5" }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, background: "#FFF0F1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📝</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Raise a New Complaint</h3>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#999" }}>Fill in the details below and submit.</p>
            </div>
          </div>

          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px", marginBottom: 18 }}>
            <div>
              <Label>Complaint Title *</Label>
              <input name="title" placeholder="e.g. Water supply issue in hostel" value={form.title} onChange={handleChange} style={{ ...inputStyle, borderColor: errors.title ? "#EF4444" : "#E5E5E5" }} />
              {errors.title && <p style={{ margin: "5px 0 0", fontSize: 12, color: "#EF4444" }}>{errors.title}</p>}
            </div>
            <div>
              <Label>Category *</Label>
              <select name="category" value={form.category} onChange={handleChange} style={{ ...inputStyle, borderColor: errors.category ? "#EF4444" : "#E5E5E5", cursor: "pointer" }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              {errors.category && <p style={{ margin: "5px 0 0", fontSize: 12, color: "#EF4444" }}>{errors.category}</p>}
            </div>
          </div>

          {/* Priority */}
          <div style={{ marginBottom: 18 }}>
            <Label>Priority Level</Label>
            <div style={{ display: "flex", gap: 10 }}>
              {PRIORITIES.map(p => (
                <button key={p} onClick={() => setForm(prev => ({ ...prev, priority: p }))} style={{
                  padding: "8px 22px", borderRadius: 99, border: "1.5px solid",
                  borderColor: form.priority === p ? PRIORITY_STYLE[p].color : "#E5E5E5",
                  background: form.priority === p ? PRIORITY_STYLE[p].bg : "#fff",
                  color: form.priority === p ? PRIORITY_STYLE[p].color : "#888",
                  fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.18s"
                }}>{p}</button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 18 }}>
            <Label>Description *</Label>
            <textarea
              name="description" rows={4}
              placeholder="Describe your complaint in detail (min 20 characters)..."
              value={form.description} onChange={handleChange}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, borderColor: errors.description ? "#EF4444" : "#E5E5E5" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              {errors.description
                ? <p style={{ margin: 0, fontSize: 12, color: "#EF4444" }}>{errors.description}</p>
                : <span />
              }
              <span style={{ fontSize: 11, color: "#bbb" }}>{form.description.length} chars</span>
            </div>
          </div>

          {/* Attachment */}
          <div style={{ marginBottom: 24 }}>
            <Label>Attachment (optional)</Label>
            <label style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px", borderRadius: 11, border: "1.5px dashed #DDD",
              background: "#FAFAFA", cursor: "pointer"
            }}>
              <span style={{ fontSize: 20 }}>📎</span>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#555" }}>
                  {form.attachment ? form.attachment.name : "Click to upload a file"}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "#aaa" }}>PNG, JPG, PDF up to 5MB</p>
              </div>
              <input type="file" style={{ display: "none" }} onChange={e => setForm(p => ({ ...p, attachment: e.target.files[0] }))} />
            </label>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button onClick={() => setShowForm(false)} style={{
              padding: "10px 22px", borderRadius: 10, border: "1.5px solid #E5E5E5",
              background: "#fff", color: "#555", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>Cancel</button>
            <button onClick={handleSubmit} style={{
              padding: "10px 28px", borderRadius: 10, border: "none",
              background: "#C0272D", color: "#fff", fontSize: 13,
              fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 12px rgba(192,39,45,0.28)"
            }}>Submit Complaint →</button>
          </div>
        </div>
      )}

      {/* ── Summary Cards ─────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total",       value: counts.total,      color: "#4F7FFA", bg: "#EEF3FF", icon: "📋" },
          { label: "Pending",     value: counts.pending,    color: "#DC2626", bg: "#FFF0F0", icon: "⏳" },
          { label: "In Progress", value: counts.inProgress, color: "#D97706", bg: "#FFF8EB", icon: "🔄" },
          { label: "Resolved",    value: counts.resolved,   color: "#16A34A", bg: "#EDFAF3", icon: "✅" },
        ].map((s, i) => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: 14, padding: "18px 20px",
            border: "1px solid #F0F0F0", display: "flex", alignItems: "center", gap: 14,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            animation: `fadeUp 0.5s ease ${i * 70}ms both`
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "#999", fontWeight: 500 }}>{s.label}</p>
              <p style={{ margin: "2px 0 0", fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters & Search ─────────────────────────────────────────── */}
      <div style={{
        background: "#fff", borderRadius: 14, padding: "16px 20px",
        border: "1px solid #F0F0F0", marginBottom: 20,
        display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center",
        animation: "fadeUp 0.5s ease 0.3s both"
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🔍</span>
          <input
            placeholder="Search by title or ID..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 36, margin: 0 }}
          />
        </div>

        {/* Status filter */}
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Pending", "In Progress", "Resolved"].map(s => (
            <button key={s} className="filter-btn" onClick={() => setFilterStatus(s)} style={{
              padding: "7px 14px", borderRadius: 99, border: "1.5px solid",
              borderColor: filterStatus === s ? "#C0272D" : "#E5E5E5",
              background: filterStatus === s ? "#C0272D" : "#fff",
              color: filterStatus === s ? "#fff" : "#666",
              fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap"
            }}>{s}</button>
          ))}
        </div>

        {/* Category filter */}
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{
          ...inputStyle, width: "auto", minWidth: 150, cursor: "pointer", margin: 0
        }}>
          <option value="All">All Categories</option>
          {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* ── Complaints Table ──────────────────────────────────────────── */}
      <div style={{
        background: "#fff", borderRadius: 18,
        border: "1px solid #F0F0F0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        overflow: "hidden", animation: "fadeUp 0.5s ease 0.4s both"
      }}>
        {/* Table Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "90px 1fr 110px 90px 100px 160px 36px",
          padding: "12px 20px",
          background: "#FAFAFA",
          borderBottom: "1px solid #F0F0F0"
        }}>
          {["ID", "Title", "Category", "Priority", "Status", "Date & Time", ""].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.07em", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#bbb" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>No complaints found.</p>
            <p style={{ margin: "4px 0 0", fontSize: 13 }}>Try adjusting your filters.</p>
          </div>
        ) : (
          filtered.map((c, i) => (
            <React.Fragment key={c.id}>
              <div
                className="row-hover"
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr 110px 90px 100px 160px 36px",
                  padding: "15px 20px",
                  borderBottom: i < filtered.length - 1 ? "1px solid #F8F8F8" : "none",
                  alignItems: "center", cursor: "pointer", transition: "background 0.15s"
                }}
                onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: "#999" }}>{c.id}</span>
                <span style={{ fontSize: 14, fontWeight: 500, paddingRight: 16 }}>{c.title}</span>
                <span style={{
                  fontSize: 12, fontWeight: 600, padding: "3px 10px",
                  borderRadius: 7, background: "#F5F5F5", color: "#555",
                  display: "inline-block", width: "fit-content"
                }}>{c.category}</span>
                <Badge label={c.priority} styleMap={PRIORITY_STYLE} />
                <Badge label={c.status} styleMap={STATUS_STYLE} />
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#333" }}>{c.date}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#aaa" }}>{c.time}</p>
                </div>
                <span style={{ fontSize: 14, color: "#bbb", textAlign: "center", transition: "transform 0.2s", display: "inline-block", transform: expandedId === c.id ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
              </div>

              {/* Expanded Detail */}
              {expandedId === c.id && (
                <div style={{
                  padding: "16px 24px 20px",
                  background: "#FDFCFC",
                  borderBottom: i < filtered.length - 1 ? "1px solid #F0F0F0" : "none",
                  animation: "slideDown 0.2s ease both"
                }}>
                  <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase" }}>Description</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#444", lineHeight: 1.7, maxWidth: 640 }}>{c.description}</p>

                  {/* Timeline indicator */}
                  <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center" }}>
                    {["Submitted", "Under Review", "In Progress", "Resolved"].map((step, idx) => {
                      const stepIndex = ["Submitted","Under Review","In Progress","Resolved"].indexOf(
                        c.status === "Pending" ? "Submitted" : c.status === "In Progress" ? "In Progress" : "Resolved"
                      );
                      const active = idx <= stepIndex;
                      return (
                        <React.Fragment key={step}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: "50%",
                              background: active ? "#C0272D" : "#EEE",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 12, color: active ? "#fff" : "#bbb", fontWeight: 700
                            }}>{active ? "✓" : idx + 1}</div>
                            <span style={{ fontSize: 10, color: active ? "#C0272D" : "#bbb", fontWeight: 600, whiteSpace: "nowrap" }}>{step}</span>
                          </div>
                          {idx < 3 && (
                            <div style={{ flex: 1, height: 2, background: idx < stepIndex ? "#C0272D" : "#EEE", marginBottom: 16, transition: "background 0.3s" }} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>

      {/* Count */}
      {filtered.length > 0 && (
        <p style={{ margin: "12px 0 0", fontSize: 12, color: "#bbb", textAlign: "right" }}>
          Showing {filtered.length} of {complaints.length} complaints
        </p>
      )}
    </div>
  );
};

export default RaiseComplaintPage;