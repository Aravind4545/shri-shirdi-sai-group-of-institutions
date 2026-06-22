import { useState, useEffect } from 'react';
import { BarChart3, Users, DollarSign, Award, TrendingUp } from 'lucide-react';

const ReportsAnalytics = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/reports/dashboard', {
      headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
    })
      .then(res => res.json())
      .then(d => setData(d))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div className="p-8 text-center text-slate-500 font-bold">Loading Reports...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center"><BarChart3 className="w-6 h-6 mr-2 text-purple-600" /> Executive Reports</h2>
        <p className="text-slate-500 font-medium text-sm">High-level financial and admission analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-bold text-sm uppercase">Admissions</h3>
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-3xl font-black text-slate-800">{data.totalAdmissions}</p>
          <div className="mt-2 text-sm font-semibold">
            <span className="text-emerald-600">{data.approvedAdmissions} Approved</span> | <span className="text-amber-600">{data.pendingAdmissions} Pending</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-bold text-sm uppercase">Total Revenue</h3>
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-slate-800 font-mono">₹{data.totalRevenue.toLocaleString()}</p>
          <p className="mt-2 text-sm font-semibold text-emerald-600">Collected to date</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-bold text-sm uppercase">Pending Dues</h3>
            <DollarSign className="w-6 h-6 text-rose-500" />
          </div>
          <p className="text-3xl font-black text-slate-800 font-mono">₹{data.pendingRevenue.toLocaleString()}</p>
          <p className="mt-2 text-sm font-semibold text-rose-600">Outstanding balance</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-bold text-sm uppercase">Scholarships</h3>
            <Award className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-800">{data.scholarshipsGranted}</p>
          <p className="mt-2 text-sm font-semibold text-amber-600">Active grants</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
        <BarChart3 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Detailed Analytics Engine</h3>
        <p className="text-slate-500 mb-6 max-w-lg mx-auto">Full integration with charting libraries (Chart.js / Recharts) for monthly revenue trends and program distribution is available in the premium reporting module.</p>
        <button className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-purple-700 transition-colors">Export CSV Report</button>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
