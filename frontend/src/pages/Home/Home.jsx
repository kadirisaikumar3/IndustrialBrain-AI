import {
  ArrowRight,
  BrainCircuit,
  FileText,
  Search,
  Network,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-900 text-white">

      {/* Hero Section */}

      <section className="max-w-7xl mx-auto px-8 py-20">

        <div className="max-w-3xl">

          <h1 className="text-6xl font-bold leading-tight">
            Transform
            <span className="text-cyan-400">
              {" "}Industrial Documents{" "}
            </span>
            Into AI-Powered Intelligence
          </h1>

          <p className="mt-8 text-xl text-slate-300 leading-8">
            Upload maintenance manuals, SOPs, inspection reports and
            engineering documents. Ask questions in natural language
            and receive intelligent answers powered by Generative AI.
          </p>

          <div className="mt-10 flex gap-4">

            <button
              onClick={() => navigate("/upload")}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-cyan-400"
            >
              Get Started
              <ArrowRight size={20} />
            </button>

            <button
              className="rounded-xl border border-slate-700 px-6 py-3 transition hover:border-cyan-400"
            >
              Learn More
            </button>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="max-w-7xl mx-auto px-8 pb-20">

        <div className="grid gap-6 md:grid-cols-4">

          <div className="rounded-xl bg-slate-800 p-6">
            <BrainCircuit
              className="mb-4 text-cyan-400"
              size={34}
            />

            <h2 className="mb-2 text-xl font-semibold">
              AI Chat
            </h2>

            <p className="text-slate-400">
              Ask industrial questions naturally.
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-6">
            <FileText
              className="mb-4 text-cyan-400"
              size={34}
            />

            <h2 className="mb-2 text-xl font-semibold">
              PDF Intelligence
            </h2>

            <p className="text-slate-400">
              Upload manuals and reports.
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-6">
            <Search
              className="mb-4 text-cyan-400"
              size={34}
            />

            <h2 className="mb-2 text-xl font-semibold">
              Semantic Search
            </h2>

            <p className="text-slate-400">
              Search beyond keywords.
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-6">
            <Network
              className="mb-4 text-cyan-400"
              size={34}
            />

            <h2 className="mb-2 text-xl font-semibold">
              Knowledge Graph
            </h2>

            <p className="text-slate-400">
              Visualize connected industrial knowledge.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;