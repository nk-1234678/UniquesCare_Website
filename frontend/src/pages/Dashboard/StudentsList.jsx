import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import LoadingState from "../../components/ui/LoadingState";
import ErrorState from "../../components/ui/ErrorState";
import { getErrorMessage } from "../../utils/errorHelper";

const StudentsList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await authApi.getStudents();
        setStudents(response?.students || []);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    (student.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Students</h1>
            <p className="text-sm text-slate-500">Overview of registered students and their complaints</p>
          </div>
          <div className="w-80">
            <input
              type="text"
              placeholder="Search students by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white text-sm placeholder-slate-400"
            />
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-md shadow-sm p-8 text-center border border-slate-100">
            <p className="text-slate-500">No students found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => navigate(`/dashboard/admin/users/students/${student.id}`)}
                className="bg-white rounded-md shadow-sm hover:shadow-md transition p-4 flex items-center justify-between cursor-pointer border border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold">
                    {student.name ? student.name.split(" ").map(n=>n[0]).slice(0,2).join("") : "U"}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{student.name}</div>
                    <div className="text-xs text-slate-500">{student.email}</div>
                    {student.department && <div className="text-xs text-slate-400 mt-1">{student.department}</div>}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-slate-900">{student.complaintCount}</div>
                    <div className="text-xs text-slate-500">Complaints</div>
                  </div>
                  <button className="px-3 py-1 text-sm text-slate-700 border border-slate-200 rounded-md bg-white">View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsList;
