import React from "react";
import { formatDate, statusStyle } from "./adminDashboardUtils";

const RecentComplaintsTable = ({ complaints }) => {
  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 8);

  const getComplaintId = (complaint, index) => {
    if (complaint.id) return complaint.id;
    if (complaint._id) return `COMP-${String(complaint._id).slice(-4).toUpperCase()}`;
    return `COMP-${String(index + 1).padStart(3, "0")}`;
  };

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Recent Complaints</h3>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#999" }}>Latest submissions</p>
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
            color: "#C0272D",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#FFF5F5";
            e.currentTarget.style.borderColor = "#C0272D";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "#E5E5E5";
          }}
        >
          View All →
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #F5F5F5" }}>
              {["ID", "Title", "Category", "Status", "Date"].map((header) => (
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
                    whiteSpace: "nowrap",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentComplaints.length > 0 ? (
              recentComplaints.map((complaint, index) => {
                const status = complaint.status || "Pending";
                const style = statusStyle(status);
                return (
                  <tr
                    key={complaint.id || index}
                    style={{
                      borderBottom: index < recentComplaints.length - 1 ? "1px solid #F8F8F8" : "none",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F9FAFB";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td style={{ padding: "14px 12px 14px 0", fontSize: 12, fontWeight: 600, color: "#666" }}>
                      {getComplaintId(complaint, index)}
                    </td>
                    <td style={{ padding: "14px 12px 14px 0", fontSize: 13, fontWeight: 500, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {complaint.title}
                    </td>
                    <td style={{ padding: "14px 12px 14px 0" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: 6,
                          background: "#F5F5F5",
                          color: "#555",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {complaint.category || "N/A"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 12px 14px 0" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "4px 12px",
                          borderRadius: 6,
                          background: style.bg,
                          color: style.color,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 12px 14px 0", fontSize: 12, color: "#888" }}>
                      {formatDate(complaint.createdAt)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: "24px 12px", textAlign: "center", color: "#999", fontSize: 14 }}>
                  No complaints found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentComplaintsTable;
