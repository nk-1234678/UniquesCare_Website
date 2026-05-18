import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import LoadingState from "../../components/ui/LoadingState";
import ErrorState from "../../components/ui/ErrorState";
import { getErrorMessage } from "../../utils/errorHelper";
import DashboardEntityList from "../../components/dashboard/DashboardEntityList";

const TechniciansList = () => {
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalTechnicians = technicians.length;
  const activeTechnicians = technicians.filter((tech) => tech.active || tech.isActive || tech.status === "active").length;
  const assignedComplaints = technicians.reduce(
    (acc, tech) => acc + (tech.complaintCount || (tech.complaints ? tech.complaints.length : 0) || 0),
    0
  );
  const resolvedComplaints = technicians.reduce((acc, tech) => acc + (tech.resolvedCount || 0), 0);

  const dashboardStats = [
    {
      label: "Total Technicians",
      value: totalTechnicians,
      icon: "🔧",
      color: "#7f1d1d",
      bg: "#fff1f2",
    },
    {
      label: "Active Technicians",
      value: activeTechnicians,
      icon: "✅",
      color: "#7f1d1d",
      bg: "#fff1f2",
    },
    {
      label: "Assigned Complaints",
      value: assignedComplaints,
      icon: "📄",
      color: "#7f1d1d",
      bg: "#fff1f2",
    },
    {
      label: "Resolved Complaints",
      value: resolvedComplaints,
      icon: "✅",
      color: "#7f1d1d",
      bg: "#fff1f2",
    },
  ];

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setLoading(true);
        const response = await authApi.getTechnicians();
        // normalize isActive/active flag
        const normalized = (response?.technicians || []).map((t) => ({
          ...t,
          isActive: t.isActive !== undefined ? t.isActive : (t.active !== undefined ? t.active : true),
          active: t.isActive !== undefined ? t.isActive : (t.active !== undefined ? t.active : true),
        }));
        setTechnicians(normalized);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchTechnicians();
  }, []);

  const columns = [
    { key: "name", label: "Technician", value: (tech) => tech.name || "N/A" },
    { key: "email", label: "Email", value: (tech) => tech.email || "" },
    { key: "department", label: "Department", value: (tech) => tech.department || "N/A" },
    {
      key: "complaintCount",
      label: "Assigned",
      value: (tech) => tech.complaintCount || (tech.complaints ? tech.complaints.length : 0) || 0,
    },
    { key: "resolvedCount", label: "Resolved", value: (tech) => tech.resolvedCount || 0 },
    { key: "action", label: "Action", value: () => "View" },
  ];

  const renderRow = (tech) => (
    <>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm">
            {tech.name ? tech.name.split(" ").map((n) => n[0]).slice(0, 2).join("") : "T"}
          </div>

          <div>
            <div className="text-sm font-medium text-slate-900">{tech.name}</div>
            <div className="text-xs text-slate-400">{tech.department || "N/A"}</div>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 text-sm text-slate-600">{tech.email}</td>

      <td className="px-4 py-4 text-sm text-slate-600">{tech.department || "N/A"}</td>

      <td className="px-4 py-4 text-center">
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
          {tech.complaintCount || (tech.complaints ? tech.complaints.length : 0) || 0}
        </span>
      </td>

      <td className="px-4 py-4 text-center">
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
          {tech.resolvedCount || 0}
        </span>
      </td>

      <td className="px-4 py-4 text-center">
        <div className="relative inline-flex items-center">
          <button className="px-3 py-1 text-sm text-slate-700 border border-slate-200 rounded-md bg-white hover:bg-slate-100" onClick={() => navigate(`/dashboard/admin/users/technicians/${tech.id}`)}>
            View
          </button>

          {/** Admin actions: block/unblock **/}
          <div className="ml-2 relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // simple toggle menu per-row by using id in state
                setTechnicians((prev) => prev.map((p) => ({ ...p, _menuOpen: p.id === tech.id ? !p._menuOpen : p._menuOpen })));
              }}
              className="px-2 py-1 rounded-md text-slate-600 hover:bg-slate-100"
            >
              ⋯
            </button>

            {tech._menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-md shadow-sm z-50">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      const updated = await authApi.blockTechnician(tech.id, !(tech.isActive ?? true));
                      const newStatus = updated?.student?.isActive ?? updated?.student?.isActive;
                      setTechnicians((prev) => prev.map((t) => (t.id === tech.id ? { ...t, isActive: newStatus, active: newStatus } : t)));
                    } catch (err) {
                      alert(getErrorMessage(err, "Failed to update technician status."));
                    } finally {
                      setTechnicians((prev) => prev.map((p) => ({ ...p, _menuOpen: false })));
                    }
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${tech.isActive || tech.active || tech.status === 'active' ? 'text-red-600' : 'text-green-600'}`}
                >
                  {tech.isActive || tech.active || tech.status === 'active' ? 'Block account' : 'Unblock account'}
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <DashboardEntityList
      title="Technicians"
      description="List of technicians and their handled complaints"
      stats={dashboardStats}
      items={technicians}
      emptyMessage="No technicians found"
      searchPlaceholder="Search technicians by name or email"
      searchFields={["name", "email", "department"]}
      sortOptions={[
        { label: "All", value: "all" },
        { label: "Name", value: "name" },
        { label: "Email", value: "email" },
        { label: "Department", value: "department" },
        { label: "Active", value: "activeOnly" },
        { label: "Blocked", value: "isActive" },
        { label: "Assigned", value: "complaintCount" },
        { label: "Resolved", value: "resolvedCount" },
      ]}
      defaultSortKey="name"
      rowKey={(tech) => tech.id}
      onRowClick={(tech) => navigate(`/dashboard/admin/users/technicians/${tech.id}`)}
      renderRow={renderRow}
      columns={columns}
      exportFilename="technicians.csv"
    />
  );
};

export default TechniciansList;
