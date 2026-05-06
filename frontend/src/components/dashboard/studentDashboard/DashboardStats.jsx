import React from "react";

const StatCard = ({ label, value, icon, color, bg, delay }) => (
  <div
    style={{
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
    }}
  >
    <div
      style={{
        width: 54,
        height: 54,
        borderRadius: 14,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, fontSize: 13, color: "#888", fontWeight: 500 }}>{label}</p>
      <p style={{ margin: "4px 0 0", fontSize: 30, fontWeight: 800, color, lineHeight: 1 }}>{value}</p>
    </div>
  </div>
);

const DashboardStats = ({ dashboardStats }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 28,
      }}
    >
      {dashboardStats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index * 80} />
      ))}
    </div>
  );
};

export default DashboardStats;
