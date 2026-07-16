import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  MessageSquare,
  Network,
  Settings,
  BrainCircuit,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Upload",
    icon: Upload,
    path: "/upload",
  },
  {
    name: "AI Chat",
    icon: MessageSquare,
    path: "/ai",
  },
  {
    name: "Knowledge Graph",
    icon: Network,
    path: "/graph",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-80 min-h-screen bg-slate-950 border-r border-slate-800">

      <div className="flex items-center gap-3 p-6 border-b border-slate-800">

        <BrainCircuit
          size={34}
          className="text-cyan-400"
        />

        <div>
          <h1 className="text-white text-xl font-bold">
            IndustrialBrain AI
          </h1>

          <p className="text-slate-400 text-xs">
            AI Knowledge Platform
          </p>
        </div>

      </div>

      <nav className="mt-8 px-4">

        {menuItems.map((item) => {

          const Icon = item.icon;

          const active = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-4 rounded-xl mb-3 transition ${
                active
                  ? "bg-cyan-500 text-slate-900 font-semibold"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon size={22} />
              {item.name}
            </Link>
          );

        })}

      </nav>

    </aside>
  );
}

export default Sidebar;