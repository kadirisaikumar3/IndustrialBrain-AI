import { useEffect, useState } from "react";
import API from "../../services/api";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

function AIChat() {

  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {

    try {

      const response = await API.get("/dashboard/documents");

      setDocuments(response.data);

    } catch (error) {

      console.error(error);
      alert("Unable to load documents.");

    }

  };

  const askAI = async () => {

    if (!selectedDocument) {
      alert("Please select a document.");
      return;
    }

    if (question.trim() === "") {
      alert("Please enter your question.");
      return;
    }

    try {

      setLoading(true);
      setAnswer("");

      const response = await API.post(
        `/dashboard/ask/${selectedDocument}`,
        question,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );

      setAnswer(response.data);

    } catch (error) {

      console.error("FULL ERROR:", error);

      console.log("Response:", error.response);

      console.log("Response Data:", error.response?.data);

      setAnswer(error.response?.data || "Unknown error");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="flex min-h-screen bg-slate-900">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <main className="p-8">

          <div className="mx-auto max-w-6xl">

            {/* Header */}

            <div className="rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 p-8 shadow-2xl">

              <h1 className="text-5xl font-extrabold text-white">
                🧠 IndustrialBrain AI Assistant
              </h1>

              <p className="mt-4 text-lg leading-8 text-cyan-100">
                Upload engineering documents, maintenance manuals,
                SOPs, reports and ask intelligent questions powered
                by Google Gemini AI.
              </p>

            </div>
            {/* Document Selection */}

            <div className="mt-8 rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-2xl">

              <h2 className="text-3xl font-bold text-white">
                📄 Select Document
              </h2>

              <p className="mt-2 text-slate-400">
                Choose the document that you want Gemini AI to analyze.
              </p>

              <select
                value={selectedDocument}
                onChange={(e) => setSelectedDocument(e.target.value)}
                className="mt-6 w-full rounded-xl border border-slate-600 bg-slate-700 p-4 text-white outline-none transition-all focus:border-cyan-400"
              >

                <option value="">
                  📂 Select a document...
                </option>

                {documents.map((doc) => (

                  <option
                    key={doc.id}
                    value={doc.id}
                  >
                    {doc.fileName}
                  </option>

                ))}

              </select>

            </div>

            {/* Ask Question */}

            <div className="mt-8 rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-2xl">

              <h2 className="text-3xl font-bold text-white">
                💬 Ask Your Question
              </h2>

              <p className="mt-2 text-slate-400">
                Ask anything related to the selected document.
              </p>

              <textarea
                rows={7}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Example:
• Summarize this document
• Explain the key concepts
• List interview questions
• What are the important topics?"
                className="mt-6 w-full rounded-2xl border border-slate-600 bg-slate-700 p-5 text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-400"
              />

              <div className="mt-8 flex justify-center">

                <button
                  onClick={askAI}
                  disabled={loading}
                  className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-12 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {loading ? (

                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Thinking...
                    </>

                  ) : (

                    <>🚀 Ask Gemini</>

                  )}

                </button>

              </div>

            </div>
            {/* AI Response */}

            <div className="mt-8 rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-2xl">

              <h2 className="flex items-center gap-3 text-3xl font-bold text-white">
                🤖 AI Response
              </h2>

              <p className="mt-2 text-slate-400">
                Gemini AI will analyze the selected document and answer your question.
              </p>

              <div className="mt-6 min-h-[380px] rounded-2xl border border-slate-700 bg-slate-900 p-6">

                {loading ? (

                  <div className="flex flex-col items-center justify-center py-20">

                    <div className="mb-6 h-14 w-14 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>

                    <h3 className="text-2xl font-semibold text-cyan-400">
                      Gemini is analyzing your document...
                    </h3>

                    <p className="mt-3 text-slate-400">
                      Please wait while AI processes your request.
                    </p>

                  </div>

                ) : answer ? (

                  <div className="overflow-auto rounded-xl bg-slate-950 p-5">

                    <pre className="whitespace-pre-wrap font-sans text-[16px] leading-8 text-slate-200">
                      {answer}
                    </pre>

                  </div>

                ) : (

                  <div className="flex h-full flex-col items-center justify-center py-20">

                    <div className="mb-6 text-7xl">
                      🤖
                    </div>

                    <h3 className="text-3xl font-bold text-white">
                      Ready to Answer
                    </h3>

                    <p className="mt-4 max-w-2xl text-center text-slate-400 leading-8">
                      Select a document, type your question, and click
                      <span className="font-semibold text-cyan-400">
                        {" "}Ask Gemini
                      </span>.
                      <br />
                      Your AI-generated answer will appear here.
                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>

  );

}

export default AIChat;