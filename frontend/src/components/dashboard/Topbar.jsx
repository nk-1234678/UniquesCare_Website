import React from "react";
import { Search, Bell, Settings } from "lucide-react";

const Topbar = ({ title = "Dashboard" }) => {
  return (
    <div className="h-[70px] bg-white border-b border-[#E8E0E0] shadow-[0_2px_10px_rgba(155,28,28,0.05)] flex items-center justify-between px-8">

      {/* Left Section */}
      <div>
        <h1 className="text-[20px] font-semibold tracking-[0.5px] text-[#1A0A0A]">
          {title}
        </h1>
        <p className="text-[11px] uppercase tracking-[2px] text-[#C0392B] mt-[2px]">
          Welcome back
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Search Box */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08080]"
          />
          <input
            type="text"
            placeholder="Search here..."
            className="w-[220px] pl-9 pr-4 py-[8px] text-[13px] rounded-[6px] border border-[#E8E0E0] focus:outline-none focus:border-[#9B1C1C] focus:ring-1 focus:ring-[#9B1C1C] transition"
          />
        </div>

        {/* Icon Buttons */}
        <div className="flex items-center gap-4">

          <button className="relative p-2 rounded-full hover:bg-[rgba(155,28,28,0.08)] transition">
            <Bell size={18} className="text-[#6B4E4E]" />
            <span className="absolute -top-1 -right-1 w-[8px] h-[8px] bg-[#9B1C1C] rounded-full"></span>
          </button>

          <button className="p-2 rounded-full hover:bg-[rgba(155,28,28,0.08)] transition">
            <Settings size={18} className="text-[#6B4E4E]" />
          </button>

        </div>

        

      </div>
    </div>
  );
};

export default Topbar;