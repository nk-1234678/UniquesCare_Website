import React, { useEffect, useMemo, useState } from "react";
import { getAllowedStatuses } from "../../components/dashboard/studentDashboard/statusOrder";
import { complaintApi } from "../../api/complaintApi";
import { getErrorMessage } from "../../api/httpClient";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";

const STATUS_OPTIONS = ["Submitted", "Under Review", "In Progress", "Resolved"];
const STATUS_STYLE = {
  Resolved: { bg: "#EDFAF3", color: "#16A34A" },
  "In Progress": { bg: "#FFF8EB", color: "#D97706" },
  Submitted: { bg: "#FFF0F0", color: "#DC2626" },
};

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeComplaint = (complaint) => ({
  ...complaint,
  id: complaint._id ?? complaint.id,
  status: complaint.status ?? "Submitted",
  date: complaint.date ?? formatDate(complaint.createdAt),
});

const TechnicianStatusUpdate = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [statusDrafts, setStatusDrafts] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await complaintApi.getComplaints();
      const items = Array.isArray(data) ? data : data.complaints ?? [];
      const normalized = Array.isArray(items) ? items.map(normalizeComplaint) : [];
      setComplaints(normalized);

      const initialDrafts = normalized.reduce((acc, complaint) => {
        if (!complaint?.id) return acc;
        acc[complaint.id] = complaint.status;
        return acc;
      }, {});
      setStatusDrafts(initialDrafts);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load complaints."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchQuery =
        complaint.title?.toLowerCase().includes(query.toLowerCase()) ||
        String(complaint.id ?? "").toLowerCase().includes(query.toLowerCase()) ||
        complaint.category?.toLowerCase().includes(query.toLowerCase());
      const matchStatus = filterStatus === "All" || complaint.status === filterStatus;
      
      // Date range filtering
      let matchDate = true;
      if (startDate || endDate) {
        const complaintDate = new Date(complaint.createdAt);
        complaintDate.setHours(0, 0, 0, 0);
        
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (complaintDate < start) matchDate = false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (complaintDate > end) matchDate = false;
        }
      }
      
      return matchQuery && matchStatus && matchDate;
    });
  }, [complaints, filterStatus, query, startDate, endDate]);

  const handleStatusChange = (id, value) => {
    setStatusDrafts((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveStatus = async (complaint) => {
    const nextStatus = statusDrafts[complaint.id];
    if (!nextStatus || nextStatus === complaint.status) return;

    try {
      setSavingId(complaint.id);
      setError("");
      const data = await complaintApi.updateComplaint(complaint.id, { status: nextStatus });
      if (!data || !data.complaint) {
        throw new Error("Invalid complaint update response");
      }
      const updatedComplaint = normalizeComplaint(data.complaint ?? {});

      setComplaints((prev) =>
        prev.map((item) => (item.id === updatedComplaint.id ? updatedComplaint : item))
      );
      setStatusDrafts((prev) => ({ ...prev, [updatedComplaint.id]: updatedComplaint.status }));
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update complaint status."));
    } finally {
      setSavingId(null);
    }
  };

  const totalCount = complaints.length;
  const submittedCount = complaints.filter((item) => item.status === "Submitted").length;
  const inProgressCount = complaints.filter((item) => item.status === "In Progress").length;
  const resolvedCount = complaints.filter((item) => item.status === "Resolved").length;

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#1A1A1A" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          background: "linear-gradient(130deg, #9B1C1C 0%, #6B1111 100%)",
          borderRadius: 20,
          padding: "28px 36px",
          color: "#fff",
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          boxShadow: "0 4px 24px rgba(155,28,28,0.22)",
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: 12, opacity: 0.8, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Technician Dashboard
          </p>
          <h2 style={{ margin: "6px 0 4px", fontSize: 25, fontWeight: 800 }}>
            Update Complaint Status
          </h2>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
            Review complaints and change their progress status.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, auto)", gap: 12 }}>
          {[
            { label: "Total", value: totalCount },
            { label: "Submitted", value: submittedCount },
            { label: "In Progress", value: inProgressCount },
            { label: "Resolved", value: resolvedCount },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "rgba(255,255,255,0.12)",
                borderRadius: 14,
                padding: "10px 14px",
                minWidth: 88,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, opacity: 0.8 }}>{item.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #F0F0F0",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Status Update Panel</h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#999" }}>
              Select a new status and save changes.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, id or category"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #E5E5E5",
                minWidth: 260,
                outline: "none",
              }}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #E5E5E5",
                outline: "none",
                background: "#fff",
              }}
            >
              <option value="All">All Status</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start date"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #E5E5E5",
                outline: "none",
                background: "#fff",
              }}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End date"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #E5E5E5",
                outline: "none",
                background: "#fff",
              }}
            />
          </div>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={fetchComplaints} compact />}

      <div style={{ display: "grid", gap: 14 }}>
        {filteredComplaints.map((complaint, index) => (
          <div
            key={complaint.id}
            style={{
              background: "#fff",
              border: "1px solid #F0F0F0",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              animation: `fadeUp 0.4s ease both`,
              animationDelay: `${index * 40}ms`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <h4 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{complaint.title}</h4>
                  <span style={{ fontSize: 11, color: "#999" }}>{complaint.id}</span>
                </div>
                <p style={{ margin: "6px 0 10px", fontSize: 13, color: "#666" }}>{complaint.category}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#666", maxWidth: 820 }}>{complaint.description}</p>
              </div>

              <div style={{ minWidth: 220, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 99,
                      background: STATUS_STYLE[complaint.status]?.bg,
                      color: STATUS_STYLE[complaint.status]?.color,
                    }}
                  >
                    {complaint.status}
                  </span>
                  <span style={{ fontSize: 12, color: "#999" }}>{complaint.date}</span>
                </div>

                <select
                  value={statusDrafts[complaint.id] ?? complaint.status}
                  onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #E5E5E5",
                    outline: "none",
                    background: "#fff",
                  }}
                >
                  {getAllowedStatuses(complaint.status).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleSaveStatus(complaint)}
                  disabled={savingId === complaint.id}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "none",
                    background: savingId === complaint.id ? "#D48A8D" : "#9B1C1C",
                    color: "#fff",
                    cursor: savingId === complaint.id ? "not-allowed" : "pointer",
                    fontWeight: 700,
                  }}
                >
                  {savingId === complaint.id ? "Saving..." : "Save Status"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredComplaints.length === 0 && (
        <div style={{ marginTop: 18, padding: "18px 20px", background: "#fff", border: "1px solid #F0F0F0", borderRadius: 14, color: "#666" }}>
          No complaints match your current filters.
        </div>
      )}

      {loading && <LoadingState label="Loading complaints..." />}
    </div>
  );
};

export default TechnicianStatusUpdate;
