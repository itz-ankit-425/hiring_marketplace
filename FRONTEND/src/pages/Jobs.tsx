import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  employer: {
    id: string;
    name: string;
    email: string;
  };
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data);

        if (user?.role === "USER") {
          const appsRes = await api.get("/applications");
          const appliedJobIds: Set<string> = new Set(appsRes.data.map((app: any) => app.job.id as string));
          setAppliedJobs(appliedJobIds);
        }
      } catch (err) {
        console.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  const handleApply = async (jobId: string) => {
    try {
      await api.post("/applications", { jobId });
      setAppliedJobs(new Set([...appliedJobs, jobId]));
      alert("✅ Application submitted successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to apply for job");
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-300 mt-4">Loading opportunities...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">HM</span>
            </div>
            <h1 className="text-2xl font-bold text-white">HireHub</h1>
          </div>
          <a href="/" className="text-slate-300 hover:text-white transition">
            ← Dashboard
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Job Opportunities</h2>
          <p className="text-slate-300">Discover amazing career opportunities</p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <span className="absolute left-4 top-3 text-2xl">🔍</span>
            <input
              type="text"
              placeholder="Search by job title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition backdrop-blur-md"
            />
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-slate-300 text-lg">
              {searchTerm ? "No jobs match your search" : "No jobs available yet"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:border-blue-500/50 hover:bg-white/15 transition duration-300"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold">
                        {job.employer.name[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{job.title}</h3>
                        <p className="text-sm text-slate-400">{job.employer.name}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                        📍 {job.location}
                      </span>
                    </div>

                    <p className="text-slate-300 line-clamp-2 text-sm md:text-base">
                      {job.description}
                    </p>
                  </div>

                  {user?.role === "USER" && (
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={appliedJobs.has(job.id)}
                      className={`px-6 py-3 rounded-lg font-semibold transition transform whitespace-nowrap ${
                        appliedJobs.has(job.id)
                          ? "bg-slate-500/20 text-slate-300 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white hover:scale-105"
                      }`}
                    >
                      {appliedJobs.has(job.id) ? "✅ Applied" : "Apply Now"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center text-slate-400">
          Showing {filteredJobs.length} of {jobs.length} opportunities
        </div>
      </main>
    </div>
  );
}