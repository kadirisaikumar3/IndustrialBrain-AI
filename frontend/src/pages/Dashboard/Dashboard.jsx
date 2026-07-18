import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AppLayout from "../../components/layout/AppLayout";

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

  const [searchTerm, setSearchTerm] = useState("");

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

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await API.get("/dashboard/documents");
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }

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

  const downloadDocument = async (id) => {

    try {

        const selectedDoc = documents.find(
            doc => doc.id === id
        );

        const response = await API.get(
            `/dashboard/download/${id}`,
            {
                responseType: "blob",
            }
        );

        const blob = new Blob(
            [response.data],
            {
                type: response.headers["content-type"],
            }
        );

        const url = window.URL.createObjectURL(blob);

        const link = window.document.createElement("a");

        link.href = url;

        link.download = selectedDoc
            ? selectedDoc.fileName
            : "download";

        window.document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

        window.document.body.appendChild(link);

link.click();

link.remove();

window.URL.revokeObjectURL(url);

toast.success("Document downloaded successfully!", {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
});

    } catch (error) {

        console.error(error);

        toast.error("Download failed.");

    }

};

  const deleteDocument = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/dashboard/delete/${id}`);
      toast.success("Document deleted successfully!", {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
});
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

  const filteredDocuments = documents.filter((doc) =>
  doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
  <AppLayout>

          {/* Welcome Banner */}

          <div className="mb-8 rounded-3xl bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-700 px-10 py-12 text-primary shadow-2xl">

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
                  className="group card-bg rounded-3xl p-10 card-hover hover:-translate-y-2 hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]"
                >
                  <div className="flex items-start justify-between">

                    <div>
                      <p className="text-sm text-secondary">
                        {item.title}
                      </p>

                      <h2 className="mt-4 text-6xl font-bold text-primary">
                        {item.value}
                      </h2>

                      <p className="mt-4 text-sm text-secondary">
                        {item.subtitle}
                      </p>
                    </div>

                    <div
                      className={`rounded-2xl search-box p-4 ${item.color}`}
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

            <h2 className="mb-6 text-3xl font-bold text-primary">
              ⚡ Quick Actions
            </h2>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.title}
                    onClick={() => navigate(action.path)}
                    className={`rounded-2xl p-6 text-left text-primary transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] ${action.color}`}
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

          
          <div className="mb-6 flex justify-end">
  <input
    type="text"
    placeholder="Search documents..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full max-w-md rounded-xl border border-theme bg-transparent px-4 py-3 text-primary placeholder:text-secondary outline-none focus:ring-2 focus:ring-cyan-500"
  />
</div>

          {/* Recent Documents */}

          <div className="mt-10 rounded-2xl border border-theme card-bg p-10">

            <h2 className="mb-6 text-3xl font-bold text-primary">
              Recent Documents
            </h2>

            {filteredDocuments.length === 0 ? (

              <div className="py-16 text-center">

                <h2 className="text-2xl font-bold text-primary">
                  {searchTerm
    ? "No matching documents found"
    : "No Documents Yet"}
                </h2>

                <p className="mt-3 text-secondary">
                  {searchTerm
    ? "Try another filename."
    : "Upload your first document to start AI analysis."}
                </p>

              </div>

            ) : (

              <div className="space-y-5">

                {filteredDocuments.map((doc) => (

                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-xl search-box p-5"
                  >

                    <div className="flex items-center gap-4">

                      <FileText
                        size={28}
                        className="text-cyan-400"
                      />

                      <div>

                        <p className="text-xl font-semibold text-primary">
                          {doc.fileName}
                        </p>

                        <p className="text-sm text-secondary">
                          {doc.fileType}
                        </p>

                        <p className="text-xs text-secondary">
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
    onClick={() => navigate(`/pdf/${doc.id}`)}
    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-primarye transition hover:bg-indigo-500"
>
    <Eye size={18} />
    Preview
</button>

                      <button
                        onClick={() => downloadDocument(doc.id)}
                        className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-semibold card-bg transition hover:bg-cyan-400"
                      >
                        <Download size={18} />
                        Download
                      </button>

                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-primary transition hover:bg-red-500"
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

          <footer className="mt-14 border-t border-theme py-8 text-center text-secondary">
            IndustrialBrain AI • Powered by React • Spring Boot • Gemini AI
          </footer>

          </AppLayout>
  );
}

export default Dashboard;