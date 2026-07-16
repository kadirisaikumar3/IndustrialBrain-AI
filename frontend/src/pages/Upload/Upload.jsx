import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import UploadBox from "../../components/upload/UploadBox";

import DocumentList from "../../components/document/DocumentList";

function Upload() {
  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <div className="mx-auto max-w-6xl">

            <UploadBox />

            <div className="mt-10">
              <DocumentList />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Upload;