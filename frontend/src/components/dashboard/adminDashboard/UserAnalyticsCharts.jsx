import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = {
  active: "#22C55E",
  inactive: "#F59E0B",
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

const UserAnalyticsCharts = ({ users = [], complaints = [] }) => {
  const [activityMode, setActivityMode] = useState("stacked");

  const { activityData, totals, recentComplaints } = useMemo(() => {
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

    const sortedComplaints = [...complaints].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    return {
      activityData: [
        { role: "Students", active: studentStats.active, inactive: studentStats.inactive },
        { role: "Technicians", active: technicianStats.active, inactive: technicianStats.inactive },
        { role: "Admins", active: adminStats.active, inactive: adminStats.inactive },
      ],
      totals: {
        active: users.filter((user) => user.hasLoggedInBefore).length,
        inactive: users.filter((user) => !user.hasLoggedInBefore).length,
        students: studentUsers.length,
        technicians: technicianUsers.length,
      },
      recentComplaints: sortedComplaints.slice(0, 5),
    };
  }, [users, complaints]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 20, marginTop: 22 }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "18px",
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

        <ResponsiveContainer width="100%" height={260}>
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

      <div style={{ display: "grid", gap: 18 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F0F0F0", animation: "fadeUp 0.5s ease 0.5s both" }}>
          <div style={{ marginBottom: 10 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Recent Complaints</h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#999" }}>Latest 5 complaints</p>
          </div>

          <div style={{ display: "grid", gap: 8, maxHeight: 190, overflow: "auto", paddingRight: 2 }}>
            {recentComplaints.length === 0 ? (
              <div style={{ padding: 12, borderRadius: 10, border: "1px dashed #E5E7EB", color: "#6B7280" }}>
                No complaints yet.
              </div>
            ) : (
              recentComplaints.map((complaint) => (
                <div key={complaint._id || complaint.id} style={{ padding: 10, borderRadius: 10, border: "1px solid #F3F4F6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                        {complaint.title || complaint.subject || complaint.category || "Complaint"}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                        {complaint.description ? complaint.description.slice(0, 80) : "No description provided."}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{complaint.status || "Submitted"}</div>
                      <div style={{ fontSize: 11, color: "#6B7280", marginTop: 5 }}>
                        {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : "Unknown"}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserAnalyticsCharts;
