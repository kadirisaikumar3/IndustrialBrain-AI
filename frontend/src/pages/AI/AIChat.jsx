import { useEffect, useState } from "react";
import API from "../../services/api";

import AppLayout from "../../components/layout/AppLayout";
import { toast } from "react-toastify";

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
      toast.error("Unable to load documents.");

    }

  };

  const askAI = async () => {

    if (loading) return;

    if (!selectedDocument) {
      toast.warning("Please select a document.");
      return;
    }

    if (question.trim() === "") {
      toast.warning("Please enter your question.");
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

      toast.success("Response generated successfully!");

    } catch (error) {

      console.error("FULL ERROR:", error);


      setAnswer(error.response?.data || "Unknown error");

    } finally {

      setLoading(false);

    }

  };

  return (

    <AppLayout>

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

        {documents.length === 0 ? (

          <div className="mt-8 rounded-3xl card-bg border border-theme p-10 text-center shadow-xl">

            <h2 className="text-2xl font-bold text-primary">
              No Documents Available
            </h2>

            <p className="mt-3 text-secondary">
              Upload a document first to start chatting with Gemini AI.
            </p>

          </div>

        ) : (

          <>

            {/* Document Selection */}

            <div className="mt-8 rounded-3xl card-bg border border-theme p-8 shadow-xl">

              <h2 className="text-3xl font-bold text-primary">
                📄 Select Document
              </h2>

              <p className="mt-2 text-secondary">
                Choose the document that you want Gemini AI to analyze.
              </p>

              <select
    disabled={loading}
                value={selectedDocument}
                onChange={(e) => setSelectedDocument(e.target.value)}
                className="mt-6 w-full rounded-xl border border-theme search-box p-4 text-primary outline-none transition-all focus:border-cyan-400"
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

            <div className="mt-8 rounded-3xl card-bg border border-theme p-8 shadow-xl">

              <h2 className="text-3xl font-bold text-primary">
                💬 Ask Your Question
              </h2>

              <p className="mt-2 text-secondary">
                Ask anything related to the selected document.
              </p>

              <textarea
    disabled={loading}
                rows={7}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={`Example:
• Summarize this document
• Explain the key concepts
• List interview questions
• What are the important topics?`}
                className="mt-6 w-full rounded-2xl border border-theme search-box p-5 text-primary placeholder:text-secondary outline-none transition-all focus:border-cyan-400"
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

            <div className="mt-8 rounded-3xl card-bg border border-theme p-8 shadow-xl">

              <h2 className="flex items-center gap-3 text-3xl font-bold text-primary">
                🤖 AI Response
              </h2>

              <p className="mt-2 text-secondary">
                Gemini AI will analyze the selected document and answer your question.
              </p>

              <div className="mt-6 min-h-[380px] rounded-2xl border border-theme search-box p-6">
                                {loading ? (

                  <div className="flex flex-col items-center justify-center py-20">

                    <div className="mb-6 h-14 w-14 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>

                    <h3 className="text-2xl font-semibold text-cyan-400">
                      Gemini is analyzing your document...
                    </h3>

                    <p className="mt-3 text-secondary">
                      Please wait while AI processes your request.
                    </p>

                  </div>

                ) : answer ? (

                  <div className="overflow-auto rounded-xl search-box p-5">

                    <pre className="whitespace-pre-wrap font-sans text-[16px] leading-8 text-primary">
                      {answer}
                    </pre>

                  </div>

                ) : (

                  <div className="flex h-full flex-col items-center justify-center py-20">

                    <div className="mb-6 text-7xl">
                      🤖
                    </div>

                    <h3 className="text-3xl font-bold text-primary">
                      Ready to Answer
                    </h3>

                    <p className="mt-4 max-w-2xl text-center text-secondary leading-8">
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

          </>

        )}

      </div>

    </AppLayout>

  );

}

export default AIChat;