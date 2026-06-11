import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, BookOpen, Download, BrainCircuit, Activity } from 'lucide-react';

const TeacherIntelligence = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchIntelligence();
  }, []);

  const fetchIntelligence = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/intelligence/teacher', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) setData(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: 'pdf' | 'excel') => {
    setDownloading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/intelligence/report?type=teacher&format=${format}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Batch_Intelligence_Report.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      console.error('Download failed', err);
    }
    setDownloading(false);
  };

  if (loading) return <div className="p-8">Loading Academic Intelligence...</div>;
  if (!data) return <div className="p-8">Data not available yet.</div>;

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-purple-900 to-indigo-800 p-8 rounded-3xl shadow-lg text-white gap-4">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-purple-300" /> 
            Teacher Academic Companion
          </h1>
          <p className="text-purple-100 max-w-2xl">
            Your intelligent assistant for class performance, attendance, behavior, and assignment insights.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleDownload('pdf')}
            disabled={downloading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-bold transition-colors"
          >
            <Download className="w-4 h-4" /> PDF Report
          </button>
          <button 
            onClick={() => handleDownload('excel')}
            disabled={downloading}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Excel Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <p className="text-sm font-bold text-slate-500 uppercase">Batch Performance</p>
          <p className="text-5xl font-black text-indigo-600 mt-2">{data.batchPerformance}%</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <p className="text-sm font-bold text-slate-500 uppercase">Assignment Rate</p>
          <p className="text-5xl font-black text-emerald-600 mt-2">{data.assignmentCompletionRate}%</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <p className="text-sm font-bold text-slate-500 uppercase">Attendance Trend</p>
          <p className="text-5xl font-black text-blue-600 mt-2">{data.attendanceTrend}%</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center bg-rose-50 border-rose-100">
          <p className="text-sm font-bold text-rose-600 uppercase">At-Risk Students</p>
          <p className="text-5xl font-black text-rose-700 mt-2">{data.atRiskCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" /> Academic Risk Monitoring
          </h3>
          <div className="space-y-4">
            {data.risks.length > 0 ? data.risks.map((risk: any, i: number) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">{risk.studentId.fullName}</p>
                  <p className="text-xs text-slate-500">{risk.factors[0]?.description || 'Multiple factors'}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${risk.riskLevel === 'High' || risk.riskLevel === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                  {risk.riskLevel} Risk
                </span>
              </div>
            )) : (
              <p className="text-slate-500 text-sm">No at-risk students detected in this batch.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" /> Behavior & Attendance Alerts
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">Class Attendance Drop</p>
                <p className="text-xs text-slate-500">Attendance dropped by 4% this week in morning sessions.</p>
              </div>
              <span className="px-2 py-1 bg-amber-200 text-amber-800 rounded-lg text-xs font-bold">Alert</span>
            </div>
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">Low Assignment Submissions</p>
                <p className="text-xs text-slate-500">12 students missed the latest Physics assignment.</p>
              </div>
              <span className="px-2 py-1 bg-indigo-200 text-indigo-800 rounded-lg text-xs font-bold">Action Needed</span>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">Positive Behavior Trend</p>
                <p className="text-xs text-slate-500">Classroom engagement improved by 15% overall.</p>
              </div>
              <span className="px-2 py-1 bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold">Insight</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherIntelligence;
