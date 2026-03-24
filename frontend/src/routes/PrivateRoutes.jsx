import DashboardLayout from "../layouts/ProtectedLayout";
import StudentDashboardTab from "../components/dashboard/StudentDashboardTab";
import ProfilePage from "../pages/Dashboard/Profile";
import Alerts from "../pages/Dashboard/Alerts";
import SettingsPage from "../pages/Dashboard/Settings";
import Reports from "../pages/Dashboard/Reports";
import RaiseComplaintPage from "../pages/Dashboard/Complaint";

const PrivateRoutes = [
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <StudentDashboardTab /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "reports", element: <Reports /> },
      { path: "alerts", element: <Alerts /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "complaint", element: <RaiseComplaintPage/> },
    ],
  },
];

export default PrivateRoutes;