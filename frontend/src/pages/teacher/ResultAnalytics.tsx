import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

const ResultAnalytics = () => {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/teacher/analytics', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) setAnalytics(await res.json());
    } catch (err) { console.error(err); }
  };

  if (!analytics) return <div className="p-8 font-bold text-slate-500">Loading Analytics...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center"><BarChart3 className="w-6 h-6 mr-2 text-indigo-600" /> Result Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <p className="text-sm font-bold text-slate-500 uppercase">Batch Performance Average</p>
          <div className="mt-4 flex items-end">
            <span className="text-5xl font-black text-indigo-600 font-mono">{analytics.batchPerformance}%</span>
            <span className="text-sm font-bold text-emerald-500 ml-2 mb-1 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> +2.4% from last test</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <p className="text-sm font-bold text-slate-500 uppercase">Top Ranker</p>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-800">{analytics.topRanker}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-rose-500" /> Weak Topics</h3>
          <div className="space-y-2">
            {analytics.weakTopics.map((t: string) => (
              <div key={t} className="p-3 bg-rose-50 text-rose-700 font-bold rounded-xl border border-rose-100">{t}</div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-emerald-500" /> Strong Topics</h3>
          <div className="space-y-2">
            {analytics.strongTopics.map((t: string) => (
              <div key={t} className="p-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-100">{t}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultAnalytics;
