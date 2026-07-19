import GlobalFooter from '../components/GlobalFooter';
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, ClipboardList, 
  Database, TrendingUp, Bell, Map, FileText, Menu, X, 
  Settings, LogOut, CheckCircle2, AlertCircle, Calendar, MessageSquare, 
  BarChart3, BrainCircuit, Trophy, AlertTriangle, Activity, ShieldCheck, UserPlus, IndianRupee, CreditCard, FileEdit, CalendarCheck, UserCheck
} from 'lucide-react';

const AdminLayout = () => {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/auth/me', {
      headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
    })
      .then(res => res.json())
      .then(data => setAdminUser(data))
      .catch(() => handleLogout());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'AI Controls', path: '/admin/ai-controls', icon: <BrainCircuit className="w-5 h-5" /> },
    { name: 'Admissions', path: '/admin/admissions', icon: <UserPlus className="w-5 h-5" /> },
    { name: 'Institution Analytics', path: '/admin/analytics', icon: <TrendingUp className="w-5 h-5" /> },
    { name: 'Institution Intelligence', path: '/admin/intelligence', icon: <BrainCircuit className="w-5 h-5" /> },
    { name: 'Global Leaderboard', path: '/admin/leaderboard', icon: <Trophy className="w-5 h-5" /> },
    { name: 'Fees Management', path: '/admin/fees', icon: <IndianRupee className="w-5 h-5" /> },
    { name: 'Payments', path: '/admin/payments', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'Financial Analytics', path: '/admin/reports', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Students', path: '/admin/students', icon: <Users className="w-5 h-5" /> },
    { name: 'Teachers', path: '/admin/teachers', icon: <ShieldCheck className="w-5 h-5" /> },
    { name: 'Programs', path: '/admin/programs', icon: <ShieldCheck className="w-5 h-5" /> },
    { name: 'Materials', path: '/admin/materials', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Mock Tests', path: '/admin/mocktests', icon: <ClipboardList className="w-5 h-5" /> },
    { name: 'Question Bank', path: '/admin/questions', icon: <Database className="w-5 h-5" /> },
    { name: 'Results', path: '/admin/results', icon: <TrendingUp className="w-5 h-5" /> },
    { name: 'Announcements', path: '/admin/announcements', icon: <Bell className="w-5 h-5" /> },
    { name: 'Complaints', path: '/admin/complaints', icon: <AlertTriangle className="w-5 h-5" /> },
    { name: 'Behavior', path: '/admin/behavior', icon: <Activity className="w-5 h-5" /> },
    { name: 'Messages', path: '/admin/messages', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Attendance', path: '/admin/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
    { name: 'Teacher Attendance', path: '/admin/teacher-attendance', icon: <UserCheck className="w-5 h-5" /> },
    { name: 'Teacher Feedback', path: '/admin/teacher-feedback', icon: <UserCheck className="w-5 h-5" /> },
    { name: 'CMS', path: '/admin/cms', icon: <FileEdit className="w-5 h-5" /> }
  ];

  if (!adminUser) return <div className="h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col w-64 bg-slate-900 fixed h-full z-10 border-r border-slate-800`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-center flex-col">
          <ShieldCheck className="w-10 h-10 text-blue-500 mb-2" />
          <h2 className="text-xl font-black text-white text-center">Super Admin</h2>
        </div>
        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                    isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3 font-semibold text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center justify-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-bold text-sm">
            <LogOut className="w-5 h-5 mr-3" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-slate-900 border-b border-slate-800 z-50 flex justify-between items-center p-4">
        <h2 className="text-xl font-black text-white flex items-center"><ShieldCheck className="w-6 h-6 text-blue-500 mr-2" /> Super Admin</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-300 hover:text-white">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900 pt-16 flex flex-col">
          <nav className="space-y-1 px-4 py-6 flex-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-4 rounded-xl transition-all ${
                  location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'
                }`}
              >
                {item.icon}
                <span className="ml-3 font-semibold">{item.name}</span>
              </Link>
            ))}
            <button onClick={handleLogout} className="flex items-center justify-center w-full px-4 py-4 mt-4 text-red-400 bg-red-500/10 rounded-xl font-bold text-sm">
              <LogOut className="w-5 h-5 mr-3" /> Terminate Session
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen flex flex-col">
        {/* Topbar Desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-0 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">
            {menuItems.find(i => i.path === location.pathname)?.name || 'Admin Panel'}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">{adminUser.fullName}</p>
              <p className="text-xs text-slate-500 font-semibold">{adminUser.email}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200 text-blue-600 font-black">
              A
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6 lg:p-8 bg-slate-50 overflow-x-hidden min-w-0">
          <Outlet />
        </div>
        <GlobalFooter />
      </main>
    </div>
  );
};

export default AdminLayout;
