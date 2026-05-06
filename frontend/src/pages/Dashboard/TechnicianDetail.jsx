import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import LoadingState from "../../components/ui/LoadingState";
import ErrorState from "../../components/ui/ErrorState";
import { getErrorMessage } from "../../utils/errorHelper";

const TechnicianDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [technician, setTechnician] = useState(null);
  const [complaintStats, setComplaintStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechnicianDetail = async () => {
      try {
        setLoading(true);
        const response = await authApi.getTechnicianDetail(id);
        setTechnician(response?.technician);
        setComplaintStats(response?.complaintStats);
        setComplaints(response?.complaints || []);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchTechnicianDetail();
  }, [id]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!technician) return <ErrorState error="Technician not found" />;

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-orange-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-3 py-1 text-sm text-slate-700 rounded-md"
        >
          ← Back
        </button>

        <div className="bg-white rounded-md shadow-sm p-6 mb-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{technician.name}</h1>
              <div className="text-sm text-slate-500">{technician.email}</div>
            </div>
            <div className={`px-3 py-1 text-sm rounded-md ${technician.hasLoggedInBefore ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
              {technician.hasLoggedInBefore ? 'Active' : 'Inactive'}
            </div>
          </div>

          <div className="mt-4 flex gap-6 text-sm text-slate-600">
            {technician.department && <div>Department: <span className="text-slate-900 font-medium">{technician.department}</span></div>}
            <div>Joined: <span className="text-slate-900 font-medium">{new Date(technician.createdAt).toLocaleDateString()}</span></div>
          </div>
        </div>

        {complaintStats && (
          <div className="flex gap-4 mb-6">
            <div className="bg-white p-4 rounded-md border border-slate-100 text-center w-1/4">
              <div className="text-sm text-slate-500">Assigned</div>
              <div className="text-lg font-semibold text-slate-900">{complaintStats.total}</div>
            </div>
            <div className="bg-white p-4 rounded-md border border-slate-100 text-center w-1/4">
              <div className="text-sm text-slate-500">Pending</div>
              <div className="text-lg font-semibold text-yellow-600">{complaintStats.pending}</div>
            </div>
            <div className="bg-white p-4 rounded-md border border-slate-100 text-center w-1/4">
              <div className="text-sm text-slate-500">In Progress</div>
              <div className="text-lg font-semibold text-blue-600">{complaintStats.inProgress}</div>
            </div>
            <div className="bg-white p-4 rounded-md border border-slate-100 text-center w-1/4">
              <div className="text-sm text-slate-500">Resolved</div>
              <div className="text-lg font-semibold text-green-600">{complaintStats.resolved}</div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-md shadow-sm overflow-hidden border border-slate-100">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-sm font-medium text-slate-900">Assigned Complaints</h2>
          </div>

          {complaints.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No complaints assigned</div>
          ) : (
            <div className="divide-y">
              {complaints.map((c) => (
                <div key={c.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{c.title}</div>
                    <div className="text-xs text-slate-500">{c.category} • {new Date(c.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs ${c.status === 'Resolved' ? 'bg-green-50 text-green-700' : c.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-blue-50 text-blue-700'}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianDetail;
