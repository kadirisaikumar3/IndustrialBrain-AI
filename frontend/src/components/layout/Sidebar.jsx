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
    <aside className="w-80 min-h-screen sidebar-bg">

      <div className="flex items-center gap-3 p-6 sidebar-header">

        <BrainCircuit
          size={34}
          className="text-cyan-400"
        />

        <div>
          <h1 className="sidebar-title text-xl font-bold">
            IndustrialBrain AI
          </h1>

          <p className="sidebar-subtitle text-xs">
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
                  ? "sidebar-link-active"
                  : "sidebar-link"
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