import AppLayout from "../../components/layout/AppLayout";
import UploadBox from "../../components/upload/UploadBox";
import DocumentList from "../../components/document/DocumentList";

function Upload() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl">

        <UploadBox />

        <div className="mt-10">
          <DocumentList />
        </div>

      </div>
    </AppLayout>
  );
}

export default Upload;