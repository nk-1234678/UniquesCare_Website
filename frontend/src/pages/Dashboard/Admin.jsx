import React, { useEffect, useState } from "react";
import AdminDashboardStats from "../../components/dashboard/adminDashboard/AdminDashboardStats";
import ComplaintCharts from "../../components/dashboard/adminDashboard/ComplaintCharts";
import UserAnalyticsCharts from "../../components/dashboard/adminDashboard/UserAnalyticsCharts";
import LoadingState from "../../components/ui/LoadingState";
import { complaintApi } from "../../api/complaintApi";
import { authApi } from "../../api/authApi";
import { getErrorMessage } from "../../api/httpClient";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch complaints
        const complaintsData = await complaintApi.getComplaints();
        const complaintItems = Array.isArray(complaintsData)
          ? complaintsData
          : complaintsData.complaints ?? [];
        setComplaints(Array.isArray(complaintItems) ? complaintItems : []);

        // Fetch users
        try {
          const usersData = await authApi.getUsers();
          setUsers(Array.isArray(usersData) ? usersData : usersData?.users ?? []);
        } catch (err) {
          console.warn("Failed to fetch users", err);
          setUsers([]);
        }
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load dashboard data."));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div style={{ padding: 24, color: "#DC2626", textAlign: "center" }}>
        <p>{error}</p>
      </div>
    );
  }

  // Calculate stats
  const totalStudents = users.filter((u) => u.role === "student").length;
  const totalTechnicians = users.filter((u) => u.role === "technician").length;
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter((c) => c.status === "Submitted").length;

  const dashboardStats = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: "👥",
      color: "#B91C1C",
      bg: "#FFF5F5",
    },
    {
      label: "Total Technicians",
      value: totalTechnicians,
      icon: "🔧",
      color: "#B91C1C",
      bg: "#FFF5F5",
    },
    {
      label: "Total Complaints",
      value: totalComplaints,
      icon: "📋",
      color: "#B91C1C",
      bg: "#FFF1F2",
    },
    {
      label: "Submitted Complaints",
      value: pendingComplaints,
      icon: "⏳",
      color: "#B91C1C",
      bg: "#FEF2F2",
    },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: "#B91C1C" }}>
          Admin Dashboard
        </h1>
        
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6B7280" }}>
          Welcome back! Here's what's happening with your complaints system today.
        </p>
      </div>

      {/* Stats Cards */}
      <AdminDashboardStats dashboardStats={dashboardStats} />

      {/* Charts Section */}
      <div style={{ marginBottom: 28 }}>
        <ComplaintCharts complaints={complaints} users={users} />
      </div>

      {/* Tables Section */}
      <UserAnalyticsCharts users={users} complaints={complaints} />
    </div>
  );
};

export default AdminDashboard;
