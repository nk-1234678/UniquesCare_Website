import React, { useEffect, useMemo, useState } from "react";
import { complaintApi } from "../../api/complaintApi";
import { getErrorMessage } from "../../api/httpClient";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";

const Alerts = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await complaintApi.getNotifications();
      const items = Array.isArray(data) ? data : data.notifications ?? [];
      setNotifications(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load alerts."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const visibleNotifications = useMemo(() => notifications, [notifications]);

  const handleDeleteNotification = async (id) => {
    try {
      await complaintApi.dismissNotification(id);

      setNotifications((prev) => prev.filter((item) => String(item.id) !== String(id)));
    } catch (err) {
      setError(getErrorMessage(err, "Failed to dismiss notification."));
    }
  };

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#1A1A1A" }}>
      <div
        style={{
          background: "linear-gradient(120deg, #C0272D 0%, #8B1A1E 100%)",
          borderRadius: 16,
          padding: "24px 28px",
          color: "#fff",
          marginBottom: 22,
          boxShadow: "0 4px 24px rgba(192,39,45,0.22)",
        }}
      >
        <p style={{ margin: "0 0 4px", fontSize: 12, opacity: 0.85, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Alerts
        </p>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Complaint Notifications</h2>
        <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.8 }}>
          You will see alerts when a complaint is raised or updated from student side / other side.
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #F0F0F0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #F5F5F5", fontSize: 13, color: "#666" }}>
          Total notifications: <strong style={{ color: "#111" }}>{visibleNotifications.length}</strong>
        </div>

        {loading ? (
          <div style={{ padding: 18 }}>
            <LoadingState label="Loading alerts..." />
          </div>
        ) : error ? (
          <div style={{ padding: 18 }}>
            <ErrorState message={error} onRetry={fetchNotifications} />
          </div>
        ) : visibleNotifications.length === 0 ? (
          <div style={{ padding: "36px", textAlign: "center", color: "#999", fontSize: 14 }}>
            No new alerts right now.
          </div>
        ) : (
          visibleNotifications.map((n, idx) => (
            <div
              key={n.id}
              style={{
                padding: "14px 18px",
                borderBottom: idx < visibleNotifications.length - 1 ? "1px solid #F8F8F8" : "none",
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${n.tone}1A`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {n.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#222" }}>{n.title}</p>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 99,
                      background: `${n.tone}1A`,
                      color: n.tone,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {n.actor}
                  </span>
                </div>

                <p style={{ margin: "4px 0 8px", fontSize: 13, color: "#555" }}>{n.message}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#9A9A9A" }}>
                    {n.date} at {n.time}
                  </p>
                  <button
                    onClick={() => handleDeleteNotification(n.id)}
                    title="Delete notification"
                    style={{
                      border: "1px solid #FECACA",
                      background: "#FFF5F5",
                      color: "#B91C1C",
                      borderRadius: 8,
                      padding: "4px 8px",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 24,
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;