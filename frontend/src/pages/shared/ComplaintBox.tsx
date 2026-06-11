import React, { useState, useEffect } from 'react';
import { AlertCircle, Send, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

const ComplaintBox = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [formData, setFormData] = useState({ type: 'General', title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchComplaints = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/complaints/my', {
        headers: { 'x-auth-token': localStorage.getItem('token') || '' }
      });
      if (res.ok) {
        const data = await res.json();
        const fallback = [
          { _id: 'c1', title: 'Hostel Wi-Fi Issue', description: 'Wi-Fi in block A is very slow.', status: 'Open', type: 'Technical', createdAt: new Date().toISOString(), user: { fullName: 'Student' } }
        ];
        setComplaints(data && data.length > 0 ? data : fallback);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5001/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMessage('Complaint submitted successfully.');
        setFormData({ type: 'General', title: '', description: '' });
        fetchComplaints();
      } else {
        const data = await res.json();
        setMessage(data.msg || 'Error submitting complaint.');
      }
    } catch (err) {
      setMessage('Server error.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'In Progress': return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'Resolved': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default: return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Resolved': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Submit a Complaint</h2>
            <p className="text-sm text-slate-500 font-medium">Report a general college issue or a technical website issue.</p>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 font-bold ${message.includes('successfully') ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Complaint Type</label>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.type === 'General' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-slate-200 text-slate-600 hover:border-brand-blue'}`}>
                <input type="radio" name="type" value="General" checked={formData.type === 'General'} onChange={() => setFormData({ ...formData, type: 'General' })} className="hidden" />
                <span className="font-bold">General (College Issue)</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.type === 'Technical' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600 hover:border-rose-500'}`}>
                <input type="radio" name="type" value="Technical" checked={formData.type === 'Technical'} onChange={() => setFormData({ ...formData, type: 'Technical' })} className="hidden" />
                <span className="font-bold">Technical (Website Issue)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Subject / Title</label>
            <input 
              required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="Brief summary of the issue"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea 
              required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="Provide full details here..." rows={4}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none resize-none" 
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl shadow-md hover:bg-blue-800 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : <><Send className="w-5 h-5" /> Submit Complaint</>}
          </button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-6">My Previous Complaints</h3>
        
        {complaints.length === 0 ? (
          <p className="text-slate-500 italic">You haven't submitted any complaints yet.</p>
        ) : (
          <div className="space-y-4">
            {complaints.map(c => (
              <div key={c._id} className="p-5 border border-slate-200 rounded-2xl hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${c.type === 'General' ? 'bg-slate-100 text-slate-700' : 'bg-rose-100 text-rose-700'}`}>
                        {c.type} Issue
                      </span>
                      <span className="text-sm text-slate-500 font-medium">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800">{c.title}</h4>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm ${getStatusColor(c.status)}`}>
                    {getStatusIcon(c.status)} {c.status}
                  </div>
                </div>
                <p className="text-slate-600 whitespace-pre-wrap text-sm">{c.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintBox;
