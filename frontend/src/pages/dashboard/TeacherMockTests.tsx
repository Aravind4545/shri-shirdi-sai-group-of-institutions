import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, PlayCircle, Users, FileBarChart2 } from 'lucide-react';

const TeacherMockTests = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    targetProgram: 'Lakshya',
    targetExam: 'JEE Main',
    durationMinutes: 180,
    totalMarks: 300
  });

  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/mocktests/teacher', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        setTests(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async (testId: string) => {
    try {
      setSelectedTestId(testId);
      const res = await fetch(`http://localhost:5001/api/mocktests/${testId}/results`, {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        setResults(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (!formData.title) {
      alert("Please enter a test title before uploading.");
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append('pdf', e.target.files[0]);
    data.append('title', formData.title);
    data.append('targetProgram', formData.targetProgram);
    data.append('targetExam', formData.targetExam);
    data.append('durationMinutes', formData.durationMinutes.toString());
    data.append('totalMarks', formData.totalMarks.toString());

    try {
      const res = await fetch('http://localhost:5001/api/mocktests/upload', {
        method: 'POST',
        headers: { 'x-auth-token': localStorage.getItem('token') || '' },
        body: data
      });

      if (res.ok) {
        alert("Mock Test extracted and published successfully!");
        setFormData({ ...formData, title: '' });
        fetchTests();
      } else {
        const error = await res.json();
        alert(error.msg || "Failed to upload.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) return <div className="p-8">Loading Mock Tests...</div>;

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-900 to-indigo-800 p-8 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-300" /> 
            Mock Test Generation
          </h1>
          <p className="text-blue-100 max-w-2xl">
            Upload PDF mock tests. The AI system will extract questions and automatically dispatch them to students in the targeted programs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm col-span-1">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-indigo-500" /> Upload New Test
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Test Title</label>
              <input 
                type="text" 
                placeholder="e.g. Grand Test 1 - Physics"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Target Program</label>
                <select 
                  value={formData.targetProgram}
                  onChange={e => setFormData({...formData, targetProgram: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Lakshya">Lakshya</option>
                  <option value="Deekshya">Deekshya</option>
                  <option value="DAFNE">DAFNE</option>
                  <option value="All">All Programs</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Target Exam</label>
                <select 
                  value={formData.targetExam}
                  onChange={e => setFormData({...formData, targetExam: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="AP EAMCET">AP EAMCET</option>
                  <option value="TS EAMCET">TS EAMCET</option>
                  <option value="JEE Main">JEE Main</option>
                  <option value="NEET">NEET</option>
                </select>
              </div>
            </div>

            <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-8 rounded-2xl flex flex-col items-center justify-center text-center mt-4">
              <UploadCloud className="w-10 h-10 text-indigo-400 mb-3" />
              <p className="text-sm font-bold text-indigo-900 mb-1">Select Mock Test PDF</p>
              <p className="text-xs text-indigo-600 mb-4 px-4">PDF must contain questions formatted with numbers and options (A,B,C,D).</p>
              
              <input 
                type="file" 
                accept="application/pdf"
                ref={fileInputRef}
                className="hidden"
                onChange={handleUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={`px-6 py-2 rounded-xl font-bold shadow-md transition-colors ${uploading ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                {uploading ? 'Extracting Questions...' : 'Browse PDF & Publish'}
              </button>
            </div>
          </div>
        </div>

        {/* Existing Tests List */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm col-span-1 lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FileBarChart2 className="w-5 h-5 text-emerald-500" /> Published Tests
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                  <th className="p-4 font-bold">Title</th>
                  <th className="p-4 font-bold">Target</th>
                  <th className="p-4 font-bold">Questions</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {tests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">No mock tests published yet.</td>
                  </tr>
                ) : tests.map(test => (
                  <tr key={test._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{test.title}</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold mr-2">{test.targetProgram}</span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs font-bold">{test.targetExam}</span>
                    </td>
                    <td className="p-4 font-bold text-slate-600">{test.questions?.length || 0}</td>
                    <td className="p-4 text-sm text-slate-500">{new Date(test.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => fetchResults(test._id)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${selectedTestId === test._id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                      >
                        View Results
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Results View */}
      {selectedTestId && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mt-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" /> Student Results
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                  <th className="p-4 font-bold">Student Name</th>
                  <th className="p-4 font-bold">Program</th>
                  <th className="p-4 font-bold">Score</th>
                  <th className="p-4 font-bold text-emerald-600">Correct</th>
                  <th className="p-4 font-bold text-rose-600">Incorrect</th>
                  <th className="p-4 font-bold text-amber-600">Unattempted</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">No students have taken this test yet.</td>
                  </tr>
                ) : results.map(result => (
                  <tr key={result._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{result.studentId?.fullName}</td>
                    <td className="p-4 text-sm text-slate-600">{result.studentId?.programInfo?.program}</td>
                    <td className="p-4 font-black text-indigo-600">{result.score}</td>
                    <td className="p-4 font-bold text-emerald-600">{result.correctAnswers}</td>
                    <td className="p-4 font-bold text-rose-600">{result.incorrectAnswers}</td>
                    <td className="p-4 font-bold text-amber-600">{result.unattempted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherMockTests;
