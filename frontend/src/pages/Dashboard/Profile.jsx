import React, { useEffect, useMemo, useRef, useState } from "react";
import { authApi } from "../../api/authApi";
import { getErrorMessage } from "../../api/httpClient";
import { useAuth } from "../../context/AuthContext";

// ─── Constants ────────────────────────────────────────────────────────────────

const ACADEMIC_START_YEARS = ["2021", "2022", "2023", "2024", "2025"];
const ACADEMIC_END_YEARS   = ["2023", "2024", "2025", "2026", "2027"];

const initialProfile = {
  name:               "",
  email:              "",
  role:               "Student",
  department:         "",
  phone:              "",
  profilePhoto:       "",
  academicStartYear:  "",
  academicEndYear:    "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalise a raw user object (from API or AuthContext) into the local profile
 * shape. Uses nullish coalescing (??) so that legitimate empty strings from the
 * API are preserved rather than being replaced by the fallback value.
 */
const normaliseUser = (user, fallback = initialProfile) => ({
  ...initialProfile,
  name:  user?.name  ?? fallback.name,
  email: user?.email ?? fallback.email,
  role: user?.role
    ? String(user.role).charAt(0).toUpperCase() + String(user.role).slice(1)
    : fallback.role,
  department:        user?.department        ?? fallback.department,
  phone:             user?.phone             ?? fallback.phone,
  profilePhoto:      user?.profilePhoto      ?? fallback.profilePhoto,
  academicStartYear: user?.academicStartYear ?? fallback.academicStartYear,
  academicEndYear:   user?.academicEndYear   ?? fallback.academicEndYear,
});

const optimizeImageToDataUrl = (file, maxSize = 1024, quality = 0.75) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale  = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width  = Math.max(1, Math.round(img.width  * scale));
        const height = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width  = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Failed to get canvas context.")); return; }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Invalid image file."));
      img.src = typeof reader.result === "string" ? reader.result : "";
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle = {
  padding:    "10px 12px",
  borderRadius: 10,
  border:     "1px solid #E5E5E5",
  fontSize:   14,
  width:      "100%",
  boxSizing:  "border-box",
  outline:    "none",
  background: "#fff",
  color:      "#1A1A1A",
  fontFamily: "inherit",
};

