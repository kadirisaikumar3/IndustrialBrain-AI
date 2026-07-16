import { Bell, Search, UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Topbar() {
  const navigate = useNavigate();

const handleLogout = () => {

  localStorage.removeItem("token");

  toast.success("Logged out successfully!");

  navigate("/login");

};
  return (
    <header className="h-20 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Industrial Knowledge Dashboard
        </h1>

        <p className="text-slate-400 mt-1">
          Welcome back, Saikumar 👋
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-xl">
          <Search
            size={20}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-white placeholder:text-slate-400 w-52"
          />
        </div>

        <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition">
          <Bell
            size={20}
            className="text-white"
          />
        </button>

        <div className="flex items-center gap-4">

  <UserCircle
    size={42}
    className="text-cyan-400"
  />

  <button
    onClick={handleLogout}
    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-medium transition"
  >
    <LogOut size={18} />
    Logout
  </button>

</div>
      </div>
    </header>
  );
}

export default Topbar;