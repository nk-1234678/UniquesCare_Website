import { lazy } from "react";
import DashboardLayout from "../layouts/PrivateLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotFoundPage from "../pages/NotFoundPage";

const StudentDashboardTab = lazy(() => import("../components/dashboard/StudentDashboardTab"));
const AdminDashboard = lazy(() => import("../pages/Dashboard/Admin"));
const ProfilePage = lazy(() => import("../pages/Dashboard/Profile"));
const Alerts = lazy(() => import("../pages/Dashboard/Alerts"));
const SettingsPage = lazy(() => import("../pages/Dashboard/Settings"));
const Reports = lazy(() => import("../pages/Dashboard/Reports"));
const RaiseComplaintPage = lazy(() => import("../pages/Dashboard/Complaint"));
const TechnicianStatusUpdate = lazy(() => import("../pages/Dashboard/TechnicianStatusUpdate"));
const Logout = lazy(() => import("../pages/Dashboard/Logout"));
const AdminSectionPage = lazy(() => import("../pages/Dashboard/Admin"));
const StudentsList = lazy(() => import("../pages/Dashboard/StudentsList"));
const TechniciansList = lazy(() => import("../pages/Dashboard/TechniciansList"));
const StudentDetail = lazy(() => import("../pages/Dashboard/StudentDetail"));
const TechnicianDetail = lazy(() => import("../pages/Dashboard/TechnicianDetail"));

const DashboardHome = () => {
  const { user } = useAuth();
  const role = String(user?.role || "student").toLowerCase();

  if (role === "admin") {
    return <AdminDashboard />;
  }

  return <StudentDashboardTab />;
};

const DashboardRoleRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  const role = String(user?.role || "student").toLowerCase();
  return <Navigate to={`/dashboard/${role}`} replace />;
};

const PrivateRoutes = [
  {
    path: "/dashboard",
    element: <DashboardRoleRedirect />,
  },
  {
    path: "/dashboard/:role",
    element: <ProtectedLayout />,
    children: [
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardHome /> },
          { path: "complaints/:view", element: <RaiseComplaintPage /> },
          { path: "users/:view", element: <AdminSectionPage /> },
          { path: "users/students", element: <StudentsList /> },
          { path: "users/students/:id", element: <StudentDetail /> },
          { path: "users/technicians", element: <TechniciansList /> },
          { path: "users/technicians/:id", element: <TechnicianDetail /> },
          { path: "technicians/:view", element: <AdminSectionPage /> },
          { path: "reports/:view", element: <AdminSectionPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "reports", element: <Reports /> },
          { path: "alerts", element: <Alerts /> },
          { path: "status-update", element: <TechnicianStatusUpdate /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "complaint", element: <RaiseComplaintPage /> },
          { path: "logout", element: <Logout /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
];

export default PrivateRoutes;