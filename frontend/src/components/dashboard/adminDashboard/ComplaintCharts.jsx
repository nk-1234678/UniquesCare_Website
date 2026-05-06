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
} from "recharts";
import { buildWeeklyData, buildMonthlyData } from "./adminDashboardUtils";

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

const ComplaintCharts = ({ complaints }) => {
  const [weeklyChartType, setWeeklyChartType] = useState("area");
  const [monthlyChartType, setMonthlyChartType] = useState("bar");

  const weeklyData = buildWeeklyData(complaints);
  const monthlyData = buildMonthlyData(complaints);

  const ChartButton = ({ type, label, active, onClick }) => (
    <button
      onClick={onClick}
      style={{
        padding: "5px 14px",
        borderRadius: 8,
        border: "1px solid #E5E5E5",
        background: active ? "#C0272D" : "#fff",
        color: active ? "#fff" : "#666",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "#C0272D";
          e.currentTarget.style.color = "#C0272D";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "#E5E5E5";
          e.currentTarget.style.color = "#666";
        }
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
      }}
    >
      {/* Weekly Complaints Chart */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "24px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #F0F0F0",
          animation: "fadeUp 0.5s ease 0.2s both",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Weekly Complaints</h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#999" }}>Last 7 days overview</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["area", "line", "bar"].map((type) => (
              <ChartButton
                key={type}
                type={type}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                active={weeklyChartType === type}
                onClick={() => setWeeklyChartType(type)}
              />
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          {weeklyChartType === "area" && (
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorRaised" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#999" style={{ fontSize: 12 }} />
              <YAxis stroke="#999" style={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="raised" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRaised)" name="Raised" />
              <Area type="monotone" dataKey="resolved" stroke="#22C55E" fillOpacity={1} fill="url(#colorResolved)" name="Resolved" />
            </AreaChart>
          )}
          {weeklyChartType === "line" && (
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#999" style={{ fontSize: 12 }} />
              <YAxis stroke="#999" style={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="raised" stroke="#3B82F6" strokeWidth={2} name="Raised" />
              <Line type="monotone" dataKey="resolved" stroke="#22C55E" strokeWidth={2} name="Resolved" />
            </LineChart>
          )}
          {weeklyChartType === "bar" && (
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#999" style={{ fontSize: 12 }} />
              <YAxis stroke="#999" style={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="raised" fill="#3B82F6" name="Raised" />
              <Bar dataKey="resolved" fill="#22C55E" name="Resolved" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Monthly Complaints Chart */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "24px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #F0F0F0",
          animation: "fadeUp 0.5s ease 0.3s both",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Monthly Complaint Trends</h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#999" }}>Year overview</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["bar", "area", "line"].map((type) => (
              <ChartButton
                key={type}
                type={type}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                active={monthlyChartType === type}
                onClick={() => setMonthlyChartType(type)}
              />
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          {monthlyChartType === "bar" && (
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#999" style={{ fontSize: 12 }} />
              <YAxis stroke="#999" style={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="raised" fill="#3B82F6" name="Raised" />
              <Bar dataKey="resolved" fill="#22C55E" name="Resolved" />
              <Bar dataKey="inProgress" fill="#F59E0B" name="In Progress" />
            </BarChart>
          )}
          {monthlyChartType === "area" && (
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorMonthRaised" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#999" style={{ fontSize: 12 }} />
              <YAxis stroke="#999" style={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="raised" stroke="#3B82F6" fillOpacity={1} fill="url(#colorMonthRaised)" name="Raised" />
            </AreaChart>
          )}
          {monthlyChartType === "line" && (
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#999" style={{ fontSize: 12 }} />
              <YAxis stroke="#999" style={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="raised" stroke="#3B82F6" strokeWidth={2} name="Raised" />
              <Line type="monotone" dataKey="resolved" stroke="#22C55E" strokeWidth={2} name="Resolved" />
              <Line type="monotone" dataKey="inProgress" stroke="#F59E0B" strokeWidth={2} name="In Progress" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComplaintCharts;
