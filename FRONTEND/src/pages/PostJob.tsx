import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!title.trim() || !description.trim() || !location.trim()) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      await api.post("/jobs", {
        title,
        description,
        location,
      });

      setSuccess("✅ Job posted successfully! Redirecting...");
      setTimeout(() => navigate("/jobs"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Post New Job</h1>
          <p className="text-slate-300">Share the perfect opportunity with your team</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg mb-6 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">💼 Job Title</label>
              <input
                type="text"
                placeholder="e.g., Senior Frontend Developer, UX Designer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">📍 Location</label>
              <input
                type="text"
                placeholder="e.g., San Francisco, CA or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition"
                required
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">📝 Job Description</label>
              <textarea
                placeholder="Describe the role, responsibilities, requirements, and benefits..."
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition resize-none"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-slate-500 disabled:to-slate-500 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 disabled:scale-100"
              >
                {loading ? "Posting..." : "Post Job"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="flex-1 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Tips Section */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-white font-semibold mb-4">💡 Tips for a Great Job Posting</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Be specific about the role and responsibilities</li>
              <li>• Highlight required skills and qualifications</li>
              <li>• Mention benefits, salary range, and perks if applicable</li>
              <li>• Include information about your company culture</li>
              <li>• Specify whether the role is remote, on-site, or hybrid</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}