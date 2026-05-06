import React from "react";
import { Search, Bell, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Topbar = ({ title = "Dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const currentRoleFromPath = (() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts[0] !== "dashboard") return "student";
    const role = parts[1] || "student";
    return String(role).toLowerCase();
  })();

  const basePath = `/dashboard/${currentRoleFromPath}`;
  const greetingText = "Welcome back";
  const greetingName = user?.name || "User";

  return (
    <div
      className="flex items-center justify-between px-8"
      style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-color)",
        boxShadow: "var(--shadow-soft)",
        color: "var(--text-primary)",
        height: 70,
      }}
    >

      {/* Left Section */}
      <div>
        <h1 className="text-[20px] font-semibold tracking-[0.5px]" style={{ color: "var(--text-primary)" }}>
          {title}
        </h1>
        <p className="text-[11px] uppercase tracking-[2px]" style={{ marginTop: 2, color: "var(--accent-strong)" }}>
          {greetingText}, {greetingName}
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Search Box */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search here..."
            className="pl-9 pr-4 text-[13px] focus:outline-none focus:ring-1 transition"
            style={{
              width: 220,
              paddingTop: 8,
              paddingBottom: 8,
              borderRadius: 6,
              background: "var(--bg-surface)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            }}
          />
        </div>

        {/* Icon Buttons */}
        <div className="flex items-center gap-4">

          <button
            className="relative p-2 rounded-full hover:bg-[rgba(155,28,28,0.08)] transition"
            onClick={() => navigate(`${basePath}/alerts`)}
            title="Open alerts"
            aria-label="Open alerts"
          >
            <Bell size={18} style={{ color: "var(--text-secondary)" }} />
            <span className="absolute -top-1 -right-1 bg-[#9B1C1C] rounded-full" style={{ width: 8, height: 8 }}></span>
          </button>

          <button
            className="p-2 rounded-full hover:bg-[rgba(155,28,28,0.08)] transition"
            onClick={() => navigate(`${basePath}/settings`)}
            title="Open settings"
            aria-label="Open settings"
          >
            <Settings size={18} style={{ color: "var(--text-secondary)" }} />
          </button>

        </div>

        

      </div>
    </div>
  );
};

export default Topbar;