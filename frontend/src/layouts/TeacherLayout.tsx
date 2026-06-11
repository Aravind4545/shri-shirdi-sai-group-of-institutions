import GlobalFooter from '../components/GlobalFooter';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, ClipboardList, 
  Bell, FileEdit, LogOut, MessageSquare, BarChart3, BrainCircuit, Trophy, AlertTriangle, Activity, UserCheck
} from 'lucide-react';

const TeacherLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Assignments', path: '/teacher/assignments', icon: <FileEdit className="w-5 h-5" /> },
    { name: 'My Students', path: '/teacher/students', icon: <Users className="w-5 h-5" /> },
    { name: 'Attendance', path: '/teacher/attendance', icon: <ClipboardList className="w-5 h-5" /> },
    { name: 'Mock Tests', path: '/teacher/mocktests', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Study Materials', path: '/teacher/materials', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Topic Analytics', path: '/teacher/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'AI Intelligence', path: '/teacher/intelligence', icon: <BrainCircuit className="w-5 h-5" /> },
    { name: 'Leaderboard', path: '/teacher/leaderboard', icon: <Trophy className="w-5 h-5" /> },
    { name: 'Announcements', path: '/teacher/announcements', icon: <Bell className="w-5 h-5" /> },
    { name: 'Messages', path: '/teacher/messages', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Complaints', path: '/teacher/complaints', icon: <AlertTriangle className="w-5 h-5" /> },
    { name: 'Behavior', path: '/teacher/behavior', icon: <Activity className="w-5 h-5" /> },
    { name: 'Teacher Feedback', path: '/teacher/teacher-feedback', icon: <UserCheck className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex fixed h-full z-10">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white tracking-tight">SSSI <span className="text-emerald-500">Teacher</span></h2>
          <p className="text-xs text-slate-500 font-medium tracking-widest mt-1 uppercase">Portal</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path 
                  ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-900/50' 
                  : 'hover:bg-slate-800 hover:text-white font-medium'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-rose-500 hover:text-white transition-colors text-slate-400 font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-8 justify-between sticky top-0 z-10">
          <h1 className="text-lg font-bold text-slate-800">
            {menuItems.find(m => m.path === location.pathname)?.name || 'Teacher Portal'}
          </h1>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-slate-700">Teacher Profile</p>
               <p className="text-xs text-emerald-600 font-bold">Active</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
               T
             </div>
          </div>
        </header>
        
        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
        <GlobalFooter />
      </main>
    </div>
  );
};

export default TeacherLayout;
