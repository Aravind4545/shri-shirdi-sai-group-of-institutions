import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, AlertTriangle, Target, BookOpen } from 'lucide-react';

const TeacherAnalytics = () => {
  const [data, setData] = useState<any>(null);
  const [risks, setRisks] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/ai/risk-predictions', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) setRisks(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/analytics/teacher/batch', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading analytics...</div>;
  if (!data) return <div className="p-8">No analytics data available for this batch.</div>;

  const barChartData = data.subjects.map((s: any) => ({
    name: s._id,
    Accuracy: Math.round(s.avgAccuracy)
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Batch Performance Analytics</h1>
        <p className="text-slate-500">Monitor your entire batch's strengths and weaknesses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Subject Performance Bar Chart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Subject Performance
            </h3>
            <div className="h-80">
              {barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <RechartsTooltip cursor={{ fill: '#f8fafc' }} wrapperClassName="rounded-xl shadow-lg border-none" />
                    <Bar dataKey="Accuracy" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex justify-center items-center text-slate-400">No subject data</div>
              )}
            </div>
          </div>

          {/* At-Risk Students & Interventions */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mt-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              At-Risk Students & Interventions
            </h3>
            <div className="space-y-4">
              {risks && risks.length > 0 ? risks.map((risk: any, i: number) => (
                <div key={i} className={`p-4 rounded-2xl border ${risk.riskLevel === 'High' || risk.riskLevel === 'Critical' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-800">{risk.studentId?.fullName || 'Student'}</h4>
                      <p className="text-xs text-slate-500">{risk.studentId?.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-bold rounded-lg ${risk.riskLevel === 'High' || risk.riskLevel === 'Critical' ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'}`}>
                      {risk.riskLevel} Risk
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-bold text-slate-600 mb-1">Factors:</p>
                    <ul className="list-disc pl-4 text-xs text-slate-700">
                      {risk.factors.map((f: any, idx: number) => <li key={idx}>{f.description}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-600 mb-1">AI Suggested Intervention:</p>
                    <ul className="list-disc pl-4 text-xs text-indigo-700">
                      {risk.interventionSuggestions.map((s: any, idx: number) => <li key={idx}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              )) : (
                <div className="text-center text-slate-400 py-4">No at-risk students identified.</div>
              )}
            </div>
          </div>
        </div>

        {/* Weak Topics Side Panel */}
        <div>
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 h-full">
            <h3 className="text-lg font-bold text-red-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Batch Weak Areas
            </h3>
            <p className="text-sm text-red-700 mb-6">Topics where the batch is scoring lowest</p>
            
            <div className="space-y-4">
              {data.weakTopics.map((topic: any, index: number) => (
                <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-red-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800">{topic._id}</h4>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg">
                      {Math.round(topic.avgAccuracy)}% Acc
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex justify-between">
                    <span>{topic.subject} &bull; {topic.chapter}</span>
                    <span>{topic.totalAttempts} Attempts</span>
                  </div>
                </div>
              ))}
              {data.weakTopics.length === 0 && (
                <div className="text-center text-red-400 py-8">No weak topics identified yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAnalytics;
