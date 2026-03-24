import React, { useState } from "react";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const SectionCard = ({ title, icon, description, children, delay = 0 }) => (
  <div style={{
    background: "#fff", borderRadius: 18, padding: "28px",
    border: "1px solid #F0F0F0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    animation: `fadeUp 0.5s ease ${delay}ms both`
  }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #F5F5F5" }}>
      <span style={{
        width: 40, height: 40, borderRadius: 11, background: "#FFF0F1",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0
      }}>{icon}</span>
      <div>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111" }}>{title}</h3>
        {description && <p style={{ margin: "3px 0 0", fontSize: 13, color: "#999" }}>{description}</p>}
      </div>
    </div>
    {children}
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <div onClick={onChange} style={{
    width: 44, height: 24, borderRadius: 99, cursor: "pointer", flexShrink: 0,
    background: checked ? "#C0272D" : "#DDD",
    transition: "background 0.25s", position: "relative"
  }}>
    <div style={{
      position: "absolute", top: 3, left: checked ? 23 : 3,
      width: 18, height: 18, borderRadius: "50%", background: "#fff",
      boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.25s"
    }} />
  </div>
);

const SettingRow = ({ label, description, children }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 0", borderBottom: "1px solid #F8F8F8"
  }}>
    <div style={{ flex: 1, marginRight: 20 }}>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#222" }}>{label}</p>
      {description && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#999" }}>{description}</p>}
    </div>
    {children}
  </div>
);

const inputStyle = {
  padding: "9px 14px", borderRadius: 10,
  border: "1.5px solid #E5E5E5", fontSize: 14,
  color: "#222", background: "#FAFAFA",
  outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box"
};

const SelectInput = ({ value, onChange, options }) => (
  <select value={value} onChange={onChange} style={{ ...inputStyle, width: "auto", minWidth: 160, cursor: "pointer" }}>
    {options.map(o => <option key={o}>{o}</option>)}
  </select>
);

const SaveBtn = ({ onClick, saved }) => (
  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20, gap: 10, alignItems: "center" }}>
    {saved && (
      <span style={{ fontSize: 13, fontWeight: 600, color: "#16A34A", background: "#EDFAF3", padding: "7px 14px", borderRadius: 9 }}>
        ✅ Saved!
      </span>
    )}
    <button onClick={onClick} style={{
      padding: "9px 24px", borderRadius: 10, border: "none",
      background: "#C0272D", color: "#fff", fontSize: 13,
      fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 10px rgba(192,39,45,0.2)"
    }}>Save Changes</button>
  </div>
);

