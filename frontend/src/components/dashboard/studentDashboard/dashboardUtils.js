export const API_BASE = "/api/complaints";

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const STATUS_COLORS = {
  Resolved: "#22C55E",
  "In Progress": "#F59E0B",
  Pending: "#EF4444",
};

export const formatComplaintId = (complaint, index) => {
  if (complaint.id) return complaint.id;
  if (complaint._id) return `UC-${String(complaint._id).slice(-4).toUpperCase()}`;
  return `UC-${String(index + 1).padStart(3, "0")}`;
};

export const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const buildMonthlyData = (items) =>
  MONTHS.map((month) => ({ month, raised: 0, resolved: 0, inProgress: 0 }))
    .map((bucket, index) => {
      items.forEach((item) => {
        if (!item.createdAt) return;
        const date = new Date(item.createdAt);
        if (date.getMonth() !== index) return;

        bucket.raised += 1;
        if (item.status === "Resolved") bucket.resolved += 1;
        if (item.status === "In Progress") bucket.inProgress += 1;
      });

      return bucket;
    });

export const buildRecentComplaints = (items) =>
  [...items]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5)
    .map((item, index) => ({
      id: formatComplaintId(item, index),
      title: item.title,
      category: item.category,
      status: item.status || "Pending",
      date: formatDate(item.createdAt),
    }));

export const statusStyle = (status) => {
  const map = {
    Resolved: { bg: "#EDFAF3", color: "#16A34A" },
    "In Progress": { bg: "#FFF8EB", color: "#D97706" },
    Pending: { bg: "#FFF0F0", color: "#DC2626" },
  };

  return map[status] || {};
};
