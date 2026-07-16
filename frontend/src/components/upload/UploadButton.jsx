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
          px-8
          py-4
          mt-6
          rounded-xl
          bg-cyan-500
          hover:bg-cyan-400
          text-slate-900
          text-lg
          font-bold
          cursor-pointer
          transition-all
          duration-300
          hover:scale-105
          shadow-lg
        "
      >
        Choose Files
      </label>
    </>
  );
}

export default UploadButton;