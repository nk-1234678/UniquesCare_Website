import React from "react";
import { useAuth } from "../../../context/AuthContext";

const DashboardIntro = () => {
  const { user } = useAuth();

  const roleConfig = {
    student: {
      title: "Student Dashboard",
      subtitle: "Here's a summary of all your complaint activity.",
    },
    admin: {
      title: "Admin Dashboard",
      subtitle: "Monitor and manage all system complaints efficiently.",
    },
    warden: {
      title: "Warden Dashboard",
      subtitle: "Oversee hostel complaints and student issues.",
    },
    staff: {
      title: "Staff Dashboard",
      subtitle: "Track and resolve assigned complaints.",
    },
  };

  const config = roleConfig[user?.role] || roleConfig.student;

  const isStudent = user?.role === "student";

  return (
    <div
      style={{
        background: "linear-gradient(120deg, #C0272D 0%, #8B1A1E 100%)",
        borderRadius: 18,
        padding: "28px 36px",
        color: "#fff",
        marginBottom: 28,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 24px rgba(192,39,45,0.25)",
      }}
    >
      {/* LEFT SIDE */}
      <div>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            opacity: 0.8,
            textTransform: "uppercase",
          }}
        >
          {config.title}
        </p>

        <h2 style={{ margin: "6px 0 4px", fontSize: 26, fontWeight: 800 }}>
          Welcome back, {user?.name} 👋
        </h2>

        <p style={{ margin: 0, fontSize: 14, opacity: 0.75 }}>
          {config.subtitle}
        </p>
      </div>

      {/* RIGHT SIDE (ONLY FOR STUDENT) */}
      {isStudent && (
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: 14,
            padding: "14px 22px",
            textAlign: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 800 }}>
            {user?.academicStartYear && user?.academicEndYear
            ? `${user.academicStartYear} – ${user.academicEndYear}`
            : "-"}
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardIntro;