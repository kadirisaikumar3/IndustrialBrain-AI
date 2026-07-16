import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { useParams } from "react-router-dom";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";




pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PDFViewer() {

  const { id } = useParams();

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const [previewUrl, setPreviewUrl] = useState("");

  const [isImage, setIsImage] = useState(false);

  useEffect(() => {

    async function loadDocument() {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/dashboard/documents`
      );

      const documents = await response.json();

      const doc = documents.find(
        d => d.id === Number(id)
      );

      if (!doc) return;

      setPreviewUrl(
        `${import.meta.env.VITE_API_URL}/dashboard/preview/${id}`
      );

      setIsImage(
        doc.fileType?.startsWith("image/")
      );

    }

    loadDocument();

  }, [id]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error) {
    console.error(error);
  }

  return (

    <div className="flex min-h-screen bg-slate-900">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <main className="p-8">

          <div className="mx-auto max-w-6xl">

            <h1 className="text-4xl font-bold text-white">
              📄 Document Preview
            </h1>

            <div className="mt-8 rounded-2xl bg-slate-800 p-6">

              {!isImage && (

                <div className="mb-6 flex items-center justify-between">

                  <button
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(p => p - 1)}
                    className="rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-slate-900 disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="text-lg text-white">
                    Page {pageNumber} / {numPages}
                  </span>

                  <button
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber(p => p + 1)}
                    className="rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-slate-900 disabled:opacity-40"
                  >
                    Next
                  </button>

                </div>

              )}

              <div className="flex justify-center overflow-auto rounded-xl bg-slate-900 p-6">

                {isImage ? (

                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-[800px] rounded-xl"
                  />

                ) : (

                  <Document
                    file={previewUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <p className="text-white text-xl">
                        Loading PDF...
                      </p>
                    }
                  >

                    <Page
                      pageNumber={pageNumber}
                      width={900}
                    />

                  </Document>

                )}

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>

  );

}

export default PDFViewer;