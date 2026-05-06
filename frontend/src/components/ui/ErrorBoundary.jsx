import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled UI error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "#f7f7f8",
            padding: 24,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 24,
              textAlign: "center",
              boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 22, color: "#111827" }}>Something went wrong</h2>
            <p style={{ marginTop: 10, color: "#4b5563", fontSize: 14 }}>
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                marginTop: 16,
                border: "none",
                background: "#9B1C1C",
                color: "#fff",
                borderRadius: 10,
                padding: "10px 16px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
