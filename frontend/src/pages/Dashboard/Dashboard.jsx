import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

import UploadTrendChart from "../../components/dashboard/UploadTrendChart";
import FileTypeChart from "../../components/dashboard/FileTypeChart";
import RecentActivity from "../../components/dashboard/RecentActivity";

import API from "../../services/api";

import {
  FileText,
  MessageSquare,
  Network,
  Upload,
  Download,
  CheckCircle,
  Trash2,
  Eye,
  BrainCircuit,
  Settings,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);

  const [statsData, setStatsData] = useState({
    totalDocuments: 0,
    pdfCount: 0,
    imageCount: 0,
    storageUsed: "0 MB",
  });

  useEffect(() => {
    fetchDocuments();
    fetchDashboardStats();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await API.get("/dashboard/documents");
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await API.get("/dashboard/stats");
      setStatsData(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load dashboard statistics.");
    }
  };

  const downloadDocument = (id) => {
    window.open(
        `${import.meta.env.VITE_API_URL}/dashboard/download/${id}`,
        "_blank"
    );
};

  const deleteDocument = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/dashboard/delete/${id}`);
      toast.success("Document deleted successfully.");
      fetchDocuments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete document.");
    }
  };

  const stats = [
    {
      title: "Total Documents",
      value: statsData.totalDocuments,
      subtitle: "All uploaded files",
      color: "text-cyan-400",
      icon: FileText,
    },
    {
      title: "PDF Documents",
      value: statsData.pdfCount,
      subtitle: "Ready for AI Analysis",
      color: "text-green-400",
      icon: FileText,
    },
    {
      title: "Images",
      value: statsData.imageCount,
      subtitle: "OCR & Vision Ready",
      color: "text-purple-400",
      icon: Upload,
    },
    {
      title: "Storage Used",
      value: statsData.storageUsed,
      subtitle: "Local Storage",
      color: "text-orange-400",
      icon: Network,
    },
  ];

  const quickActions = [
    {
      title: "Upload Document",
      description: "Upload PDFs & Images",
      icon: Upload,
      color: "bg-cyan-600 hover:bg-cyan-500",
      path: "/upload",
    },
    {
      title: "Ask AI",
      description: "Chat with your documents",
      icon: MessageSquare,
      color: "bg-emerald-600 hover:bg-emerald-500",
      path: "/ai",
    },
    {
      title: "Knowledge Graph",
      description: "Visualize document knowledge",
      icon: BrainCircuit,
      color: "bg-purple-600 hover:bg-purple-500",
      path: "/graph",
    },
    {
      title: "Settings",
      description: "Application preferences",
      icon: Settings,
      color: "bg-orange-600 hover:bg-orange-500",
      path: "/settings",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-10">

          {/* Welcome Banner */}

          <div className="mb-8 rounded-3xl bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-700 px-10 py-12 text-white shadow-2xl">

            <h1 className="text-6xl font-extrabold">
              🏭 IndustrialBrain AI
            </h1>

            <p className="mt-3 text-xl text-cyan-100">
              Intelligent Industrial Knowledge Platform
            </p>

            <div className="mt-5 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              ET AI Hackathon 2026 🚀
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
                📄 Upload
              </span>

              <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
                🤖 AI Analysis
              </span>

              <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
                🌐 Knowledge Graph
              </span>

              <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
                📊 Dashboard
              </span>
            </div>
          </div>

          {/* Statistics */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-slate-700 bg-slate-800 p-10 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]"
                >
                  <div className="flex items-start justify-between">

                    <div>
                      <p className="text-sm text-slate-400">
                        {item.title}
                      </p>

                      <h2 className="mt-4 text-6xl font-bold text-white">
                        {item.value}
                      </h2>

                      <p className="mt-4 text-sm text-slate-500">
                        {item.subtitle}
                      </p>
                    </div>

                    <div
                      className={`rounded-2xl bg-slate-900 p-4 ${item.color}`}
                    >
                      <Icon size={34} />
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}

          <div className="mt-10">

            <h2 className="mb-6 text-3xl font-bold text-white">
              ⚡ Quick Actions
            </h2>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.title}
                    onClick={() => navigate(action.path)}
                    className={`rounded-2xl p-6 text-left text-white transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] ${action.color}`}
                  >
                    <Icon size={42} />

                    <h3 className="mt-5 text-xl font-bold">
                      {action.title}
                    </h3>

                    <p className="mt-2 text-sm opacity-90">
                      {action.description}
                    </p>
                  </button>
                );
              })}

            </div>
          </div>

          {/* Charts */}

          <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2">

            <UploadTrendChart />

            <FileTypeChart
              pdfCount={statsData.pdfCount}
              imageCount={statsData.imageCount}
            />

          </div>
                    {/* Recent Activity */}

          <div className="mt-10">
            <RecentActivity />
          </div>

          {/* Recent Documents */}

          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-800 p-10">

            <h2 className="mb-6 text-3xl font-bold text-white">
              Recent Documents
            </h2>

            {documents.length === 0 ? (

              <div className="py-16 text-center">

                <h2 className="text-2xl font-bold text-slate-300">
                  No Documents Yet
                </h2>

                <p className="mt-3 text-slate-500">
                  Upload your first document to start AI analysis.
                </p>

              </div>

            ) : (

              <div className="space-y-5">

                {documents.map((doc) => (

                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-xl bg-slate-900 p-5"
                  >

                    <div className="flex items-center gap-4">

                      <FileText
                        size={28}
                        className="text-cyan-400"
                      />

                      <div>

                        <p className="text-xl font-semibold text-white">
                          {doc.fileName}
                        </p>

                        <p className="text-sm text-slate-400">
                          {doc.fileType}
                        </p>

                        <p className="text-xs text-slate-500">
                          {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      <span className="flex items-center gap-2 text-green-400">
                        <CheckCircle size={18} />
                        Uploaded
                      </span>

         <button
  onClick={() =>
    window.open(
      `${import.meta.env.VITE_API_URL}/dashboard/preview/${doc.id}`,
      "_blank"
    )
  }
  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500"
>
  <Eye size={18} />
  Preview
</button>

                      <button
                        onClick={() => downloadDocument(doc.id)}
                        className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-900 transition hover:bg-cyan-400"
                      >
                        <Download size={18} />
                        Download
                      </button>

                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* Footer */}

          <footer className="mt-14 border-t border-slate-700 py-8 text-center text-slate-400">
            IndustrialBrain AI • Powered by React • Spring Boot • Gemini AI
          </footer>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;