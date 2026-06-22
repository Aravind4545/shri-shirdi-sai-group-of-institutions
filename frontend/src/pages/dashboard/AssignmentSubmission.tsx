import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud, FileText, Download, CheckCircle, Clock } from 'lucide-react';

const AssignmentSubmission = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/assignments/student', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        const data = await res.json();
        const found = data.find((a: any) => a._id === id);
        setAssignment(found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return alert('Please select files to upload');
    
    setSubmitting(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const res = await fetch(`https://shri-shirdi-sai-group-of-institutions.onrender.com/api/assignments/${id}/submit`, {
        method: 'POST',
        headers: { 'x-auth-token': localStorage.getItem('token') || '' },
        body: formData
      });
      if (res.ok) {
        setFiles([]);
        fetchAssignment();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!assignment) return <div className="p-8">Assignment not found</div>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <Link to="/dashboard/assignments" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium w-max">
        <ArrowLeft className="w-4 h-4" />
        Back to Assignments
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">{assignment.title}</h1>
                <p className="text-slate-500">Teacher: {assignment.teacherId?.fullName}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500 mb-1">Due Date</div>
                <div className="font-bold text-slate-800">{new Date(assignment.dueDate).toLocaleString()}</div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none mb-8">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Description</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{assignment.description || 'No description provided.'}</p>
              
              {assignment.instructions && (
                <>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 mt-6">Instructions</h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{assignment.instructions}</p>
                </>
              )}
            </div>

            {assignment.attachments && assignment.attachments.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Reference Materials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {assignment.attachments.map((file: any, i: number) => (
                    <a key={i} href={`https://shri-shirdi-sai-group-of-institutions.onrender.com${file.url}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors group">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{file.filename}</p>
                      </div>
                      <Download className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Your Submission</h3>
            
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Status</p>
                <p className="font-bold text-slate-800">{assignment.submissionStatus}</p>
              </div>
              {assignment.submissionStatus === 'Graded' && (
                <div className="text-right">
                  <p className="text-sm text-slate-500 mb-1">Marks</p>
                  <p className="font-bold text-emerald-600">{assignment.submissionDetails?.marksAwarded} / {assignment.maxMarks}</p>
                </div>
              )}
            </div>

            {assignment.submissionStatus === 'Graded' && assignment.submissionDetails?.feedback && (
              <div className="mb-6 p-4 rounded-2xl bg-purple-50 border border-purple-100">
                <p className="text-sm font-bold text-purple-800 mb-1">Teacher Feedback:</p>
                <p className="text-sm text-purple-700">{assignment.submissionDetails.feedback}</p>
              </div>
            )}

            {assignment.submissionDetails?.files && assignment.submissionDetails.files.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-bold text-slate-800 mb-3">Submitted Files:</p>
                <div className="space-y-2">
                  {assignment.submissionDetails.files.map((f: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-100">
                      <CheckCircle className="w-4 h-4" />
                      <span className="truncate">{f.filename}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Submitted on {new Date(assignment.submissionDetails.submissionDate).toLocaleString()}
                </p>
              </div>
            )}

            {assignment.submissionStatus !== 'Graded' && (
              <form onSubmit={handleSubmit}>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors mb-4 cursor-pointer relative">
                  <input 
                    type="file" 
                    multiple 
                    onChange={e => {
                      if (e.target.files) setFiles(Array.from(e.target.files));
                    }} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700 mb-1">Click to browse files</p>
                  <p className="text-xs text-slate-500">PDF, DOCX, PPT, Images up to 10MB</p>
                </div>

                {files.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {files.map((file, i) => (
                      <div key={i} className="text-xs p-2 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-colors"
                >
                  {submitting ? 'Uploading...' : (assignment.submissionDetails ? 'Resubmit Assignment' : 'Submit Assignment')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmission;
