import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { complaintApi } from "../../api/complaintApi";
import { getErrorMessage } from "../../api/httpClient";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";

// ─── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = ["Select Category", "Hostel", "Mess", "Library", "IT", "Academics", "Transport", "Sports", "Medical", "Admin", "Other"];
const PRIORITIES = ["Low", "Medium", "High"];

const STATUS_STYLE = {
  "Resolved":    { bg: "#EDFAF3", color: "#16A34A" },
  "In Progress": { bg: "#FFF8EB", color: "#D97706" },
  "Submitted":   { bg: "#FFF0F0", color: "#DC2626" },
};

const PRIORITY_STYLE = {
  "Low":    { bg: "#F0F9FF", color: "#0369A1" },
  "Medium": { bg: "#FFF8EB", color: "#D97706" },
  "High":   { bg: "#FFF0F0", color: "#DC2626" },
};

const ADMIN_THEME = {
  pageBg: "#FFFFFF",
  heroBg: "#FFFFFF",
  heroShadow: "0 1px 4px rgba(0,0,0,0.05)",
  heroBorder: "#E5E7EB",
  heroText: "#111827",
  panelBg: "#FFFFFF",
  panelBorder: "#E5E7EB",
  panelShadow: "0 1px 4px rgba(0,0,0,0.05)",
  tableHeadBg: "#FAFAFA",
  emptyIcon: "📋",
};

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const normalizeComplaint = (complaint) => ({
  ...complaint,
  id: complaint._id ?? complaint.id,
  status: complaint.status ?? "Submitted",
  priority: complaint.priority ?? "Medium",
  date: complaint.date ?? formatDate(complaint.createdAt),
  time: complaint.time ?? formatTime(complaint.createdAt),
});

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
  const { user } = useAuth();
  const role = String(user?.role || "student").toLowerCase();
  const isStudent = role === "student";
  const theme = isStudent ? null : ADMIN_THEME;

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [showForm, setShowForm]     = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [submittedAt, setSubmittedAt] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [filterStatus, setFilterStatus]     = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [search, setSearch]         = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "", category: "Select Category",
    priority: "Medium", description: "", attachment: null
  });
  const [errors, setErrors] = useState({});

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setFetchError("");
      const data = await complaintApi.getComplaints();
      const items = Array.isArray(data) ? data : data.complaints ?? [];
      setComplaints(Array.isArray(items) ? items.map(normalizeComplaint) : []);
    } catch (err) {
      setFetchError(getErrorMessage(err, "Failed to load complaints."));
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch complaints on mount ────────────────────────────────────────────────

  useEffect(() => {
    fetchComplaints();
  }, []);

  const resetFormState = () => {
    setForm({ title: "", category: "Select Category", priority: "Medium", description: "", attachment: null });
    setErrors({});
    setEditingId(null);
  };

  // ── Form Handlers ────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())                  e.title       = "Title is required.";
    if (form.category === "Select Category") e.category    = "Please select a category.";
    if (!form.description.trim())            e.description = "Description is required.";
    if (form.description.trim().length < 20) e.description = "Please describe in at least 20 characters.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSubmitError("");

    try {
      const isEditing = Boolean(editingId);
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority,
      };

      const data = isEditing
        ? await complaintApi.updateComplaint(editingId, payload)
        : await complaintApi.createComplaint(payload);
      if (!data || !data.complaint) {
        throw new Error("Invalid complaint response");
      }
      const updatedComplaint = normalizeComplaint(data.complaint ?? {});

      if (isEditing) {
        setComplaints(prev => prev.map(item => (
          (item._id ?? item.id) === (updatedComplaint._id ?? updatedComplaint.id) ? updatedComplaint : item
        )));
        setSubmittedAt(null);
      } else {
        setComplaints(prev => [updatedComplaint, ...prev]);
        const registeredAt = new Date(updatedComplaint.createdAt ?? Date.now());
        setSubmittedAt({
          date: registeredAt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
          time: registeredAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        });
      }

      resetFormState();
      setSubmitted(true);
      setShowForm(false);
      setTimeout(() => {
        setSubmitted(false);
        setSubmittedAt(null);
      }, 3500);
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Failed to submit complaint. Please try again."));
    }
  };

  const handleEdit = (complaint) => {
    setForm({
      title: complaint.title ?? "",
      category: complaint.category ?? "Select Category",
      priority: complaint.priority ?? "Medium",
      description: complaint.description ?? "",
      attachment: null,
    });
    setEditingId(complaint._id ?? complaint.id);
    setShowForm(true);
    setErrors({});
    setSubmitError("");
    setExpandedId(null);
  };

  const handleDelete = async (complaint) => {
    const id = complaint._id ?? complaint.id;
    if (!id) return;

    const shouldDelete = window.confirm("Are you sure you want to delete this complaint?");
    if (!shouldDelete) return;

    try {
      setSubmitError("");
      await complaintApi.deleteComplaint(id);

      setComplaints(prev => prev.filter(item => (item._id ?? item.id) !== id));
      if (expandedId === id) setExpandedId(null);
      if (editingId === id) {
        resetFormState();
        setShowForm(false);
      }
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Failed to delete complaint. Please try again."));
    }
  };

  // ── Filtered List ────────────────────────────────────────────────────────────

  const filtered = complaints.filter(c => {
    const matchStatus   = filterStatus === "All"   || c.status === filterStatus;
    const matchCategory = filterCategory === "All" || c.category === filterCategory;
    const matchSearch   = c.title?.toLowerCase().includes(search.toLowerCase()) ||
                          String(c.id ?? "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchCategory && matchSearch;
  });

  const counts = {
    total:      complaints.length,
    submitted:  complaints.filter(c => c.status === "Submitted").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved:   complaints.filter(c => c.status === "Resolved").length,
  };

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#1A1A1A", background: theme?.pageBg || "transparent", minHeight: "100%" }}>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        input:focus, select:focus, textarea:focus { border-color: ${isStudent ? "#C0272D" : "#111827"} !important; background: #fff !important; }
        .filter-btn:hover { background: ${isStudent ? "#FFF0F1" : "#F3F4F6"} !important; color: ${isStudent ? "#C0272D" : "#111827"} !important; }
        .row-hover:hover { background: ${isStudent ? "#FAFAFA" : "#F9FAFB"} !important; }
      `}</style>

      <div style={{
        background: isStudent ? "linear-gradient(130deg, #C0272D 0%, #7A1519 100%)" : theme.heroBg,
        border: isStudent ? "none" : `1px solid ${theme.heroBorder}`,
        borderRadius: 20,
        padding: "28px 36px",
        marginBottom: 24,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: isStudent ? "0 4px 28px rgba(192,39,45,0.22)" : theme.heroShadow,
        animation: "fadeUp 0.4s ease both",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {isStudent ? "Student Dashboard" : "Complaints Dashboard"}
          </p>
          <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: "#fff" }}>
            {isStudent ? "My Complaints" : "All Complaints"}
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
            {isStudent
              ? "Raise, track and manage your complaints in one place."
              : "Review every complaint with search and status filters."}
          </p>
        </div>
        {isStudent && (
          <button onClick={() => {
            setShowForm(p => {
              if (p) resetFormState();
              return !p;
            });
            setErrors({});
            setSubmitError("");
          }} style={{
            padding: "11px 26px", borderRadius: 11, border: isStudent ? "2px solid rgba(255,255,255,0.5)" : "2px solid rgba(255,255,255,0.34)",
            background: showForm ? (isStudent ? "rgba(255,255,255,0.15)" : "#F9FAFB") : "#fff",
            color: showForm ? (isStudent ? "#fff" : "#374151") : (isStudent ? "#C0272D" : "#374151"),
            fontSize: 14, fontWeight: 700, cursor: "pointer",
            backdropFilter: "blur(4px)", transition: "all 0.2s"
          }}>
            {showForm ? "✕ Cancel" : "+ Raise Complaint"}
          </button>
        )}
      </div>

      {/* ── Success Toast ─────────────────────────────────────────────── */}
      {submitted && (
        <div style={{
          background: isStudent ? "#EDFAF3" : "#F9FAFB", border: isStudent ? "1px solid #A7F3D0" : "1px solid #E5E7EB", borderRadius: 12,
          padding: "14px 20px", marginBottom: 20, fontSize: 14,
          color: isStudent ? "#065F46" : "#374151", fontWeight: 600, display: "flex", gap: 10, alignItems: "center",
          animation: "slideDown 0.3s ease both"
        }}>
          <div>
            <div>✅ Your complaint has been submitted successfully! We'll update you on its status.</div>
            {submittedAt && (
              <div style={{ marginTop: 4, fontSize: 12, fontWeight: 500, color: isStudent ? "#047857" : "#6B7280" }}>
                Registered on {submittedAt.date} at {submittedAt.time}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Submit Error Toast ────────────────────────────────────────── */}
      {submitError && (
        <div style={{
          background: isStudent ? "#FFF0F0" : "#FAFAFA", border: isStudent ? "1px solid #FECACA" : "1px solid #E5E7EB", borderRadius: 12,
          padding: "14px 20px", marginBottom: 20, fontSize: 14,
          color: isStudent ? "#991B1B" : "#374151", fontWeight: 600, display: "flex", gap: 10, alignItems: "center",
          animation: "slideDown 0.3s ease both"
        }}>
          ❌ {submitError}
        </div>
      )}

      {fetchError && (
        <div style={{ marginBottom: 14 }}>
          <ErrorState message={fetchError} onRetry={fetchComplaints} />
        </div>
      )}

      {loading && (
        <div style={{ marginBottom: 14 }}>
          <LoadingState label="Loading complaints..." />
        </div>
      )}

      {/* ── Complaint Form ────────────────────────────────────────────── */}
      {isStudent && showForm && (
        <div style={{
          background: theme?.panelBg || "#fff", borderRadius: 18, padding: "28px",
          border: theme?.panelBorder ? `1px solid ${theme.panelBorder}` : "1px solid #F0F0F0", boxShadow: theme?.panelShadow || "0 4px 20px rgba(0,0,0,0.07)",
          marginBottom: 24, animation: "slideDown 0.35s ease both"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 18, borderBottom: isStudent ? "1px solid #F5F5F5" : "1px solid #E5EEFF" }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, background: isStudent ? "#FFF0F1" : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📝</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{editingId ? "Edit Complaint" : "Raise a New Complaint"}</h3>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#999" }}>
                {editingId ? "Update complaint details and save changes." : "Fill in the details below and submit."}
              </p>
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
            <button onClick={() => { setShowForm(false); resetFormState(); }} style={{
              padding: "10px 22px", borderRadius: 10, border: "1.5px solid #E5E5E5",
              background: "#fff", color: "#555", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>Cancel</button>
            <button onClick={handleSubmit} style={{
              padding: "10px 28px", borderRadius: 10, border: "none",
              background: "#C0272D", color: "#fff", fontSize: 13,
              fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 12px rgba(192,39,45,0.28)"
            }}>{editingId ? "Update Complaint →" : "Submit Complaint →"}</button>
          </div>
        </div>
      )}

      {/* ── Summary Cards ─────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total",       value: counts.total,      color: isStudent ? "#4F7FFA" : "#1D4ED8", bg: isStudent ? "#EEF3FF" : "#EAF2FF", icon: "📋" },
          { label: "Submitted",   value: counts.submitted,  color: isStudent ? "#DC2626" : "#B45309", bg: isStudent ? "#FFF0F0" : "#FFF7ED", icon: "⏳" },
          { label: "In Progress", value: counts.inProgress, color: isStudent ? "#D97706" : "#7C3AED", bg: isStudent ? "#FFF8EB" : "#F5F3FF", icon: "🔄" },
          { label: "Resolved",    value: counts.resolved,   color: isStudent ? "#16A34A" : "#059669", bg: isStudent ? "#EDFAF3" : "#ECFDF5", icon: "✅" },
        ].map((s, i) => (
          <div key={s.label} style={{
            background: theme?.panelBg || "#fff", borderRadius: 14, padding: "18px 20px",
            border: theme?.panelBorder ? `1px solid ${theme.panelBorder}` : "1px solid #F0F0F0", display: "flex", alignItems: "center", gap: 14,
            boxShadow: theme?.panelShadow || "0 1px 4px rgba(0,0,0,0.05)",
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
        background: theme?.panelBg || "#fff", borderRadius: 14, padding: "16px 20px",
        border: theme?.panelBorder ? `1px solid ${theme.panelBorder}` : "1px solid #F0F0F0", marginBottom: 20,
        display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center",
        animation: "fadeUp 0.5s ease 0.3s both"
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🔍</span>
          <input
            placeholder="Search by title or ID..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 36, margin: 0, borderColor: isStudent ? "#E5E5E5" : "#D4DCF0", background: isStudent ? "#FAFAFA" : "#F8FAFF" }}
          />
        </div>

        {/* Status filter */}
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Submitted", "Under Review", "In Progress", "Resolved"].map(s => (
            <button key={s} className="filter-btn" onClick={() => setFilterStatus(s)} style={{
              padding: "7px 14px", borderRadius: 99, border: "1.5px solid",
              borderColor: filterStatus === s ? (isStudent ? "#C0272D" : "#111827") : (isStudent ? "#E5E5E5" : "#E5E7EB"),
              background: filterStatus === s ? (isStudent ? "#C0272D" : "#111827") : "#fff",
              color: filterStatus === s ? "#fff" : "#374151",
              fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap"
            }}>{s}</button>
          ))}
        </div>

        {/* Category filter */}
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{
          ...inputStyle, width: "auto", minWidth: 150, cursor: "pointer", margin: 0,
          borderColor: "#E5E7EB",
          background: "#fff"
        }}>
          <option value="All">All Categories</option>
          {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* ── Complaints Table ──────────────────────────────────────────── */}
      <div style={{
        background: theme?.panelBg || "#fff", borderRadius: 18,
        border: theme?.panelBorder ? `1px solid ${theme.panelBorder}` : "1px solid #F0F0F0", boxShadow: theme?.panelShadow || "0 1px 4px rgba(0,0,0,0.05)",
        overflow: "hidden", animation: "fadeUp 0.5s ease 0.4s both"
      }}>
        {/* Table Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 110px 90px 100px 160px 36px",
          padding: "12px 20px",
          background: theme?.tableHeadBg || "#FAFAFA",
          borderBottom: theme?.panelBorder ? `1px solid ${theme.panelBorder}` : "1px solid #F0F0F0"
        }}>
          {["Title", "Category", "Priority", "Status", "Date & Time", ""].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.07em", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>

        {/* Loading state */}
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#bbb" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Loading complaints...</p>
          </div>
        ) : fetchError ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#DC2626" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Failed to load complaints</p>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#aaa" }}>{fetchError}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#bbb" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>{theme?.emptyIcon || "📭"}</div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>No complaints found.</p>
            <p style={{ margin: "4px 0 0", fontSize: 13 }}>
              {complaints.length === 0
                ? isStudent
                  ? "You haven't raised any complaints yet."
                  : "No complaints have been submitted yet."
                : "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          filtered.map((c, i) => (
            <React.Fragment key={c.id ?? c._id}>
              <div
                className="row-hover"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 110px 90px 100px 160px 36px",
                  padding: "15px 20px",
                  borderBottom: i < filtered.length - 1 ? "1px solid #F8F8F8" : "none",
                  alignItems: "center", cursor: "pointer", transition: "background 0.15s"
                }}
                onClick={() => setExpandedId(expandedId === (c.id ?? c._id) ? null : (c.id ?? c._id))}
              >
                <span style={{ fontSize: 14, fontWeight: 500, paddingRight: 16 }}>{c.title}</span>
                <span style={{
                  fontSize: 12, fontWeight: 600, padding: "3px 10px",
                  borderRadius: 7, background: "#F5F5F5", color: "#555",
                  display: "inline-block", width: "fit-content"
                }}>{c.category}</span>
                <Badge label={c.priority} styleMap={PRIORITY_STYLE} />
                <Badge label={c.status}   styleMap={STATUS_STYLE} />
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#333" }}>{c.date}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#aaa" }}>{c.time}</p>
                </div>
                <span style={{
                  fontSize: 14, color: "#bbb", textAlign: "center",
                  transition: "transform 0.2s", display: "inline-block",
                  transform: expandedId === (c.id ?? c._id) ? "rotate(180deg)" : "rotate(0deg)"
                }}>▾</span>
              </div>

              {/* Expanded Detail */}
              {expandedId === (c.id ?? c._id) && (
                <div style={{
                  padding: "16px 24px 20px",
                  background: "#FDFCFC",
                  borderBottom: i < filtered.length - 1 ? "1px solid #F0F0F0" : "none",
                  animation: "slideDown 0.2s ease both"
                }}>
                  <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase" }}>Description</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#444", lineHeight: 1.7, maxWidth: 640 }}>{c.description}</p>

                  <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEdit(c); }}
                      style={{
                        padding: "7px 14px",
                        borderRadius: 8,
                        border: "1px solid #E5E5E5",
                        background: "#fff",
                        color: "#555",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(c); }}
                      style={{
                        padding: "7px 14px",
                        borderRadius: 8,
                        border: "1px solid #FECACA",
                        background: "#FFF5F5",
                        color: "#B91C1C",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  {/* Timeline indicator */}
                  <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center" }}>
                    {["Submitted", "Under Review", "In Progress", "Resolved"].map((step, idx) => {
                      const statusForIndex = (c.status === "Pending" ? "Submitted" : c.status) || "Submitted";
                      const stepIndex = ["Submitted","Under Review","In Progress","Resolved"].indexOf(statusForIndex);
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
      {!loading && !fetchError && filtered.length > 0 && (
        <p style={{ margin: "12px 0 0", fontSize: 12, color: "#bbb", textAlign: "right" }}>
          Showing {filtered.length} of {complaints.length} complaints
        </p>
      )}
    </div>
  );
};

export default RaiseComplaintPage;