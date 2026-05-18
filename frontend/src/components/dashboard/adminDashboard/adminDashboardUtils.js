export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const STATUS_COLORS = {
  Resolved: "#22C55E",
  "In Progress": "#F59E0B",
  Submitted: "#EF4444",
};

export const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const statusStyle = (status) => {
  const map = {
    Resolved: { bg: "#EDFAF3", color: "#16A34A" },
    "In Progress": { bg: "#FFF8EB", color: "#D97706" },
    Submitted: { bg: "#FFF0F0", color: "#DC2626" },
  };

  return map[status] || { bg: "#F5F5F5", color: "#666" };
};

// Build weekly data (last 7 days)
export const buildWeeklyData = (items) => {
  const data = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const dateStr = date.toISOString().split("T")[0];
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;

    const raised = items.filter((item) => {
      const itemDate = new Date(item.createdAt || "").toISOString().split("T")[0];
      return itemDate === dateStr;
    }).length;

    const resolved = items.filter((item) => {
      const itemDate = new Date(item.createdAt || "").toISOString().split("T")[0];
      return itemDate === dateStr && item.status === "Resolved";
    }).length;

    data.push({
      day: DAYS[dayIndex],
      date: dateStr,
      raised,
      resolved,
    });
  }

  return data;
};

// Build monthly data (all 12 months)
export const buildMonthlyData = (items) =>
  MONTHS.map((month) => ({
    month,
    raised: 0,
    resolved: 0,
    inProgress: 0,
  })).map((bucket, index) => {
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

// Calculate complaint statistics
export const calculateStats = (complaints, users) => {
  return {
    totalComplaints: complaints.length,
    resolvedComplaints: complaints.filter((c) => c.status === "Resolved").length,
    pendingComplaints: complaints.filter((c) => c.status === "Submitted").length,
    inProgressComplaints: complaints.filter((c) => c.status === "In Progress").length,
    totalStudents: users.filter((u) => u.role === "student").length,
    totalTechnicians: users.filter((u) => u.role === "technician").length,
  };
};
