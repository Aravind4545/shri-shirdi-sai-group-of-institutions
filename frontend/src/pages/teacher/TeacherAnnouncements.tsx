import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Megaphone, Calendar, Users, X, Info } from 'lucide-react';

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  targetProgram: 'All' | 'Lakshya' | 'Deekshya' | 'DAFNE';
  priority: 'Low' | 'Medium' | 'High';
  date: string;
  status: 'Active' | 'Expired';
}

const TeacherAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetProgram, setTargetProgram] = useState<'All' | 'Lakshya' | 'Deekshya' | 'DAFNE'>('All');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');

  useEffect(() => {
    // Initial Mock Data
    const initialAnnouncements: AnnouncementItem[] = [
      {
        id: '1',
        title: 'Physics Weekly Mock Test Syllabus Update',
        content: 'The syllabus for the upcoming Weekly Mock Test 4 has been adjusted. Mechanics will now cover Circular Motion and Rotation only. Electrostatics is moved to next week.',
        targetProgram: 'Lakshya',
        priority: 'High',
        date: '2026-06-15',
        status: 'Active'
      },
      {
        id: '2',
        title: 'Special Guest Lecture: NEET Strategy Session',
        content: 'All Deekshya (Medical) program students are required to attend the NEET Strategy & Preparation workshop tomorrow at 2:00 PM in the Main Seminar Hall.',
        targetProgram: 'Deekshya',
        priority: 'Medium',
        date: '2026-06-14',
        status: 'Active'
      },
      {
        id: '3',
        title: 'Current Affairs Booklet: May Edition Released',
        content: 'The Monthly Current Affairs magazine for DAFNE (UPSC) program has been uploaded to the Study Materials section. Please download and start reading.',
        targetProgram: 'DAFNE',
        priority: 'Low',
        date: '2026-06-12',
        status: 'Active'
      },
      {
        id: '4',
        title: 'College Annual Sports Meet Notice',
        content: 'Sri Shirdi Sai Institutions is conducting the Annual Sports Meet selection this Friday. Interested students can register their names with the sports coordinator.',
        targetProgram: 'All',
        priority: 'Low',
        date: '2026-06-10',
        status: 'Active'
      },
      {
        id: '5',
        title: 'Holiday Notice: Public Holiday next Monday',
        content: 'The college will remain closed on Monday, 22nd June due to the public holiday. Regular classes will resume on Tuesday.',
        targetProgram: 'All',
        priority: 'Medium',
        date: '2026-06-08',
        status: 'Active'
      }
    ];
    setAnnouncements(initialAnnouncements);
  }, []);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newAnnouncement: AnnouncementItem = {
      id: Date.now().toString(),
      title,
      content,
      targetProgram,
      priority,
      date: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);
    
    // Clear inputs
    setTitle('');
    setContent('');
    setTargetProgram('All');
    setPriority('Low');
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }
  };

  // Stats
  const totalCount = announcements.length;
  const activeCount = announcements.filter(a => a.status === 'Active').length;
  const highPriorityCount = announcements.filter(a => a.priority === 'High').length;
  const targetSplit = {
    All: announcements.filter(a => a.targetProgram === 'All').length,
    Lakshya: announcements.filter(a => a.targetProgram === 'Lakshya').length,
    Deekshya: announcements.filter(a => a.targetProgram === 'Deekshya').length,
    DAFNE: announcements.filter(a => a.targetProgram === 'DAFNE').length
  };

  return (
    <div className="space-y-6">
      {/* Upper Banner */}
      <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Announcements Management</h2>
          <p className="text-slate-400 text-sm mt-1">Broadcast reminders, schedule changes, and notices to target student programs.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-3 rounded-xl transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Publish Notice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl">
            <Megaphone className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Notices</p>
            <h4 className="text-2xl font-black text-slate-800">{totalCount}</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <Bell className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Broadcasts</p>
            <h4 className="text-2xl font-black text-slate-800">{activeCount}</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-xl">
            <Info className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">High Priority</p>
            <h4 className="text-2xl font-black text-slate-800">{highPriorityCount}</h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl">
            <Users className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Audience Mix</p>
            <p className="text-xxs font-black text-slate-600">L:{targetSplit.Lakshya} | D:{targetSplit.Deekshya} | DF:{targetSplit.DAFNE} | A:{targetSplit.All}</p>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map(a => {
            let priorityBadge = 'bg-blue-50 text-blue-800 border-blue-100';
            if (a.priority === 'High') {
              priorityBadge = 'bg-rose-50 text-rose-800 border-rose-100';
            } else if (a.priority === 'Medium') {
              priorityBadge = 'bg-amber-50 text-amber-800 border-amber-100';
            }

            let programBadge = 'bg-slate-100 text-slate-800';
            if (a.targetProgram === 'Lakshya') programBadge = 'bg-blue-50 text-blue-700 border border-blue-100';
            if (a.targetProgram === 'Deekshya') programBadge = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
            if (a.targetProgram === 'DAFNE') programBadge = 'bg-amber-50 text-amber-700 border border-amber-100';

            return (
              <div key={a.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                <div className="space-y-2 flex-1 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 border rounded-lg text-xxs font-black tracking-wider uppercase ${programBadge}`}>
                      {a.targetProgram}
                    </span>
                    <span className={`px-2 py-0.5 border rounded-lg text-xxs font-black tracking-wider uppercase ${priorityBadge}`}>
                      {a.priority} Priority
                    </span>
                    <div className="flex items-center text-slate-400 gap-1 ml-auto md:ml-0">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xxs font-bold">{a.date}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{a.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-4xl">{a.content}</p>
                </div>
                
                <div className="border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 w-full md:w-auto flex justify-end">
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all cursor-pointer"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-sm text-slate-400 font-medium italic">
            No announcements published yet. Click "Publish Notice" above to start.
          </div>
        )}
      </div>

      {/* Publish Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Publish New Notice</h3>
                  <p className="text-xxs text-slate-400 uppercase tracking-widest font-black">Announcements Broadcast</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Notice Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Inorganic Chemistry Exam Postponed"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Notice Content</label>
                <textarea
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Type the full announcement content here for students to read..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 text-sm font-medium transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Audience</label>
                  <select
                    value={targetProgram}
                    onChange={e => setTargetProgram(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="All">All Programs</option>
                    <option value="Lakshya">Lakshya Students</option>
                    <option value="Deekshya">Deekshya Students</option>
                    <option value="DAFNE">DAFNE Students</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Priority Level</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md cursor-pointer text-sm"
              >
                Broadcast Notice
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAnnouncements;
