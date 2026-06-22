import { useState, useEffect } from 'react';
import { Users, ClipboardList, BookOpen, FileEdit, Bell } from 'lucide-react';

const TeacherDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchStats();
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/teacher/dashboard', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) setStats(await res.json());
    } catch (err) { console.error(err); }
  };

  if (!stats || !user) return <div className="p-8 font-bold text-slate-500">Loading Dashboard...</div>;

  const cards = [
    { title: 'My Students', value: stats.totalStudents, icon: <Users className="w-8 h-8 text-emerald-500" />, bg: 'bg-emerald-50' },
    { title: 'Attendance', value: `${stats.attendancePercentage}%`, icon: <ClipboardList className="w-8 h-8 text-blue-500" />, bg: 'bg-blue-50' },
    { title: 'Tests Conducted', value: stats.testsConducted, icon: <FileEdit className="w-8 h-8 text-rose-500" />, bg: 'bg-rose-50' },
    { title: 'Study Materials', value: stats.studyMaterialsUploaded, icon: <BookOpen className="w-8 h-8 text-amber-500" />, bg: 'bg-amber-50' },
    { title: 'Announcements', value: stats.announcementsPosted, icon: <Bell className="w-8 h-8 text-purple-500" />, bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-emerald-800 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden flex justify-between items-center">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2">Welcome, {user.fullName}</h2>
          <p className="text-emerald-200 font-medium">Manage your assigned students, track performance, and share resources easily.</p>
        </div>
        <div className="relative z-10 bg-emerald-900/50 p-6 rounded-2xl border border-emerald-700/50 text-right backdrop-blur-md">
          <p className="text-emerald-200 text-sm font-bold uppercase tracking-wider mb-1">Assigned Module</p>
          <h3 className="text-3xl font-black text-white">{user.programInfo?.assignedProgram || user.assignedProgram || 'All Programs'}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-full ${c.bg} mb-4`}>
              {c.icon}
            </div>
            <h3 className="text-3xl font-black text-slate-800 font-mono mb-1">{c.value}</h3>
            <p className="text-sm font-bold text-slate-500">{c.title}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h3>
        <p className="text-slate-500 italic text-sm">No recent activity found. Publish a test or share a material to see it here.</p>
      </div>
    </div>
  );
};

export default TeacherDashboard;
