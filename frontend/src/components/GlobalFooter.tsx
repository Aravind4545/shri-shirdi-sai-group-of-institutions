const GlobalFooter = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-4 px-8 flex justify-between items-center text-xs text-slate-400 font-medium">
      <span>© 2024 Aashvee Tech Solutions Pvt Ltd. All rights reserved.</span>
      <span className="flex gap-4">
        <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
      </span>
    </footer>
  );
};

export default GlobalFooter;
