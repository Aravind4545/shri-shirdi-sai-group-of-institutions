import React, { useState, useEffect } from 'react';
import { Trophy, Users, ShieldCheck, Download } from 'lucide-react';

const AdminLeaderboard = () => {
  const [globalRanks, setGlobalRanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalLeaderboard();
  }, []);

  const fetchGlobalLeaderboard = async () => {
    try {
      const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/leaderboard/global', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) setGlobalRanks(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading Global Rankings...</div>;
  if (!globalRanks || globalRanks.length === 0) return <div className="p-8">No ranking data available.</div>;

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 p-8 rounded-3xl shadow-lg text-white flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-blue-300" /> 
            Global Institution Leaderboard
          </h1>
          <p className="text-blue-100 max-w-2xl">
            Complete ranking of all students across Lakshya, Deekshya, and DAFNE programs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Institution Topper</p>
            <p className="text-xl font-black text-slate-800">{globalRanks[0]?.studentId?.fullName}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Total Ranked</p>
            <p className="text-2xl font-black text-slate-800">{globalRanks.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Top Program</p>
            <p className="text-xl font-black text-slate-800">{globalRanks[0]?.program}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-8">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Global Rank</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Program</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Overall Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {globalRanks.map((r: any, idx: number) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${idx === 0 ? 'bg-amber-100 text-amber-600' : idx === 1 ? 'bg-slate-200 text-slate-600' : idx === 2 ? 'bg-orange-100 text-orange-700' : 'text-slate-500'}`}>
                    {idx + 1}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-800">{r.studentId?.fullName}</td>
                <td className="px-6 py-4 text-slate-500">{r.program}</td>
                <td className="px-6 py-4 font-black text-indigo-600 text-right">{r.overallScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLeaderboard;
