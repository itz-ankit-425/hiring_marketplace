import { useEffect, useState } from "react";
import api from "../api/axios";

type ReceivedApplication = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  job: {
    id: string;
    title: string;
    location: string;
  };
  status: string;
  createdAt: string;
};

export default function ReceivedApplications() {
  const [applications, setApplications] = useState<ReceivedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/employer/received");
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to load received applications");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: "ACCEPTED" | "REJECTED") => {
    setUpdating(applicationId);
    try {
      await api.patch(`/applications/${applicationId}/status`, { status: newStatus });
      // Update local state
      setApplications(applications.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update application status");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return { bg: "bg-amber-500/20", border: "border-amber-500/30", text: "text-amber-300", icon: "⏳" };
      case "ACCEPTED":
        return { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-300", icon: "✅" };
      case "REJECTED":
        return { bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-300", icon: "❌" };
      default:
        return { bg: "bg-slate-500/20", border: "border-slate-500/30", text: "text-slate-300", icon: "•" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin">
              <div className="w-12 h-12 border-4 border-white/20 border-t-blue-500 rounded-full"></div>
            </div>
            <p className="text-slate-300 mt-4">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Received Applications</h1>
          <p className="text-slate-300">Manage applications from job seekers</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📬</div>
            <p className="text-white text-lg font-semibold mb-2">No applications yet</p>
            <p className="text-slate-300">Applications from job seekers will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-400">{applications.length}</div>
                <div className="text-slate-300 text-sm">Total Received</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400">
                  {applications.filter((a) => a.status === "ACCEPTED").length}
                </div>
                <div className="text-slate-300 text-sm">Accepted</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-amber-400">
                  {applications.filter((a) => a.status === "PENDING").length}
                </div>
                <div className="text-slate-300 text-sm">Pending</div>
              </div>
            </div>

            {/* Applications List */}
            {applications.map((app) => {
              const statusBadge = getStatusBadge(app.status);
              return (
                <div
                  key={app.id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:border-white/40 transition"
                >
                  <div className="flex justify-between items-start gap-4">
                    {/* Applicant Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-bold text-white">{app.user.name}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.border} ${statusBadge.text}`}>
                          {statusBadge.icon} {app.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2 text-slate-300">
                          <span>✉️</span>
                          <a href={`mailto:${app.user.email}`} className="hover:text-blue-400 transition">
                            {app.user.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span>💼</span>
                        <span>{app.job.title}</span>
                        {app.job.location && (
                          <>
                            <span>•</span>
                            <span>📍 {app.job.location}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Date & Actions */}
                    <div className="text-right space-y-3">
                      <div>
                        <p className="text-xs text-slate-400">Applied on</p>
                        <p className="text-white font-semibold">
                          {new Date(app.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      {app.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusUpdate(app.id, "ACCEPTED")}
                            disabled={updating === app.id}
                            className="px-4 py-2 bg-green-500/20 border border-green-500/30 hover:bg-green-500/30 text-green-300 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                          >
                            {updating === app.id ? "..." : "✅ Accept"}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app.id, "REJECTED")}
                            disabled={updating === app.id}
                            className="px-4 py-2 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                          >
                            {updating === app.id ? "..." : "❌ Reject"}
                          </button>
                        </div>
                      )}

                      {app.status === "ACCEPTED" && (
                        <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg text-sm font-semibold text-center">
                          ✅ Accepted
                        </div>
                      )}

                      {app.status === "REJECTED" && (
                        <div className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm font-semibold text-center">
                          ❌ Rejected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
