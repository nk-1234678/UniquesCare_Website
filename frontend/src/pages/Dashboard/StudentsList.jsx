import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/authApi";
import LoadingState from "../../components/ui/LoadingState";
import ErrorState from "../../components/ui/ErrorState";
import { getErrorMessage } from "../../utils/errorHelper";
import DashboardEntityList from "../../components/dashboard/DashboardEntityList";

const StudentsList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  // close menu on outside click
  useEffect(() => {
    const handler = () => setMenuOpenId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);
  const { user } = useAuth();

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.active || s.isActive || s.status === "active").length;
  const totalComplaints = students.reduce(
    (acc, s) => acc + (s.complaintCount || (s.complaints ? s.complaints.length : 0) || 0),
    0
  );

  const dashboardStats = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: "🎓",
      color: "#7f1d1d",
      bg: "#fff1f2",
    },
    {
      label: "Active Students",
      value: activeStudents,
      icon: "✅",
      color: "#7f1d1d",
      bg: "#fff1f2",
    },
    {
      label: "Total Complaints",
      value: totalComplaints,
      icon: "📄",
      color: "#7f1d1d",
      bg: "#fff1f2",
    },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await authApi.getStudents();
        // Normalize active flag: prefer `isActive`, fall back to legacy `active`
        const normalized = (response?.students || []).map((s) => ({
          ...s,
          isActive: s.isActive !== undefined ? s.isActive : (s.active !== undefined ? s.active : true),
          active: s.isActive !== undefined ? s.isActive : (s.active !== undefined ? s.active : true),
        }));
        setStudents(normalized);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const columns = [
    { key: "student", label: "Student", value: (student) => student.name || "N/A" },
    { key: "email", label: "Email", value: (student) => student.email || "" },
    { key: "department", label: "Department", value: (student) => student.department || "N/A" },
    {
      key: "complaintCount",
      label: "Complaints",
      value: (student) => student.complaintCount || (student.complaints ? student.complaints.length : 0) || 0,
    },
    {
      key: "status",
      label: "Status",
      value: (student) => (student.active || student.isActive || student.status === "active" ? "Active" : "Inactive"),
    },
    { key: "action", label: "Action", value: () => "View" },
  ];

  const renderRow = (student) => (
    <>
      <td className="px-4 py-4" style={{ opacity: student.isActive === false ? 0.6 : 1, filter: student.isActive === false ? 'grayscale(40%)' : 'none' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm">
            {student.name
              ? student.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
              : "U"}
          </div>

          <div>
            <div className="text-sm font-medium text-slate-900 flex items-center gap-2">
              {student.name}
              {!student.isActive && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-md">Blocked</span>
              )}
            </div>
            <div className="text-xs text-slate-400">{student.department || "N/A"}</div>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 text-sm text-slate-600" style={{ opacity: student.isActive === false ? 0.6 : 1 }}>{student.email}</td>

      <td className="px-4 py-4 text-sm text-slate-600" style={{ opacity: student.isActive === false ? 0.6 : 1 }}>{student.department || "N/A"}</td>

      <td className="px-4 py-4 text-center" style={{ opacity: student.isActive === false ? 0.6 : 1 }}>
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
          {student.complaintCount || (student.complaints ? student.complaints.length : 0) || 0}
        </span>
      </td>

      <td className="px-4 py-4 text-center" style={{ opacity: student.isActive === false ? 0.6 : 1 }}>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            student.isActive || student.active || student.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-700"
          }`}
        >
          {student.isActive || student.active || student.status === "active" ? "Active" : "Blocked"}
        </span>
      </td>

      <td className="px-4 py-4 text-center">
        <div className="relative inline-flex items-center">
          <button className="px-3 py-1 text-sm text-slate-700 border border-slate-200 rounded-md bg-white hover:bg-slate-100" onClick={() => navigate(`/dashboard/admin/users/students/${student.id}`)}>
            View
          </button>

          {String(user?.role || "").toLowerCase() === "admin" && (
            <div className="ml-2 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(menuOpenId === student.id ? null : student.id);
                }}
                className="px-2 py-1 rounded-md text-slate-600 hover:bg-slate-100"
                aria-haspopup="true"
                aria-expanded={menuOpenId === student.id}
              >
                ⋯
              </button>

              {menuOpenId === student.id && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-md shadow-sm z-50">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        const updated = await authApi.blockStudent(student.id, !(student.isActive ?? true));
                        const newStatus = updated?.student?.isActive;
                        setStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, isActive: newStatus, active: newStatus } : s)));
                      } catch (err) {
                        alert(getErrorMessage(err, "Failed to update student status."));
                      } finally {
                        setMenuOpenId(null);
                      }
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${student.isActive || student.active || student.status === 'active' ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {student.isActive || student.active || student.status === 'active' ? 'Block account' : 'Unblock account'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </td>
    </>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <DashboardEntityList
      title="Students"
      description="Overview of registered students and their complaints"
      stats={dashboardStats}
      items={students}
      emptyMessage="No students found"
      searchPlaceholder="Search students by name or email"
      searchFields={["name", "email", "department"]}
      exportFilename="students.csv"
      sortOptions={[
        { label: "All", value: "all" },
        { label: "Name", value: "name" },
        { label: "Email", value: "email" },
        { label: "Department", value: "department" },
        { label: "Active", value: "activeOnly" },
        { label: "Blocked", value: "isActive" },
        { label: "Complaints", value: "complaintCount" },
      ]}
      defaultSortKey="name"
      rowKey={(student) => student.id}
      onRowClick={(student) => navigate(`/dashboard/admin/users/students/${student.id}`)}
      renderRow={renderRow}
      columns={columns}
      
    />
  );
};

export default StudentsList;
