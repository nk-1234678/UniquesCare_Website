import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useUserProfile } from "../../hooks/useUserProfile";

const Sidebar = ({ isOpen = true, setIsOpen = () => {}, navItems = [] }) => {
  const { user } = useAuth();
  const { displayName, displayRole, initials } = useUserProfile(user);
  const safeNavItems = Array.isArray(navItems) ? navItems : [];
  const isGroupedNav = safeNavItems.length > 0 && Array.isArray(safeNavItems[0]?.items);

  const renderNavLink = (item, keyPrefix = "item") => (
    <NavLink
      key={`${keyPrefix}-${item?.path || item?.label}`}
      to={item?.path || "#"}
      end={Boolean(item.end)}
      title={!isOpen ? item?.label || "Menu" : ""}
      className={({ isActive }) =>
        `relative flex items-center whitespace-nowrap transition-all ${
          isActive ? "text-[#9B1C1C]" : "hover:text-[#9B1C1C]"
        }`
      }
      style={{
        gap: 13,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 11,
        paddingBottom: 11,
        borderRadius: 8,
        color: "var(--text-secondary)",
        background: "transparent",
      }}
    >
      {({ isActive }) => (
        <>
          <span className="flex justify-center" style={{ width: 20 }}>
            {item?.icon || "•"}
          </span>

          {isOpen && <span className="text-[13.5px] font-medium tracking-[0.3px]">{item?.label || "Untitled"}</span>}

          {isActive && (
            <div className="absolute right-0 bg-[#9B1C1C] rounded-l" style={{ top: "20%", height: "60%", width: 3 }} />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <div
      className="relative h-screen flex flex-col transition-all duration-300"
      style={{
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border-color)",
        boxShadow: "var(--shadow-soft)",
        color: "var(--text-primary)",
        width: isOpen ? 260 : 68,
      }}
    >
      {/* Left Accent Stripe */}
      <div
        className="absolute left-0 top-0 h-full"
        style={{ width: 3, backgroundImage: "linear-gradient(to bottom, #9B1C1C, #7B1111)" }}
      />

      {/* Toggle Button */}
      <div className="absolute z-20" style={{ top: 22, right: -14 }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full flex items-center justify-center group transition"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-soft)",
            width: 28,
            height: 28,
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`group-hover:text-white transition-transform duration-300 ${
              !isOpen ? "rotate-180" : ""
            }`}
            style={{ color: "var(--text-secondary)" }}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* Logo */}
      <div
        className="flex items-center gap-3 whitespace-nowrap overflow-hidden"
        style={{ borderBottom: "1px solid var(--border-color)", paddingLeft: 22, paddingRight: 22, paddingTop: 28, paddingBottom: 20 }}
      >
        <div
          className={`flex items-center justify-center font-extrabold text-white transition-all duration-300
          ${
            isOpen
              ? "text-[18px]"
              : "text-[12px]"
          }
          bg-[#C0272D] shadow-[0_2px_6px_rgba(192,39,45,0.25)]`}
          style={{
            width: isOpen ? 42 : 34,
            height: isOpen ? 42 : 34,
            borderRadius: isOpen ? 8 : 6,
          }}
        >
          UC
        </div>

        {isOpen && (
          <div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              UNIQUE <span style={{ color: "#C0272D" }}>CARE</span>
            </div>
            <div
              style={{
                fontSize: "9px",
                fontWeight: 500,
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginTop: "1px",
              }}
            >
              Smart Lab Maintenance
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto" style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 18, paddingBottom: 18 }}>
        {isOpen && (
          <div className="text-[9px] tracking-[2.5px] uppercase px-3 pb-2" style={{ color: "var(--text-muted)" }}>
            Main Menu
          </div>
        )}

        {isGroupedNav
          ? safeNavItems.map((section, sectionIndex) => (
              <div key={section.title || sectionIndex} style={{ marginBottom: 14 }}>
                {isOpen && (
                  <div
                    className="text-[9px] tracking-[2.2px] uppercase px-3 pb-2 pt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {section.title}
                  </div>
                )}

                <div style={{ display: "grid", gap: 4 }}>
                  {(Array.isArray(section.items) ? section.items : []).map((item, itemIndex) =>
                    renderNavLink(item, `${sectionIndex}-${itemIndex}`),
                  )}
                </div>
              </div>
            ))
          : safeNavItems.map((item, i) => renderNavLink(item, `flat-${i}`))}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--border-color)", paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 20 }}>
        <div className="flex items-center gap-3 hover:bg-[rgba(155,28,28,0.06)] transition whitespace-nowrap overflow-hidden" style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, borderRadius: 6 }}>
          <div className="rounded-full text-white flex items-center justify-center text-[13px] font-semibold border-2 border-[#FDEAEA]" style={{ width: 34, height: 34, backgroundImage: "linear-gradient(to bottom right, #9B1C1C, #7B1111)" }}>
            {initials}
          </div>

          {isOpen && (
            <div>
              <div className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
                {displayName}
              </div>
              <div className="text-[10px] uppercase tracking-[0.5px] text-[#C0392B]">
                {displayRole}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;