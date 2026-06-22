import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, CheckCircle, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/assignments/student', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        const data = await res.json();
        const fallback = [
          { _id: 'as1', title: 'Calculus Worksheet 4', subject: 'Mathematics', dueDate: new Date(Date.now() + 86400000).toISOString(), status: 'Pending', type: 'Homework' },
          { _id: 'as2', title: 'Physics Lab Report', subject: 'Physics', dueDate: new Date(Date.now() - 86400000).toISOString(), status: 'Completed', type: 'Lab' }
        ];
        setAssignments(data && data.length > 0 ? data : fallback);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(a => filter === 'All' || a.submissionStatus === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Submitted': return 'bg-emerald-100 text-emerald-700';
      case 'Graded': return 'bg-purple-100 text-purple-700';
      case 'Late': return 'bg-amber-100 text-amber-700';
      case 'Overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Submitted': return <CheckCircle className="w-4 h-4" />;
      case 'Graded': return <CheckCircle className="w-4 h-4" />;
      case 'Late': return <Clock className="w-4 h-4" />;
      case 'Overdue': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">My Assignments</h1>
        <p className="text-slate-500">Track and submit your homework tasks</p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto custom-scrollbar pb-2">
        {['All', 'Pending', 'Submitted', 'Late', 'Graded', 'Overdue'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${
              filter === f ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-full p-8 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
            No assignments found for this filter.
          </div>
        ) : (
          filteredAssignments.map(assignment => (
            <div key={assignment._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(assignment.submissionStatus)}`}>
                  {getStatusIcon(assignment.submissionStatus)}
                  {assignment.submissionStatus}
                </div>
              </div>
              
              <h3 className="font-bold text-slate-800 text-lg mb-2">{assignment.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{assignment.description || 'No description provided.'}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Due Date:</span>
                  <span className="font-medium text-slate-800">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Teacher:</span>
                  <span className="font-medium text-slate-800">{assignment.teacherId?.fullName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Max Marks:</span>
                  <span className="font-medium text-slate-800">{assignment.maxMarks}</span>
                </div>
                {assignment.submissionStatus === 'Graded' && (
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-100">
                    <span className="text-slate-500">Score:</span>
                    <span className="font-bold text-emerald-600">{assignment.submissionDetails?.marksAwarded} / {assignment.maxMarks}</span>
                  </div>
                )}
              </div>

              <Link 
                to={`/dashboard/assignments/${assignment._id}`}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors border border-slate-200"
              >
                {assignment.submissionStatus === 'Pending' || assignment.submissionStatus === 'Overdue' ? 'Submit Now' : 'View Submission'}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;
