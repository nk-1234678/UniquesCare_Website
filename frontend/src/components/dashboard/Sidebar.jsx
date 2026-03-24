import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen, navItems }) => {
  return (
    <div
      className={`relative h-screen flex flex-col bg-white border-r border-[#E8E0E0] shadow-[2px_0_12px_rgba(155,28,28,0.06)] transition-all duration-300
      ${isOpen ? "w-[260px]" : "w-[68px]"}`}
    >
      {/* Left Accent Stripe */}
      <div className="absolute left-0 top-0 w-[3px] h-full bg-gradient-to-b from-[#9B1C1C] to-[#7B1111]" />

      {/* Toggle Button */}
      <div className="absolute top-[22px] -right-[14px] z-20">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-[28px] h-[28px] bg-white border border-[#EDE5E5] rounded-full shadow-[0_2px_8px_rgba(155,28,28,0.12)] flex items-center justify-center hover:bg-[#9B1C1C] hover:border-[#9B1C1C] group transition"
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
            className={`text-[#6B4E4E] group-hover:text-white transition-transform duration-300 ${
              !isOpen ? "rotate-180" : ""
            }`}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* Logo */}
      <div className="flex items-center gap-3 px-[22px] pt-[28px] pb-[20px] border-b border-[#E8E0E0] whitespace-nowrap overflow-hidden">
        <div
          className={`flex items-center justify-center font-extrabold text-white transition-all duration-300
          ${
            isOpen
              ? "w-[42px] h-[42px] text-[18px] rounded-[8px]"
              : "w-[34px] h-[34px] text-[12px] rounded-[6px]"
          }
          bg-[#C0272D] shadow-[0_2px_6px_rgba(192,39,45,0.25)]`}
        >
          UC
        </div>

        {isOpen && (
          <div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "-0.02em",
              }}
            >
              UNIQUE <span style={{ color: "#C0272D" }}>CARE</span>
            </div>
            <div
              style={{
                fontSize: "9px",
                fontWeight: 500,
                color: "#6b7280",
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
      <nav className="flex-1 px-[10px] py-[18px] overflow-y-auto">
        {isOpen && (
          <div className="text-[9px] tracking-[2.5px] uppercase text-[#A08080] px-3 pb-2">
            Main Menu
          </div>
        )}

        {navItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            end={item.path === "/dashboard"}
            title={!isOpen ? item.label : ""}
            className={({ isActive }) =>
              `relative flex items-center gap-[13px] px-[12px] py-[11px] rounded-[6px] whitespace-nowrap transition-all
              ${
                isActive
                  ? "bg-[rgba(155,28,28,0.1)] text-[#9B1C1C]"
                  : "text-[#6B4E4E] hover:bg-[rgba(155,28,28,0.06)] hover:text-[#9B1C1C]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="w-[20px] flex justify-center">
                  {item.icon}
                </span>

                {isOpen && (
                  <span className="text-[13.5px] font-medium tracking-[0.3px]">
                    {item.label}
                  </span>
                )}

                {isActive && (
                  <div className="absolute right-0 top-[20%] h-[60%] w-[3px] bg-[#9B1C1C] rounded-l" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-[10px] pt-[14px] pb-[20px] border-t border-[#E8E0E0]">
        <div className="flex items-center gap-3 px-[12px] py-[10px] rounded-[6px] hover:bg-[rgba(155,28,28,0.06)] transition whitespace-nowrap overflow-hidden">
          <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#9B1C1C] to-[#7B1111] text-white flex items-center justify-center text-[13px] font-semibold border-2 border-[#FDEAEA]">
            AK
          </div>

          {isOpen && (
            <div>
              <div className="text-[13px] font-medium text-[#1A0A0A]">
                Alex Kiran
              </div>
              <div className="text-[10px] uppercase tracking-[0.5px] text-[#C0392B]">
                Administrator
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;