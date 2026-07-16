function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-6 mt-20">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-slate-400 text-sm">
          © 2026 IndustrialBrain AI. All Rights Reserved.
        </p>

        <div className="flex gap-6 text-slate-400 text-sm">
          <a href="#" className="hover:text-cyan-400 transition">
            Documentation
          </a>

          <a href="#" className="hover:text-cyan-400 transition">
            GitHub
          </a>

          <a href="#" className="hover:text-cyan-400 transition">
            Contact
          </a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;