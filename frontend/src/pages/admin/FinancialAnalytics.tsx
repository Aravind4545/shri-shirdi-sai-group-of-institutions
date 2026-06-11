import React, { useState, useEffect } from 'react';
import { IndianRupee, FileText, Download, TrendingDown, Users, Search, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

const FinancialAnalytics = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'salaries' | 'expenses'>('overview');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([
    { id: 1, date: '2026-06-01', category: 'Infrastructure', description: 'Server Maintenance & Cloud Hosting', amount: 45000, status: 'Paid' },
    { id: 2, date: '2026-06-05', category: 'Events', description: 'Annual Science Fair Setup', amount: 120000, status: 'Paid' },
    { id: 3, date: '2026-06-08', category: 'Marketing', description: 'Local Newspaper Advertisement', amount: 25000, status: 'Pending' }
  ]);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: 'Operations', description: '', amount: 0 });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/admin/teachers', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      if (res.ok) {
        const data = await res.json();
        const baseData = data.length > 0 ? data : [
          { _id: 'mock1', fullName: 'Dr. Sarah', designation: 'Physics HOD' },
          { _id: 'mock2', fullName: 'Mr. John', designation: 'Math Faculty' },
          { _id: 'mock3', fullName: 'Ms. Emily', designation: 'Chemistry Faculty' }
        ];
        
        // Add dummy salary data
        const decorated = baseData.map((t: any) => ({
          ...t,
          baseSalary: t.designation === 'HOD' ? 120000 : 80000,
          bonus: Math.floor(Math.random() * 10000),
          deductions: Math.floor(Math.random() * 2000),
          status: Math.random() > 0.2 ? 'Paid' : 'Pending'
        }));
        setTeachers(decorated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;
    
    setExpenses([
      {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        category: newExpense.category,
        description: newExpense.description,
        amount: newExpense.amount,
        status: 'Pending'
      },
      ...expenses
    ]);
    setIsAddingExpense(false);
    setNewExpense({ category: 'Operations', description: '', amount: 0 });
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <IndianRupee className="w-8 h-8 mr-3 text-emerald-600" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Financial Analytics</h2>
            <p className="text-slate-500 font-medium text-sm">Teacher salary management, expenses tracking, and pay slips.</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('salaries')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'salaries' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Teacher Salaries
          </button>
          <button 
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'expenses' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Expenses
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 font-bold text-sm uppercase">Total Payroll (Monthly)</h3>
              <Users className="w-6 h-6 text-indigo-500" />
            </div>
            <p className="text-3xl font-black text-slate-800 font-mono">
              {formatCurrency(teachers.reduce((acc, t) => acc + t.baseSalary + t.bonus - t.deductions, 0))}
            </p>
            <p className="mt-2 text-sm font-semibold text-indigo-600">Across {teachers.length} faculty members</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 font-bold text-sm uppercase">Total Expenses (YTD)</h3>
              <TrendingDown className="w-6 h-6 text-rose-500" />
            </div>
            <p className="text-3xl font-black text-slate-800 font-mono">
              {formatCurrency(expenses.reduce((acc, e) => acc + e.amount, 0))}
            </p>
            <p className="mt-2 text-sm font-semibold text-rose-600">Operational costs</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 bg-emerald-50 border-emerald-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-emerald-700 font-bold text-sm uppercase">Net Positive Balance</h3>
              <IndianRupee className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-emerald-800 font-mono">₹ 14,250,000</p>
            <p className="mt-2 text-sm font-semibold text-emerald-700">Estimated current reserves</p>
          </div>
        </div>
      )}

      {activeTab === 'salaries' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="relative w-72">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-2.5" />
              <input type="text" placeholder="Search teacher..." className="w-full pl-11 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm" />
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
              <FileText className="w-4 h-4" /> Generate All Slips
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4 pl-6">Faculty Name</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4 text-right">Base Salary</th>
                  <th className="p-4 text-right">Allowances</th>
                  <th className="p-4 text-right">Deductions</th>
                  <th className="p-4 text-right text-indigo-700">Net Pay</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 pr-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {teachers.map((t) => {
                  const netPay = t.baseSalary + t.bonus - t.deductions;
                  return (
                    <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-slate-800">{t.fullName}</td>
                      <td className="p-4 font-semibold text-slate-600">{t.designation || 'Faculty'}</td>
                      <td className="p-4 text-right font-mono font-bold text-slate-700">{formatCurrency(t.baseSalary)}</td>
                      <td className="p-4 text-right font-mono font-bold text-emerald-600">+{formatCurrency(t.bonus)}</td>
                      <td className="p-4 text-right font-mono font-bold text-rose-600">-{formatCurrency(t.deductions)}</td>
                      <td className="p-4 text-right font-mono font-black text-indigo-700">{formatCurrency(netPay)}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                          t.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {t.status === 'Paid' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-center">
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Download Pay Slip">
                          <Download className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800 text-lg">Institutional Expenses</h3>
            <button 
              onClick={() => setIsAddingExpense(!isAddingExpense)}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              <Plus className="w-4 h-4" /> Add New Expense
            </button>
          </div>

          {isAddingExpense && (
            <div className="p-6 border-b border-slate-100 bg-white">
              <form onSubmit={handleAddExpense} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select 
                    value={newExpense.category} 
                    onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:border-rose-500 text-sm font-semibold"
                  >
                    <option>Operations</option>
                    <option>Infrastructure</option>
                    <option>Marketing</option>
                    <option>Events</option>
                    <option>Software/IT</option>
                  </select>
                </div>
                <div className="flex-[2]">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <input 
                    type="text" 
                    value={newExpense.description} 
                    onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                    placeholder="E.g., Bought new lab equipment"
                    className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:border-rose-500 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Amount (₹)</label>
                  <input 
                    type="number" 
                    value={newExpense.amount} 
                    onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                    className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:border-rose-500 text-sm font-mono"
                  />
                </div>
                <button type="submit" className="bg-rose-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-rose-700 transition-colors">
                  Save
                </button>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4 pl-6">Date</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-slate-600">{new Date(e.date).toLocaleDateString()}</td>
                    <td className="p-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{e.category}</span></td>
                    <td className="p-4 font-medium text-slate-800">{e.description}</td>
                    <td className="p-4 text-right font-mono font-bold text-rose-600">{formatCurrency(e.amount)}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                        e.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {e.status}
                      </span>
                    </td>
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

export default FinancialAnalytics;