const DangerBtn = ({ label, onClick }) => (
  <button onClick={onClick} style={{
    padding: "9px 20px", borderRadius: 10,
    border: "1.5px solid #EF4444", background: "#fff",
    color: "#EF4444", fontSize: 13, fontWeight: 700, cursor: "pointer"
  }}>{label}</button>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const SettingsPage = () => {

  // Tabs
  const [activeTab, setActiveTab] = useState("notifications");

  // Notifications
  const [notif, setNotif] = useState({
    emailComplaints: true, emailUpdates: false, emailAnnouncements: true,
    smsComplaints: true,   smsUpdates: false,
    browserPush: true,     inAppSound: true,
    digestFrequency: "Daily",
  });
  const [notifSaved, setNotifSaved] = useState(false);

  // Security
  const [security, setSecurity] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
    twoFactor: false, sessionTimeout: "30 minutes", loginAlerts: true,
  });
  const [securitySaved, setSecuritySaved] = useState(false);
  const [pwError, setPwError] = useState("");

  // Appearance
  const [appearance, setAppearance] = useState({
    theme: "Light", language: "English", fontSize: "Medium",
    compactMode: false, animations: true, colorAccent: "#C0272D"
  });
  const [appearSaved, setAppearSaved] = useState(false);

  // Privacy
  const [privacy, setPrivacy] = useState({
    profileVisibility: "University Only",
    showCGPA: true, showContact: false, showComplaints: false,
    dataCollection: true, activityLog: true,
  });
  const [privacySaved, setPrivacySaved] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const toggle = (setter, key) => setter(p => ({ ...p, [key]: !p[key] }));

  const saveNotif = () => { setNotifSaved(true); setTimeout(() => setNotifSaved(false), 2500); };
  const saveAppear = () => { setAppearSaved(true); setTimeout(() => setAppearSaved(false), 2500); };
  const savePrivacy = () => { setPrivacySaved(true); setTimeout(() => setPrivacySaved(false), 2500); };

  const saveSecurity = () => {
    if (security.newPassword && security.newPassword !== security.confirmPassword) {
      setPwError("Passwords do not match."); return;
    }
    if (security.newPassword && security.newPassword.length < 8) {
      setPwError("Password must be at least 8 characters."); return;
    }
    setPwError("");
    setSecuritySaved(true);
    setSecurity(p => ({ ...p, currentPassword: "", newPassword: "", confirmPassword: "" }));
    setTimeout(() => setSecuritySaved(false), 2500);
  };

  const tabs = [
    { key: "notifications", label: "Notifications", icon: "🔔" },
    { key: "security",      label: "Security",      icon: "🔒" },
    { key: "appearance",    label: "Appearance",    icon: "🎨" },
    { key: "privacy",       label: "Privacy",       icon: "🛡️" },
    { key: "account",       label: "Account",       icon: "⚙️" },
  ];

  const accentColors = ["#C0272D", "#4F7FFA", "#22C55E", "#F59E0B", "#8B5CF6", "#0EA5E9"];

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#1A1A1A" }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input:focus, select:focus { border-color: #C0272D !important; background: #fff !important; }
        .stab:hover { background: #FFF0F1 !important; color: #C0272D !important; }
      `}</style>

      {/* ── Page Header ────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(130deg, #C0272D 0%, #7A1519 100%)",
        borderRadius: 20, padding: "28px 36px", marginBottom: 24,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 4px 28px rgba(192,39,45,0.22)",
        animation: "fadeUp 0.4s ease both"
      }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Student Dashboard
          </p>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff" }}>Settings</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            Manage your preferences, security and privacy.
          </p>
        </div>
        <span style={{ fontSize: 52, opacity: 0.25 }}>⚙️</span>
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

        {/* ── Sidebar Tabs ─────────────────────────────────────────── */}
        <div style={{
          width: 200, flexShrink: 0, background: "#fff",
          borderRadius: 16, padding: 8, border: "1px solid #F0F0F0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          animation: "fadeUp 0.4s ease 0.1s both"
        }}>
          {tabs.map(t => (
            <button key={t.key} className="stab" onClick={() => setActiveTab(t.key)} style={{
              width: "100%", padding: "11px 14px", borderRadius: 10,
              border: "none", display: "flex", alignItems: "center", gap: 10,
              background: activeTab === t.key ? "#C0272D" : "transparent",
              color: activeTab === t.key ? "#fff" : "#555",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              textAlign: "left", marginBottom: 3, transition: "all 0.18s"
            }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ──────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── NOTIFICATIONS ──────────────────────────────────────── */}
          {activeTab === "notifications" && (
            <>
              <SectionCard title="Email Notifications" icon="📧" description="Control which emails you receive" delay={100}>
                <SettingRow label="Complaint Updates" description="Get notified when your complaint status changes">
                  <Toggle checked={notif.emailComplaints} onChange={() => toggle(setNotif, "emailComplaints")} />
                </SettingRow>
                <SettingRow label="Platform Updates" description="New features and announcements">
                  <Toggle checked={notif.emailUpdates} onChange={() => toggle(setNotif, "emailUpdates")} />
                </SettingRow>
                <SettingRow label="University Announcements" description="Important notices from admin">
                  <Toggle checked={notif.emailAnnouncements} onChange={() => toggle(setNotif, "emailAnnouncements")} />
                </SettingRow>
                <SettingRow label="Digest Frequency" description="How often to receive email summaries">
                  <SelectInput value={notif.digestFrequency} onChange={e => setNotif(p => ({ ...p, digestFrequency: e.target.value }))} options={["Instant", "Daily", "Weekly", "Never"]} />
                </SettingRow>
              </SectionCard>

              <SectionCard title="SMS & Push Notifications" icon="📱" description="Mobile and browser alerts" delay={150}>
                <SettingRow label="SMS – Complaint Updates" description="Text alerts when complaints are resolved">
                  <Toggle checked={notif.smsComplaints} onChange={() => toggle(setNotif, "smsComplaints")} />
                </SettingRow>
                <SettingRow label="SMS – Status Changes" description="In-progress updates via text">
                  <Toggle checked={notif.smsUpdates} onChange={() => toggle(setNotif, "smsUpdates")} />
                </SettingRow>
                <SettingRow label="Browser Push Notifications" description="Alerts even when tab is inactive">
                  <Toggle checked={notif.browserPush} onChange={() => toggle(setNotif, "browserPush")} />
                </SettingRow>
                <SettingRow label="In-App Sound" description="Play a sound for new notifications">
                  <Toggle checked={notif.inAppSound} onChange={() => toggle(setNotif, "inAppSound")} />
                </SettingRow>
              </SectionCard>

              <SaveBtn onClick={saveNotif} saved={notifSaved} />
            </>
          )}

          {/* ── SECURITY ────────────────────────────────────────────── */}
          {activeTab === "security" && (
            <>
              <SectionCard title="Change Password" icon="🔑" description="Keep your account secure with a strong password" delay={100}>
                {pwError && (
                  <div style={{ background: "#FFF0F0", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#DC2626" }}>
                    ⚠️ {pwError}
                  </div>
                )}
                {[
                  { label: "Current Password",  key: "currentPassword" },
                  { label: "New Password",       key: "newPassword" },
                  { label: "Confirm New Password", key: "confirmPassword" },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                      {f.label}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={security[f.key]}
                      onChange={e => setSecurity(p => ({ ...p, [f.key]: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <div style={{ background: "#F9F9F9", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#888" }}>
                  💡 Use at least 8 characters with a mix of letters, numbers and symbols.
                </div>
              </SectionCard>

              <SectionCard title="Login & Session Security" icon="🛡️" description="Control how you log in" delay={150}>
                <SettingRow label="Two-Factor Authentication" description="Add an extra layer of security on login">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {security.twoFactor && <span style={{ fontSize: 11, fontWeight: 700, color: "#16A34A", background: "#EDFAF3", padding: "3px 10px", borderRadius: 99 }}>Enabled</span>}
                    <Toggle checked={security.twoFactor} onChange={() => toggle(setSecurity, "twoFactor")} />
                  </div>
                </SettingRow>
                <SettingRow label="Session Timeout" description="Automatically log out after inactivity">
                  <SelectInput value={security.sessionTimeout} onChange={e => setSecurity(p => ({ ...p, sessionTimeout: e.target.value }))} options={["15 minutes", "30 minutes", "1 hour", "4 hours", "Never"]} />
                </SettingRow>
                <SettingRow label="Login Alerts" description="Email me when a new login is detected">
                  <Toggle checked={security.loginAlerts} onChange={() => toggle(setSecurity, "loginAlerts")} />
                </SettingRow>
              </SectionCard>

              <SaveBtn onClick={saveSecurity} saved={securitySaved} />
            </>
          )}

          {/* ── APPEARANCE ───────────────────────────────────────────── */}
          {activeTab === "appearance" && (
            <>
              <SectionCard title="Theme & Display" icon="🎨" description="Customise how the dashboard looks" delay={100}>
                <SettingRow label="Theme" description="Choose light or dark mode">
                  <SelectInput value={appearance.theme} onChange={e => setAppearance(p => ({ ...p, theme: e.target.value }))} options={["Light", "Dark", "System Default"]} />
                </SettingRow>
                <SettingRow label="Language" description="Dashboard display language">
                  <SelectInput value={appearance.language} onChange={e => setAppearance(p => ({ ...p, language: e.target.value }))} options={["English", "Hindi", "Punjabi", "Tamil", "Telugu"]} />
                </SettingRow>
                <SettingRow label="Font Size" description="Adjust text size across the app">
                  <SelectInput value={appearance.fontSize} onChange={e => setAppearance(p => ({ ...p, fontSize: e.target.value }))} options={["Small", "Medium", "Large"]} />
                </SettingRow>
                <SettingRow label="Compact Mode" description="Reduce spacing for more content on screen">
                  <Toggle checked={appearance.compactMode} onChange={() => toggle(setAppearance, "compactMode")} />
                </SettingRow>
                <SettingRow label="Animations" description="Enable smooth transitions and effects">
                  <Toggle checked={appearance.animations} onChange={() => toggle(setAppearance, "animations")} />
                </SettingRow>
              </SectionCard>

              <SectionCard title="Accent Color" icon="🖌️" description="Pick your dashboard highlight color" delay={150}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingTop: 4 }}>
                  {accentColors.map(c => (
                    <div key={c} onClick={() => setAppearance(p => ({ ...p, colorAccent: c }))} style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: c, cursor: "pointer",
                      border: appearance.colorAccent === c ? `3px solid ${c}` : "3px solid transparent",
                      outline: appearance.colorAccent === c ? `2px solid ${c}` : "2px solid transparent",
                      outlineOffset: 3, transition: "all 0.2s"
                    }} />
                  ))}
                </div>
                <p style={{ margin: "14px 0 0", fontSize: 12, color: "#999" }}>Selected: <strong>{appearance.colorAccent}</strong></p>
              </SectionCard>

              <SaveBtn onClick={saveAppear} saved={appearSaved} />
            </>
          )}

          {/* ── PRIVACY ──────────────────────────────────────────────── */}
          {activeTab === "privacy" && (
            <>
              <SectionCard title="Profile Visibility" icon="👁️" description="Control who can see your information" delay={100}>
                <SettingRow label="Profile Visible To" description="Who can view your public profile">
                  <SelectInput value={privacy.profileVisibility} onChange={e => setPrivacy(p => ({ ...p, profileVisibility: e.target.value }))} options={["Everyone", "University Only", "Staff Only", "Only Me"]} />
                </SettingRow>
                <SettingRow label="Show CGPA on Profile" description="Display your academic score publicly">
                  <Toggle checked={privacy.showCGPA} onChange={() => toggle(setPrivacy, "showCGPA")} />
                </SettingRow>
                <SettingRow label="Show Contact Info" description="Let others see your phone and email">
                  <Toggle checked={privacy.showContact} onChange={() => toggle(setPrivacy, "showContact")} />
                </SettingRow>
                <SettingRow label="Show Complaint History" description="Allow staff to see your past complaints">
                  <Toggle checked={privacy.showComplaints} onChange={() => toggle(setPrivacy, "showComplaints")} />
                </SettingRow>
              </SectionCard>

              <SectionCard title="Data & Activity" icon="📊" description="Manage how your data is used" delay={150}>
                <SettingRow label="Usage Data Collection" description="Help improve the platform with anonymous usage stats">
                  <Toggle checked={privacy.dataCollection} onChange={() => toggle(setPrivacy, "dataCollection")} />
                </SettingRow>
                <SettingRow label="Activity Log" description="Keep a record of your actions in the dashboard">
                  <Toggle checked={privacy.activityLog} onChange={() => toggle(setPrivacy, "activityLog")} />
                </SettingRow>
              </SectionCard>

              <SaveBtn onClick={savePrivacy} saved={privacySaved} />
            </>
          )}

          {/* ── ACCOUNT ──────────────────────────────────────────────── */}
          {activeTab === "account" && (
            <>
              <SectionCard title="Account Information" icon="🪪" description="Your registered account details" delay={100}>
                <SettingRow label="Student ID" description="Your unique university identifier">
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#555" }}>21CSE104</span>
                </SettingRow>
                <SettingRow label="Registered Email" description="arjun.sharma@university.edu">
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: "#16A34A",
                    background: "#EDFAF3", padding: "4px 12px", borderRadius: 99
                  }}>Verified ✓</span>
                </SettingRow>
                <SettingRow label="Account Created" description="September 2021">
                  <span style={{ fontSize: 13, color: "#888" }}>3 years ago</span>
                </SettingRow>
                <SettingRow label="Last Login" description="Today, 09:32 AM from Chrome · Ludhiana">
                  <span style={{ fontSize: 13, color: "#888" }}>Active</span>
                </SettingRow>
              </SectionCard>

              <SectionCard title="Danger Zone" icon="⚠️" description="Irreversible account actions" delay={150}>
                <div style={{ background: "#FFF0F0", border: "1px solid #FECACA", borderRadius: 12, padding: "16px 20px" }}>
                  <p style={{ margin: "0 0 16px", fontSize: 13, color: "#7F1D1D", lineHeight: 1.6 }}>
                    These actions are <strong>permanent and cannot be undone</strong>. Please proceed with caution.
                  </p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <DangerBtn label="🗂️ Download My Data" onClick={() => alert("Your data export will be sent to your email.")} />
                    <DangerBtn label="🔕 Deactivate Account" onClick={() => alert("Account deactivation request submitted.")} />
                    <DangerBtn label="🗑️ Delete Account" onClick={() => confirm("Are you sure? This cannot be undone.") && alert("Deletion request submitted.")} />
                  </div>
                </div>
              </SectionCard>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;