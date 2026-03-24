import React, { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const complaintStats = [
  { label: "Total Raised",   value: 48, icon: "📋", color: "#4F7FFA", bg: "#EEF3FF" },
  { label: "Resolved",       value: 31, icon: "✅", color: "#22C55E", bg: "#EDFAF3" },
  { label: "In Progress",    value: 11, icon: "🔄", color: "#F59E0B", bg: "#FFF8EB" },
  { label: "Pending",        value: 6,  icon: "⏳", color: "#EF4444", bg: "#FFF0F0" },
];

const monthlyData = [
  { month: "Sep", raised: 6,  resolved: 4,  inProgress: 2 },
  { month: "Oct", raised: 9,  resolved: 6,  inProgress: 3 },
  { month: "Nov", raised: 7,  resolved: 5,  inProgress: 1 },
  { month: "Dec", raised: 5,  resolved: 3,  inProgress: 2 },
  { month: "Jan", raised: 11, resolved: 7,  inProgress: 3 },
  { month: "Feb", raised: 10, resolved: 6,  inProgress: 0 },
];

const pieData = [
  { name: "Resolved",    value: 31, color: "#22C55E" },
  { name: "In Progress", value: 11, color: "#F59E0B" },
  { name: "Pending",     value: 6,  color: "#EF4444" },
];

const recentComplaints = [
  { id: "UC-048", title: "Hostel water supply issue",     category: "Hostel",     status: "In Progress", date: "Mar 18, 2026" },
  { id: "UC-047", title: "Library book not returned tag", category: "Library",    status: "Resolved",    date: "Mar 15, 2026" },
  { id: "UC-046", title: "Mess food quality complaint",   category: "Mess",       status: "Pending",     date: "Mar 12, 2026" },
  { id: "UC-045", title: "Wi-Fi connectivity in Block C", category: "IT",         status: "Resolved",    date: "Mar 10, 2026" },
  { id: "UC-044", title: "Classroom projector broken",    category: "Academics",  status: "Resolved",    date: "Mar 08, 2026" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusStyle = (status) => {
  const map = {
    "Resolved":    { bg: "#EDFAF3", color: "#16A34A" },
    "In Progress": { bg: "#FFF8EB", color: "#D97706" },
    "Pending":     { bg: "#FFF0F0", color: "#DC2626" },
  };
  return map[status] || {};
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon, color, bg, delay }) => (
  <div style={{
    background: "#fff",
    borderRadius: 16,
    padding: "24px 28px",
    display: "flex",
    alignItems: "center",
    gap: 20,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    border: "1px solid #F0F0F0",
    animation: `fadeUp 0.5s ease both`,
    animationDelay: `${delay}ms`,
  }}>
    <div style={{
      width: 54, height: 54, borderRadius: 14,
      background: bg, display: "flex",
      alignItems: "center", justifyContent: "center",
      fontSize: 24, flexShrink: 0
    }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, fontSize: 13, color: "#888", fontWeight: 500 }}>{label}</p>
      <p style={{ margin: "4px 0 0", fontSize: 30, fontWeight: 800, color, lineHeight: 1 }}>{value}</p>
    </div>
  </div>
);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid #eee",
      borderRadius: 10, padding: "10px 16px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 13
    }}>
      <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#333" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: "2px 0", color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const StudentDashboardTab = () => {
  const [chartType, setChartType] = useState("area");

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#1A1A1A" }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(120deg, #C0272D 0%, #8B1A1E 100%)",
        borderRadius: 18,
        padding: "28px 36px",
        color: "#fff",
        marginBottom: 28,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 24px rgba(192,39,45,0.25)",
        animation: "fadeUp 0.4s ease both"
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.8, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Student Dashboard
          </p>
          <h2 style={{ margin: "6px 0 4px", fontSize: 26, fontWeight: 800 }}>
            Welcome back, Arjun 👋
          </h2>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.75 }}>
            Here's a summary of all your complaint activity.
          </p>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: 14, padding: "14px 22px",
          textAlign: "center", backdropFilter: "blur(4px)"
        }}>
          <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>Academic Year</p>
          <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 800 }}>2025 – 26</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 28
      }}>
        {complaintStats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 80} />
        ))}
      </div>

      {/* Charts Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 340px",
        gap: 20,
        marginBottom: 24
      }}>

        {/* Area / Bar Chart */}
        <div style={{
          background: "#fff", borderRadius: 16,
          padding: "24px 24px 16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #F0F0F0",
          animation: "fadeUp 0.5s ease 0.3s both"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Monthly Complaint Trends</h3>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#999" }}>Sep 2025 – Feb 2026</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["area", "bar"].map(t => (
                <button key={t} onClick={() => setChartType(t)} style={{
                  padding: "5px 14px", borderRadius: 8, border: "1px solid #E5E5E5",
                  background: chartType === t ? "#C0272D" : "#fff",
                  color: chartType === t ? "#fff" : "#666",
                  fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize"
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            {chartType === "area" ? (
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="raised" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F7FFA" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4F7FFA" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#999" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#999" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="raised"     name="Raised"      stroke="#4F7FFA" fill="url(#raised)"   strokeWidth={2} dot={{ r: 4 }} />
                <Area type="monotone" dataKey="resolved"   name="Resolved"    stroke="#22C55E" fill="url(#resolved)" strokeWidth={2} dot={{ r: 4 }} />
                <Area type="monotone" dataKey="inProgress" name="In Progress" stroke="#F59E0B" fill="none"           strokeWidth={2} strokeDasharray="5 3" dot={{ r: 4 }} />
              </AreaChart>
            ) : (
              <BarChart data={monthlyData} barSize={14} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#999" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#999" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="raised"     name="Raised"      fill="#4F7FFA" radius={[4,4,0,0]} />
                <Bar dataKey="resolved"   name="Resolved"    fill="#22C55E" radius={[4,4,0,0]} />
                <Bar dataKey="inProgress" name="In Progress" fill="#F59E0B" radius={[4,4,0,0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{
          background: "#fff", borderRadius: 16,
          padding: "24px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #F0F0F0",
          animation: "fadeUp 0.5s ease 0.4s both"
        }}>
          <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700 }}>Status Breakdown</h3>
          <p style={{ margin: "0 0 12px", fontSize: 12, color: "#999" }}>All complaints overview</p>

          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData} cx="50%" cy="50%"
                innerRadius={52} outerRadius={78}
                paddingAngle={4} dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {pieData.map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color }} />
                  <span style={{ fontSize: 13, color: "#555" }}>{d.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{d.value}</span>
                  <span style={{ fontSize: 11, color: "#aaa" }}>
                    ({Math.round((d.value / 48) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Resolution rate */}
          <div style={{
            marginTop: 18, background: "#EDFAF3",
            borderRadius: 10, padding: "12px 16px"
          }}>
            <p style={{ margin: 0, fontSize: 12, color: "#555" }}>Resolution Rate</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
              <div style={{ flex: 1, height: 6, background: "#D1FAE5", borderRadius: 99 }}>
                <div style={{ width: "65%", height: "100%", background: "#22C55E", borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#16A34A" }}>65%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div style={{
        background: "#fff", borderRadius: 16,
        padding: "24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        border: "1px solid #F0F0F0",
        animation: "fadeUp 0.5s ease 0.5s both"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Recent Complaints</h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#999" }}>Your latest 5 submissions</p>
          </div>
          <button style={{
            padding: "7px 18px", borderRadius: 9,
            border: "1px solid #E5E5E5", background: "#fff",
            fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#C0272D"
          }}>
            View All →
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #F5F5F5" }}>
              {["ID", "Title", "Category", "Status", "Date"].map(h => (
                <th key={h} style={{
                  textAlign: "left", fontSize: 11, fontWeight: 700,
                  color: "#aaa", letterSpacing: "0.07em",
                  textTransform: "uppercase", padding: "0 12px 12px 0"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentComplaints.map((c, i) => (
              <tr key={c.id} style={{
                borderBottom: i < recentComplaints.length - 1 ? "1px solid #F8F8F8" : "none"
              }}>
                <td style={{ padding: "14px 12px 14px 0", fontSize: 13, fontWeight: 700, color: "#888" }}>{c.id}</td>
                <td style={{ padding: "14px 12px 14px 0", fontSize: 13, fontWeight: 500 }}>{c.title}</td>
                <td style={{ padding: "14px 12px 14px 0" }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    padding: "3px 10px", borderRadius: 6,
                    background: "#F5F5F5", color: "#555"
                  }}>{c.category}</span>
                </td>
                <td style={{ padding: "14px 12px 14px 0" }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    padding: "4px 12px", borderRadius: 99,
                    background: statusStyle(c.status).bg,
                    color: statusStyle(c.status).color
                  }}>{c.status}</span>
                </td>
                <td style={{ padding: "14px 0", fontSize: 12, color: "#999" }}>{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default StudentDashboardTab;