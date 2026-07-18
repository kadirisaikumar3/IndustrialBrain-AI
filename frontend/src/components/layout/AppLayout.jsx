import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen page-bg">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Topbar />

        <main className="flex-1 p-10 page-bg">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AppLayout;