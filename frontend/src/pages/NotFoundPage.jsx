import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #f9fafb, #eef2ff)",
        padding: 24,
      }}
    >
      <div
        style={{
          textAlign: "center",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 28,
          width: "100%",
          maxWidth: 540,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div style={{ fontSize: 46, fontWeight: 800, color: "#9B1C1C" }}>404</div>
        <h2 style={{ margin: "6px 0 10px", color: "#111827" }}>Page not found</h2>
        <p style={{ margin: 0, color: "#4b5563", fontSize: 14 }}>
          The page you are trying to access does not exist.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            marginTop: 18,
            borderRadius: 10,
            background: "#9B1C1C",
            color: "#fff",
            padding: "10px 14px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
