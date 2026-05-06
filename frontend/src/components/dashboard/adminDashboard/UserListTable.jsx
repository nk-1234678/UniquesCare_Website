import React, { useState } from "react";
import { formatDate } from "./adminDashboardUtils";

const UserListTable = ({ users }) => {
  const [filterRole, setFilterRole] = useState("all");

  const filteredUsers = users.filter((user) => {
    if (filterRole === "all") return true;
    return user.role === filterRole;
  });

  const displayUsers = filteredUsers.slice(0, 8);

  const roleColors = {
    student: { bg: "#EFF6FF", color: "#1E40AF", label: "Student", icon: "👨‍🎓" },
    technician: { bg: "#F5F3FF", color: "#6D28D9", label: "Technician", icon: "🔧" },
    admin: { bg: "#FEF2F2", color: "#991B1B", label: "Admin", icon: "👨‍💼" },
  };

  const getRoleStyle = (role) => roleColors[role] || roleColors.student;

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
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>User List</h3>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#999" }}>Students & Technicians</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "student", "technician"].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid #E5E5E5",
                background: filterRole === role ? "#C0272D" : "#fff",
                color: filterRole === role ? "#fff" : "#666",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (filterRole !== role) {
                  e.currentTarget.style.borderColor = "#C0272D";
                  e.currentTarget.style.color = "#C0272D";
                }
              }}
              onMouseLeave={(e) => {
                if (filterRole !== role) {
                  e.currentTarget.style.borderColor = "#E5E5E5";
                  e.currentTarget.style.color = "#666";
                }
              }}
            >
              {role === "all" ? "All" : role}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #F5F5F5" }}>
              {["Name", "Email", "Role", "Created"].map((header) => (
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
            {displayUsers.length > 0 ? (
              displayUsers.map((user, index) => {
                const roleStyle = getRoleStyle(user.role);
                return (
                  <tr
                    key={user.id || user._id || index}
                    style={{
                      borderBottom: index < displayUsers.length - 1 ? "1px solid #F8F8F8" : "none",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F9FAFB";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td style={{ padding: "14px 12px 14px 0", fontSize: 13, fontWeight: 600 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: roleStyle.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 16,
                          }}
                        >
                          {roleStyle.icon}
                        </div>
                        <span>{user.name || "N/A"}</span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "14px 12px 14px 0",
                        fontSize: 12,
                        color: "#666",
                        maxWidth: 180,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.email || "N/A"}
                    </td>
                    <td style={{ padding: "14px 12px 14px 0" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "4px 12px",
                          borderRadius: 6,
                          background: roleStyle.bg,
                          color: roleStyle.color,
                          textTransform: "capitalize",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {roleStyle.label}
                      </span>
                    </td>
                    <td style={{ padding: "14px 12px 14px 0", fontSize: 12, color: "#888" }}>
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: "24px 12px", textAlign: "center", color: "#999", fontSize: 14 }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserListTable;
