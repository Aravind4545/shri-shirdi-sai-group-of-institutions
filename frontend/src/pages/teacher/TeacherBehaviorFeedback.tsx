import React, { useState, useEffect } from 'react';
import { Activity, Send, CheckCircle2, User, Search, AlertTriangle } from 'lucide-react';

const TeacherBehaviorFeedback = () => {
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Record<string, { rating: string, comments: string }>>({});
  const [submittingStatus, setSubmittingStatus] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});

  useEffect(() => {
    fetchActiveRequestAndStudents();
  }, []);

  const fetchActiveRequestAndStudents = async () => {
    try {
      const reqRes = await fetch('http://localhost:5001/api/behavior/requests/active', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setActiveRequest(reqData);

        if (reqData) {
          const stdRes = await fetch('http://localhost:5001/api/behavior/students', {
            headers: { 'x-auth-token': localStorage.getItem('token') || '' }
          });
          if (stdRes.ok) {
            const stdData = await stdRes.json();
            const fallback = [
              { _id: 's1', fullName: 'Rahul Verma', email: 'rahul@test.com' },
              { _id: 's2', fullName: 'Priya Sharma', email: 'priya@test.com' }
            ];
            setStudents(stdData && stdData.length > 0 ? stdData : fallback);

            // Fetch existing feedbacks for this request to pre-populate
            const fbRes = await fetch(`http://localhost:5001/api/behavior/feedbacks/me/${reqData._id}`, {
              headers: { 'x-auth-token': localStorage.getItem('token') || '' }
            });
            if (fbRes.ok) {
              const fbData = await fbRes.json();
              const fbMap: Record<string, { rating: string, comments: string }> = {};
              const statusMap: Record<string, any> = {};
              fbData.forEach((fb: any) => {
                fbMap[fb.student] = { rating: fb.rating, comments: fb.comments };
                statusMap[fb.student] = 'success';
              });
              setFeedbacks(fbMap);
              setSubmittingStatus(statusMap);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackChange = (studentId: string, field: string, value: string) => {
    setFeedbacks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
    if (submittingStatus[studentId] === 'success') {
      setSubmittingStatus(prev => ({ ...prev, [studentId]: 'idle' }));
    }
  };

  const submitFeedback = async (studentId: string) => {
    const feedback = feedbacks[studentId];
    if (!feedback || !feedback.rating || !feedback.comments) {
      alert('Please provide both a rating and comments.');
      return;
    }

    setSubmittingStatus(prev => ({ ...prev, [studentId]: 'loading' }));

    try {
      const res = await fetch('http://localhost:5001/api/behavior/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({
          requestId: activeRequest._id,
          studentId: studentId,
          rating: feedback.rating,
          comments: feedback.comments
        })
      });

      if (res.ok) {
        setSubmittingStatus(prev => ({ ...prev, [studentId]: 'success' }));
      } else {
        setSubmittingStatus(prev => ({ ...prev, [studentId]: 'error' }));
      }
    } catch (err) {
      setSubmittingStatus(prev => ({ ...prev, [studentId]: 'error' }));
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!activeRequest) {
    return (
      <div className="bg-white p-12 rounded-3xl text-center border border-slate-200 shadow-sm flex flex-col items-center">
        <div className="p-4 bg-slate-50 rounded-full mb-4 text-slate-400">
          <Activity className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Active Requests</h2>
        <p className="text-slate-500 max-w-md">There are currently no active behavior tracking requests from the administration. You will be notified when feedback is required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-10">
          <Activity className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-800/50 px-3 py-1.5 rounded-lg text-sm font-bold mb-4 backdrop-blur-sm border border-indigo-600/50">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Action Required
            </div>
            <h2 className="text-3xl font-black mb-2">Behavior Tracking Feedback</h2>
            <p className="text-indigo-200 text-lg">The administration has requested behavior feedback for your assigned students for the past <strong className="text-white bg-indigo-800 px-2 py-0.5 rounded">{activeRequest.period}</strong>.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-brand-blue" />
          Assigned Students
        </h3>

        <div className="space-y-6">
          {students.map(s => {
            const fb = feedbacks[s._id] || { rating: '', comments: '' };
            const status = submittingStatus[s._id] || 'idle';

            return (
              <div key={s._id} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row gap-6">
                
                {/* Student Info */}
                <div className="w-full md:w-64 shrink-0 flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-6">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                    {s.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg leading-tight">{s.fullName}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-1">{s.email}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-600">
                      {s.programInfo?.program}
                    </span>
                  </div>
                </div>

                {/* Feedback Form */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Behavior Rating</label>
                    <div className="flex flex-wrap gap-2">
                      {['Excellent', 'Good', 'Average', 'Needs Improvement', 'Poor'].map(r => (
                        <label key={r} className={`cursor-pointer px-3 py-1.5 rounded-lg border text-sm font-bold transition-colors ${fb.rating === r ? 'bg-indigo-100 border-indigo-300 text-indigo-800 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                          <input type="radio" name={`rating-${s._id}`} value={r} className="hidden" checked={fb.rating === r} onChange={() => handleFeedbackChange(s._id, 'rating', r)} />
                          {r}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Observations / Comments</label>
                    <textarea 
                      value={fb.comments}
                      onChange={(e) => handleFeedbackChange(s._id, 'comments', e.target.value)}
                      placeholder="Write specific observations about the student's behavior..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end items-center gap-4 pt-2">
                    {status === 'success' && <span className="text-emerald-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Saved</span>}
                    {status === 'error' && <span className="text-rose-600 text-sm font-bold">Failed to save</span>}
                    <button 
                      onClick={() => submitFeedback(s._id)}
                      disabled={status === 'loading'}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center gap-2 ${status === 'success' ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'}`}
                    >
                      {status === 'loading' ? 'Saving...' : status === 'success' ? 'Update Feedback' : <><Send className="w-4 h-4" /> Submit Feedback</>}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeacherBehaviorFeedback;
