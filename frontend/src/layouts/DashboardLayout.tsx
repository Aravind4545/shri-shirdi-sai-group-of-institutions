import GlobalFooter from '../components/GlobalFooter';
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, 
  ClipboardList, TrendingUp, Bell, CalendarCheck, 
  Settings, LogOut, Menu, X, User, IndianRupee, BrainCircuit, Target, FileText, Award, BarChart2, MessageSquare, Trophy, AlertTriangle, UserCheck
} from 'lucide-react';

const DashboardLayout = () => {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/auth/me', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'My Profile', path: '/dashboard/profile', icon: <User className="w-5 h-5" /> },
    { name: 'Assignments', path: '/dashboard/assignments', icon: <Target className="w-5 h-5" /> },
    { name: 'Study Materials', path: '/dashboard/materials', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Mock Tests', path: '/dashboard/mocktests', icon: <FileText className="w-5 h-5" /> },
    { name: 'Test Results', path: '/dashboard/results', icon: <Award className="w-5 h-5" /> },
    { name: 'Topic Analytics', path: '/dashboard/analytics', icon: <BarChart2 className="w-5 h-5" /> },
    { name: 'Competition Analysis', path: '/dashboard/competition-analysis', icon: <TrendingUp className="w-5 h-5" /> },
    { name: 'AI Intelligence', path: '/dashboard/intelligence', icon: <BrainCircuit className="w-5 h-5" /> },
    { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: <Trophy className="w-5 h-5" /> },
    { name: 'Teacher Feedback', path: '/dashboard/teacher-feedback', icon: <UserCheck className="w-5 h-5" /> },
    { name: 'Messages', path: '/dashboard/messages', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Announcements', path: '/dashboard/announcements', icon: <Bell className="w-5 h-5" /> },
    { name: 'Complaints', path: '/dashboard/complaints', icon: <AlertTriangle className="w-5 h-5" /> },
    { name: 'Attendance', path: '/dashboard/attendance', icon: <CalendarCheck className="w-5 h-5" /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> }
  ];

  if (!user) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  // Determine theme colors based on program
  let themeColor = 'bg-brand-blue';
  let textColor = 'text-brand-blue';
  if (user.programInfo.program === 'Deekshya') { themeColor = 'bg-emerald-600'; textColor = 'text-emerald-600'; }
  if (user.programInfo.program === 'DAFNE') { themeColor = 'bg-slate-900'; textColor = 'text-slate-900'; }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-10`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-center">
          <h2 className={`text-2xl font-black ${textColor}`}>Sri Shirdi Sai</h2>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              if (item.name === 'Mock Tests' && user.programInfo.program === 'Deekshya') {
                return (
                  <a
                    key={item.name}
                    href="/Deekshya_NEET2026.html"
                    className={`flex items-center px-4 py-3 rounded-xl transition-colors text-gray-600 hover:bg-gray-50`}
                  >
                    {item.icon}
                    <span className="ml-3 font-semibold">{item.name}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                    isActive ? `${themeColor} text-white shadow-md` : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3 font-semibold">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-20 flex justify-between items-center p-4">
        <h2 className={`text-xl font-black ${textColor}`}>Sri Shirdi Sai</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-white pt-16 flex flex-col">
          <nav className="space-y-1 px-4 py-6 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              if (item.name === 'Mock Tests' && user.programInfo.program === 'Deekshya') {
                return (
                  <a
                    key={item.name}
                    href="/Deekshya_NEET2026.html"
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-4 rounded-xl transition-colors text-gray-600`}
                  >
                    {item.icon}
                    <span className="ml-3 font-semibold">{item.name}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-4 rounded-xl transition-colors ${
                    location.pathname === item.path ? `${themeColor} text-white` : 'text-gray-600'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3 font-semibold">{item.name}</span>
                </Link>
              );
            })}
            <button onClick={handleLogout} className="flex items-center w-full px-4 py-4 mt-4 text-red-600 rounded-xl font-bold">
              <LogOut className="w-5 h-5 mr-3" /> Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 sticky top-0 z-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {menuItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-gray-500 hover:text-gray-700 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center border-l pl-6 border-gray-200">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${themeColor}`}>
                {user.fullName.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-gray-800">{user.fullName}</p>
                <p className="text-xs font-semibold text-gray-500">{user.programInfo.program} - {user.programInfo.stream}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet context={{ user, themeColor, textColor, fetchProfile }} />
        </div>
        <GlobalFooter />
      </main>
    </div>
  );
};

export default DashboardLayout;
