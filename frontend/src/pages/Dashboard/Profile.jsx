import React, { useState, useRef } from "react";

// ─── Mock Initial Data ─────────────────────────────────────────────────────────

const initialProfile = {
  name: "Arjun Sharma",
  rollNo: "21CSE104",
  email: "arjun.sharma@university.edu",
  phone: "+91 98765 43210",
  dob: "2003-08-15",
  gender: "Male",
  bloodGroup: "B+",
  nationality: "Indian",
  // Academic
  department: "Computer Science & Engineering",
  program: "B.Tech",
  semester: "6th",
  section: "A",
  batch: "2021 – 2025",
  advisor: "Dr. Priya Mehta",
  cgpa: "8.74",
  // Address
  hostel: "Block C – Room 214",
  hometown: "Ludhiana, Punjab",
  pincode: "141001",
  // Emergency
  guardianName: "Rajesh Sharma",
  guardianPhone: "+91 94110 22233",
  guardianRelation: "Father",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const Field = ({ label, value, editing, name, onChange, type = "text", options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase" }}>
      {label}
    </label>
    {editing ? (
      options ? (
        <select name={name} value={value} onChange={onChange} style={inputStyle}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} style={inputStyle} />
      )
    ) : (
      <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#222", padding: "9px 0" }}>{value || "—"}</p>
    )}
  </div>
);

const inputStyle = {
  padding: "9px 14px",
  borderRadius: 10,
  border: "1.5px solid #E5E5E5",
  fontSize: 14,
  color: "#222",
  background: "#FAFAFA",
  outline: "none",
  fontFamily: "inherit",
  transition: "border 0.2s",
};

const SectionCard = ({ title, icon, children }) => (
  <div style={{
    background: "#fff",
    borderRadius: 18,
    padding: "28px 28px",
    border: "1px solid #F0F0F0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    animation: "fadeUp 0.5s ease both",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
      <span style={{
        width: 36, height: 36, borderRadius: 10,
        background: "#FFF0F1", display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: 18
      }}>{icon}</span>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111" }}>{title}</h3>
    </div>
    {children}
  </div>
);

const Grid = ({ children, cols = 2 }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: "18px 28px"
  }}>
    {children}
  </div>
);

// ─── Badge ─────────────────────────────────────────────────────────────────────

const Badge = ({ label, color = "#C0272D", bg = "#FFF0F1" }) => (
  <span style={{
    fontSize: 11, fontWeight: 700, padding: "4px 12px",
    borderRadius: 99, background: bg, color, letterSpacing: "0.05em"
  }}>{label}</span>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const ProfilePage = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialProfile);
  const [avatar, setAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setDraft(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    setProfile(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  const tabs = [
    { key: "personal",     label: "Personal",   icon: "👤" },
    { key: "academic",     label: "Academic",   icon: "🎓" },
    { key: "address",      label: "Address",    icon: "📍" },
    { key: "emergency",    label: "Emergency",  icon: "🚨" },
  ];

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#1A1A1A" }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input:focus, select:focus { border-color: #C0272D !important; background: #fff !important; }
        .tab-btn:hover { background: #FFF0F1 !important; color: #C0272D !important; }
      `}</style>

      {/* ── Profile Hero Card ───────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(130deg, #C0272D 0%, #7A1519 100%)",
        borderRadius: 20,
        padding: "32px 36px",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 28,
        boxShadow: "0 4px 28px rgba(192,39,45,0.22)",
        animation: "fadeUp 0.4s ease both",
        flexWrap: "wrap"
      }}>
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 96, height: 96, borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.4)",
            overflow: "hidden", background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {avatar
              ? <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: 38 }}>🧑‍💻</span>
            }
          </div>
          {/* Upload button */}
          <button
            onClick={() => fileRef.current.click()}
            title="Upload photo"
            style={{
              position: "absolute", bottom: 2, right: 2,
              width: 28, height: 28, borderRadius: "50%",
              background: "#fff", border: "2px solid #C0272D",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 13, boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
            }}>
            📷
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Student Profile
          </p>
          <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 800, color: "#fff" }}>
            {profile.name}
          </h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Badge label={profile.rollNo} color="#C0272D" bg="#fff" />
            <Badge label={profile.department} color="#C0272D" bg="rgba(255,255,255,0.9)" />
            <Badge label={`${profile.program} · ${profile.semester} Sem`} color="#7A1519" bg="rgba(255,255,255,0.85)" />
          </div>
        </div>

        {/* CGPA Pill */}
        <div style={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: 16, padding: "16px 24px",
          textAlign: "center", backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.08em" }}>CGPA</p>
          <p style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 900, color: "#fff" }}>{profile.cgpa}</p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>out of 10.0</p>
        </div>
      </div>

      {/* ── Tabs + Edit Controls ────────────────────────────────────── */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12
      }}>
        {/* Tabs */}
        <div style={{
          display: "flex", gap: 6,
          background: "#fff", padding: 5, borderRadius: 12,
          border: "1px solid #F0F0F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
        }}>
          {tabs.map(t => (
            <button key={t.key} className="tab-btn" onClick={() => setActiveTab(t.key)} style={{
              padding: "8px 18px", borderRadius: 9, border: "none",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              background: activeTab === t.key ? "#C0272D" : "transparent",
              color: activeTab === t.key ? "#fff" : "#666",
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6
            }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Edit / Save / Cancel */}
        <div style={{ display: "flex", gap: 10 }}>
          {saved && (
            <span style={{
              fontSize: 13, fontWeight: 600, color: "#16A34A",
              background: "#EDFAF3", padding: "8px 16px", borderRadius: 9
            }}>✅ Saved!</span>
          )}
          {editing ? (
            <>
              <button onClick={handleCancel} style={{
                padding: "9px 20px", borderRadius: 10, border: "1.5px solid #E5E5E5",
                background: "#fff", color: "#555", fontSize: 13, fontWeight: 600, cursor: "pointer"
              }}>Cancel</button>
              <button onClick={handleSave} style={{
                padding: "9px 22px", borderRadius: 10, border: "none",
                background: "#C0272D", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 2px 10px rgba(192,39,45,0.25)"
              }}>Save Changes</button>
            </>
          ) : (
            <button onClick={() => { setDraft(profile); setEditing(true); }} style={{
              padding: "9px 22px", borderRadius: 10, border: "1.5px solid #C0272D",
              background: "#fff", color: "#C0272D", fontSize: 13, fontWeight: 700, cursor: "pointer"
            }}>✏️ Edit Profile</button>
          )}
        </div>
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────── */}

      {activeTab === "personal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <SectionCard title="Personal Information" icon="👤">
            <Grid>
              <Field label="Full Name"     name="name"        value={editing ? draft.name : profile.name}               editing={editing} onChange={handleChange} />
              <Field label="Date of Birth" name="dob"         value={editing ? draft.dob : profile.dob}                 editing={editing} onChange={handleChange} type="date" />
              <Field label="Gender"        name="gender"      value={editing ? draft.gender : profile.gender}           editing={editing} onChange={handleChange} options={["Male","Female","Other","Prefer not to say"]} />
              <Field label="Blood Group"   name="bloodGroup"  value={editing ? draft.bloodGroup : profile.bloodGroup}   editing={editing} onChange={handleChange} options={["A+","A-","B+","B-","AB+","AB-","O+","O-"]} />
              <Field label="Nationality"   name="nationality" value={editing ? draft.nationality : profile.nationality} editing={editing} onChange={handleChange} />
            </Grid>
          </SectionCard>

          <SectionCard title="Contact Details" icon="📬">
            <Grid>
              <Field label="Email Address"   name="email" value={editing ? draft.email : profile.email} editing={editing} onChange={handleChange} type="email" />
              <Field label="Phone Number"    name="phone" value={editing ? draft.phone : profile.phone} editing={editing} onChange={handleChange} />
            </Grid>
          </SectionCard>
        </div>
      )}

      {activeTab === "academic" && (
        <SectionCard title="Academic Information" icon="🎓">
          <Grid>
            <Field label="Roll Number"    name="rollNo"     value={editing ? draft.rollNo : profile.rollNo}         editing={editing} onChange={handleChange} />
            <Field label="Department"     name="department" value={editing ? draft.department : profile.department} editing={editing} onChange={handleChange} />
            <Field label="Program"        name="program"    value={editing ? draft.program : profile.program}       editing={editing} onChange={handleChange} options={["B.Tech","M.Tech","BCA","MCA","B.Sc","M.Sc","MBA"]} />
            <Field label="Semester"       name="semester"   value={editing ? draft.semester : profile.semester}     editing={editing} onChange={handleChange} options={["1st","2nd","3rd","4th","5th","6th","7th","8th"]} />
            <Field label="Section"        name="section"    value={editing ? draft.section : profile.section}       editing={editing} onChange={handleChange} options={["A","B","C","D"]} />
            <Field label="Batch"          name="batch"      value={editing ? draft.batch : profile.batch}           editing={editing} onChange={handleChange} />
            <Field label="Faculty Advisor" name="advisor"   value={editing ? draft.advisor : profile.advisor}       editing={editing} onChange={handleChange} />
            <Field label="CGPA"           name="cgpa"       value={editing ? draft.cgpa : profile.cgpa}             editing={editing} onChange={handleChange} />
          </Grid>

          {/* CGPA Visual Bar */}
          <div style={{ marginTop: 24, background: "#F9F9F9", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>CGPA Progress</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#C0272D" }}>{profile.cgpa} / 10.0</span>
            </div>
            <div style={{ height: 8, background: "#EEE", borderRadius: 99 }}>
              <div style={{
                height: "100%", borderRadius: 99,
                background: "linear-gradient(90deg, #C0272D, #F59E0B)",
                width: `${(parseFloat(profile.cgpa) / 10) * 100}%`,
                transition: "width 0.5s ease"
              }} />
            </div>
          </div>
        </SectionCard>
      )}

      {activeTab === "address" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <SectionCard title="Campus Address" icon="🏫">
            <Grid>
              <Field label="Hostel / Block" name="hostel"   value={editing ? draft.hostel : profile.hostel}     editing={editing} onChange={handleChange} />
              <Field label="Pincode"        name="pincode"  value={editing ? draft.pincode : profile.pincode}   editing={editing} onChange={handleChange} />
            </Grid>
          </SectionCard>

          <SectionCard title="Hometown Address" icon="🏠">
            <Grid>
              <Field label="City / Town"  name="hometown" value={editing ? draft.hometown : profile.hometown} editing={editing} onChange={handleChange} />
              <Field label="Pincode"      name="pincode"  value={editing ? draft.pincode : profile.pincode}   editing={editing} onChange={handleChange} />
            </Grid>
          </SectionCard>
        </div>
      )}

      {activeTab === "emergency" && (
        <SectionCard title="Emergency Contact" icon="🚨">
          <div style={{
            background: "#FFF8EB", border: "1px solid #FDE68A",
            borderRadius: 12, padding: "12px 16px", marginBottom: 22,
            fontSize: 13, color: "#92400E", display: "flex", gap: 8, alignItems: "flex-start"
          }}>
            <span>⚠️</span>
            <span>This information is used only in case of emergency and is kept strictly confidential.</span>
          </div>
          <Grid>
            <Field label="Guardian Name"     name="guardianName"     value={editing ? draft.guardianName : profile.guardianName}         editing={editing} onChange={handleChange} />
            <Field label="Relationship"      name="guardianRelation" value={editing ? draft.guardianRelation : profile.guardianRelation}  editing={editing} onChange={handleChange} options={["Father","Mother","Sibling","Guardian","Other"]} />
            <Field label="Guardian Phone"    name="guardianPhone"    value={editing ? draft.guardianPhone : profile.guardianPhone}        editing={editing} onChange={handleChange} />
          </Grid>
        </SectionCard>
      )}

    </div>
  );
};

export default ProfilePage;