import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const StatusBreakdownCard = ({ pieChartData, totalRaised, resolvedCount }) => {
  return (
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
      <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700 }}>Status Breakdown</h3>
      <p style={{ margin: "0 0 12px", fontSize: 12, color: "#999" }}>Backend complaints overview</p>

      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={4} dataKey="value">
            {pieChartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} />
        </PieChart>
      </ResponsiveContainer>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
        {pieChartData.map((item) => (
          <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color }} />
              <span style={{ fontSize: 13, color: "#555" }}>{item.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{item.value}</span>
              <span style={{ fontSize: 11, color: "#aaa" }}>
                ({totalRaised ? Math.round((item.value / totalRaised) * 100) : 0}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 18,
          background: "#EDFAF3",
          borderRadius: 10,
          padding: "12px 16px",
        }}
      >
        <p style={{ margin: 0, fontSize: 12, color: "#555" }}>Resolution Rate</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
          <div style={{ flex: 1, height: 6, background: "#D1FAE5", borderRadius: 99 }}>
            <div
              style={{
                width: `${totalRaised ? Math.round((resolvedCount / totalRaised) * 100) : 0}%`,
                height: "100%",
                background: "#22C55E",
                borderRadius: 99,
              }}
            />
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#16A34A" }}>
            {totalRaised ? Math.round((resolvedCount / totalRaised) * 100) : 0}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusBreakdownCard;
