import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";


const navItems = [
  { label: "Dashboard", icon: "📊", path: "/dashboard" },
  { label: "Profile", icon: "👤", path: "/dashboard/profile" },
  { label: "Reports", icon: "📑", path: "/dashboard/reports" },
  { label: "Alerts", icon: "🔔", path: "/dashboard/alerts" },
  { label: "Settings", icon: "⚙️", path: "/dashboard/settings" },
  { label: "Register Complaint", icon: "⚙️", path: "/dashboard/complaint" },
  { label: "Logout", icon: "⚙️", path: "/dashboard/logout" },
];

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  

  return (
    <div className="flex h-screen bg-[#FAF6F6] overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        navItems={navItems}
        
      />

      {/* Main Section */}
      <div className="flex flex-col flex-1">

        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;