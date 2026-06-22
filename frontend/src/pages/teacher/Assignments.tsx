import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, FileText, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Assignments = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    program: 'Lakshya',
    stream: 'MPC',
    dueDate: '',
    maxMarks: 100
  });
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/assignments/teacher', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        const data = await res.json();
        setAssignments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('instructions', formData.instructions);
    data.append('program', formData.program);
    data.append('stream', formData.stream);
    data.append('dueDate', formData.dueDate);
    data.append('maxMarks', formData.maxMarks.toString());
    
    files.forEach(file => {
      data.append('files', file);
    });

    try {
      const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/assignments/create', {
        method: 'POST',
        headers: { 'x-auth-token': localStorage.getItem('token') || '' },
        body: data
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({
          title: '', description: '', instructions: '', program: 'Lakshya', stream: 'MPC', dueDate: '', maxMarks: 100
        });
        setFiles([]);
        fetchAssignments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading assignments...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Assignment Management</h1>
          <p className="text-slate-500">Create and grade assignments for your students</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Assignment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {assignments.map(assignment => (
          <div key={assignment._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                new Date(assignment.dueDate) > new Date() ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
              }`}>
                {new Date(assignment.dueDate) > new Date() ? 'Active' : 'Past Due'}
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">{assignment.title}</h3>
            <p className="text-sm text-slate-500 mb-4">{assignment.program} - {assignment.stream}</p>
            
            <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-4">
              <div className="flex items-center gap-1 text-slate-600">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>{assignment.totalSubmissions} Subs</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{assignment.pendingEvals} to grade</span>
              </div>
            </div>

            <Link 
              to={`/teacher/assignments/${assignment._id}`}
              className="mt-4 w-full block text-center bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-2 rounded-xl transition-colors border border-slate-200"
            >
              View Submissions
            </Link>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-800">Create New Assignment</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assignment Title *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" rows={3}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Program *</label>
                  <select value={formData.program} onChange={e => setFormData({...formData, program: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none">
                    <option>Lakshya</option>
                    <option>Deekshya</option>
                    <option>DAFNE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stream *</label>
                  <input type="text" value={formData.stream} onChange={e => setFormData({...formData, stream: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date *</label>
                  <input required type="datetime-local" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max Marks *</label>
                  <input required type="number" value={formData.maxMarks} onChange={e => setFormData({...formData, maxMarks: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Upload Reference Materials (PDF, DOCX, PPT)</label>
                  <input type="file" multiple onChange={e => {
                    if (e.target.files) setFiles(Array.from(e.target.files));
                  }} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl">Create Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
