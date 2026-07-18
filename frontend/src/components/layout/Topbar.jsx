import { useState, useRef, useEffect } from "react";
import {
  Bell,
  UserCircle,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Topbar() {
  const navigate = useNavigate();

  const userName = localStorage.getItem("name") || "User";
  const userEmail = localStorage.getItem("email") || "";

  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleLogout = () => {
    localStorage.clear();

    toast.success("Logged out successfully!");

    navigate("/login");
  };

  return (
    <header className="h-20 topbar-bg flex items-center justify-between px-8">

      <div>
        <h1 className="text-3xl font-bold text-primary">
          Industrial Knowledge Dashboard
        </h1>

        <p className="mt-1 text-secondary">
          Welcome back, {userName} 👋
        </p>
      </div>

      <div className="flex items-center gap-6">

        <button className="rounded-xl p-3 icon-button">
          <Bell
            size={20}
            className="icon-primary"
          />
        </button>

        <div
          className="relative"
          ref={menuRef}
        >
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-cyan-500/10"
          >
            <UserCircle
              size={42}
              className="text-cyan-400"
            />

            <ChevronDown
              size={18}
              className="text-secondary"
            />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-theme card-bg p-4 shadow-2xl z-50">

              <div className="border-b border-theme pb-4">

                <h3 className="text-lg font-bold text-primary">
                  {userName}
                </h3>

                <p className="mt-1 text-sm text-secondary break-all">
                  {userEmail}
                </p>

              </div>

              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/settings");
                }}
                className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-cyan-500/10"
              >
                <Settings size={20} />

                Settings
              </button>

              <button
                onClick={handleLogout}
                className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-red-500 transition hover:bg-red-500/10"
              >
                <LogOut size={20} />

                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}

export default Topbar;