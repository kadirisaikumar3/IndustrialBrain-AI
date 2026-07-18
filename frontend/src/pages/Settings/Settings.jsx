import { useEffect, useState } from "react";
import API from "../../services/api";

import { useTheme } from "../../context/ThemeContext";
import AppLayout from "../../components/layout/AppLayout";

import {
  User,
  BrainCircuit,
  Database,
  Server,
  Moon,
  CheckCircle,
} from "lucide-react";

function Settings() {
  const [stats, setStats] =useState({
    totalDocuments: 0,
    pdfCount: 0,
    imageCount: 0,
    storageUsed: "0 MB",
  });

  const { theme, toggleTheme } = useTheme();

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
    <AppLayout>
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-8 shadow-2xl">
          <h1 className="text-5xl font-extrabold text-primary">
            ⚙️ Settings
          </h1>

          <p className="mt-4 text-lg text-blue-100">
            Manage your profile, AI configuration, storage, API status, and application appearance.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Profile */}

          <div className="card-bg rounded-3xl p-6 shadow-xl">
            <div className="mb-5 flex items-center gap-3">
              <User
                className="text-cyan-500"
                size={28}
              />
              <h2 className="text-2xl font-bold text-primary">
                Profile
              </h2>
            </div>

            <p className="mb-3 text-primary">
              <strong>Name:</strong> {profile.name}
            </p>

            <p className="text-primary">
              <strong>Role:</strong> {profile.role}
            </p>
          </div>

          {/* AI Model */}

          <div className="card-bg rounded-3xl p-6 shadow-xl">
            <div className="mb-5 flex items-center gap-3">
              <BrainCircuit
                className="text-green-500"
                size={28}
              />
              <h2 className="text-2xl font-bold text-primary">
                AI Model
              </h2>
            </div>

            <p className="text-primary">
              Gemini 2.5 Flash
            </p>

            <div className="mt-3 flex items-center gap-2 text-green-500">
              <CheckCircle size={18} />
              Connected
            </div>
          </div>

          {/* Storage */}

          <div className="card-bg rounded-3xl p-6 shadow-xl">
            <div className="mb-5 flex items-center gap-3">
              <Database
                className="text-yellow-500"
                size={28}
              />
              <h2 className="text-2xl font-bold text-primary">
                Storage
              </h2>
            </div>

            <div className="space-y-3 text-primary">
              <p>
                Documents Uploaded : <strong>{stats.totalDocuments}</strong>
              </p>

              <p>
                PDF Files : <strong>{stats.pdfCount}</strong>
              </p>

              <p>
                Images : <strong>{stats.imageCount}</strong>
              </p>

              <p>
                Storage Used : <strong>{stats.storageUsed}</strong>
              </p>
            </div>
          </div>

          {/* API Status */}

          <div className="card-bg rounded-3xl p-6 shadow-xl">
            <div className="mb-5 flex items-center gap-3">
              <Server
                className="text-purple-500"
                size={28}
              />
              <h2 className="text-2xl font-bold text-primary">
                API Status
              </h2>
            </div>

            <div className="space-y-3">

              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle size={18} />
                Backend Running
              </div>

              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle size={18} />
                Gemini Connected
              </div>

            </div>
          </div>

          {/* Appearance */}

          <div className="card-bg rounded-3xl p-6 shadow-xl lg:col-span-2">

            <div className="mb-6 flex items-center gap-3">
              <Moon
                className="text-blue-500"
                size={28}
              />
              <h2 className="text-2xl font-bold text-primary">
                Appearance
              </h2>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-theme p-6">

              <div>

                <p className="text-lg font-semibold text-primary">
                  {theme === "dark"
                    ? "🌙 Dark Mode"
                    : "☀️ Light Mode"}
                </p>

                <p className="mt-2 text-secondary">
                  Switch between light and dark themes instantly across the application.
                </p>

              </div>

              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ${
                  theme === "dark"
                    ? "bg-cyan-500"
                    : "bg-gray-400"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                    theme === "dark"
                      ? "translate-x-9"
                      : "translate-x-1"
                  }`}
                />
              </button>

            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
}

export default Settings;