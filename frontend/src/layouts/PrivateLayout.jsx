import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { useAuth } from "../context/AuthContext";
import LoadingState from "../components/ui/LoadingState";
import { useNavigation } from "../hooks/useNavigation";

// ─── COMPONENT ───────────────────────────────────────────────

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { role: routeRole } = useParams();
  const [isOpen, setIsOpen] = useState(true);

  const role = user?.role?.toLowerCase() || "student";
  const basePath = `/dashboard/${role}`;

  useEffect(() => {
    if (!loading && user && routeRole && routeRole !== role) {
      if (location.pathname !== basePath) {
        navigate(basePath, { replace: true });
      }
    }
  }, [loading, user, routeRole, role, basePath, navigate, location.pathname]);

  const navItems = useNavigation(role, basePath);

  if (loading) {
    return <LoadingState label="Loading dashboard..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
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
        <main
          className="flex-1 overflow-y-auto p-8"
          style={{
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
          }}
        >
          <Outlet context={{ user }} />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;