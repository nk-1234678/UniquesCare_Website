import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const SectionCard = ({ title, icon, description, children }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 18,
      padding: 28,
      border: "1px solid #F0F0F0",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 24,
        paddingBottom: 20,
        borderBottom: "1px solid #F5F5F5",
      }}
    >
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: 11,
          background: "#FFF0F1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <div>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111" }}>{title}</h3>
        {description && <p style={{ margin: "3px 0 0", fontSize: 13, color: "#999" }}>{description}</p>}
      </div>
    </div>
    {children}
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <div
    onClick={onChange}
    style={{
      width: 44,
      height: 24,
      borderRadius: 99,
      cursor: "pointer",
      flexShrink: 0,
      background: checked ? "#C0272D" : "#DDD",
      transition: "background 0.25s",
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 3,
        left: checked ? 23 : 3,
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        transition: "left 0.25s",
      }}
    />
  </div>
);

const SettingRow = ({ label, description, children, noBorder = false }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 0",
      borderBottom: noBorder ? "none" : "1px solid #F8F8F8",
    }}
  >
    <div style={{ flex: 1, marginRight: 20 }}>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#222" }}>{label}</p>
      {description && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#999" }}>{description}</p>}
    </div>
    {children}
  </div>
);

const SaveBtn = ({ onClick, saved }) => (
  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20, gap: 10, alignItems: "center" }}>
    {saved && (
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#16A34A",
          background: "#EDFAF3",
          padding: "7px 14px",
          borderRadius: 9,
        }}
      >
        Saved
      </span>
    )}
    <button
      onClick={onClick}
      style={{
        padding: "9px 24px",
        borderRadius: 10,
        border: "none",
        background: "#C0272D",
        color: "#fff",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 2px 10px rgba(192,39,45,0.2)",
      }}
    >
      Save Changes
    </button>
  </div>
);

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("notifications");
  const [notifSaved, setNotifSaved] = useState(false);
  const [accountSaved, setAccountSaved] = useState(false);

  const [notif, setNotif] = useState({
    complaintUpdates: true,
    reminderAlerts: true,
    emailAlerts: true,
    sound: false,
  });

  const [account, setAccount] = useState({
    language: "English",
    theme: theme === "dark" ? "Dark" : "Light",
  });

  React.useEffect(() => {
    setAccount((prev) => ({ ...prev, theme: theme === "dark" ? "Dark" : "Light" }));
  }, [theme]);

  const saveNotif = () => {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 1800);
  };

  const saveAccount = () => {
    setAccountSaved(true);
    setTimeout(() => setAccountSaved(false), 1800);
  };

  const tabs = [
    { key: "notifications", label: "Notifications", icon: "🔔" },
    { key: "account", label: "Basic Settings", icon: "⚙️" },
  ];

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#1A1A1A" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stab:hover { background: #FFF0F1 !important; color: #C0272D !important; }
      `}</style>

      <div
        style={{
          background: "linear-gradient(130deg, #C0272D 0%, #7A1519 100%)",
          borderRadius: 20,
          padding: "28px 36px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 28px rgba(192,39,45,0.22)",
          animation: "fadeUp 0.4s ease both",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: 12,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Dashboard
          </p>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff" }}>Settings</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            Manage basic and actionable settings.
          </p>
        </div>
        <span style={{ fontSize: 52, opacity: 0.25 }}>⚙️</span>
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div
          style={{
            width: 220,
            flexShrink: 0,
            background: "#fff",
            borderRadius: 16,
            padding: 8,
            border: "1px solid #F0F0F0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              className="stab"
              onClick={() => setActiveTab(t.key)}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 10,
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: activeTab === t.key ? "#C0272D" : "transparent",
                color: activeTab === t.key ? "#fff" : "#555",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
                marginBottom: 3,
                transition: "all 0.18s",
              }}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          {activeTab === "notifications" && (
            <>
              <SectionCard title="Notifications" icon="🔔" description="Choose what should trigger alerts.">
                <SettingRow label="Complaint Status Updates" description="Alert when complaint status changes.">
                  <Toggle
                    checked={notif.complaintUpdates}
                    onChange={() => setNotif((p) => ({ ...p, complaintUpdates: !p.complaintUpdates }))}
                  />
                </SettingRow>
                <SettingRow label="Reminder Alerts" description="Alert for pending complaints.">
                  <Toggle
                    checked={notif.reminderAlerts}
                    onChange={() => setNotif((p) => ({ ...p, reminderAlerts: !p.reminderAlerts }))}
                  />
                </SettingRow>
                <SettingRow label="Email Alerts" description="Also send notifications on email.">
                  <Toggle
                    checked={notif.emailAlerts}
                    onChange={() => setNotif((p) => ({ ...p, emailAlerts: !p.emailAlerts }))}
                  />
                </SettingRow>
                <SettingRow label="In-App Sound" description="Play sound for new notifications." noBorder>
                  <Toggle checked={notif.sound} onChange={() => setNotif((p) => ({ ...p, sound: !p.sound }))} />
                </SettingRow>
              </SectionCard>
              <SaveBtn onClick={saveNotif} saved={notifSaved} />
            </>
          )}

          {activeTab === "account" && (
            <>
              <SectionCard title="Basic Preferences" icon="🛠️" description="Simple settings you can change now.">
                <SettingRow label="Language" description="Set dashboard language.">
                  <select
                    value={account.language}
                    onChange={(e) => setAccount((p) => ({ ...p, language: e.target.value }))}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "1px solid #E5E5E5",
                      background: "#fff",
                      fontSize: 13,
                    }}
                  >
                    <option value="English">English</option>
                  </select>
                </SettingRow>
                <SettingRow label="Appearance Mode" description="Choose dashboard mode." noBorder>
                  <select
                    value={account.theme}
                    onChange={(e) => {
                      const mode = e.target.value;
                      setAccount((p) => ({ ...p, theme: mode }));
                      setTheme(mode === "Dark" ? "dark" : "light");
                    }}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "1px solid #E5E5E5",
                      background: "#fff",
                      fontSize: 13,
                    }}
                  >
                    <option value="Light">Light</option>
                    <option value="Dark">Dark</option>
                  </select>
                </SettingRow>
              </SectionCard>
              <SaveBtn onClick={saveAccount} saved={accountSaved} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
