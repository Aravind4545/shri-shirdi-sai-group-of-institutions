import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', program: 'Lakshya', stream: 'MPC', subject: 'Combined', totalMarks: 300, durationMinutes: 180
  });

  useEffect(() => { fetchTests(); }, []);

  const fetchTests = async () => {
    try {
      const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/admin/tests', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      const data = await res.json();
      if (res.ok) {
        const fallback = [
          { _id: 't1', title: 'Mid Term Physics Exam', subject: 'Physics', date: new Date().toISOString(), totalMarks: 100 }
        ];
        setTests(data && data.length > 0 ? data : fallback);
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete test?')) return;
    try {
      await fetch(`https://shri-shirdi-sai-group-of-institutions.onrender.com/api/admin/tests/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      fetchTests();
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/admin/tests', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken') || '' 
        },
        body: JSON.stringify(formData)
      });
      setIsFormOpen(false);
      fetchTests();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Test Management</h2>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center shadow-md">
          <Plus className="w-5 h-5 mr-1" /> Create Test
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-slate-700">Test Title</label><input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-xl p-2" /></div>
            <div><label className="block text-sm font-bold text-slate-700">Program</label>
              <select value={formData.program} onChange={e => setFormData({...formData, program: e.target.value})} className="w-full border rounded-xl p-2">
                <option>Lakshya</option><option>Deekshya</option><option>DAFNE</option>
              </select>
            </div>
            <div><label className="block text-sm font-bold text-slate-700">Stream</label><input type="text" value={formData.stream} onChange={e => setFormData({...formData, stream: e.target.value})} className="w-full border rounded-xl p-2" /></div>
            <div><label className="block text-sm font-bold text-slate-700">Subject</label><input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full border rounded-xl p-2" /></div>
            <div><label className="block text-sm font-bold text-slate-700">Total Marks</label><input type="number" required value={formData.totalMarks} onChange={e => setFormData({...formData, totalMarks: parseInt(e.target.value)})} className="w-full border rounded-xl p-2" /></div>
            <div><label className="block text-sm font-bold text-slate-700">Duration (Mins)</label><input type="number" required value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: parseInt(e.target.value)})} className="w-full border rounded-xl p-2" /></div>
            <button type="submit" className="md:col-span-2 bg-slate-900 text-white font-bold py-3 rounded-xl mt-2">Save Test</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-600">
              <th className="p-4">Title</th>
              <th className="p-4">Program</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Marks/Time</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test: any) => (
              <tr key={test._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-semibold text-slate-800">{test.title}</td>
                <td className="p-4 text-slate-600">{test.program}</td>
                <td className="p-4 text-slate-600">{test.subject}</td>
                <td className="p-4 text-slate-600">{test.totalMarks} / {test.durationMinutes}m</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(test._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestManagement;
