import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import LoadingState from "../../components/ui/LoadingState";
import ErrorState from "../../components/ui/ErrorState";
import { getErrorMessage } from "../../utils/errorHelper";

const TechnicianDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [technician, setTechnician] =
    useState(null);

  const [complaintStats, setComplaintStats] =
    useState(null);

  const [complaints, setComplaints] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    const fetchTechnicianDetail =
      async () => {
        try {
          setLoading(true);

          const response =
            await authApi.getTechnicianDetail(
              id
            );

          setTechnician(
            response?.technician
          );

          setComplaintStats(
            response?.complaintStats
          );

          setComplaints(
            response?.complaints || []
          );

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

  if (error)
    return <ErrorState error={error} />;

  if (!technician)
    return (
      <ErrorState error="Technician not found" />
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-yellow-100 text-yellow-700";

      case "In Progress":
        return "bg-blue-100 text-blue-700";

      case "Resolved":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <button
        onClick={() => navigate(-1)}
        className="mb-5 text-sm text-slate-600 hover:text-red-600 transition"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* LEFT */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* Technician Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

            <div className="flex flex-col md:flex-row md:items-center gap-6">

              {/* Avatar */}
              <div className="flex flex-col items-center text-center">

                <div className="w-28 h-28 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-3xl font-bold">
                  {technician.name
                    ?.split(" ")
                    ?.map((n) => n[0])
                    ?.slice(0, 2)
                    ?.join("")}
                </div>

                <h2 className="mt-4 text-xl font-semibold text-slate-900">
                  {technician.name}
                </h2>

                <p className="text-sm text-red-600 mt-1">
                  {technician.email}
                </p>
              </div>

              {/* Info */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <p className="text-xs text-slate-400">
                    Department
                  </p>

                  <h3 className="text-sm font-medium text-slate-800 mt-1">
                    {technician.department ||
                      "N/A"}
                  </h3>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Joined Date
                  </p>

                  <h3 className="text-sm font-medium text-slate-800 mt-1">
                    {new Date(
                      technician.createdAt
                    ).toLocaleDateString()}
                  </h3>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Status
                  </p>

                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-md text-sm font-medium ${
                      technician.hasLoggedInBefore
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {technician.hasLoggedInBefore
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Assigned Complaints
                  </p>

                  <h3 className="text-2xl font-bold text-red-600 mt-1">
                    {complaintStats?.total || 0}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          {complaintStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-xs text-slate-400">
                  Assigned
                </p>

                <h2 className="text-2xl font-bold text-red-600 mt-2">
                  {complaintStats.total}
                </h2>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-xs text-slate-400">
                  Submitted
                </p>

                <h2 className="text-2xl font-bold text-yellow-600 mt-2">
                  {complaintStats.submitted}
                </h2>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-xs text-slate-400">
                  In Progress
                </p>

                <h2 className="text-2xl font-bold text-blue-600 mt-2">
                  {complaintStats.inProgress}
                </h2>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-xs text-slate-400">
                  Resolved
                </p>

                <h2 className="text-2xl font-bold text-green-600 mt-2">
                  {complaintStats.resolved}
                </h2>
              </div>
            </div>
          )}

          {/* Complaints */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="px-6 py-4 border-b border-slate-100">

              <h2 className="text-lg font-semibold text-slate-900">
                Assigned Complaints
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Complaints assigned to this
                technician
              </p>
            </div>

            {complaints.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                No complaints assigned
              </div>
            ) : (
              <div className="divide-y divide-slate-100">

                {complaints.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 hover:bg-red-50 transition"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                      <div>

                        <h3 className="text-base font-medium text-slate-900">
                          {c.title}
                        </h3>

                        <div className="flex items-center gap-3 mt-2 flex-wrap">

                          <span className="px-3 py-1 rounded-md bg-red-50 text-red-700 text-sm">
                            {c.category}
                          </span>

                          <span className="text-sm text-slate-500">
                            {new Date(
                              c.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">

                        <span
                          className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(
                            c.status
                          )}`}
                        >
                          {c.status}
                        </span>

                        <button className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm transition">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-5">

          {/* Technician Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Technician Info
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-xs text-slate-400">
                  Full Name
                </p>

                <h3 className="text-sm font-medium text-slate-800 mt-1">
                  {technician.name}
                </h3>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Email
                </p>

                <h3 className="text-sm font-medium text-slate-800 mt-1 break-all">
                  {technician.email}
                </h3>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Department
                </p>

                <h3 className="text-sm font-medium text-slate-800 mt-1">
                  {technician.department ||
                    "N/A"}
                </h3>
              </div>

            </div>
          </div>

          {/* Recent Assigned Complaints */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Recent Complaints
            </h2>

            <div className="space-y-4">

              {complaints
                .slice(0, 3)
                .map((c) => (
                  <div
                    key={c.id}
                    className="border-b border-slate-100 pb-3"
                  >

                    <h3 className="text-sm font-medium text-slate-800">
                      {c.title}
                    </h3>

                    <div className="flex items-center justify-between mt-2">

                      <span className="text-xs text-slate-500">
                        {new Date(
                          c.createdAt
                        ).toLocaleDateString()}
                      </span>

                      <span
                        className={`px-2 py-1 rounded-md text-xs ${getStatusColor(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDetail;