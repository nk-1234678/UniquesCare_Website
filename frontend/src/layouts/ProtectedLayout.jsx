import React from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";

const ProtectedLayout = () => {
  const { role: routeRole } = useParams();
  const location = useLocation();
  const { user, loading, isAuthenticated } = useAuth();

  // ⏳ Loading state
  if (loading) return <LoadingState label="Checking authentication..." />;

  // ❌ Not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.role) {
    return <ErrorState message="Invalid user role received. Please login again." />;
  }

  // ❌ Role mismatch
  if (routeRole && user.role !== routeRole) {
    const target = `/dashboard/${user.role}`;
    if (location.pathname !== target) {
      return <Navigate to={target} replace />;
    }
  }

  // ✅ Allowed
  return <Outlet context={{ user }} />;
};

export default ProtectedLayout;