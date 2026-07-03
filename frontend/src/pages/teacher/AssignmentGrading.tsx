import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, FileText, Download, Award } from 'lucide-react';

const AssignmentGrading = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [gradeData, setGradeData] = useState({ marks: 0, feedback: '' });

  useEffect(() => {
    fetchSubmissions();
  }, [id]);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/assignments/${id}/submissions', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitGrade = async () => {
    try {
      const res = await fetch('/api/assignments/${id}/grade/${selectedSub._id}', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || '' 
        },
        body: JSON.stringify(gradeData)
      });
      if (res.ok) {
        fetchSubmissions();
        setSelectedSub(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">Loading submissions...</div>;

  return (
    <div className="p-8">
      <Link to="/teacher/assignments" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium w-max">
        <ArrowLeft className="w-4 h-4" />
        Back to Assignments
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Student Submissions ({submissions.length})</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {submissions.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No submissions yet.</div>
              ) : (
                submissions.map((sub) => (
                  <div key={sub._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <h3 className="font-bold text-slate-800">{sub.studentId?.fullName || 'Unknown Student'}</h3>
                      <p className="text-sm text-slate-500">Submitted on {new Date(sub.submissionDate).toLocaleString()}</p>
                      <div className="mt-2 flex gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                          sub.status === 'Graded' ? 'bg-emerald-100 text-emerald-700' : 
                          sub.status === 'Late' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {sub.status}
                        </span>
                        {sub.status === 'Graded' && (
                          <span className="text-xs font-bold px-2 py-1 rounded-md bg-purple-100 text-purple-700">
                            Marks: {sub.marksAwarded}
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedSub(sub);
                        setGradeData({ marks: sub.marksAwarded || 0, feedback: sub.feedback || '' });
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
                    >
                      Review & Grade
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div>
          {selectedSub ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Grading Panel</h3>
              <div className="mb-6">
                <p className="text-sm text-slate-500 mb-2">Student Files:</p>
                <div className="space-y-2">
                  {selectedSub.files?.map((f: any, i: number) => (
                    <a key={i} href={`http://${window.location.hostname}:5001${f.url}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-emerald-600 hover:underline text-sm font-medium p-3 bg-emerald-50 rounded-xl">
                      <Download className="w-4 h-4" />
                      {f.filename}
                    </a>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Marks Awarded</label>
                  <input type="number" value={gradeData.marks} onChange={e => setGradeData({...gradeData, marks: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Feedback</label>
                  <textarea value={gradeData.feedback} onChange={e => setGradeData({...gradeData, feedback: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" rows={4}></textarea>
                </div>
                <button onClick={submitGrade} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <Award className="w-5 h-5" />
                  Save Grade
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 border-dashed p-8 text-center text-slate-500">
              Select a submission from the list to begin grading.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentGrading;
