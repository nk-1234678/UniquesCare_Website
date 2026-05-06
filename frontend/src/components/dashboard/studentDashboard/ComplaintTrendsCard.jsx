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
} from "recharts";

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

const ComplaintTrendsCard = ({ chartMonthlyData }) => {
  const [chartType, setChartType] = useState("area");

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "24px 24px 16px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        border: "1px solid #F0F0F0",
        animation: "fadeUp 0.5s ease 0.3s both",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Monthly Complaint Trends</h3>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#999" }}>Complaints from backend data</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["area", "bar"].map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              style={{
                padding: "5px 14px",
                borderRadius: 8,
                border: "1px solid #E5E5E5",
                background: chartType === type ? "#C0272D" : "#fff",
                color: chartType === type ? "#fff" : "#666",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        {chartType === "area" ? (
          <AreaChart data={chartMonthlyData}>
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
            <Area type="monotone" dataKey="raised" name="Raised" stroke="#4F7FFA" fill="url(#raised)" strokeWidth={2} dot={{ r: 4 }} />
            <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#22C55E" fill="url(#resolved)" strokeWidth={2} dot={{ r: 4 }} />
            <Area type="monotone" dataKey="inProgress" name="In Progress" stroke="#F59E0B" fill="none" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 4 }} />
          </AreaChart>
        ) : (
          <BarChart data={chartMonthlyData} barSize={14} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#999" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#999" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="raised" name="Raised" fill="#4F7FFA" radius={[4, 4, 0, 0]} />
            <Bar dataKey="resolved" name="Resolved" fill="#22C55E" radius={[4, 4, 0, 0]} />
            <Bar dataKey="inProgress" name="In Progress" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ComplaintTrendsCard;
