import { useEffect, useState } from "react";
import api from "../api/axios";

type Application = {
  id: string;
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    employer: {
      name: string;
    };
  };
  status: string;
  createdAt: string;
};

export default function Applications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications");
        setApps(res.data);
      } catch (err) {
        console.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

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
            <p className="text-slate-300 mt-4">Loading your applications...</p>
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
          <h1 className="text-4xl font-bold text-white mb-2">My Applications</h1>
          <p className="text-slate-300">Track the status of all your job applications</p>
        </div>

        {apps.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-white text-lg font-semibold mb-2">No applications yet</p>
            <p className="text-slate-300">Start exploring jobs and submit your applications</p>
            <a
              href="/jobs"
              className="inline-block mt-6 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
            >
              Browse Jobs
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-400">{apps.length}</div>
                <div className="text-slate-300 text-sm">Total Applications</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400">
                  {apps.filter((a) => a.status === "ACCEPTED").length}
                </div>
                <div className="text-slate-300 text-sm">Accepted</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-amber-400">
                  {apps.filter((a) => a.status === "PENDING").length}
                </div>
                <div className="text-slate-300 text-sm">Pending</div>
              </div>
            </div>

            {/* Applications List */}
            {apps.map((app) => {
              const statusBadge = getStatusBadge(app.status);
              return (
                <div
                  key={app.id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:border-white/40 transition"
                >
                  <div className="flex justify-between items-start gap-4">
                    {/* Job Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-bold text-white">{app.job.title}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.border} ${statusBadge.text}`}>
                          {statusBadge.icon} {app.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2 text-slate-300">
                          <span>🏢</span>
                          <span>{app.job.employer.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <span>📍</span>
                          <span>{app.job.location}</span>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm line-clamp-2">{app.job.description}</p>
                    </div>

                    {/* Date */}
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Applied on</p>
                      <p className="text-white font-semibold">
                        {new Date(app.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
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