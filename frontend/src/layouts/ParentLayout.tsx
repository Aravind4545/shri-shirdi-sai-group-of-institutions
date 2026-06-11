import GlobalFooter from '../components/GlobalFooter';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, LogOut, Menu, X, CheckCircle2
} from 'lucide-react';
import { useState } from 'react';

const ParentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Parent Dashboard', path: '/parent/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex fixed h-full z-10">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white tracking-tight">SSSI <span className="text-blue-500">Parent</span></h2>
          <p className="text-xs text-slate-500 font-medium tracking-widest mt-1 uppercase">Portal</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all font-semibold text-sm"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="md:hidden fixed top-0 w-full bg-slate-900 text-white z-50 flex items-center justify-between p-4 shadow-md">
        <div>
          <h2 className="font-bold">SSSI <span className="text-blue-500">Parent</span></h2>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-40 pt-20 px-4 pb-6 flex flex-col">
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all font-bold ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-300'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-4 text-rose-400 font-bold mt-4 border-t border-slate-800"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 bg-slate-50 min-h-screen pt-16 md:pt-0">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
        <GlobalFooter />
      </main>
    </div>
  );
};

export default ParentLayout;



