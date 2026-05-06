import React from "react";

const LoadingState = ({ label = "Loading..." }) => {
  return (
    <div
      style={{
        padding: "18px 20px",
        background: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: 14,
        color: "#666",
        fontSize: 14,
      }}
    >
      {label}
    </div>
  );
};

export default LoadingState;
