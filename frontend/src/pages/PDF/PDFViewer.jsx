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

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/dashboard/documents`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load documents");
        }

        const documents = await response.json();

        const doc = documents.find(
          d => d.id === Number(id)
        );

        if (!doc) return;

        if (doc.fileType?.startsWith("image/")) {

          setIsImage(true);

          // Use Cloudinary URL directly
          setPreviewUrl(doc.filePath);

        } else {

          setIsImage(false);

          // PDFs still go through backend
          setPreviewUrl(
            `${import.meta.env.VITE_API_URL}/dashboard/preview/${id}`
          );

        }

      }
      catch (err) {

        console.error(err);

      }

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

    <div className="flex min-h-screen card-bg">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <main className="p-8">

          <div className="mx-auto max-w-6xl">

            <h1 className="text-4xl font-bold text-primary">
              📄 Document Preview
            </h1>

            <div className="mt-8 rounded-2xl card-bg p-6">

              {!isImage && (

                <div className="mb-6 flex items-center justify-between">

                  <button
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(p => p - 1)}
                    className="rounded-lg bg-cyan-500 px-5 py-2 font-semibold card-bg disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="text-lg text-primary">
                    Page {pageNumber} / {numPages}
                  </span>

                  <button
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber(p => p + 1)}
                    className="rounded-lg bg-cyan-500 px-5 py-2 font-semibold card-bg disabled:opacity-40"
                  >
                    Next
                  </button>

                </div>

              )}

              <div className="flex justify-center overflow-auto rounded-xl card-bg p-6">

                {isImage ? (

                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-[800px] rounded-xl"
                  />

                ) : (

                  <Document
                    file={{
                      url: previewUrl,
                      httpHeaders: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                      }
                    }}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <p className="text-primary text-xl">
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