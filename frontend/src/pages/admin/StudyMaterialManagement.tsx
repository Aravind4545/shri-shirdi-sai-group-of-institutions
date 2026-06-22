import { useState, useEffect } from 'react';
import { Trash2, Plus, Download } from 'lucide-react';

const StudyMaterialManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'PDF', program: 'Lakshya', stream: 'MPC', subject: 'Mathematics', url: '#'
  });

  useEffect(() => { fetchMaterials(); }, []);

  const fetchMaterials = async () => {
    try {
      const res = await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/admin/materials', {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      const data = await res.json();
      if (res.ok) {
        const fallback = [
          { _id: 's1', title: 'Physics Mechanics Concepts', type: 'PDF', subject: 'Physics', url: '#' },
          { _id: 's2', title: 'Calculus Basics', type: 'Video', subject: 'Mathematics', url: '#' }
        ];
        setMaterials(data && data.length > 0 ? data : fallback);
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete material?')) return;
    try {
      await fetch(`https://shri-shirdi-sai-group-of-institutions.onrender.com/api/admin/materials/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      fetchMaterials();
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('https://shri-shirdi-sai-group-of-institutions.onrender.com/api/admin/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('adminToken') || '' },
        body: JSON.stringify(formData)
      });
      setIsFormOpen(false);
      fetchMaterials();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Study Materials</h2>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center shadow-md">
          <Plus className="w-5 h-5 mr-1" /> Add Material
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-slate-700">Title</label><input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-xl p-2" /></div>
            <div><label className="block text-sm font-bold text-slate-700">Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border rounded-xl p-2">
                <option>PDF</option><option>Video</option><option>Note</option>
              </select>
            </div>
            <div className="md:col-span-2"><label className="block text-sm font-bold text-slate-700">Description</label><input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded-xl p-2" /></div>
            <div><label className="block text-sm font-bold text-slate-700">Program</label>
              <select value={formData.program} onChange={e => setFormData({...formData, program: e.target.value})} className="w-full border rounded-xl p-2">
                <option>Lakshya</option><option>Deekshya</option><option>DAFNE</option><option>All</option>
              </select>
            </div>
            <div><label className="block text-sm font-bold text-slate-700">Stream</label><input type="text" value={formData.stream} onChange={e => setFormData({...formData, stream: e.target.value})} className="w-full border rounded-xl p-2" /></div>
            <div><label className="block text-sm font-bold text-slate-700">Subject</label><input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full border rounded-xl p-2" /></div>
            <div><label className="block text-sm font-bold text-slate-700">URL</label><input type="text" required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full border rounded-xl p-2" /></div>
            <button type="submit" className="md:col-span-2 bg-slate-900 text-white font-bold py-3 rounded-xl mt-2">Publish Material</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {materials.map((mat: any) => (
          <div key={mat._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">{mat.type}</span>
              <button onClick={() => handleDelete(mat._id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">{mat.title}</h3>
            <p className="text-sm text-slate-500 mb-4 h-10 overflow-hidden">{mat.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-400">{mat.program} - {mat.subject}</span>
              <a href={mat.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center">Link <Download className="w-3 h-3 ml-1"/></a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyMaterialManagement;
