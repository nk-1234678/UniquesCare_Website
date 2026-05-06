import React from "react";

const ErrorState = ({
  message = "Something went wrong. Try again.",
  onRetry,
  compact = false,
}) => {
  return (
    <div
      style={{
        background: "#fff0f0",
        border: "1px solid #fecaca",
        color: "#991b1b",
        borderRadius: 12,
        padding: compact ? "12px 14px" : "16px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <span style={{ fontSize: 13 }}>{message}</span>
      {typeof onRetry === "function" && (
        <button
          onClick={onRetry}
          style={{
            border: "1px solid #fca5a5",
            background: "#fff",
            color: "#7f1d1d",
            borderRadius: 8,
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;
