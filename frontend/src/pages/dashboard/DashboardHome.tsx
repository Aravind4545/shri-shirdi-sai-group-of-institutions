import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BookOpen, ClipboardList, TrendingUp, CalendarCheck, Target, Award, BrainCircuit, Bell } from 'lucide-react';
import AASHVEECompanion from '../../components/AASHVEECompanion';

const DashboardHome = () => {
  const { user, themeColor, textColor } = useOutletContext<any>();
  const [stats, setStats] = useState({ testsCompleted: 0, averageScore: 0, attendancePercentage: 100, studyHours: 0 });
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/dashboard/stats', {
      headers: { 'x-auth-token': localStorage.getItem('token') || '' }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));

    fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/dashboard/announcements', {
      headers: { 'x-auth-token': localStorage.getItem('token') || '' }
    })
      .then(res => res.json())
      .then(data => {
        const fallback = [
          { _id: 'a1', title: 'Upcoming Parent-Teacher Meeting', content: 'PTM is scheduled for next Saturday.', date: new Date().toISOString(), priority: 'Medium' },
          { _id: 'a2', title: 'Holiday Notice', content: 'School will remain closed on Monday due to public holiday.', date: new Date().toISOString(), priority: 'High' }
        ];
        setAnnouncements(data && data.length > 0 ? data : fallback);
      })
      .catch(err => console.error(err));
  }, []);

  const renderProgramSpecificSection = () => {
    const p = user.programInfo.program;
    if (p === 'Lakshya') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <ClipboardList className="w-12 h-12 text-brand-blue mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Practice Tests</h3>
            <p className="text-sm text-gray-500 mt-2">Latest mock tests for JEE Main & Advanced</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <Award className="w-12 h-12 text-brand-gold mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Rank Analysis</h3>
            <p className="text-sm text-gray-500 mt-2">Compare performance with peers</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <BookOpen className="w-12 h-12 text-brand-blue mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Engineering Resources</h3>
            <p className="text-sm text-gray-500 mt-2">Study materials and physics lectures</p>
          </div>
        </div>
      );
    }
    
    if (p === 'Deekshya') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <ClipboardList className="w-12 h-12 text-emerald-500 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Medical Practice Tests</h3>
            <p className="text-sm text-gray-500 mt-2">NEET Grand Tests and subject-wise exams</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <BrainCircuit className="w-12 h-12 text-teal-500 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Biology Resources</h3>
            <p className="text-sm text-gray-500 mt-2">Botany & Zoology in-depth notes</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <Target className="w-12 h-12 text-emerald-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">NEET Analysis</h3>
            <p className="text-sm text-gray-500 mt-2">Track your subject weaknesses</p>
          </div>
        </div>
      );
    }

    if (p === 'DAFNE') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <BookOpen className="w-12 h-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Current Affairs</h3>
            <p className="text-sm text-gray-500 mt-2">Daily & Monthly CA magazines</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <Award className="w-12 h-12 text-slate-800 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Personality Development</h3>
            <p className="text-sm text-gray-500 mt-2">Communication & leadership modules</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <ClipboardList className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">Civil Services Resources</h3>
            <p className="text-sm text-gray-500 mt-2">UPSC Foundation notes and tests</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <AASHVEECompanion />
      
      {/* Announcements Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 text-gray-800 flex flex-col md:flex-row items-start justify-between shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start gap-4 md:gap-6 text-left mb-4 md:mb-0 w-full md:w-3/4">
          <div className="bg-gray-100 p-4 rounded-full flex-shrink-0 mx-auto md:mx-0">
            <Bell className="w-8 h-8 text-gray-500" />
          </div>
          <div className="w-full text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              {user.companionSettings?.studentNickname || 'Student'}, here are your latest announcements
            </h2>
            {announcements.length > 0 ? (
              <div className="space-y-3">
                {announcements.slice(0, 2).map((ann: any) => {
                  let priorityColor = 'bg-blue-50 border-blue-100 text-blue-800';
                  let priorityDot = 'bg-blue-500';
                  if (ann.priority === 'High' || ann.priority === 'Urgent') {
                    priorityColor = 'bg-red-50 border-red-100 text-red-900';
                    priorityDot = 'bg-red-500';
                  } else if (ann.priority === 'Medium') {
                    priorityColor = 'bg-amber-50 border-amber-100 text-amber-900';
                    priorityDot = 'bg-amber-500';
                  }

                  return (
                    <div key={ann._id} className={`px-5 py-4 rounded-2xl border text-left ${priorityColor}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${priorityDot}`}></div>
                        <h4 className="font-bold text-sm md:text-base">{ann.title}</h4>
                      </div>
                      <p className="text-xs md:text-sm mt-1 opacity-90 ml-4">{ann.content}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No new announcements at the moment. Keep studying!</p>
            )}
            
            <p className="mt-4 text-sm font-semibold text-gray-400 italic">
              - {user.companionSettings?.companionName || 'Companion'}
            </p>
          </div>
        </div>
        <div className="relative z-10 bg-gray-50 px-6 py-6 rounded-2xl border border-gray-100 text-center hidden md:flex flex-col items-center justify-center min-w-[180px]">
          <p className="text-xs font-black uppercase tracking-widest mb-3 text-gray-500">Exam Targets</p>
          <div className="flex flex-col gap-2 w-full">
            {user.programInfo.exams && user.programInfo.exams.length > 0 ? (
              user.programInfo.exams.map((exam: string) => (
                <span key={exam} className={`text-white px-4 py-2 rounded-full text-xs font-black shadow-sm ${themeColor}`}>{exam}</span>
              ))
            ) : (
              <span className={`text-white px-4 py-2 rounded-full text-xs font-black shadow-sm ${themeColor}`}>Foundation Services</span>
            )}
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Progress Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className={`p-4 rounded-xl ${themeColor} shadow-md mr-4`}>
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold">Tests Completed</p>
              <p className="text-2xl font-black text-gray-800">{stats.testsCompleted}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className={`p-4 rounded-xl ${themeColor} shadow-md mr-4`}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold">Study Hours</p>
              <p className="text-2xl font-black text-gray-800">{stats.studyHours}h</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className={`p-4 rounded-xl ${themeColor} shadow-md mr-4`}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold">Average Score</p>
              <p className="text-2xl font-black text-gray-800">{stats.averageScore}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className={`p-4 rounded-xl ${themeColor} shadow-md mr-4`}>
              <CalendarCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold">Attendance</p>
              <p className="text-2xl font-black text-gray-800">{stats.attendancePercentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Program Specific Sections */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Program Quick Access</h3>
        {renderProgramSpecificSection()}
      </div>

    </div>
  );
};

export default DashboardHome;
