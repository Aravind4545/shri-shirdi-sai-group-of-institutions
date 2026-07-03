import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, TrendingUp, Award, Zap, ChevronUp, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const StudentLeaderboard = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'program' | 'me'>('me');
  const [globalRanks, setGlobalRanks] = useState<any[]>([]);
  const [programRanks, setProgramRanks] = useState<any[]>([]);
  const [myRankData, setMyRankData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const headers = { 'x-auth-token': localStorage.getItem('token') || '' };
      
      const [globalRes, programRes, meRes] = await Promise.all([
        fetch('/api/leaderboard/global', { headers }),
        // Assuming we mock the program name or get it from `meRes`
        // We'll fetch it after meRes to ensure we have the program if needed, 
        // but let's just use a dummy URL for now and overwrite it later
        fetch('/api/leaderboard/global', { headers }), // Placeholder
        fetch('/api/leaderboard/me', { headers })
      ]);

      const globalData = await globalRes.json();
      const meData = await meRes.json();
      
      const pRes = await fetch('/api/leaderboard/program/${meData.rank?.program || 'IIT'}', { headers });
      const pData = await pRes.json();

      setGlobalRanks(globalData);
      setProgramRanks(pData);
      setMyRankData(meData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading Leaderboard...</div>;
  if (!myRankData || !myRankData.rank) return <div className="p-8">No ranking data available.</div>;

  const { rank, achievements, history } = myRankData;
  const historyData = history.map((h: any) => ({ name: new Date(h.timestamp).toLocaleDateString(), GlobalRank: h.globalRank, Score: h.overallScore }));

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center bg-gradient-to-r from-amber-600 to-orange-500 p-8 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-200" /> 
            Leaderboards & Rank Intelligence
          </h1>
          <p className="text-amber-100 max-w-2xl">
            Track your competitive standing, earn badges, and monitor your growth over time.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200 pb-2">
        <button onClick={() => setActiveTab('me')} className={`pb-2 px-4 font-bold ${activeTab === 'me' ? 'text-amber-600 border-b-4 border-amber-600' : 'text-slate-500 hover:text-slate-700'}`}>My Intelligence</button>
        <button onClick={() => setActiveTab('program')} className={`pb-2 px-4 font-bold ${activeTab === 'program' ? 'text-amber-600 border-b-4 border-amber-600' : 'text-slate-500 hover:text-slate-700'}`}>Program Leaderboard</button>
        <button onClick={() => setActiveTab('global')} className={`pb-2 px-4 font-bold ${activeTab === 'global' ? 'text-amber-600 border-b-4 border-amber-600' : 'text-slate-500 hover:text-slate-700'}`}>Global Leaderboard</button>
      </div>

      {activeTab === 'me' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
              <p className="text-sm font-bold text-slate-500 uppercase mb-2">Global Rank</p>
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-black text-3xl">
                #{rank.globalRank}
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
              <p className="text-sm font-bold text-slate-500 uppercase mb-2">Program Rank</p>
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-black text-3xl">
                #{rank.programRank}
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
              <p className="text-sm font-bold text-slate-500 uppercase mb-2">Overall Score</p>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-3xl">
                {rank.overallScore}
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <p className="text-sm font-bold text-slate-500 uppercase mb-2">Trend</p>
              <div className="flex items-center gap-2 text-emerald-500 font-black text-2xl">
                <ChevronUp className="w-8 h-8" /> Up
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" /> Rank History Trend
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis reversed domain={['dataMin - 5', 'dataMax + 5']} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip wrapperClassName="rounded-xl shadow-lg border-none" />
                    <Line type="monotone" dataKey="GlobalRank" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-slate-400 mt-4">*Lower is better for Rank</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Achievement Showcase
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {achievements.length > 0 ? achievements.map((ach: any, idx: number) => (
                  <div key={idx} className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl flex flex-col items-center text-center">
                    <Medal className="w-10 h-10 text-amber-500 mb-2" />
                    <p className="font-bold text-slate-800 text-sm">{ach.badgeName}</p>
                    <p className="text-xs text-slate-500 mt-1">{ach.description}</p>
                  </div>
                )) : (
                  <p className="text-sm text-slate-500 col-span-2 text-center">No achievements yet. Keep learning!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'program' || activeTab === 'global') && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Program</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(activeTab === 'program' ? programRanks : globalRanks).map((r: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${idx === 0 ? 'bg-amber-100 text-amber-600' : idx === 1 ? 'bg-slate-200 text-slate-600' : idx === 2 ? 'bg-orange-100 text-orange-700' : 'text-slate-500'}`}>
                      {idx + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{r.studentId?.fullName || 'Unknown'}</td>
                  <td className="px-6 py-4 text-slate-500">{r.program}</td>
                  <td className="px-6 py-4 font-black text-indigo-600 text-right">{r.overallScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentLeaderboard;
