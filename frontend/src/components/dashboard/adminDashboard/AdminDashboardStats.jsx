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
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
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
      <p style={{ margin: "4px 0 0", fontSize: 30, fontWeight: 800, color, lineHeight: 1 }}>
        {value}
      </p>
    </div>
  </div>
);

const AdminDashboardStats = ({ dashboardStats }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
        marginBottom: 28,
      }}
    >
      {dashboardStats.map((stat, index) => (
        <StatCard
          key={stat.label}
          {...stat}
          delay={index * 100}
        />
      ))}
    </div>
  );
};

export default AdminDashboardStats;
