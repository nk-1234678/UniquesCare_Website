import React, { useEffect, useState } from "react";
import DashboardIntro from "./studentDashboard/DashboardIntro";
import DashboardStats from "./studentDashboard/DashboardStats";
import ComplaintTrendsCard from "./studentDashboard/ComplaintTrendsCard";
import StatusBreakdownCard from "./studentDashboard/StatusBreakdownCard";
import RecentComplaintsCard from "./studentDashboard/RecentComplaintsCard";
import { complaintApi } from "../../api/complaintApi";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/httpClient";
import LoadingState from "../../components/ui/LoadingState";
import {
  STATUS_COLORS,
  buildMonthlyData,
  buildRecentComplaints,
} from "./studentDashboard/dashboardUtils";

const StudentDashboardTab = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");
  const { user } = useAuth();

  useEffect(() => {
    setUserName(user?.name || "User");
  }, [user]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await complaintApi.getComplaints();
        const items = Array.isArray(data) ? data : data.complaints ?? [];
        setComplaints(Array.isArray(items) ? items : []);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load complaint data."));
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const totalRaised = complaints.length;
  const resolvedCount = complaints.filter(item => item.status === "Resolved").length;
  const inProgressCount = complaints.filter(item => item.status === "In Progress").length;
  const pendingCount = complaints.filter(item => item.status === "Pending").length;

  const chartMonthlyData = buildMonthlyData(complaints);
  const recentComplaints = buildRecentComplaints(complaints);
  const pieChartData = [
    { name: "Resolved", value: resolvedCount, color: STATUS_COLORS.Resolved },
    { name: "In Progress", value: inProgressCount, color: STATUS_COLORS["In Progress"] },
    { name: "Pending", value: pendingCount, color: STATUS_COLORS.Pending },
  ];

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#1A1A1A" }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <DashboardIntro userName={userName} />
      <DashboardStats
        dashboardStats={[
          { label: "Total Raised", value: totalRaised, icon: "📋", color: "#4F7FFA", bg: "#EEF3FF" },
          { label: "Resolved", value: resolvedCount, icon: "✅", color: "#22C55E", bg: "#EDFAF3" },
          { label: "In Progress", value: inProgressCount, icon: "🔄", color: "#F59E0B", bg: "#FFF8EB" },
          { label: "Pending", value: pendingCount, icon: "⏳", color: "#EF4444", bg: "#FFF0F0" },
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginBottom: 24 }}>
        <ComplaintTrendsCard chartMonthlyData={chartMonthlyData} />
        <StatusBreakdownCard
          pieChartData={pieChartData}
          totalRaised={totalRaised}
          resolvedCount={resolvedCount}
        />
      </div>

      <RecentComplaintsCard
        recentComplaints={recentComplaints}
        loading={loading}
        error={error}
      />

      {loading && <LoadingState label="Loading dashboard data..." />}

    </div>
  );
};

export default StudentDashboardTab;