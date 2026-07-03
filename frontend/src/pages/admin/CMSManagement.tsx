const CMSManagement = () => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Content Management System</h2>
      <p className="text-slate-500 mb-8 max-w-lg mx-auto">Manage homepage content, program descriptions, and hero banners dynamically from this interface.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div className="p-6 border rounded-2xl hover:border-blue-500 cursor-pointer transition-colors">
          <h3 className="font-bold text-lg mb-2">Homepage Editor</h3>
          <p className="text-sm text-slate-500">Edit main landing page hero, about, and highlights.</p>
        </div>
        <div className="p-6 border rounded-2xl hover:border-blue-500 cursor-pointer transition-colors">
          <h3 className="font-bold text-lg mb-2">IIT Editor</h3>
          <p className="text-sm text-slate-500">Edit Engineering program details and features.</p>
        </div>
        <div className="p-6 border rounded-2xl hover:border-blue-500 cursor-pointer transition-colors">
          <h3 className="font-bold text-lg mb-2">NEET Editor</h3>
          <p className="text-sm text-slate-500">Edit Medical program details and features.</p>
        </div>
        <div className="p-6 border rounded-2xl hover:border-blue-500 cursor-pointer transition-colors">
          <h3 className="font-bold text-lg mb-2">UPSC Editor</h3>
          <p className="text-sm text-slate-500">Edit Civil Services program details and features.</p>
        </div>
      </div>
      <div className="mt-8 inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-bold border border-amber-200">
        Note: CMS visual editor integration is a premium feature and is currently in development mock mode.
      </div>
    </div>
  );
};

export default CMSManagement;
