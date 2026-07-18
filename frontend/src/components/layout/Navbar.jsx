import { BrainCircuit } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full bg-theme border-b border-theme">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <BrainCircuit
            size={34}
            className="text-cyan-400"
          />

          <div>
            <h1 className="text-2xl font-bold text-primary">
              IndustrialBrain AI
            </h1>

            <p className="text-xs text-secondary">
              Industrial Knowledge Intelligence
            </p>
          </div>
        </div>

        {/* Navigation */}

        <ul className="hidden md:flex gap-8 text-secondary font-medium">

          <li>
            <Link to="/" className="hover:text-cyan-400 transition">
                Home
            </Link>
        </li>

          <li>
            <Link to="/dashboard" className="hover:text-cyan-400 transition">
            Dashboard
            </Link>
        </li>

          <li className="cursor-pointer hover:text-cyan-400 transition">
            Upload
          </li>

          <li className="cursor-pointer hover:text-cyan-400 transition">
            AI Chat
          </li>

        </ul>

      </div>
    </nav>
  );
}

export default Navbar;