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
    <main className="min-h-screen bg-theme transition-colors duration-300">

      {/* Hero Section */}

      <section className="mx-auto max-w-7xl px-8 py-20">

        <div className="rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-12 shadow-2xl">

          <div className="max-w-3xl">

            <h1 className="text-6xl font-bold leading-tight text-primary">
              Transform
              <span className="text-cyan-200">
                {" "}Industrial Documents{" "}
              </span>
              Into AI-Powered Intelligence
            </h1>

            <p className="mt-8 text-xl leading-8 text-cyan-100">
              Upload maintenance manuals, SOPs, inspection reports and engineering documents. Ask questions in natural language and receive intelligent answers powered by Generative AI.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <button
                onClick={() => navigate("/upload")}
                className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-cyan-700 transition-all duration-300 hover:scale-[1.03]"
              >
                Get Started
                <ArrowRight size={20} />
              </button>

              <button
                className="rounded-xl border border-white/40 px-6 py-3 font-semibold text-primary transition-all duration-300 hover:bg-white/10"
              >
                Learn More
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="mx-auto max-w-7xl px-8 pb-20">

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="card-bg rounded-3xl border border-theme p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <BrainCircuit
              className="mb-5 text-cyan-500"
              size={36}
            />

            <h2 className="mb-3 text-2xl font-bold text-primary">
              AI Chat
            </h2>

            <p className="text-secondary">
              Ask industrial questions naturally and receive AI-powered responses instantly.
            </p>
          </div>

          <div className="card-bg rounded-3xl border border-theme p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <FileText
              className="mb-5 text-cyan-500"
              size={36}
            />

            <h2 className="mb-3 text-2xl font-bold text-primary">
              PDF Intelligence
            </h2>

            <p className="text-secondary">
              Upload manuals, inspection reports and technical documents for intelligent processing.
            </p>
          </div>

          <div className="card-bg rounded-3xl border border-theme p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <Search
              className="mb-5 text-cyan-500"
              size={36}
            />

            <h2 className="mb-3 text-2xl font-bold text-primary">
              Semantic Search
            </h2>

            <p className="text-secondary">
              Search documents using natural language instead of exact keywords.
            </p>
          </div>

          <div className="card-bg rounded-3xl border border-theme p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <Network
              className="mb-5 text-cyan-500"
              size={36}
            />

            <h2 className="mb-3 text-2xl font-bold text-primary">
              Knowledge Graph
            </h2>

            <p className="text-secondary">
              Visualize relationships and explore connected industrial knowledge interactively.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;