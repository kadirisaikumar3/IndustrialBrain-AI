import { useEffect, useState } from "react";
import {
    FileText,
    Image,
    Download,
    Eye,
    Trash2,
} from "lucide-react";
import API from "../../services/api";

import { useNavigate } from "react-router-dom";

function DocumentList() {

    const navigate = useNavigate();

    const [documents, setDocuments] = useState([]);

    const [selectedDocument, setSelectedDocument] = useState(null);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loadingAI, setLoadingAI] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await API.get("/dashboard/documents");
            setDocuments(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    const deleteDocument = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this document?"
        );

        if (!confirmDelete) return;

        try {

            await API.delete(`/dashboard/delete/${id}`);

            fetchDocuments();

        } catch (error) {

            console.error(error);

            alert("Failed to delete document.");

        }

    };

    const askAI = async () => {

        if (!question.trim()) {
            alert("Please enter a question.");
            return;
        }

        try {

            setLoadingAI(true);

            const response = await API.post(
                `/dashboard/ask/${selectedDocument.id}`,
                question,
                {
                    headers: {
                        "Content-Type": "text/plain"
                    }
                }
            );

            setAnswer(response.data);

        } catch (error) {

            console.error(error);

            setAnswer("Failed to get AI response.");

        } finally {

            setLoadingAI(false);

        }

    };

    return (
        <div className="mt-12">

            <h2 className="mb-6 text-3xl font-bold text-white">
                Uploaded Documents
            </h2>

            <div className="space-y-5">

                {documents.map((doc) => (

                    <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-2xl bg-slate-800 p-6 shadow-lg border border-slate-700 transition-all duration-300 hover:border-cyan-500 hover:shadow-cyan-500/20"
                    >

                        <div className="flex items-center gap-5">

                            {doc.fileType.startsWith("image") ? (

                                <Image
                                    size={36}
                                    className="text-cyan-400"
                                />

                            ) : (

                                <FileText
                                    size={36}
                                    className="text-cyan-400"
                                />

                            )}

                            <div>

                                <h3 className="text-lg font-semibold text-white">
                                    {doc.fileName}
                                </h3>

                                <p className="text-sm text-slate-400">
                                    {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB
                                </p>

                            </div>

                        </div>

                        <div className="flex gap-3">

                            <button
    onClick={() => navigate(`/pdf/${doc.id}`)}
    className="rounded-lg bg-slate-700 p-3 text-cyan-400 transition hover:bg-cyan-500 hover:text-white"
    title="Preview"
>
    <Eye size={20} />
</button>

                            <button
    onClick={async () => {
        try {
            const response = await API.get(
                `/dashboard/download/${doc.id}`,
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], {
                type: response.headers["content-type"],
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;

            // original filename
            link.download = doc.fileName;

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Download failed");
        }
    }}
    className="rounded-lg bg-slate-700 p-3 text-green-400 transition hover:bg-green-500 hover:text-white"
    title="Download"
>
                                <Download size={20} />
                            </button>

                            <button
                                onClick={() => deleteDocument(doc.id)}
                                className="rounded-lg bg-slate-700 p-3 text-red-400 transition hover:bg-red-500 hover:text-white"
                                title="Delete"
                            >
                                <Trash2 size={20} />
                            </button>

                            <button
                                onClick={() => {

                                    setSelectedDocument(doc);

                                    setQuestion("");

                                    setAnswer("");

                                }}
                                className="rounded-lg bg-slate-700 p-3 text-yellow-400 transition hover:bg-yellow-500 hover:text-black"
                                title="Ask AI"
                            >
                                ✨
                            </button>

                        </div>

                    </div>

                ))}

            </div>

            {selectedDocument && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

                    <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-slate-800 border border-cyan-500 shadow-2xl flex flex-col">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-700 p-5">

                            <div>
                                <h2 className="text-3xl font-bold text-white">
                                    🤖 Ask AI
                                </h2>

                                <p className="mt-1 text-cyan-400">
                                    {selectedDocument.fileName}
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setSelectedDocument(null);
                                    setQuestion("");
                                    setAnswer("");
                                }}
                                className="text-3xl text-red-400 hover:text-red-300"
                            >
                                ✕
                            </button>

                        </div>

                        {/* Body */}
                        <div className="overflow-y-auto p-6 flex-1">

                            <textarea
                                rows={4}
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Ask anything about this document..."
                                className="w-full rounded-xl bg-slate-700 p-4 text-white outline-none border border-slate-600"
                            />

                            <button
                                onClick={askAI}
                                disabled={loadingAI}
                                className="mt-5 rounded-xl bg-cyan-500 px-8 py-3 font-bold text-slate-900 hover:bg-cyan-400"
                            >
                                {loadingAI ? "Thinking..." : "Ask AI"}
                            </button>

                            {answer && (

                                <div className="mt-8 rounded-xl bg-slate-700 p-5">

                                    <h3 className="mb-4 text-2xl font-bold text-cyan-400">
                                        AI Response
                                    </h3>

                                    <div className="max-h-[400px] overflow-y-auto whitespace-pre-wrap leading-8 text-white">
                                        {answer}
                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}

export default DocumentList;