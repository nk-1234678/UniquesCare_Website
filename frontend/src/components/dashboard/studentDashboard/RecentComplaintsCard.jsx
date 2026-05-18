import React from "react";
import { statusStyle } from "./dashboardUtils";

const RecentComplaintsCard = ({ recentComplaints, loading, error }) => {
  return (
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#B91C1C" }}>Recent Complaints</h3>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6B7280" }}>Your latest 5 backend submissions</p>
        </div>
        <button
          style={{
            padding: "7px 18px",
            borderRadius: 9,
            border: "1px solid #E5E5E5",
            background: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            color: "#B91C1C",
          }}
        >
          View All →
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #F5F5F5" }}>
            {["Title", "Category", "Status", "Date"].map((header) => (
              <th
                key={header}
                style={{
                  textAlign: "left",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#aaa",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  padding: "0 12px 12px 0",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recentComplaints.map((complaint, index) => (
            <tr
              key={complaint.id}
              style={{ borderBottom: index < recentComplaints.length - 1 ? "1px solid #F8F8F8" : "none" }}
            >
              <td style={{ padding: "14px 12px 14px 0", fontSize: 13, fontWeight: 500 }}>{complaint.title}</td>
              <td style={{ padding: "14px 12px 14px 0" }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 6,
                    background: "#FFF5F5",
                    color: "#B91C1C",
                  }}
                >
                  {complaint.category}
                </span>
              </td>
              <td style={{ padding: "14px 12px 14px 0" }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: 99,
                    background: statusStyle(complaint.status).bg,
                    color: statusStyle(complaint.status).color,
                  }}
                >
                  {complaint.status}
                </span>
              </td>
              <td style={{ padding: "14px 0", fontSize: 12, color: "#999" }}>{complaint.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && (
        <div style={{ padding: "18px 0 4px", fontSize: 13, color: "#999" }}>
          Loading complaint data...
        </div>
      )}

      {error && (
        <div style={{ padding: "18px 0 4px", fontSize: 13, color: "#DC2626" }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default RecentComplaintsCard;
