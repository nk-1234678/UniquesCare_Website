import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { buildWeeklyData, buildMonthlyData } from "./adminDashboardUtils";

const ROLE_COLORS = {
  student: "#3B82F6",
  technician: "#8B5CF6",
  admin: "#EC4899",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 10,
        padding: "10px 16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        fontSize: 13,
      }}
    >
      <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#333" }}>{label}</p>
      {payload.map((item, index) => (
        <p key={index} style={{ margin: "2px 0", color: item.color }}>
          {item.name}: <strong>{item.value}</strong>
        </p>
      ))}
    </div>
  );
};

const ComplaintCharts = ({ complaints, users = [] }) => {
  const [viewMode, setViewMode] = useState("weekly"); // 'weekly' | 'monthly'

  const weeklyData = buildWeeklyData(complaints);
  const monthlyData = buildMonthlyData(complaints);

  const data = viewMode === "weekly" ? weeklyData : monthlyData;

  const studentUsers = users.filter((user) => user.role === "student");
  const technicianUsers = users.filter((user) => user.role === "technician");
  const adminUsers = users.filter((user) => user.role === "admin");

  const roleData = [
    { name: "Students", value: studentUsers.length, color: ROLE_COLORS.student },
    { name: "Technicians", value: technicianUsers.length, color: ROLE_COLORS.technician },
    { name: "Admins", value: adminUsers.length, color: ROLE_COLORS.admin },
  ];

  const totalUsers = users.length;

  const ToggleButton = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: 8,
        border: "1px solid #E5E5E5",
        background: active ? "#B91C1C" : "#fff",
        color: active ? "#fff" : "#666",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            border: "1px solid #F0F0F0",
            animation: "fadeUp 0.5s ease 0.2s both",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#B91C1C" }}>
                {viewMode === "weekly" ? "Weekly Complaints (Bar)" : "Monthly Complaints (Bar)"}
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6B7280" }}>
                {viewMode === "weekly" ? "Last 7 days" : "Monthly overview"}
              </p>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <ToggleButton label="Weekly" active={viewMode === "weekly"} onClick={() => setViewMode("weekly")} />
              <ToggleButton label="Monthly" active={viewMode === "monthly"} onClick={() => setViewMode("monthly")} />
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={viewMode === "weekly" ? "day" : "month"} stroke="#999" style={{ fontSize: 12 }} />
              <YAxis stroke="#999" style={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="raised" fill="#B91C1C" name="Raised" />
              {data[0] && data[0].inProgress !== undefined && <Bar dataKey="inProgress" fill="#F59E0B" name="In Progress" />}
              {data[0] && data[0].resolved !== undefined && <Bar dataKey="resolved" fill="#22C55E" name="Resolved" />}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "14px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            border: "1px solid #F0F0F0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>User Distribution</h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6B7280" }}>Who is using the system</p>
          </div>

          <div style={{ height: 180, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={84} paddingAngle={4}>
                  {roleData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", pointerEvents: "none" }}>
              <div style={{ fontSize: 13, color: "#6B7280" }}>Total Users</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{totalUsers}</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
            {roleData.map((role) => (
              <div key={role.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 10, border: "1px solid #F3F4F6" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 999, background: role.color }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{role.name}</span>
                </div>
                <strong style={{ fontSize: 14, color: "#111827" }}>{role.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ComplaintCharts;
