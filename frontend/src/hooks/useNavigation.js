import { useMemo } from "react";

const buildAdminSections = (basePath) => [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: "🏠", path: `${basePath}`, end: true },
    ],
  },
  {
    title: "Complaints",
    items: [
      { label: "All Complaints", icon: "📋", path: `${basePath}/complaints/all` },
    ],
  },
  {
    title: "Users",
    items: [
      { label: "Students", icon: "👥", path: `${basePath}/users/students` },
      { label: "Technicians", icon: "🧑‍🔧", path: `${basePath}/users/technicians` },
    ],
  },
  {
    title: "Technicians",
    items: [
      { label: "Performance", icon: "📈", path: `${basePath}/technicians/performance` },
      { label: "Assigned Complaints", icon: "🛠️", path: `${basePath}/technicians/assigned` },
      { label: "Resolution Rate", icon: "🎯", path: `${basePath}/technicians/resolution-rate` },
    ],
  },
  {
    title: "Analytics / Reports",
    items: [
      { label: "Weekly Complaints", icon: "📅", path: `${basePath}/reports/weekly` },
      { label: "Monthly Complaints", icon: "🗓️", path: `${basePath}/reports/monthly` },
      { label: "Category-wise Data", icon: "🧩", path: `${basePath}/reports/categories` },
      { label: "Charts", icon: "📊", path: `${basePath}/reports/charts` },
    ],
  },
];

const buildStudentNavItems = (basePath) => [
  { label: "Dashboard", icon: "📊", path: `${basePath}`, end: true },
  { label: "Profile", icon: "👤", path: `${basePath}/profile` },
  { label: "Reports", icon: "📑", path: `${basePath}/reports` },
  { label: "Alerts", icon: "🔔", path: `${basePath}/alerts` },
  { label: "Settings", icon: "⚙️", path: `${basePath}/settings` },
  { label: "Register Complaint", icon: "📝", path: `${basePath}/complaint` },
  { label: "Logout", icon: "🚪", path: `${basePath}/logout` },
];

const buildTechnicianNavItems = (basePath) => [
  { label: "Dashboard", icon: "📊", path: `${basePath}`, end: true },
  { label: "Profile", icon: "👤", path: `${basePath}/profile` },
  { label: "Reports", icon: "📑", path: `${basePath}/reports` },
  { label: "Alerts", icon: "🔔", path: `${basePath}/alerts` },
  { label: "My Complaints", icon: "🛠️", path: `${basePath}/status-update` },
  { label: "Settings", icon: "⚙️", path: `${basePath}/settings` },
  { label: "Logout", icon: "🚪", path: `${basePath}/logout` },
];

const buildAdminNavItems = (basePath) => [
  { label: "Dashboard", icon: "🏠", path: `${basePath}`, end: true },
  { label: "All Complaints", icon: "📋", path: `${basePath}/complaints/all` },
  { label: "Students", icon: "👥", path: `${basePath}/users/students` },
  { label: "Technicians", icon: "🧑‍🔧", path: `${basePath}/technicians/performance` },
  { label: "Reports", icon: "📊", path: `${basePath}/reports/weekly` },
  { label: "Settings", icon: "⚙️", path: `${basePath}/settings` },
  { label: "Logout", icon: "🚪", path: `${basePath}/logout` },
];

export const useNavigation = (role, basePath) => {
  return useMemo(() => {
    const normalizedRole = String(role || "student").toLowerCase();

    switch (normalizedRole) {
      case "technician":
        return buildTechnicianNavItems(basePath);
      case "admin":
        return buildAdminSections(basePath);
      case "student":
      default:
        return buildStudentNavItems(basePath);
    }
  }, [role, basePath]);
};
