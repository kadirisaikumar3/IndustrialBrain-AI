import { useState } from "react";
import {
  UploadCloud,
  FileText,
  Image,
  X,
  Upload,
  Loader2,
} from "lucide-react";

import { toast } from "react-toastify";
import API from "../../services/api";

function UploadBox() {

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // ===========================
  // Select Files
  // ===========================

  const handleFileSelect = (event) => {

    if (isUploading) return;

    const files = Array.from(event.target.files);

    setSelectedFiles((prev) => [...prev, ...files]);
  };

  // ===========================
  // Drag Over
  // ===========================

  const handleDragOver = (event) => {
    event.preventDefault();

    if (!isUploading) {
      setIsDragging(true);
    }
  };

  // ===========================
  // Drag Leave
  // ===========================

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // ===========================
  // Drop Files
  // ===========================

  const handleDrop = (event) => {

    event.preventDefault();

    if (isUploading) return;

    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files);

    setSelectedFiles((prev) => [...prev, ...files]);
  };

  // ===========================
  // Remove File
  // ===========================

  const removeFile = (indexToRemove) => {

    if (isUploading) return;

    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // ===========================
  // Upload Files
  // ===========================

  const handleUpload = async () => {

    if (isUploading) return;

    if (selectedFiles.length === 0) {
      toast.warning("Please select at least one file.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first.");
      return;
    }

    try {

      setIsUploading(true);
      setUploadProgress(0);

      let uploaded = 0;

      for (const file of selectedFiles) {

        const formData = new FormData();

        formData.append("file", file);

        await API.post(
          "/dashboard/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        uploaded++;

        setUploadProgress(
          Math.round(
            (uploaded / selectedFiles.length) * 100
          )
        );
      }

      toast.success("Files uploaded successfully!");

      setSelectedFiles([]);
      setUploadProgress(0);

    } catch (error) {

      console.error(error);

      toast.error("Upload failed. Please try again.");

      setUploadProgress(0);

    } finally {

      setIsUploading(false);

    }
  };

    return (

    <div className="max-w-6xl mx-auto">

      {/* Page Heading */}

      <h1 className="text-4xl font-bold text-primary">
        Upload Industrial Documents
      </h1>

      <p className="mt-3 text-lg text-secondary">
        Upload maintenance manuals, SOPs, inspection reports and engineering
        documents for AI-powered analysis.
      </p>

      {/* Upload Area */}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mt-10 rounded-3xl border-2 border-dashed px-12 py-16 shadow-xl transition-all duration-300 ${
          isDragging
            ? "border-cyan-300 card-bg scale-[1.02]"
            : "border-cyan-500 card-bg hover:border-cyan-400 hover:shadow-cyan-500/20"
        }`}
      >

        <div className="flex flex-col items-center text-center">

          <UploadCloud
            size={90}
            className={`mb-8 ${
              isDragging
                ? "text-cyan-300"
                : "text-cyan-400"
            }`}
          />

          <h2 className="text-5xl font-bold text-primary">

            {isDragging
              ? "Drop Files Here"
              : "Drag & Drop Files Here"}

          </h2>

          <p className="mt-3 text-2xl text-secondary">
            OR
          </p>

          <input
            id="file-upload"
            type="file"
            multiple
            disabled={isUploading}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileSelect}
          />

          <label
            htmlFor="file-upload"
            className={`mt-6 rounded-xl px-8 py-3 text-lg font-semibold transition duration-300

              ${
                isUploading

                  ? "cursor-not-allowed bg-slate-600 text-slate-300"

                  : "cursor-pointer bg-cyan-500 text-slate-900 hover:scale-105 hover:bg-cyan-400"

              }`}
          >

            {isUploading
              ? "Uploading..."
              : "Choose Files"}

          </label>

          <p className="mt-6 text-lg text-secondary">

            Supported Files:

            <span className="font-semibold text-cyan-400">

              {" "}PDF • DOCX • PNG • JPG

            </span>

          </p>

          <p className="mt-2 text-sm text-secondary">

            Maximum file size: 20 MB

          </p>

        </div>

      </div>


            {/* Selected Files */}

      {selectedFiles.length > 0 && (

        <div className="mt-8 rounded-2xl bg-slate-800 p-6 shadow-lg">

          <h2 className="mb-5 text-3xl font-bold text-primary">
            Selected Files
          </h2>

          <div className="space-y-4">

            {selectedFiles.map((file, index) => (

              <div
                key={index}
                className="flex items-center justify-between rounded-xl bg-slate-700 p-4 transition hover:bg-slate-600"
              >

                <div className="flex items-center gap-4">

                  {file.type.startsWith("image") ? (

                    <Image
                      size={32}
                      className="text-cyan-400"
                    />

                  ) : (

                    <FileText
                      size={32}
                      className="text-cyan-400"
                    />

                  )}

                  <div>

                    <p className="font-semibold text-primary break-all">
                      {file.name}
                    </p>

                    <p className="text-sm text-secondary">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>

                  </div>

                </div>

                <button
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                  className={`rounded-full p-2 transition

                    ${
                      isUploading

                        ? "cursor-not-allowed text-slate-500"

                        : "text-red-400 hover:bg-red-500 hover:text-white"

                    }`}
                >

                  <X size={22} />

                </button>

              </div>

            ))}

          </div>

          {/* Upload Progress */}

          {uploadProgress > 0 && (

            <div className="mt-6">

              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm text-secondary">
                  Upload Progress
                </span>

                <span className="font-semibold text-cyan-400">
                  {uploadProgress}%
                </span>

              </div>

              <div className="h-4 w-full overflow-hidden rounded-full bg-slate-700">

                <div
                  className="h-4 rounded-full bg-cyan-400 transition-all duration-500"
                  style={{
                    width: `${uploadProgress}%`,
                  }}
                />

              </div>

              <p className="mt-3 text-center font-semibold text-cyan-400">

                Uploading documents...

              </p>

            </div>

          )}
          {/* Upload Button */}

          <div className="mt-8 flex justify-end">

            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`flex items-center gap-3 rounded-xl px-8 py-4 text-lg font-semibold transition-all duration-300

                ${
                  isUploading
                    ? "cursor-not-allowed bg-slate-600 text-slate-300"
                    : "bg-cyan-500 text-slate-900 hover:scale-105 hover:bg-cyan-400"
                }`}
            >

              {isUploading ? (

                <>
                  <Loader2
                    size={22}
                    className="animate-spin"
                  />

                  Uploading...
                </>

              ) : (

                <>
                  <Upload size={22} />

                  Upload Files
                </>

              )}

            </button>

          </div>

        </div>

      )}

    </div>

  );
}

export default UploadBox;