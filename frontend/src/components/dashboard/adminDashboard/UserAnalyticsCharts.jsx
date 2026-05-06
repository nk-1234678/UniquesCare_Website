import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = {
  active: "#22C55E",
  inactive: "#F59E0B",
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

const UserAnalyticsCharts = ({ users }) => {
  const [activityMode, setActivityMode] = useState("stacked");

  const { activityData, roleData, totals } = useMemo(() => {
    const studentUsers = users.filter((user) => user.role === "student");
    const technicianUsers = users.filter((user) => user.role === "technician");
    const adminUsers = users.filter((user) => user.role === "admin");

    const buildByRole = (list) => ({
      active: list.filter((user) => user.hasLoggedInBefore).length,
      inactive: list.filter((user) => !user.hasLoggedInBefore).length,
    });

    const studentStats = buildByRole(studentUsers);
    const technicianStats = buildByRole(technicianUsers);
    const adminStats = buildByRole(adminUsers);

    return {
      activityData: [
        { role: "Students", active: studentStats.active, inactive: studentStats.inactive },
        { role: "Technicians", active: technicianStats.active, inactive: technicianStats.inactive },
        { role: "Admins", active: adminStats.active, inactive: adminStats.inactive },
      ],
      roleData: [
        { name: "Students", value: studentUsers.length, color: COLORS.student },
        { name: "Technicians", value: technicianUsers.length, color: COLORS.technician },
        { name: "Admins", value: adminUsers.length, color: COLORS.admin },
      ],
      totals: {
        active: users.filter((user) => user.hasLoggedInBefore).length,
        inactive: users.filter((user) => !user.hasLoggedInBefore).length,
        students: studentUsers.length,
        technicians: technicianUsers.length,
      },
    };
  }, [users]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 0.8fr",
        gap: 24,
        marginTop: 28,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "24px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #F0F0F0",
          animation: "fadeUp 0.5s ease 0.4s both",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>User Activity Graph</h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#999" }}>Active and inactive users by role</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { key: "stacked", label: "Stacked" },
              { key: "bar", label: "Bar" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActivityMode(item.key)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 8,
                  border: "1px solid #E5E5E5",
                  background: activityMode === item.key ? "#C0272D" : "#fff",
                  color: activityMode === item.key ? "#fff" : "#666",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="role" stroke="#999" style={{ fontSize: 12 }} />
            <YAxis stroke="#999" style={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="active" name="Active" stackId={activityMode === "stacked" ? "users" : undefined} fill={COLORS.active} />
            <Bar dataKey="inactive" name="Inactive" stackId={activityMode === "stacked" ? "users" : undefined} fill={COLORS.inactive} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "24px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #F0F0F0",
          animation: "fadeUp 0.5s ease 0.5s both",
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>User Distribution</h3>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#999" }}>Students vs Technicians</p>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={roleData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={96}
              paddingAngle={4}
            >
              {roleData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginTop: 10 }}>
          <div style={{ background: "#F0FDF4", borderRadius: 12, padding: 14, border: "1px solid #DCFCE7" }}>
            <p style={{ margin: 0, fontSize: 12, color: "#166534", fontWeight: 700 }}>Active Users</p>
            <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: "#14532D" }}>{totals.active}</p>
          </div>
          <div style={{ background: "#FFFBEB", borderRadius: 12, padding: 14, border: "1px solid #FDE68A" }}>
            <p style={{ margin: 0, fontSize: 12, color: "#92400E", fontWeight: 700 }}>Inactive Users</p>
            <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: "#78350F" }}>{totals.inactive}</p>
          </div>
          <div style={{ background: "#EFF6FF", borderRadius: 12, padding: 14, border: "1px solid #DBEAFE" }}>
            <p style={{ margin: 0, fontSize: 12, color: "#1E40AF", fontWeight: 700 }}>Students</p>
            <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: "#1D4ED8" }}>{totals.students}</p>
          </div>
          <div style={{ background: "#F5F3FF", borderRadius: 12, padding: 14, border: "1px solid #EDE9FE" }}>
            <p style={{ margin: 0, fontSize: 12, color: "#6D28D9", fontWeight: 700 }}>Technicians</p>
            <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: "#7C3AED" }}>{totals.technicians}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsCharts;