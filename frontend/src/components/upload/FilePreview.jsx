import React from "react";
import {
  FileText,
  Image,
  File,
} from "lucide-react";

function FilePreview({ file }) {
  if (!file) return null;

  const isImage =
    file.type?.startsWith("image/");

  const getIcon = () => {
    if (isImage) {
      return (
        <Image
          size={28}
          className="text-green-500"
        />
      );
    }

    if (file.type === "application/pdf") {
      return (
        <FileText
          size={28}
          className="text-red-500"
        />
      );
    }

    return (
      <File
        size={28}
        className="text-cyan-500"
      />
    );
  };

  return (
    <div className="card-bg rounded-3xl border border-theme p-5 shadow-xl">

      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
          {getIcon()}
        </div>

        <div className="min-w-0 flex-1">

          <h3 className="truncate text-lg font-semibold text-primary">
            {file.name}
          </h3>

          <p className="mt-1 text-sm text-secondary">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>

          <p className="mt-1 text-xs text-secondary">
            {file.type}
          </p>

        </div>

      </div>

      {isImage && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-theme">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="max-h-72 w-full object-contain"
          />
        </div>
      )}

    </div>
  );
}

export default FilePreview;