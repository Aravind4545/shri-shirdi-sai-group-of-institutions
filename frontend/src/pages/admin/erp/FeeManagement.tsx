import { useState, useEffect } from 'react';
import { IndianRupee, Save, Users, Bell, FileText, CheckCircle2, Clock, Search, ChevronDown, Download, AlertCircle } from 'lucide-react';

const FeeManagement = () => {
  const [activeTab, setActiveTab] = useState<'structure' | 'students'>('students');
  const [structures, setStructures] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [filterProgram, setFilterProgram] = useState('All');
  
  const [formData, setFormData] = useState({
    program: 'Lakshya', baseTuitionFee: 50000, studyMaterialFee: 10000, labResourceFee: 0, examTrainingFee: 5000
  });

  useEffect(() => { 
    fetchStructures(); 
    if (activeTab === 'students') {
      fetchStudents();
    }
  }, [activeTab]);

  const fetchStructures = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/finance/structures');
      if (res.ok) setStructures(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/admin/students', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      if (res.ok) {
        const data = await res.json();
        // Decorate with dummy fee data for tracking
        const decorated = data.map((s: any) => {
          const total = s.programInfo?.program === 'Lakshya' ? 65000 : s.programInfo?.program === 'Deekshya' ? 75000 : 45000;
          const paid = Math.floor(Math.random() * total);
          const due = total - paid;
          const status = due === 0 ? 'Paid' : (paid > 0 ? 'Partial' : 'Unpaid');
          return { ...s, feeTotal: total, feePaid: paid, feeDue: due, feeStatus: status };
        });
        setStudents(decorated);
      }
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalFee = formData.baseTuitionFee + formData.studyMaterialFee + formData.labResourceFee + formData.examTrainingFee;
    try {
      await fetch('http://localhost:5001/api/finance/structures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('adminToken') || '' },
        body: JSON.stringify({ ...formData, totalFee })
      });
      fetchStructures();
    } catch (err) { console.error(err); }
  };

  const selectProgram = (prog: string) => {
    const existing = structures.find((s: any) => s.program === prog);
    if (existing) {
      setFormData({
        program: prog,
        baseTuitionFee: existing.baseTuitionFee,
        studyMaterialFee: existing.studyMaterialFee,
        labResourceFee: existing.labResourceFee,
        examTrainingFee: existing.examTrainingFee
      });
    } else {
      setFormData({ ...formData, program: prog });
    }
  };

  const filteredStudents = filterProgram === 'All' ? students : students.filter(s => s.programInfo?.program === filterProgram);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <IndianRupee className="w-8 h-8 mr-3 text-emerald-600" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Fees Management</h2>
            <p className="text-slate-500 font-medium text-sm">Fee structure, installments, due dates, payment history, receipts, pending fee tracking and automated reminders.</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('students')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'students' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Student Fee Tracking
          </button>
          <button 
            onClick={() => setActiveTab('structure')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'structure' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Fee Structure Configuration
          </button>
        </div>
      </div>

      {activeTab === 'structure' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          <div className="lg:col-span-1 space-y-4">
            {['Lakshya', 'Deekshya', 'DAFNE'].map(prog => (
              <button
                key={prog}
                onClick={() => selectProgram(prog)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-bold transition-all shadow-sm ${
                  formData.program === prog ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
                }`}
              >
                {prog} Program
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">Configure {formData.program} Fees</h3>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Base Tuition Fee (₹)</label>
                  <input type="number" required value={formData.baseTuitionFee} onChange={e => setFormData({...formData, baseTuitionFee: parseInt(e.target.value)})} className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Study Material Fee (₹)</label>
                  <input type="number" value={formData.studyMaterialFee} onChange={e => setFormData({...formData, studyMaterialFee: parseInt(e.target.value)})} className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Lab / Resource Fee (₹)</label>
                  <input type="number" value={formData.labResourceFee} onChange={e => setFormData({...formData, labResourceFee: parseInt(e.target.value)})} className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Exam & Training Fee (₹)</label>
                  <input type="number" value={formData.examTrainingFee} onChange={e => setFormData({...formData, examTrainingFee: parseInt(e.target.value)})} className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-lg" />
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase">Total Fee Configuration</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">₹ {(formData.baseTuitionFee + formData.studyMaterialFee + formData.labResourceFee + formData.examTrainingFee).toLocaleString()}</p>
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold flex items-center shadow-lg shadow-emerald-500/30 transition-colors">
                  <Save className="w-5 h-5 mr-2" /> Save Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
          <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-50">
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
                <input type="text" placeholder="Search student by name or ID..." className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white text-sm" />
              </div>
              <div className="relative">
                <select 
                  value={filterProgram}
                  onChange={(e) => setFilterProgram(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:border-emerald-500 font-bold text-sm cursor-pointer"
                >
                  <option value="All">All Programs</option>
                  <option value="Lakshya">Lakshya</option>
                  <option value="Deekshya">Deekshya</option>
                  <option value="DAFNE">DAFNE</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex gap-3 w-full lg:w-auto">
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" /> Export Report
              </button>
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm shadow-amber-500/20">
                <Bell className="w-4 h-4" /> Remind Defaulters
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4 pl-6">Student Name</th>
                  <th className="p-4">Program</th>
                  <th className="p-4 text-right">Total Fee</th>
                  <th className="p-4 text-right">Paid</th>
                  <th className="p-4 text-right">Due Amount</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 pr-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          {s.fullName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{s.fullName}</p>
                          <p className="text-xs text-slate-500">{s.mobileNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-700">{s.programInfo?.program}</span>
                      <p className="text-xs text-slate-500">{s.programInfo?.stream}</p>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-700">
                      {formatCurrency(s.feeTotal)}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-600">
                      {formatCurrency(s.feePaid)}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-rose-600">
                      {formatCurrency(s.feeDue)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                        s.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                        s.feeStatus === 'Partial' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {s.feeStatus === 'Paid' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {s.feeStatus === 'Partial' && <Clock className="w-3.5 h-3.5" />}
                        {s.feeStatus === 'Unpaid' && <AlertCircle className="w-3.5 h-3.5" />}
                        {s.feeStatus}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Receipts">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Send Reminder">
                          <Bell className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No student records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;
