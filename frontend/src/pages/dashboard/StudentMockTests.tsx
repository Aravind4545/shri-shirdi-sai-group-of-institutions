import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, PlayCircle, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentMockTests = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await fetch('/api/mocktests/student', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        const data = await res.json();
        const fallback = [
          { _id: 'mt1', title: 'Grand Mock Test 1', subject: 'Physics', duration: 180, totalMarks: 300, scheduledDate: new Date().toISOString() },
          { _id: 'mt2', title: 'Chapter Mock Test 4', subject: 'Chemistry', duration: 60, totalMarks: 100, scheduledDate: new Date(Date.now() + 86400000).toISOString() }
        ];
        setTests(data && data.length > 0 ? data : fallback);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading your Mock Tests...</div>;

  const pendingTests = tests.filter(t => !t.isCompleted);
  const completedTests = tests.filter(t => t.isCompleted);

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-900 to-indigo-800 p-8 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-300" /> 
            My Mock Tests
          </h1>
          <p className="text-blue-100 max-w-2xl">
            Access assigned mock tests, track your scores, and improve your rank prediction.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" /> Pending Tests
        </h2>
        
        {pendingTests.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
            <p className="text-slate-500 font-bold">You have no pending mock tests. Great job!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingTests.map(test => (
              <div key={test._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-amber-100 text-amber-800 text-xs font-black px-2 py-1 rounded uppercase tracking-wider">
                    {test.targetExam}
                  </span>
                  <span className="text-sm font-bold text-slate-400">{test.questions?.length} Qs</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{test.title}</h3>
                
                <div className="text-sm text-slate-500 font-medium mb-6 flex-1 flex flex-col gap-1">
                  <span className="flex items-center gap-1"><Target className="w-4 h-4"/> Total Marks: {test.totalMarks}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {test.durationMinutes} Minutes</span>
                </div>
                
                <button 
                  onClick={() => navigate(`/dashboard/mocktests/${test._id}/take`)}
                  className="w-full py-3 bg-brand-blue text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors"
                >
                  <PlayCircle className="w-5 h-5" /> Start Test Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500" /> Completed Tests
        </h2>
        
        {completedTests.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
            <p className="text-slate-500 font-bold">You haven't completed any mock tests yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedTests.map(test => (
              <div key={test._id} className="bg-slate-100 p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-slate-200 text-slate-600 text-xs font-black px-2 py-1 rounded uppercase tracking-wider">
                    {test.targetExam}
                  </span>
                  <span className="text-sm font-bold text-slate-400">{new Date(test.createdAt).toLocaleDateString()}</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{test.title}</h3>
                
                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Your Score</span>
                  <span className="text-2xl font-black text-emerald-600">{test.score} <span className="text-sm text-slate-400">/ {test.totalMarks}</span></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMockTests;
