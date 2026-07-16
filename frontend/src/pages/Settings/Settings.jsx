import { useEffect, useState } from "react";
import API from "../../services/api";

import {
  User,
  BrainCircuit,
  Database,
  Server,
  Moon,
  CheckCircle,
} from "lucide-react";

function Settings() {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    pdfCount: 0,
    imageCount: 0,
    storageUsed: "0 MB",
  });

  const profile = {
    name: "Saikumar",
    role: "Software Engineer",
  };

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await API.get("/dashboard/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">⚙️ Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Profile */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-5">
            <User className="text-cyan-400" size={28} />
            <h2 className="text-2xl font-semibold">Profile</h2>
          </div>

          <p className="mb-2">
            <strong>Name:</strong> {profile.name}
          </p>

          <p>
            <strong>Role:</strong> {profile.role}
          </p>
        </div>

        {/* AI Model */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-5">
            <BrainCircuit className="text-green-400" size={28} />
            <h2 className="text-2xl font-semibold">AI Model</h2>
          </div>

          <p>Gemini 2.5 Flash</p>

          <div className="flex items-center gap-2 mt-3 text-green-400">
            <CheckCircle size={18} />
            Connected
          </div>
        </div>

        {/* Storage */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-5">
            <Database className="text-yellow-400" size={28} />
            <h2 className="text-2xl font-semibold">Storage</h2>
          </div>

          <p className="mb-2">
            Documents Uploaded : <strong>{stats.totalDocuments}</strong>
          </p>

          <p className="mb-2">
            PDF Files : <strong>{stats.pdfCount}</strong>
          </p>

          <p className="mb-2">
            Images : <strong>{stats.imageCount}</strong>
          </p>

          <p>
            Storage Used : <strong>{stats.storageUsed}</strong>
          </p>
        </div>

        {/* API Status */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-5">
            <Server className="text-purple-400" size={28} />
            <h2 className="text-2xl font-semibold">API Status</h2>
          </div>

          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle size={18} />
            Backend Running
          </div>

          <div className="flex items-center gap-2 mt-2 text-green-400">
            <CheckCircle size={18} />
            Gemini Connected
          </div>
        </div>

        {/* Theme */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-5">
            <Moon className="text-blue-400" size={28} />
            <h2 className="text-2xl font-semibold">Theme</h2>
          </div>

          <p>🌙 Dark Theme</p>
          <p className="text-sm text-slate-400 mt-2">
            Theme switching will be implemented in the next update.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Settings;