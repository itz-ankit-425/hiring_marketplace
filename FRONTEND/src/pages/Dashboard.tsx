import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ totalJobs: 0, myApplications: 0, receivedApplications: 0 });
  const [recentJobs, setRecentJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const jobsRes = await api.get("/jobs");
        const appsRes = await api.get("/applications");
        
        let receivedCount = 0;
        if (user?.role === "EMPLOYER") {
          try {
            const receivedRes = await api.get("/applications/employer/received");
            receivedCount = receivedRes.data.length;
          } catch (err) {
            console.error("Failed to fetch received applications");
          }
        }

        setStats({
          totalJobs: jobsRes.data.length,
          myApplications: appsRes.data.length,
          receivedApplications: receivedCount,
        });
        
        // Get recent 3 jobs
        setRecentJobs(jobsRes.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch stats");
      }
    };

    fetchStats();
  }, [user?.role]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">HM</span>
            </div>
            <h1 className="text-2xl font-bold text-white">HireHub</h1>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-slate-300">
            {user?.role === "EMPLOYER"
              ? "Manage your job postings and received applications"
              : "Explore opportunities and grow your career"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium">Total Jobs</p>
                <p className="text-4xl font-bold text-white mt-2">{stats.totalJobs}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💼</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium">
                  {user?.role === "EMPLOYER" ? "Received Applications" : "My Applications"}
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {user?.role === "EMPLOYER" ? stats.receivedApplications : stats.myApplications}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium">Role</p>
                <p className="text-4xl font-bold text-white mt-2 capitalize">
                  {user?.role === "EMPLOYER" ? "Employer" : "Seeker"}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">{user?.role === "EMPLOYER" ? "👔" : "🎯"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Link
            to="/jobs"
            className="flex items-center gap-3 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition transform hover:scale-105"
          >
            <span className="text-xl">🔍</span>
            Browse Jobs
          </Link>

          {user?.role === "EMPLOYER" && (
            <Link
              to="/post-job"
              className="flex items-center gap-3 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-semibold transition transform hover:scale-105"
            >
              <span className="text-xl">✍️</span>
              Post Job
            </Link>
          )}

          <Link
            to={user?.role === "EMPLOYER" ? "/received-applications" : "/applications"}
            className="flex items-center gap-3 bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-semibold transition transform hover:scale-105"
          >
            <span className="text-xl">📊</span>
            {user?.role === "EMPLOYER" ? "Received" : "Applications"}
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-3 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-300 px-6 py-4 rounded-xl font-semibold transition"
          >
            <span className="text-xl">🚪</span>
            Logout
          </button>
        </div>

        {/* Recent Jobs Preview */}
        {user?.role === "USER" && recentJobs.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Featured Job Opportunities</h3>
              <Link to="/jobs" className="text-blue-400 hover:text-blue-300 font-semibold">
                View All →
              </Link>
            </div>

            <div className="grid gap-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-white">{job.title}</h4>
                      <p className="text-slate-300 text-sm mt-1">{job.employer.name}</p>
                      <p className="text-slate-400 text-sm mt-1">📍 {job.location}</p>
                    </div>
                    <Link
                      to="/jobs"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Employer Dashboard */}
        {user?.role === "EMPLOYER" && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Employer Dashboard</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-slate-300 mb-2">Active Job Postings</p>
                <p className="text-3xl font-bold text-blue-400">{stats.totalJobs}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-slate-300 mb-2">Received Applications</p>
                <p className="text-3xl font-bold text-green-400">{stats.receivedApplications}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}