import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { complaintApi } from "../../api/complaintApi";
import LoadingState from "../../components/ui/LoadingState";
import ErrorState from "../../components/ui/ErrorState";
import { getErrorMessage } from "../../api/httpClient";
import DashboardEntityList from "../../components/dashboard/DashboardEntityList";

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};
const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const totalComplaints = complaints.length;
  const submittedComplaints = complaints.filter(c => c.status === "Submitted").length;
  const inProgressComplaints = complaints.filter(c => c.status === "In Progress").length;
  const resolvedComplaints = complaints.filter(c => c.status === "Resolved").length;

  const dashboardStats = [
    {
      label: "Total Complaints",
      value: totalComplaints,
      icon: "📋",
      color: "#7f1d1d",
      bg: "#fff1f2",
    },
    {
      label: "Submitted",
      value: submittedComplaints,
      icon: "⏳",
      color: "#7f1d1d",
      bg: "#fff1f2",
    },
    {
      label: "In Progress",
      value: inProgressComplaints,
      icon: "🔄",
      color: "#7f1d1d",
      bg: "#fff1f2",
    },
    {
      label: "Resolved",
      value: resolvedComplaints,
      icon: "✅",
      color: "#7f1d1d",
      bg: "#fff1f2",
    },
  ];

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const data = await complaintApi.getComplaints();
        const items = Array.isArray(data) ? data : data.complaints ?? [];
        const normalized = Array.isArray(items)
          ? items.map((c) => ({ ...c, date: formatDate(c.createdAt), time: formatTime(c.createdAt) }))
          : [];
        setComplaints(normalized);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load complaints"));
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const columns = [
    { key: "title", label: "Title", value: (complaint) => complaint.title || "N/A" },
    { key: "category", label: "Category", value: (complaint) => complaint.category || "N/A" },
    { key: "priority", label: "Priority", value: (complaint) => complaint.priority || "Medium" },
    { key: "status", label: "Status", value: (complaint) => complaint.status || "Submitted" },
    { key: "date", label: "Date", value: (complaint) => complaint.date || "N/A" },
    { key: "action", label: "Action", value: () => "View" },
  ];

  const PRIORITY_COLORS = {
    "Low": { bg: "#F0F9FF", color: "#0369A1" },
    "Medium": { bg: "#FFF8EB", color: "#D97706" },
    "High": { bg: "#FFF0F0", color: "#DC2626" },
  };

  const STATUS_COLORS = {
    "Submitted": { bg: "#FFF0F0", color: "#DC2626" },
    "In Progress": { bg: "#FFF8EB", color: "#D97706" },
    "Resolved": { bg: "#EDFAF3", color: "#16A34A" },
  };

  const handleDelete = async (complaintId) => {
    if (!complaintId) return;
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await complaintApi.deleteComplaint(complaintId);
      setComplaints((prev) => prev.filter((c) => (c._id || c.id) !== complaintId));
      if (activeComplaint && (activeComplaint._id || activeComplaint.id) === complaintId) {
        setActiveComplaint(null);
        setModalOpen(false);
      }
    } catch (err) {
      alert(getErrorMessage(err, "Failed to delete complaint"));
    }
  };

  const handleOpenModal = async (complaint) => {
    const id = complaint._id || complaint.id;
    if (!id) return;
    try {
      const data = await complaintApi.getComplaint(id);
      const item = Array.isArray(data) ? data[0] : data.complaint ?? data;
      const normalized = { ...item, date: formatDate(item.createdAt), time: formatTime(item.createdAt) };
      setActiveComplaint(normalized);
      setModalOpen(true);
    } catch (err) {
      alert(getErrorMessage(err, "Failed to load complaint details."));
    }
  };

  const renderRow = (complaint) => (
    <>
      <td className="px-4 py-4">
        <div className="text-sm font-medium text-slate-900">{complaint.title || "N/A"}</div>
        <div className="text-xs text-slate-400">{complaint.description?.substring(0, 50)}...</div>
      </td>

      <td className="px-4 py-4 text-sm text-slate-600">{complaint.category || "N/A"}</td>

      <td className="px-4 py-4">
        <span
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{
            background: PRIORITY_COLORS[complaint.priority]?.bg || "#F0F9FF",
            color: PRIORITY_COLORS[complaint.priority]?.color || "#0369A1",
          }}
        >
          {complaint.priority || "Medium"}
        </span>
      </td>

      <td className="px-4 py-4">
        <span
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{
            background: STATUS_COLORS[complaint.status]?.bg || "#FFF0F0",
            color: STATUS_COLORS[complaint.status]?.color || "#DC2626",
          }}
        >
          {complaint.status || "Submitted"}
        </span>
      </td>

      <td className="px-4 py-4 text-sm text-slate-600">
        <div>{complaint.date || "N/A"}</div>
        <div className="text-xs text-slate-400">{complaint.time || ""}</div>
      </td>

      <td className="px-4 py-4 text-center">
        <button
          onClick={async (e) => {
            e.stopPropagation();
            await handleOpenModal(complaint);
          }}
          className="px-3 py-1 text-sm text-slate-700 border border-slate-200 rounded-md bg-white hover:bg-slate-100 transition-colors"
        >
          View
        </button>
      </td>
    </>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <>
      <DashboardEntityList
        title="All Complaints"
        description="Track and manage all submitted complaints"
        stats={dashboardStats}
        items={complaints}
        emptyMessage="No complaints found"
        searchPlaceholder="Search complaints by title or category"
        searchFields={["title", "category", "status", "priority"]}
        exportFilename="complaints.csv"
        sortOptions={[
          { label: "All", value: "all" },
          { label: "Title", value: "title" },
          { label: "Category", value: "category" },
          { label: "Priority", value: "priority" },
          { label: "Status", value: "status" },
          { label: "Submitted", value: "statusSubmitted" },
          { label: "Under Review", value: "statusUnderReview" },
          { label: "In Progress", value: "statusInProgress" },
          { label: "Resolved", value: "statusResolved" },
          { label: "Date", value: "date" },
        ]}
        defaultSortKey="date"
        rowKey={(complaint) => complaint._id || complaint.id}
        renderRow={renderRow}
        columns={columns}
      />

      {modalOpen && activeComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 mx-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{activeComplaint.title}</h3>
                <p className="text-sm text-slate-500">{activeComplaint.category} • {activeComplaint.priority}</p>
              </div>
              <button
                onClick={() => { setModalOpen(false); setActiveComplaint(null); }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-slate-600">{activeComplaint.description}</p>

              {(activeComplaint.image || activeComplaint.imageUrl || activeComplaint.attachmentUrl || activeComplaint.fileUrl || activeComplaint.attachmentDataUrl || (activeComplaint.attachments && activeComplaint.attachments.length > 0 && (activeComplaint.attachments[0].url || activeComplaint.attachments[0].path))) && (
                <div className="mt-4">
                  <img
                    src={
                      activeComplaint.image || activeComplaint.imageUrl || activeComplaint.attachmentUrl || activeComplaint.fileUrl || activeComplaint.attachmentDataUrl || (activeComplaint.attachments && (activeComplaint.attachments[0].url || activeComplaint.attachments[0].path))
                    }
                    alt={activeComplaint.title || "complaint-image"}
                    className="w-full max-h-72 object-contain rounded-md border border-slate-100"
                  />
                </div>
              )}

              <div className="mt-4 flex items-center gap-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: STATUS_COLORS[activeComplaint.status]?.bg || '#FFF0F0', color: STATUS_COLORS[activeComplaint.status]?.color || '#DC2626' }}>{activeComplaint.status || 'Submitted'}</span>
                <div className="text-sm text-slate-500">{activeComplaint.date} {activeComplaint.time ? `• ${activeComplaint.time}` : ''}</div>
                {activeComplaint.createdBy ? (
                  typeof activeComplaint.createdBy === 'object' ? (
                    <button
                      onClick={() => {
                        const sid = activeComplaint.createdBy._id || activeComplaint.createdBy.id || activeComplaint.createdBy;
                        const role = String(user?.role || 'admin').toLowerCase();
                        navigate(`/dashboard/${role}/users/students/${sid}`);
                      }}
                      className="text-sm text-slate-600 hover:text-red-600 underline"
                    >
                      {activeComplaint.createdBy.name || activeComplaint.createdBy.fullName || activeComplaint.createdBy.email || 'View Student'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const sid = activeComplaint.createdBy;
                        const role = String(user?.role || 'admin').toLowerCase();
                        navigate(`/dashboard/${role}/users/students/${sid}`);
                      }}
                      className="text-sm text-slate-600 hover:text-red-600 underline"
                    >
                      View Student
                    </button>
                  )
                ) : (
                  <div className="text-sm text-slate-400">ID: {activeComplaint._id}</div>
                )}
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-6">
                  {["Submitted", "Under Review", "In Progress", "Resolved"].map((step, idx) => {
                    const statusForIndex = (activeComplaint.status === "Pending" ? "Submitted" : activeComplaint.status) || "Submitted";
                    const stepIndex = ["Submitted","Under Review","In Progress","Resolved"].indexOf(statusForIndex);
                    const active = idx <= stepIndex;
                    return (
                      <div key={step} className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${active ? 'bg-red-700 text-white' : 'bg-slate-200 text-slate-500'}`}>
                          {active ? '✓' : idx + 1}
                        </div>
                        <div className={`text-xs font-semibold ${active ? 'text-red-700' : 'text-slate-400'}`}>{step}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => { setModalOpen(false); setActiveComplaint(null); }}
                className="px-4 py-2 rounded-md border border-slate-200 bg-white text-slate-700"
              >
                Close
              </button>
              <button
                onClick={async () => { await handleDelete(activeComplaint._id || activeComplaint.id); }}
                className="px-4 py-2 rounded-md bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllComplaints;
