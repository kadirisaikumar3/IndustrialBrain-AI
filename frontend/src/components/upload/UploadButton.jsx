import { Upload } from "lucide-react";

function UploadButton({ onFileSelect }) {
  return (
    <>
      <input
        id="file-upload"
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files)}
      />

      <label
        htmlFor="file-upload"
        className="
          inline-flex
          items-center
          justify-center
          gap-3
          mt-6
          rounded-xl
          bg-gradient-to-r
          from-cyan-500
          to-blue-600
          px-8
          py-4
          text-lg
          font-semibold
          text-primary
          cursor-pointer
          shadow-xl
          transition-all
          duration-300
          hover:scale-[1.03]
          hover:shadow-2xl
          active:scale-95
        "
      >
        <Upload size={22} />
        Choose Files
      </label>
    </>
  );
}

export default UploadButton;