const labelStyle = {
  fontSize:      12,
  color:         "#777",
  fontWeight:    700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const readonlyValueStyle = (readOnly) => ({
  border:       "1px solid #F0F0F0",
  borderRadius: 10,
  padding:      "10px 12px",
  background:   readOnly ? "#FAFAFA" : "#fff",
  color:        "#222",
  fontSize:     14,
  minHeight:    40,
});

// ─── Sub-components ───────────────────────────────────────────────────────────

const Field = ({
  label,
  value,
  editing,
  name,
  onChange,
  readOnly = false,
  type = "text",
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={labelStyle}>{label}</label>
    {editing && !readOnly ? (
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        style={inputStyle}
        autoComplete="off"
      />
    ) : (
      <div style={readonlyValueStyle(readOnly)}>{value || "-"}</div>
    )}
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={labelStyle}>{label}</label>
    <select
      name={name}
      value={value ?? ""}
      onChange={onChange}
      style={{ ...inputStyle, appearance: "auto", cursor: "pointer" }}
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();

  const [editing,        setEditing]        = useState(false);
  const [profile,        setProfile]        = useState(initialProfile);
  const [draft,          setDraft]          = useState(initialProfile);
  const [saved,          setSaved]          = useState(false);
  const [saving,         setSaving]         = useState(false);
  const [photoProcessing,setPhotoProcessing]= useState(false);
  const [error,          setError]          = useState("");

  const fileRef     = useRef(null);
  /**
   * Guard flag: prevents the AuthContext useEffect from overwriting locally
   * committed state while a save is in flight (or just after refreshUser runs).
   */
  const isSavingRef = useRef(false);

  // ── Seed from AuthContext whenever user changes (but not during a save) ──
  useEffect(() => {
    if (isSavingRef.current) return;
    if (user) {
      const fromContext = normaliseUser(user);
      setProfile(fromContext);
      setDraft(fromContext);
    }
  }, [user]);

  // ── Hydrate from API on mount for the most up-to-date data ──────────────
  useEffect(() => {
    let cancelled = false;
    const hydrateProfile = async () => {
      try {
        const data    = await authApi.getCurrentUser();
        const fromApi = normaliseUser(data?.user);
        if (!cancelled) {
          setProfile(fromApi);
          setDraft(fromApi);
        }
      } catch {
        // Keep existing values silently; non-critical failure.
      }
    };
    hydrateProfile();
    return () => { cancelled = true; };
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────
  const role      = useMemo(() => String(user?.role || "student").toLowerCase(), [user]);
  const isStudent = role === "student";

  // ── Handlers ─────────────────────────────────────────────────────────────

  const onChange = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async () => {
    try {
      isSavingRef.current = true;
      setSaving(true);
      setError("");

      // Always send every editable field unconditionally so that clearing a
      // value (e.g. emptying phone) is persisted rather than silently skipped.
      const payload = {
        name:       draft.name,
        email:      draft.email,
        department: draft.department,
        phone:      draft.phone,
      };

      // Academic year — students only; guards against accidentally clearing
      // data on technician profiles that share the same endpoint.
      if (isStudent) {
        payload.academicStartYear = draft.academicStartYear;
        payload.academicEndYear   = draft.academicEndYear;
      }

      // Never overwrite a stored photo with an empty string.
      if (typeof draft.profilePhoto === "string" && draft.profilePhoto.trim().length > 0) {
        payload.profilePhoto = draft.profilePhoto;
      }

      const data    = await authApi.updateProfile(payload);
      const updated = normaliseUser(data?.user, draft);

      setProfile(updated);
      setDraft(updated);
      setEditing(false);
      setSaved(true);

      // refreshUser updates AuthContext; isSavingRef blocks the useEffect
      // above from overwriting the fresh state we just committed.
      await refreshUser({ force: true });
      isSavingRef.current = false;

      setTimeout(() => setSaved(false), 1600);
    } catch (err) {
      isSavingRef.current = false;
      setError(getErrorMessage(err, "Failed to save profile. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setDraft(profile);
    setEditing(false);
    setError("");
  };

  const onPhotoPick = async (e) => {
    const file = e.target.files?.[0];
    // Reset so the same file can be re-selected after a cancel.
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setPhotoProcessing(true);
    setError("");

    try {
      const dataUrl = await optimizeImageToDataUrl(file, 1024, 0.75);
      setDraft((prev)    => ({ ...prev, profilePhoto: dataUrl }));
      setProfile((prev)  => ({ ...prev, profilePhoto: dataUrl }));
    } catch {
      setError("Failed to process the selected photo.");
    } finally {
      setPhotoProcessing(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const displayPhoto = draft.profilePhoto || profile.profilePhoto;

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#1A1A1A" }}>

      {/* ── Header banner ── */}
      <div
        style={{
          background:    "linear-gradient(130deg, #C0272D 0%, #7A1519 100%)",
          borderRadius:  20,
          padding:       "28px 32px",
          marginBottom:  22,
          display:       "flex",
          alignItems:    "center",
          justifyContent:"space-between",
          gap:           16,
          flexWrap:      "wrap",
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: 12, opacity: 0.8, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {role === "technician" ? "Technician" : "Student"} Profile
          </p>
          <h2 style={{ margin: "6px 0 0", color: "#fff", fontSize: 26, fontWeight: 800 }}>
            {profile.name || "—"}
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {saved && (
            <span style={{ background: "#EDFAF3", color: "#166534", padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
              ✓ Saved
            </span>
          )}

          {!editing ? (
            <button
              onClick={() => { setDraft(profile); setEditing(true); setError(""); }}
              style={{ border: "1px solid #fff", color: "#fff", background: "transparent", borderRadius: 10, padding: "8px 18px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={onCancel}
                style={{ border: "1px solid #F1F1F1", color: "#333", background: "#fff", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={saving || photoProcessing}
                style={{
                  border:        "none",
                  color:         "#fff",
                  background:    "#111",
                  borderRadius:  10,
                  padding:       "8px 18px",
                  cursor:        saving || photoProcessing ? "not-allowed" : "pointer",
                  opacity:       saving || photoProcessing ? 0.65 : 1,
                  fontWeight:    700,
                  fontSize:      13,
                  transition:    "opacity 0.15s",
                }}
              >
                {photoProcessing ? "Processing…" : saving ? "Saving…" : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div
          role="alert"
          style={{ marginBottom: 14, background: "#FFF0F0", color: "#B91C1C", border: "1px solid #FECACA", borderRadius: 12, padding: "10px 14px", fontSize: 13 }}
        >
          {error}
        </div>
      )}

      {/* ── Profile card ── */}
      <div
        style={{
          background:   "#fff",
          border:       "1px solid #F0F0F0",
          borderRadius: 16,
          padding:      22,
          boxShadow:    "0 1px 4px rgba(0,0,0,0.05)",
          display:      "grid",
          gridTemplateColumns: "120px 1fr",
          gap:          20,
        }}
      >
        {/* ── Avatar column ── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width:          96,
              height:         96,
              borderRadius:   "50%",
              overflow:       "hidden",
              background:     "#F5F5F5",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontSize:       38,
              border:         "2px solid #EFEFEF",
              flexShrink:     0,
            }}
          >
            {displayPhoto
              ? <img src={displayPhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : "👤"
            }
          </div>

          <button
            onClick={() => editing && fileRef.current?.click()}
            disabled={!editing || photoProcessing || saving}
            style={{
              border:       "1px solid #E5E5E5",
              background:   !editing ? "#F3F4F6" : "#fff",
              color:        !editing ? "#9CA3AF" : "#111",
              borderRadius: 8,
              padding:      "6px 10px",
              cursor:       !editing || photoProcessing || saving ? "not-allowed" : "pointer",
              fontSize:     12,
              fontWeight:   700,
              transition:   "background 0.15s, color 0.15s",
            }}
          >
            {photoProcessing ? "Processing…" : "Upload Photo"}
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPhotoPick}
            disabled={!editing}
            style={{ display: "none" }}
          />
        </div>

        {/* ── Fields grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>

          <Field
            label="Full Name"
            name="name"
            value={editing ? draft.name : profile.name}
            editing={editing}
            onChange={onChange}
          />

          <Field
            label="Email Address"
            name="email"
            value={editing ? draft.email : profile.email}
            editing={editing}
            onChange={onChange}
            type="email"
          />

          <Field
            label="Role"
            name="role"
            value={profile.role}
            editing={false}
            readOnly
          />

          <Field
            label="Department"
            name="department"
            value={editing ? draft.department : profile.department}
            editing={editing}
            onChange={onChange}
          />

          <Field
            label="Phone Number"
            name="phone"
            value={editing ? draft.phone : profile.phone}
            editing={editing}
            onChange={onChange}
            type="tel"
          />

          {/* Academic year — students only */}
          {isStudent && (
            editing ? (
              <>
                <SelectField
                  label="Start Year"
                  name="academicStartYear"
                  value={draft.academicStartYear}
                  onChange={onChange}
                  options={ACADEMIC_START_YEARS}
                />
                <SelectField
                  label="End Year"
                  name="academicEndYear"
                  value={draft.academicEndYear}
                  onChange={onChange}
                  options={ACADEMIC_END_YEARS}
                />
              </>
            ) : (
              <Field
                label="Academic Year"
                value={
                  profile.academicStartYear && profile.academicEndYear
                    ? `${profile.academicStartYear} – ${profile.academicEndYear}`
                    : ""
                }
                editing={false}
                readOnly
              />
            )
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;